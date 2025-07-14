import { motion } from "framer-motion";
import { Button } from "./ui/button";
// import { suggestionQueries } from "@/lib/helper";

type suggestedQueryType={
  desktop:string,
  mobile:string
}

export const SuggestedQueries = ({
  handleSuggestionClick,
  suggestedQueries
}: {
  suggestedQueries:suggestedQueryType[]
  handleSuggestionClick: (suggestion: string) => void;
}) => {
  return (
    <motion.div
      key="suggestions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      exit={{ opacity: 0 }}
      className="h-full overflow-y-auto"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
        Try these queries:
      </h2>
      <div className="flex flex-wrap gap-2">
        {suggestedQueries.map((suggestion:suggestedQueryType, index:number) => (
          <Button
            key={index}
            className={index > 5 ? "hidden sm:inline-block dark:bg-neutral-900" : "dark:bg-neutral-900"}
            type="button"
            variant="outline"
            onClick={() => handleSuggestionClick(suggestion.desktop)}
          >
            <span className="sm:hidden">{suggestion.mobile}</span>
            <span className="hidden sm:inline">{suggestion.desktop}</span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
