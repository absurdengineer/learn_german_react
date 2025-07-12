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
        p: ({ ...props }) => <p className="m-0" {...props} />,
        code({ className, children, ...props }: any) {
          const inline = !className?.includes('language-');
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
        ol({ ...props }) {
          return <ol className="list-decimal pl-5 space-y-1" {...props} />;
        },
        ul({ ...props }) {
          return <ul className="list-disc pl-5 space-y-1" {...props} />;
        },
        li({ ...props }) {
          return <li className="text-gray-600" {...props} />;
        }
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;