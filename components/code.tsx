"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Copy, CopyCheck } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  vs2015,
  atelierCaveLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Code({ code }: { code: string }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setCopied(false), 4000);

    return () => clearTimeout(timeoutId);
  }, [copied]);

  if (!mounted) {
    return null;
  }

  return (
    <article className="container relative mx-auto rounded-full">
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Embed this code into your website
      </p>

      {copied ? (
        <CopyCheck className="absolute right-2 top-7 w-5" />
      ) : (
        <Copy
          className="absolute right-2 top-7 w-5 cursor-pointer hover:text-zinc-400"
          onClick={handleCopy}
        />
      )}

      <SyntaxHighlighter
        language="html"
        wrapLongLines={true}
        style={theme === "dark" ? vs2015 : atelierCaveLight}
        customStyle={{ borderRadius: "7px", padding: "12px" }}
      >
        {code}
      </SyntaxHighlighter>
    </article>
  );
}
