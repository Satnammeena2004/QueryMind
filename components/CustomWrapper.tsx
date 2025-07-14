import React from "react";
import Cutsom from "./Custom";
import { generateCustomQuery, generateQuery } from "@/app/actions";
import { suggestionQueries } from "@/lib/helper";
type CustomWrapperPropsType = {
  t_name?: string;
  schema?: string;
  isCustom: boolean;
  queries?: any;
};

const CustomWrapper = ({
  t_name,
  schema,
  isCustom,
  queries,
}: CustomWrapperPropsType) => {
  return (
    <>
      {isCustom ? (
        <Cutsom
          t_name={t_name}
          schema={schema as string}
          suggestedQueries={queries}
          queryGeneratorFn={generateCustomQuery.bind(
            null,
            t_name as string,
            schema as string
          )}
        />
      ) : (
        <Cutsom
          suggestedQueries={suggestionQueries}
          queryGeneratorFn={generateQuery}
          t_name="unicorns"
        />
      )}
    </>
  );
};

export default CustomWrapper;
