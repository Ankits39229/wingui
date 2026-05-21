interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function HighlightText({ text, query, className }: HighlightTextProps) {
  const q = query.trim();
  if (!q) return <span className={className}>{text}</span>;

  const parts = text.split(new RegExp(`(${escapeRegex(q)})`, "gi"));

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="text-highlight">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
