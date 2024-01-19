import React from "react";
import fs from "fs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const getMarkdown = () => {
  return fs.readFileSync("./public/updates/wk1-unwrapped.md").toString("utf-8");
};

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-[640px] w-full flex flex-col gap-2">
        <Markdown remarkPlugins={[remarkGfm]}>{getMarkdown()}</Markdown>
      </div>
    </div>
  );
};

export default Page;
