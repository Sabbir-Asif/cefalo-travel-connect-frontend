// src/components/TagInput.tsx
import React, { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = "Add tags...",
  maxTags = 10
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      !tags.includes(trimmedValue) &&
      tags.length < maxTags
    ) {
      onChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Tags</span>
        <span className="label-text-alt">{tags.length}/{maxTags}</span>
      </label>
      
      <div className="flex flex-wrap gap-2 p-3 border border-base-300 rounded-lg min-h-[48px] focus-within:border-primary">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="badge badge-primary gap-2 py-3 px-3"
          >
            <span>{tag}</span>
            <button
              type="button"
              className="text-primary-content hover:text-error"
              onClick={() => removeTag(index)}
            >
              ✕
            </button>
          </div>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
          disabled={tags.length >= maxTags}
        />
      </div>
      
      <label className="label">
        <span className="label-text-alt">
          Press Enter or comma to add tags. Max {maxTags} tags allowed.
        </span>
      </label>
    </div>
  );
};