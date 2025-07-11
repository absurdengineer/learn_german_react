import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const processedContent = content.replace(/\\n/g, '\n');
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => <p className="m-0" {...props} />,
        code({node, inline, className, children, ...props}) {
          return !inline ? (
            <code className={className} {...props}>
              {children}
            </code>
          ) : (
            <code className="bg-gray-200 text-gray-800 px-1.5 py-1 rounded-md font-mono text-sm" {...props}>
              {children}
            </code>
          )
        },
        ol({ node, ...props }) {
          return <ol className="list-decimal pl-5 space-y-1" {...props} />;
        },
        ul({ node, ...props }) {
          return <ul className="list-disc pl-5 space-y-1" {...props} />;
        },
        li({ node, ...props }) {
          return <li className="text-gray-600" {...props} />;
        }
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;