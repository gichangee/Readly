import './CustomRadioButton.css'

const CustomRadioButton = ({ options, selectedOption, onChange }) => {
  return (
    <div className="radio-inputs">
      {options.map((option) => (
        <label key={option.value} className="radio">
          <input
            type="radio"
            name="radio-option"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className="name">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default CustomRadioButton;