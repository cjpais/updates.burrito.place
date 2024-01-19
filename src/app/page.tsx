import dayjs from "dayjs";

export default function Home() {
  const posts = [
    {
      title: "wk.1",
      type: "unwrapped",
      date: 1705680891,
      summary: "someting",
    },
    {
      title: "wk.1",
      type: "tech",
      date: 1705680891,
      summary: "someting",
    },
  ];

  return (
    <div className="flex flex-col max-w-2xl w-full gap-12 items-center">
      {/* <h3 className="">🔥 🌯</h3> */}
      <div></div>
      <div className="flex flex-col gap-3 max-w-[420px] w-full">
        {posts.map((post, i) => (
          <Row
            key={i}
            title={post.title}
            type={post.type}
            date={post.date}
            summary={post.summary}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 items-center w-32">
        <div className="flex gap-4 font-mono text-[.65rem]">
          <a href="mailto:cj@cjpais.com">contact</a>
          <a href="https://github.com/cjpais/burrito" target="blank">
            github
          </a>
        </div>
        {/* <p className="text-[.5rem]">built with burrito</p> */}
      </div>
    </div>
  );
}

const Row = ({
  title,
  type,
  date,
  summary,
}: {
  title: string;
  type: string;
  date: number;
  summary: string;
}) => {
  return (
    <div className="flex flex-col font-mono gap-1 w-full">
      <div className="flex">
        <p className="w-6">*</p>
        <a href={`/${title}`} className="underline">
          {title} {type}
        </a>
        {/* <p>[{type}]</p> */}
        <div className="flex-1"></div>
        <p className="">{dayjs.unix(date).format("MM/DD/YY")}</p>
      </div>
      {/* <p className="text-xs font-mono pl-4 italic">{summary}</p> */}
    </div>
  );
};
