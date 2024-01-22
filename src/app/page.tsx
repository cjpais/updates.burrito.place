import { POSTS, Post } from "@/posts";
import dayjs from "dayjs";

export default function Home() {
  return (
    <div className="flex flex-col max-w-2xl w-full gap-12 items-center pt-8">
      {/* <h3 className="">🔥 🌯</h3> */}
      <div className="flex flex-col gap-4 max-w-[420px] w-full">
        {POSTS.map((post, i) => (
          <Row
            key={i}
            title={post.title}
            date={post.date}
            summary={post.summary}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 items-center w-32">
        <div className="flex gap-4 font-mono text-[.65rem]">
          <a href="mailto:cj@cjpais.com">contact</a>
          <a href="/todo">todo</a>
          <a href="https://github.com/cjpais/burrito" target="blank">
            github
          </a>
        </div>
        {/* <p className="text-[.5rem]">built with burrito</p> */}
      </div>
    </div>
  );
}

const Row = ({ title, date, summary }: Post) => {
  return (
    <div className="flex flex-col font-mono gap-1 w-full">
      <div className="flex">
        <p className="w-6">*</p>
        <a href={`/${title.replace(" ", "-")}`} className="underline">
          {title}
        </a>
        {/* <p>[{type}]</p> */}
        <div className="flex-1"></div>
        <p className="">{dayjs.unix(date).format("MM/DD/YY")}</p>
      </div>
      <p className="text-xs font-mono pl-6 italic">{summary}</p>
    </div>
  );
};
