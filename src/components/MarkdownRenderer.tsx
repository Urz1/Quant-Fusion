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
              className={`font-serif font-semibold text-ink-primary pt-2 pb-0.5 tracking-tight ${
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
            <div
              key={idx}
              className="my-3 overflow-x-auto rounded-lg border border-border-rule bg-surface-sheet shadow-2xs"
            >
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-surface-recessed/90 border-b border-border-rule text-ink-primary font-mono text-[10.5px] sm:text-[11px] tracking-wider uppercase">
                    {block.headers.map((h, hIdx) => {
                      const isRight = block.alignments?.[hIdx] === "right";
                      const isCenter = block.alignments?.[hIdx] === "center";
                      const alignClass = isRight ? "text-right" : isCenter ? "text-center" : "text-left";
                      return (
                        <th key={hIdx} className={`px-3 py-2 font-semibold whitespace-nowrap ${alignClass}`}>
                          {renderInline(h)}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-rule/60">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-surface-recessed/50 transition-colors even:bg-surface-canvas/25 odd:bg-surface-sheet"
                    >
                      {row.map((cell, cIdx) => {
                        const isRight = block.alignments?.[cIdx] === "right";
                        const isCenter = block.alignments?.[cIdx] === "center";
                        const alignClass = isRight ? "text-right" : isCenter ? "text-center" : "text-left";
                        const isNumeric = isRight || /^[$\d+\-%<>#]/.test(cell.trim());

                        return (
                          <td
                            key={cIdx}
                            className={`px-3 py-2 text-ink-primary ${alignClass} ${
                              isNumeric ? "font-mono text-[11.5px] font-medium" : "font-sans text-[12px] leading-snug"
                            }`}
                          >
                            {renderInline(cell)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isStreaming && isLastBlock && (
                <div className="p-1.5 bg-surface-sheet border-t border-border-rule/40 text-[10px] text-ink-muted font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-btn-cta animate-ping" />
                  <span>Streaming tabular ledger...</span>
                </div>
              )}
            </div>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={idx} className="space-y-1.5 pl-1 my-1.5">
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
              className="border-l-3 border-btn-cta pl-3.5 py-1.5 my-2 bg-surface-recessed/30 rounded-r text-ink-secondary italic text-[13px]"
            >
              {renderInline(block.content)}
              {isStreaming && isLastBlock && (
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-btn-cta animate-pulse align-baseline rounded-2xs" />
              )}
            </blockquote>
          );
        }

        if (block.type === "divider") {
          return <hr key={idx} className="my-3 border-t border-border-rule/80" />;
        }

        return (
          <p key={idx} className="whitespace-pre-wrap leading-relaxed">
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
  | { type: "table"; headers: string[]; rows: string[][]; alignments: ("left" | "right" | "center")[] }
  | { type: "quote"; content: string }
  | { type: "divider" };

// Line-by-line stateful parser that accurately isolates tables, lists, and headings
function parseMarkdownBlocks(text: string): Block[] {
  if (!text) return [];

  const rawLines = text.split(/\r?\n/);
  const result: Block[] = [];
  let currentParagraphLines: string[] = [];
  let i = 0;

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const pText = currentParagraphLines.join("\n").trim();
      if (pText) {
        result.push({ type: "paragraph", content: pText });
      }
      currentParagraphLines = [];
    }
  };

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Empty line -> flush pending paragraph
    if (trimmed === "") {
      flushParagraph();
      i++;
      continue;
    }

    // 2. Horizontal divider
    if (/^---+$|^___+$|^\*\*\*+$/.test(trimmed)) {
      flushParagraph();
      result.push({ type: "divider" });
      i++;
      continue;
    }

    // 3. Headings
    if (trimmed.startsWith("### ")) {
      flushParagraph();
      result.push({ type: "heading", level: 3, content: trimmed.replace(/^###\s+/, "") });
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      result.push({ type: "heading", level: 2, content: trimmed.replace(/^##\s+/, "") });
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushParagraph();
      result.push({ type: "heading", level: 1, content: trimmed.replace(/^#\s+/, "") });
      i++;
      continue;
    }

    // 4. Blockquotes
    if (trimmed.startsWith("> ")) {
      flushParagraph();
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("> ")) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      result.push({ type: "quote", content: quoteLines.join(" ") });
      continue;
    }

    // 5. Table detection: line contains '|' and subsequent line is separator or table row
    if (trimmed.includes("|")) {
      const nextLine = i + 1 < rawLines.length ? rawLines[i + 1].trim() : "";
      const isHeaderAndSep = nextLine.includes("|") && /^[|\s-:]+$/.test(nextLine);

      if (isHeaderAndSep) {
        flushParagraph();
        const headerRaw = trimmed;
        const sepRaw = nextLine;
        i += 2;

        const headers = splitTableRow(headerRaw);
        const alignments = parseAlignments(sepRaw, headers.length);
        const rows: string[][] = [];

        while (i < rawLines.length && rawLines[i].trim().includes("|")) {
          const rowLine = rawLines[i].trim();
          if (rowLine.length > 0 && !/^[|\s-:]+$/.test(rowLine)) {
            const cells = splitTableRow(rowLine);
            if (cells.length > 0) {
              rows.push(cells);
            }
          }
          i++;
        }

        // Detect numerical alignment if not explicitly set
        for (let c = 0; c < headers.length; c++) {
          if (alignments[c] === "left" && rows.length > 0) {
            const numCount = rows.filter((r) => r[c] && /^[$\d+\-%<>#]/.test(r[c].trim())).length;
            if (numCount >= Math.ceil(rows.length * 0.7)) {
              alignments[c] = "right";
            }
          }
        }

        result.push({ type: "table", headers, rows, alignments });
        continue;
      }
    }

    // 6. Lists: bullet or numbered
    if (/^[-*•]\s+|^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      const listItems: string[] = [];
      while (i < rawLines.length && /^[-*•]\s+|^\d+\.\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^[-*•]\s+|^\d+\.\s+/, "").trim());
        i++;
      }
      if (listItems.length > 0) {
        result.push({ type: "list", items: listItems });
      }
      continue;
    }

    // 7. Regular paragraph line
    currentParagraphLines.push(line);
    i++;
  }

  flushParagraph();
  return result;
}

// Split table pipe row into cleaned cells
function splitTableRow(row: string): string[] {
  let s = row.trim();
  if (s.startsWith("|")) s = s.substring(1);
  if (s.endsWith("|")) s = s.substring(0, s.length - 1);
  return s.split("|").map((cell) => cell.trim());
}

// Parse markdown separator alignments (|:---|:---:|---:|)
function parseAlignments(sepLine: string, colCount: number): ("left" | "right" | "center")[] {
  const parts = splitTableRow(sepLine);
  const alignments: ("left" | "right" | "center")[] = [];

  for (let i = 0; i < colCount; i++) {
    const part = (parts[i] || "").trim();
    if (part.startsWith(":") && part.endsWith(":")) {
      alignments.push("center");
    } else if (part.endsWith(":")) {
      alignments.push("right");
    } else {
      alignments.push("left");
    }
  }
  return alignments;
}

// Inline formatting: bold (**text**), italics (*text*), inline code (`code`), citations
function renderInline(text: string): React.ReactNode {
  if (typeof text !== "string") return text;

  const parts: React.ReactNode[] = [];
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

