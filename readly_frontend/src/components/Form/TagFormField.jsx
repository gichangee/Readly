import { useState } from 'react';
import './FormField.css';

const TagFormField = ({ label, tags, setTags, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="form__group field">
      <input
        type="text"
        className="form__field"
        placeholder={placeholder || label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        id={label.toLowerCase().replace(' ', '_')}
      />
      <label htmlFor={label.toLowerCase().replace(' ', '_')} className="form__label">{label}</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="ml-2 text-red-500">
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagFormField;