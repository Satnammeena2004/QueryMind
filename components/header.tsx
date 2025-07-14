import { AuroraText } from "./magicui/aurora-text";
import { ShinyButton } from "./magicui/shiny-button";

export const Header = ({
  handleClear,
  tableName,
}: {
  handleClear: () => void;
  tableName: string;
}) => {
  return (
    <>
      <div className="flex items-center justify-center mb-6 relative">
        <h1
          className="text-xl  sm:text-6xl font-bold text-center text-foreground flex items-center cursor-pointer text-nowrap"
          onClick={() => handleClear()}
        >
          Talk to{" "}
          <AuroraText className="text-center text-4xl md:text-5xl mx-4">{tableName} </AuroraText>
        </h1>
      </div>
      {/* <Link href={"/unicorns_data"}>
        <ShinyButton>Preview Table</ShinyButton>
      </Link> */}
    </>
  );
};
