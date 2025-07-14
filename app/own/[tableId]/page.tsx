import { generateSimpleEnglishQuery, getSchema, getTheData } from "@/app/actions";
import CustomWrapper from "@/components/CustomWrapper";

const Page = async ({ params }: { params: { tableId: string } }) => {
  const { tableId } = await params;

  const schema = await getSchema(tableId);
  const data = await getTheData(tableId);
  //@ts-ignore
  const q = await generateSimpleEnglishQuery(schema,data);
 
  return (
    <div className="">
      <CustomWrapper queries={q} isCustom={true} schema={schema} t_name={tableId} />
    </div>
  );
};

export default Page;
