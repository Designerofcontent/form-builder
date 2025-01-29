import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const EmbedCode = ({ formId, theme }) => {
  const [copied, setCopied] = useState(false);
  
  const embedCode = `<!-- Form Builder Embed Code -->
<iframe
  src="${window.location.origin}/form/${formId}"
  style="width: 100%; height: 600px; border: none; background-color: ${theme.backgroundColor};"
  allow="payment"
></iframe>
<script src="${window.location.origin}/form-embed.js"></script>`;

  const wordpressCode = `[form_builder id="${formId}"]`;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">HTML Embed Code</h3>
        <div className="relative">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
            {embedCode}
          </pre>
          <button
            onClick={() => handleCopy(embedCode)}
            className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded-md"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">WordPress Shortcode</h3>
        <div className="relative">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm">
            {wordpressCode}
          </pre>
          <button
            onClick={() => handleCopy(wordpressCode)}
            className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded-md"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>To embed this form in WordPress:</p>
        <ol className="list-decimal ml-4 mt-2 space-y-2">
          <li>Install the Form Builder WordPress plugin</li>
          <li>Copy the shortcode above</li>
          <li>Paste it into any post or page where you want the form to appear</li>
        </ol>
      </div>
    </div>
  );
};

export default EmbedCode;
