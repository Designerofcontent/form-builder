import React from 'react';
import { Upload } from 'lucide-react';

const DesignSettings = ({ theme, onThemeChange }) => {
  return (
    <div className="design-settings p-4 space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">General</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Theme</label>
            <select
              value={theme.name}
              onChange={(e) => onThemeChange({ ...theme, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="custom">Custom Theme</option>
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => onThemeChange({ ...theme, primaryColor: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => onThemeChange({ ...theme, primaryColor: e.target.value })}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Question Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.questionColor}
                onChange={(e) => onThemeChange({ ...theme, questionColor: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="text"
                value={theme.questionColor}
                onChange={(e) => onThemeChange({ ...theme, questionColor: e.target.value })}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Answer Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.answerColor}
                onChange={(e) => onThemeChange({ ...theme, answerColor: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="text"
                value={theme.answerColor}
                onChange={(e) => onThemeChange({ ...theme, answerColor: e.target.value })}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Form Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.formColor}
                onChange={(e) => onThemeChange({ ...theme, formColor: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="text"
                value={theme.formColor}
                onChange={(e) => onThemeChange({ ...theme, formColor: e.target.value })}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => onThemeChange({ ...theme, backgroundColor: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) => onThemeChange({ ...theme, backgroundColor: e.target.value })}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Page Layout</h3>
        <select
          value={theme.layout}
          onChange={(e) => onThemeChange({ ...theme, layout: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="standard">Standard</option>
          <option value="compact">Compact</option>
          <option value="wide">Wide</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Background Image</h3>
        <button className="w-full p-2 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Logo</h3>
        <button className="w-full p-2 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Favicon</h3>
        <button className="w-full p-2 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Font Style</h3>
        <select
          value={theme.fontFamily}
          onChange={(e) => onThemeChange({ ...theme, fontFamily: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Font Size</h3>
        <select
          value={theme.fontSize}
          onChange={(e) => onThemeChange({ ...theme, fontSize: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Margin</h3>
        <select
          value={theme.margin}
          onChange={(e) => onThemeChange({ ...theme, margin: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="none">None</option>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">Font Weight</h3>
        <select
          value={theme.fontWeight}
          onChange={(e) => onThemeChange({ ...theme, fontWeight: e.target.value })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="semibold">Semibold</option>
          <option value="bold">Bold</option>
        </select>
      </div>
    </div>
  );
};

export default DesignSettings;
