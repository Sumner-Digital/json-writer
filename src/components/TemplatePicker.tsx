import React, { FC } from 'react';

interface TemplatePickerProps {
  onSelect(templateId: string): void;
  selected?: string;
}

const templates = [
  { id: 'home', label: 'Home' },
  { id: 'product', label: 'Product' },
  { id: 'article', label: 'Article' },
  { id: 'faq', label: 'FAQ' },
  { id: 'event', label: 'Event' },
  { id: 'local', label: 'Local' },
];

const TemplatePicker: FC<TemplatePickerProps> = ({ onSelect, selected }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="glass p-6 rounded-lg max-w-md w-full">
        <div className="grid grid-cols-3 gap-4">
          {templates.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`px-4 py-2 rounded ${
                selected === id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-pressed={selected === id}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatePicker;