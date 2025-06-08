import React, { FC } from 'react';
import hljs from 'highlight.js';

interface JsonPreviewProps {
  value: object;
  onCopy(): void;
}

const JsonPreview: FC<JsonPreviewProps> = ({ value, onCopy }) => {
  const jsonString = JSON.stringify(value, null, 2);
  const highlighted = hljs.highlightAuto(jsonString).value;
  return (
    <div className="glass p-4">
      <pre
        dangerouslySetInnerHTML={{ __html: highlighted }}
      ></pre>
      <button
        type="button"
        className="mt-2 accent-text"
        onClick={onCopy}
      >
        Copy JSON
      </button>
    </div>
  );
};

export default JsonPreview;