"use client";

import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CopyButton } from "./home/interactive";

export default function Code({ code }: { code: string }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-lg bg-zinc-950">
      <CopyButton
        value={code}
        label="Copy code"
        className="absolute top-2 right-2 text-zinc-400 hover:bg-white/10 hover:text-white"
      />

      <SyntaxHighlighter
        language="html"
        wrapLongLines={true}
        style={vs2015}
        customStyle={{
          margin: 0,
          padding: "14px 48px 14px 14px",
          background: "transparent",
          fontSize: "13px",
          lineHeight: "1.6",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
