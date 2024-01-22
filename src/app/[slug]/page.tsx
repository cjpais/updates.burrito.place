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
    <div className="w-full flex flex-col items-center pt-4">
      <div className="max-w-[640px] w-full flex flex-col gap-4">
        <Markdown remarkPlugins={[remarkGfm]}>{getPost(params.slug)}</Markdown>
        <h2>Curious?</h2>
        <p>
          If you're curious about any of this, drop me a line:{" "}
          <a href="mailto:cj@cjpais.com">cj@cjpais.com</a>
        </p>
        <p>I'd love to chat with you!</p>
      </div>
    </div>
  );
};

export default Page;
