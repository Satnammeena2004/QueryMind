"use server";
import { RetryError, APICallError } from "ai"
import { configSchema, explainQuerySchema, FinalCheckResult, Result, SchemaResult } from "@/lib/types";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { writeFile } from "fs/promises";
import { auth } from "./auth";
import { revalidatePath } from "next/cache";
import { sql, VercelPoolClient } from "@vercel/postgres";





// take the formdat and gave the schema of the data
const GOOGLE_GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL || "gemini-2.0-flash";
function customisedQuery(schema: string, tableName: string) {
  return `You are a SQL (Postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. The table schema will be provided by the user.
the name of table is ${tableName}. 
The table schema is as follows:

${JSON.stringify(schema)}

Only retrieval queries are allowed.

For string-based fields, use the ILIKE operator and convert both the search term and the field to lowercase using the LOWER() function. For example: LOWER(column_name) ILIKE LOWER('%search_term%').

If the user asks for data “over time,” return results grouped by year using EXTRACT(YEAR FROM date_column).

For fields containing comma-separated lists, use unnest(string_to_array(column_name, ',')) to split them and TRIM() to ensure accurate grouping. Some fields may be NULL or contain only one value.

Every query should return quantitative data that can be plotted on a chart. There should always be at least two columns. If the user asks for a single column, return the column and the count of that column. If the user asks for a rate, return it as a decimal (e.g., 0.1 means 10%).

If the user asks for a category that doesn’t exist in the schema, infer the closest match based on the schema provided.

You will generate the best possible SQL query to retrieve the requested data while ensuring that the results contain at least two columns and can be used for data visualization`;
}

const QUERY_GENERATAION_SYSTEM_PROMPT = `You are a SQL (postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. The table schema is as follows:

unicorns (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL UNIQUE,
  valuation DECIMAL(10, 2) NOT NULL,
  date_joined DATE,
  country VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  select_investors TEXT NOT NULL
);

Only retrieval queries are allowed.

For things like industry, company names and other string fields, use the ILIKE operator and convert both the search term and the field to lowercase using LOWER() function. For example: LOWER(industry) ILIKE LOWER('%search_term%').

Note: select_investors is a comma-separated list of investors. Trim whitespace to ensure you're grouping properly. Note, some fields may be null or have only one value.
When answering questions about a specific field, ensure you are selecting the identifying column (ie. what is Vercel's valuation would select company and valuation').

The industries available are:
- healthcare & life sciences
- consumer & retail
- financial services
- enterprise tech
- insurance
- media & entertainment
- industrials
- health

If the user asks for a category that is not in the list, infer based on the list above.

Note: valuation is in billions of dollars so 10b would be 10.0.
Note: if the user asks for a rate, return it as a decimal. For example, 0.1 would be 10%.

If the user asks for 'over time' data, return by year.

When searching for UK or USA, write out United Kingdom or United States respectively.

EVERY QUERY SHOULD RETURN QUANTITATIVE DATA THAT CAN BE PLOTTED ON A CHART! There should always be at least two columns. If the user asks for a single column, return the column and the count of the column. If the user asks for a rate, return the rate as a decimal. For example, 0.1 would be 10%.`;

const EXPLAIN_QUERY_SYSTEM_PROMPT = `You are a SQL (postgres) expert. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:
unicorns (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL UNIQUE,
  valuation DECIMAL(10, 2) NOT NULL,
  date_joined DATE,
  country VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  select_investors TEXT NOT NULL
);

When you explain you must take a section of the query, and then explain it. Each "section" should be unique. So in a query like: "SELECT * FROM unicorns limit 20", the sections could be "SELECT *", "FROM UNICORNS", "LIMIT 20".
If a section doesn't have any explanation, include it, but leave the explanation empty.`;

/**
 * Executes a SQL query and returns the result data
 * @param {string} query - The SQL query to execute
 * @returns {Promise<Result[]>} Array of query results
 * @throws {Error} If query is not a SELECT statement or table doesn't exist
 */
export const runGeneratedSQLQuery = async (query: string) => {
  "use server";
  // Ensure the query is a SELECT statement. Otherwise, throw an error
  if (
    !query.trim().toLowerCase().startsWith("select") ||
    query.trim().toLowerCase().includes("drop") ||
    query.trim().toLowerCase().includes("delete") ||
    query.trim().toLowerCase().includes("insert") ||
    query.trim().toLowerCase().includes("update") ||
    query.trim().toLowerCase().includes("alter") ||
    query.trim().toLowerCase().includes("truncate") ||
    query.trim().toLowerCase().includes("create") ||
    query.trim().toLowerCase().includes("grant") ||
    query.trim().toLowerCase().includes("revoke")
  ) {
    throw new Error("Only SELECT queries are allowed");
  }

  let data: any;
  try {
    data = await sql.query(query);
  } catch (e: any) {
    if (e.message.includes('relation "unicorns" does not exist')) {
      console.log(
        "Table does not exist, creating and seeding it with dummy data now..."
      );
      // throw error
      throw Error("Table does not exist");
    } else {
      throw e;
    }
  }

  return data.rows as Result[];
};
export async function getSchema(t_name: string) {
  let str = "";
  const result = await sql.query(
    `SELECT column_name,data_type FROM information_schema.columns WHERE table_name = $1`,
    [t_name]
  );
  for (const { column_name, data_type } of result.rows) {
    str += `${column_name} ${data_type} \n`;
  }
  return str;
}

export async function getTheData(t_name: string) {
  const data = await sql.query(`select * from ${t_name} limit 5`);
  return data.rows;
}

const sampleEnglishQuery = (schema: string, tData: string) => {
  return `
  schema:-
  ${schema}

 data:-
  ${tData}
  
  Based on this schema and some sample data, please generate simple English queries that could be asked about this table. Each English query should be clear and direct, helping users find useful information. Provide examples such as:
  if the it is todo table:
  1.How many todos are completed?
  2.Show me all the completed todos.`;
};

export const generateSimpleEnglishQuery = async (
  schema: string,
  t_name: string
) => {
  try {
    const result = await generateObject({
      //@ts-ignore
      model: google(GOOGLE_GEMINI_MODEL),
      prompt: sampleEnglishQuery(schema, t_name),
      schema: z.object({
        queries: z.array(z.object({ desktop: z.string(), mobile: z.string() })),
      }),
    });
    return result.object.queries;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to generate query");
  }
};
export const generateQuery = async (input: string) => {
  try {
    const result = await generateObject({
      //@ts-ignore
      model: google(GOOGLE_GEMINI_MODEL),
      system: QUERY_GENERATAION_SYSTEM_PROMPT,
      prompt: `Generate the query necessary to retrieve the data the user wants: ${input}`,
      schema: z.object({
        query: z.string(),
      }),
    });
    return result.object.query;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to generate query");
  }
};
export const generateCustomQuery = async (
  tableName: string,
  schema: string,
  input: string,
  retryCount = 0
) => {
  const MAX_RETRIES = 1;
  try {
    const result = await generateObject({
      //@ts-ignore
      model: google(GOOGLE_GEMINI_MODEL),
      system: customisedQuery(schema, tableName),
      prompt: `
Table: ${tableName}
User Request: ${input}

Generate a SELECT query that:
1. Returns data suitable for visualization (at least 2 columns)
2. Uses proper PostgreSQL syntax
3. Includes appropriate filtering and aggregation
4. Is optimized for performance

Requirements:
- Only SELECT statements allowed
- Use ILIKE for case-insensitive string matching
- Group by appropriate columns for aggregation
- Return quantitative data suitable for charts
`,
      schema: z.object({
        query: z.string(),
        explanation: z.string().optional()
      }),
    });
    const query = result.object.query.trim();
    if (!query.toLowerCase().startsWith('select')) {
      throw new Error("Generated query is not a SELECT statement");
    }

    return query;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying query generation (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateCustomQuery(tableName, schema, input, retryCount + 1);
    }

    // handleLLMError(error, "generateCustomQuery");
  }
};

export const explainQuery = async (input: string, sqlQuery: string) => {
  try {
    const result = await generateObject({
      //@ts-ignore
      model: google(GOOGLE_GEMINI_MODEL),
      system: EXPLAIN_QUERY_SYSTEM_PROMPT,
      schema: explainQuerySchema,
      //@ts-ignore
      output: "array",
      prompt: `Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise.

      User Query:
      ${input}

      Generated SQL Query:
      ${sqlQuery}`,
    });
    // console.log("result: " + result);
    return result.object;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to explain query");
  }
};




export const readFileData = async () => {
  const result: any = [];
  const csvFilePath = path.join(process.cwd(), "unicorns.csv");

  await new Promise((resolve, reject) => {
    const file = fs.createReadStream(csvFilePath).pipe(csv());
    file
      .on("data", (data) => {
        result.push(data);
        if (result.length > 100) {
          file.emit("end");
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });
  // console.log("result ", result);
  return result;
};

export async function uploadFile(formData: FormData) {
  "use server";

  const file = formData.get("file") as File;
  if (!file) return { success: false, message: "No file uploaded" };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save file to "public/uploads" (Ensure "uploads" folder exists)
  const filePath = path.join(process.cwd(), "public", file.name);

  try {
    await writeFile(filePath, buffer);
    return {
      success: true,
      message: "File uploaded successfully",
      filePath: `/${file.name}`,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, message: "File upload failed" };
  }
}

export const generateChartConfig = async (
  results: Result[],
  userQuery: string
) => {
  "use server";
  try {
    const { object: config } = await generateObject({
      //@ts-ignore
      model: google(GOOGLE_GEMINI_MODEL),
      system: "You are a data visualization expert.",
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
    For multiple groups use multi-lines.

    Here is an example complete config:
    export const chartConfig = {
      type: "pie",
      xKey: "month",
      yKeys: ["sales", "profit", "expenses"],
      colors: {
        sales: "#4CAF50",    // Green for sales
        profit: "#2196F3",   // Blue for profit
        expenses: "#F44336"  // Red for expenses
      },
      legend: true
    }

    User Query:
    ${userQuery}

    Data:
    ${JSON.stringify(results, null, 2)}`,
      schema: configSchema,
    });

    const coolors: Record<string, string> = {};
    config.yKeys.forEach((key, index) => {
      coolors[key] = `hsl(var(--chart-${index + 1}))`;
    });
    const updateConfig = { ...config, coolors };
    return { config, updateConfig };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chart suggestion");
  }
};
const sqlSchema = z.object({
  schema: z.object({
    tableName: z.string(),
    createStatement: z.string(),
  }),
  query: z.string(),
});
//=========================
//  CHANGE TABLE NAME
export async function changeTableName(tableId: string, tableName: string) {


  const session = await auth();
  if (!session || !session.user) {
    throw new Error("unauthorised request")
  }
  const result = await sql.query(`SELECT * FROM owned_table WHERE id=$1 AND "userId"=$2`, [tableId, session?.user.userId]);
  if (result.rowCount as number === 0 || result.rowCount === null) {
    throw new Error("table not found")

  }
  const isTableNameExist = await sql.query(`SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE  table_schema = 'public'
   AND    table_name   = '${tableName}'
);`)
  const oldTableName = result.rows[0].name;
  if (isTableNameExist.rows[0].exists) {
    throw new Error("table name already exists")
  }
  try {

    await sql.query("BEGIN")
    await sql.query(`ALTER TABLE ${oldTableName} RENAME TO ${tableName}`);
    await sql.query(`UPDATE owned_table
    SET name = '${tableName}'
    WHERE id=$1`, [tableId]);
    await sql.query('COMMIT');
    revalidatePath("/own")
  } catch (error) {
    console.log(error)
    await sql.query('ROLLBACK');
    throw new Error("action failed")
  }

}

//DELETE TABLE FROM DATABASE
export async function deleteTable(tableName: string, tableId: string) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("unauthorised request")
  }

  try {

    await sql.query("BEGIN")
    await sql.query(`DROP TABLE IF EXISTS ${tableName}`);
    await sql.query(`DELETE FROM owned_table WHERE id=$1`, [tableId])
    await sql.query('COMMIT');
    revalidatePath("/own")
  } catch (error) {
    console.log(error)
    await sql.query('ROLLBACK');
    throw new Error("action failed")
  }
}

export async function customRevalidatePath(path: string) {
  revalidatePath(path, "page")
}

export async function createTableInDatabase(
  query: string,
  client: VercelPoolClient
) {
  try {
    // if (oldTableName && tableName) {
    //   const queryWithNewTableName = query.replace(oldTableName, tableName);
    //   await sql.query(
    //     queryWithNewTableName.replaceAll("`", "").replaceAll('"', "")
    //   );
    // } else {
    // console.log("create table query:", query);
    const { command, fields, rowCount, rows } = await client.query(query)
    // console.log("table created successfully", { command, fields, rowCount, rows });
    // }
  } catch (error) {
    console.log("error in create table", error);
    throw new Error((error as Error).message || "failed to create table")
  }
}

export async function insertDataInOwnedTable(t_name: string, client: VercelPoolClient) {
  try {

    const session = await auth();
    // console.log("session insertDataInOwnedTable", session);
    const query = `INSERT INTO owned_table (name,"userId") VALUES($1,$2)`;
    await client.query(query, [t_name, session?.user?.userId]);
  } catch (error) {
    console.log("ERROR WHILE INSERTING IN OWNED TABLE", (error as Error).message);
    throw new Error((error as Error).message || "failed to insert data in owned table")
  }


}

export async function insertDataTable(insertQuery: string, client: VercelPoolClient) {
  try {
    const cleanedQuery = insertQuery.replace(/[{}]/g, "").trim();

    const splittedArray = cleanedQuery
      .replaceAll("`", "")
      .replaceAll('"', "")
      .split(";");
    const filteredQueries = splittedArray
      .map((q) => q.trim())
      .filter((q) => q !== "");
    // console.log("filtered", filteredQueries);

    // await Promise.all(filteredQueries.map((query) => sql.query(query)));
    for (const query of filteredQueries) {
      if (query) {
        // console.log("Executing query:", query);
        await client.query(query);
      }
    }
  } catch (error) {
    console.log("ERROR OCCURS WHILE INSERTING DATA AFTER CREATING THE TABLE FROM readSchemaAndGenerateQuery():", (error as Error).message);
    throw new Error((error as Error).message || "ERROR OCCURS WHILE INSERTING DATA AFTER CREATING THE TABLE")
  }
}

export async function isTableAlreadyExist(tableName: string) {
  const query =
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
  const tables = await sql.query(query);
  return tables.rows.some((t) => t.table_name === tableName);
}




export const readFileAndGetSchema = async (fileContent: string | null, retry = false, error = "", retryCount = 1): Promise<SchemaResult> => {
  let MAX_RETRIES = 2;
  try {
    let attatchedError = "";
    if (retry) {
      attatchedError = ` The previous attempt failed due to this error: ${error}. Please ensure the generated schema and INSERT statements are accurate and compatible with PostgreSQL.`;
    }
    const t = "x" + crypto.randomUUID().split("-")[0];
    const result = await generateObject({
      //@ts-ignore
      model: google(GOOGLE_GEMINI_MODEL),
      schema: sqlSchema,
      prompt: `
    ${attatchedError}  
You are an assistant that analyzes JSON sample data and generates a Postgres schema with individual INSERT statements.
Sample Data: ${fileContent}

Your tasks:
1. Generate a single table schema, flattening nested fields into columns using underscore notation (e.g., address_city).
2. If data contains arrays, store them as comma-separated strings in a VARCHAR column and insert them as such in the INSERT statements.
3. If data contains nested objects, create separate columns for each nested field using underscore notation.
4. the table name is ${t},  use that name exactly.
5. Generate appropriate column types (VARCHAR, INT, DECIMAL, DATE) based on the data.
6. Use DECIMAL for monetary values.
7. Only infer DATE type if all values in the column follow an unambiguous YYYY-MM-DD format; otherwise use VARCHAR.
8. Handle NULL values by allowing columns to be nullable when missing or NULL appears in data.
9. Skip any rows that contain problematic data (e.g., unescaped quotes or invalid values that would break SQL) or are missing required fields — do not modify the data to fix issues.
10. Remove backticks from string and date literals in INSERT statements; wrap string/date values in single quotes '...'.

11. Do NOT use backticks (\`) anywhere in the output.
12. Generate one INSERT statement per data item (no batch inserts).
13. Avoid line breaks in both createStatement and query strings — output them as single lines.
14. For each VARCHAR column, set the length to the longest string found in the data for that column and minimum length of string is VARCHAR(500) (eg. VARCHAR(500)) .
15. Return the result in exact JSON format below, including the optional indexes field (empty if none are needed):

{
  "schema": {
    "tableName": "${t}",
    "createStatement": "CREATE TABLE statement without line breaks"
  },
  "query": "All INSERT statements concatenated without newlines"
}

Important:
- Validate that the schema matches all data keys consistently.
- Use appropriate data types for production safety.
- Strings and dates must be enclosed in single quotes('...') in the INSERT statements.
- If a record contains problematic data that would cause an SQL syntax error, skip generating an INSERT for that record instead of modifying it.
- Do NOT include any explanation or extra text.
- All output must be valid JSON.
`,
    });

    return { obj: result.object, isTableExist: false };
  } catch (error) {
    console.log("ERROR IN LLM", (error as Error).message);
    if (RetryError.isInstance(error) || APICallError.isInstance(error)) {
      throw new Error(error.message)
    }
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying readFileAndGetSchema (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
      return readFileAndGetSchema(fileContent, true, (error as Error).message, retryCount + 1);
    }
    throw new Error((error as Error).message);
  }
};



export const checkCredits = async () => {
  try {

    const session = await auth();
    const ownedTable = await sql.query(
      `SELECT COUNT(*) FROM owned_table WHERE "userId"=$1`,
      [session?.user.userId]
    );

    return ownedTable.rows[0].count
  } catch (error) {
    console.log("error checking user table", error)
    throw new Error("sorry ! failed to fetch user credit limit")
  }

}






export const callTheActionsInTransations = async (fileContent: string) => {
  const client = await sql.connect();
  let transactionStarted = false;
  try {
    await client.query("BEGIN")
    transactionStarted = true;
    const { obj } = await readFileAndGetSchema(fileContent as string);
    // console.log("readFIleand Shema :", obj);
    const { finalObject } = await finalCheck(JSON.stringify(obj))
    // console.log("finalObject.schema.createStatement:", finalObject.schema.createStatement);
    // console.log("finalObject.schema:", finalObject.schema);
    await createTableInDatabase(finalObject.schema.createStatement, client);
    await insertDataInOwnedTable(finalObject.schema.tableName, client);
    await insertDataTable(finalObject.query as string, client);
    await client.query("COMMIT")
    return {
      success: true,
      tableName: finalObject.schema.tableName,
      message: "Table created successfully"
    };

  } catch (error) {
    if (transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    console.error("Transaction error:", error);

    // if (error instanceof LLMError) {
    //   throw error;
    // }

    if (RetryError.isInstance(error) || APICallError.isInstance(error)) {
      throw new Error(`AI service error: ${error.message}`);
    }

    throw new Error("Failed to create table and insert data");
  }
}


export const finalCheck = async (object: string, retryCount = 0): Promise<FinalCheckResult | undefined> => {
  const MAX_RETRIES = 1;
  // console.log("final check called,object:", object);
  try {
    const result = await generateObject({
      //@ts-ignore
      model: google(GOOGLE_GEMINI_MODEL),
      system: "You are the postgres expert",
      schema: sqlSchema,
      prompt: `
Input Object: ${object}

VALIDATION TASKS:
1. Verify all INSERT statements are syntactically correct for PostgreSQL
2. Ensure data types match between CREATE and INSERT statements
3. Validate string escaping (use single quotes only)
4. Check for SQL injection patterns and remove them
5. Ensure all column names are consistent

CRITICAL RULES:
- NO backticks anywhere
- Use single quotes for strings: 'value'
- Use double quotes for identifiers only if needed: "columnName"
- Remove any curly braces from SQL statements
- Ensure VARCHAR lengths can accommodate all data

Return ONLY valid JSON:
{
  "schema": {
    "tableName": "exact_same_name",
    "createStatement": "valid PostgreSQL CREATE statement"
  },
  "query": "concatenated INSERT statements separated by semicolons"
}
`
    })

    const finalObject = result.object;

    if (finalObject.query) {
      finalObject.query = finalObject.query
        .replace(/[{}]/g, '') // Remove curly braces
        .replace(/`/g, '') // Remove backticks
        .replace(/\n/g, ' ') // Remove newlines
        .trim();
    }

    if (finalObject.schema?.createStatement) {
      finalObject.schema.createStatement = finalObject.schema.createStatement
        .replace(/`/g, '')
        .replace(/\n/g, ' ')
        .trim();
    }

    return { finalObject };

  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying final check (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return finalCheck(object, retryCount + 1);
    }

    // handleLLMError(error, "finalCheck");
  }
}

