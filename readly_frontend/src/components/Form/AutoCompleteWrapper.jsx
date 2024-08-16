// components/Form/AutoCompleteWrapper.jsx
import FormField from './FormField';

export default function AutoCompleteWrapper({
  label,
  value,
  onChange,
  suggestions = [],
  onSuggestionClick,
  showSuggestions,
  ...props
}) {
  return (
    <div className="relative">
      <FormField
        label={label}
        value={value}
        onChange={onChange}
        {...props}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="bg-[#F5F5F5] border rounded-lg shadow-lg mt-1 absolute z-10 w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id || index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion.title}
              <div className="border-b border-custom-border w-full"></div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}