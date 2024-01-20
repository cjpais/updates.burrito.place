import React from "react";
import fs from "fs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { join } from "path";

const getPost = (slug: string) => {
  return fs
    .readFileSync(join(process.cwd(), "posts", `${slug}.md`))
    .toString("utf-8");
};

const Page = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-[640px] w-full flex flex-col gap-2">
        <Markdown remarkPlugins={[remarkGfm]}>{getPost(params.slug)}</Markdown>
      </div>
    </div>
  );
};

export default Page;
