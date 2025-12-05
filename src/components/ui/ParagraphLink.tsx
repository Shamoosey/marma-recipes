export function ParagraphLink({ children }: { children: any }) {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  if (typeof children !== "string") {
    return children;
  }

  const parts = children.split(urlPattern);

  return (
    <>
      {parts.map((part, index) => {
        if (part.match(urlPattern)) {
          const href = part.startsWith("www.") ? `https://${part}` : part;

          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
              {part}
            </a>
          );
        }
        return (
          <span key={index} className="whitespace-pre-line">
            {part}
          </span>
        );
      })}
    </>
  );
}
