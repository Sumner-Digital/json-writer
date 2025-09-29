import React, { FC } from 'react';
import hljs from 'highlight.js';

interface JsonPreviewProps {
  value: object;
  onCopy(): void;
}

const JsonPreview: FC<JsonPreviewProps> = ({ value, onCopy }) => {
  const jsonString = JSON.stringify(value, null, 2);
  
  // Create the full HTML snippet with script tags
  const htmlSnippet = `<script type="application/ld+json">
${jsonString}
</script>`;
  
  // Highlight the entire HTML snippet
  const highlighted = hljs.highlightAuto(htmlSnippet, ['html', 'xml']).value;
  
  return (
    <div className="glass p-4">
      <pre
        dangerouslySetInnerHTML={{ __html: highlighted }}
      ></pre>
      <button
        type="button"
        className="liquid-button"
        onClick={onCopy}
      >
        Copy HTML Snippet
      </button>
    </div>
  );
};

export default JsonPreview;