"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Config, Result } from "@/lib/types";
import { generateChartConfig, runGeneratedSQLQuery } from "@/app/actions";

import { Header } from "@/components/header";
import { QueryViewer } from "@/components/query-viewer";
import { Results } from "@/components/results";
import { Search } from "@/components/search";
import { SuggestedQueries } from "@/components/suggested-queries";
import React from "react";

function Cutsom({
  t_name,
  queryGeneratorFn,
  suggestedQueries,
}: {
  t_name?: string;
  suggestedQueries: any;
  queryGeneratorFn: (
    question: any,
    t_name?: string,
    schema?: string
  ) => Promise<string>;
}) {
  const [inputValue, setInputValue] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);

  const [activeQuery, setActiveQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [chartConfig, setChartConfig] = useState<Config | null>(null);

  const handleSubmit = async (suggestion?: string) => {
    clearExistingData();

    const question = suggestion ?? inputValue;
    if (inputValue.length === 0 && !suggestion) return;

    if (question.trim()) {
      setSubmitted(true);
    }

    setLoading(true);
    setLoadingStep(1);
    setActiveQuery("");

    try {
      const query = await queryGeneratorFn(question);
      // console.log("query from the ", query);
      if (query === undefined) {
        toast.error("An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      setActiveQuery(query);
      setLoadingStep(2);

      const companies = await runGeneratedSQLQuery(query);
      const columns = companies.length > 0 ? Object.keys(companies[0]) : [];
      // console.log("query datat,", companies);

      setResults(companies);
      setColumns(columns);

      setLoading(false);
      const { config } = await generateChartConfig(companies, question);
      setChartConfig(config);
    } catch (e) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInputValue(suggestion);
    try {
      await handleSubmit(suggestion);
    } catch (e) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const clearExistingData = () => {
    setActiveQuery("");
    setResults([]);
    setColumns([]);
    setChartConfig(null);
  };

  const handleClear = () => {
    setSubmitted(false);
    setInputValue("");
    clearExistingData();
  };

  return (
    <div
      className=" dark:bg-gradient-to-r dark:from-black dark:via-transparent dark:to-black flex items-start justify-center p-0 sm:p-8 overflow-y-scroll h-screen [&::-webkit-scrollbar]:w-[2px]
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-zinc-950
  dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600"
    >
      <div className="w-full  max-w-5xl min-h-dvh sm:min-h-0 flex flex-col mt-12">
        <motion.div
          className="bg-card rounded-xl sm:border sm:border-border flex-grow flex flex-col  lg:border-none dark:bg-gradient-to-r dark:from-transparent  dark:to-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="p-6 sm:p-8 flex flex-col flex-grow">
            <Header handleClear={handleClear} tableName={t_name as string} />
            <Search
              tableName={t_name}
              handleClear={handleClear}
              handleSubmit={handleSubmit}
              inputValue={inputValue}
              setInputValue={setInputValue}
              submitted={submitted}
            />
            <div
              id="main-container"
              className="flex-grow flex flex-col sm:min-h-[420px]"
            >
              <div className="flex-grow h-full">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <SuggestedQueries
                      suggestedQueries={suggestedQueries}
                      handleSuggestionClick={handleSuggestionClick}
                    />
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="sm:h-full min-h-[400px] flex flex-col"
                    >
                      <QueryViewer
                        activeQuery={activeQuery}
                        inputValue={inputValue}
                      />
                      {loading ? (
                        <div className="h-full absolute bg-background/50 w-full flex flex-col items-center justify-center space-y-4">
                          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                          <p className="text-foreground">
                            {loadingStep === 1
                              ? "Generating SQL query..."
                              : "Running SQL query..."}
                          </p>
                        </div>
                      ) : results.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center">
                          <p className="text-center text-muted-foreground">
                            No results found.
                          </p>
                        </div>
                      ) : (
                        <Results
                          results={results}
                          chartConfig={chartConfig}
                          columns={columns}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
         
        </motion.div>
      </div>
    </div>
  );
}

export default Cutsom;
