"use client";
import { CopyBlock, dracula } from "react-code-blocks";

export interface CopyBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

function MyCoolCodeBlock({ code, language, showLineNumbers }: CopyBlockProps) {
  return (
    <CopyBlock
      text={code}
      language={language}
      showLineNumbers={showLineNumbers}
      theme={dracula}
      codeBlock
    />
  );
}

export default MyCoolCodeBlock;
