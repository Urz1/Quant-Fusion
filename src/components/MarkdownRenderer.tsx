"use client";

import React, { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export function MarkdownRenderer({ content, isStreaming = false }: MarkdownRendererProps) {
  // Normalize streaming markdown by virtually closing unclosed bold, italic, or code tokens
  const safeContent = useMemo(() => {
    if (!content) return "";
    let s = content;

    // Virtually close trailing bold (**text without closing **)
    const boldMatches = s.match(/\*\*/g);
    if (boldMatches && boldMatches.length % 2 !== 0) {
      s += "**";
    }

    // Virtually close trailing inline code (`code without closing `)
    const codeMatches = s.match(/`/g);
    if (codeMatches && codeMatches.length % 2 !== 0) {
      s += "`";
    }

    return s;
  }, [content]);

  const blocks = useMemo(() => parseMarkdownBlocks(safeContent), [safeContent]);

  return (
    <div className="space-y-3 font-sans text-[13.5px] text-ink-primary leading-relaxed break-words select-text">
      {blocks.map((block, idx) => {
        const isLastBlock = idx === blocks.length - 1;

        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h3" : "h4";
          return (
            <Tag
              key={idx}
              className={`font-serif font-semibold text-ink-primary pt-1.5 pb-0.5 tracking-tight ${
                block.level === 2 ? "text-[16px]" : "text-[14.5px]"
              }`}
            >
              {renderInline(block.content)}
              {isStreaming && isLastBlock && (
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-btn-cta animate-pulse align-baseline rounded-2xs" />
              )}
            </Tag>
          );
        }

        if (block.type === "table") {
          return (
            <div key={idx} className="my-2.5 overflow-x-auto rounded-lg border border-border-rule shadow-2xs">
              <table className="w-full text-left text-[12px] font-sans border-collapse">
                <thead>
                  <tr className="bg-surface-recessed/70 border-b border-border-rule text-ink-primary font-mono text-[11px]">
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} className="px-3 py-2 font-semibold">
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-rule/60 bg-surface-sheet">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx % 2 === 1 ? "bg-surface-canvas/40" : "bg-surface-sheet"}
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 text-ink-primary font-mono">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isStreaming && isLastBlock && (
                <div className="p-1.5 bg-surface-sheet border-t border-border-rule/40 text-[10px] text-ink-muted font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-btn-cta animate-ping" />
                  <span>Synthesizing tabular figures...</span>
                </div>
              )}
            </div>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={idx} className="space-y-1.5 pl-1 my-1">
              {block.items.map((item, iIdx) => {
                const isLastItem = iIdx === block.items.length - 1;
                return (
                  <li key={iIdx} className="flex items-start gap-2 text-ink-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-btn-cta mt-2 shrink-0" />
                    <span className="flex-1">
                      {renderInline(item)}
                      {isStreaming && isLastBlock && isLastItem && (
                        <span className="inline-block w-1.5 h-3.5 ml-1 bg-btn-cta animate-pulse align-baseline rounded-2xs" />
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={idx}
              className="border-l-3 border-btn-cta pl-3 py-1 my-1.5 bg-surface-recessed/30 rounded-r text-ink-secondary italic text-[13px]"
            >
              {renderInline(block.content)}
              {isStreaming && isLastBlock && (
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-btn-cta animate-pulse align-baseline rounded-2xs" />
              )}
            </blockquote>
          );
        }

        if (block.type === "divider") {
          return <hr key={idx} className="my-2.5 border-t border-border-rule/80" />;
        }

        return (
          <p key={idx} className="whitespace-pre-wrap">
            {renderInline(block.content)}
            {isStreaming && isLastBlock && (
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-btn-cta animate-pulse align-baseline rounded-2xs" />
            )}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: "paragraph"; content: string }
  | { type: "heading"; level: number; content: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; content: string }
  | { type: "divider" };

function parseMarkdownBlocks(text: string): Block[] {
  if (!text) return [];

  const rawBlocks = text.split(/\n{2,}/);
  const result: Block[] = [];

  for (const raw of rawBlocks) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // Divider
    if (/^---+$|^___+$/.test(trimmed)) {
      result.push({ type: "divider" });
      continue;
    }

    // Heading
    if (trimmed.startsWith("### ")) {
      result.push({ type: "heading", level: 3, content: trimmed.replace(/^###\s+/, "") });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      result.push({ type: "heading", level: 2, content: trimmed.replace(/^##\s+/, "") });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed
        .split("\n")
        .map((l) => l.replace(/^>\s?/, ""))
        .join(" ");
      result.push({ type: "quote", content: quoteText });
      continue;
    }

    // Markdown Table
    if (trimmed.includes("|") && trimmed.includes("\n")) {
      const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length >= 2 && lines[0].includes("|") && lines[1].includes("-")) {
        const headers = lines[0]
          .split("|")
          .map((c) => c.trim())
          .filter((c, i, arr) => !(i === 0 && c === "") && !(i === arr.length - 1 && c === ""));

        const rows = lines.slice(2).map((l) =>
          l
            .split("|")
            .map((c) => c.trim())
            .filter((c, i, arr) => !(i === 0 && c === "") && !(i === arr.length - 1 && c === ""))
        );

        result.push({ type: "table", headers, rows });
        continue;
      }
    }

    // List: if any line starts with bullet or number list
    const lines = trimmed.split("\n");
    const isList = lines.some((l) => /^[-*•]\s+|^\d+\.\s+/.test(l.trim()));
    if (isList && lines.length > 0) {
      const items = lines
        .map((l) => l.replace(/^[-*•]\s+|^\d+\.\s+/, "").trim())
        .filter((l) => l.length > 0);
      if (items.length > 0) {
        result.push({ type: "list", items });
        continue;
      }
    }

    // Normal paragraph
    result.push({ type: "paragraph", content: trimmed });
  }

  return result;
}

// Inline formatting: bold (**text**), italics (*text*), inline code (`code`), citations
function renderInline(text: string): React.ReactNode {
  if (typeof text !== "string") return text;

  const parts: React.ReactNode[] = [];
  // Tokenize bold, code, citations, italics
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-ink-primary">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="font-mono text-[12px] px-1.5 py-0.5 rounded bg-surface-recessed text-ink-primary border border-border-rule/80"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.endsWith("]")) {
      // Citation pill formatting
      parts.push(
        <span
          key={match.index}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-btn-cta/10 text-btn-cta font-mono text-[11px] font-medium border border-btn-cta/25 mx-0.5"
        >
          <span>§</span>
          <span>{token.slice(1, -1)}</span>
        </span>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-ink-secondary">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
