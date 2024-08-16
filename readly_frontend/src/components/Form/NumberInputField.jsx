// src/components/Form/NumberInputField.jsx
import { useState, useEffect } from 'react';
import './FormField.css';

const NumberInputField = ({ label, value, onChange, min = 1, max = 12 }) => {
  const [error, setError] = useState('');

  const checkError = (newValue) => {
    if (newValue < min || newValue > max) {
      setError(`${min}에서 ${max}까지만 가능합니다.`);
    } else {
      setError('');
    }
  };

  useEffect(() => {
    checkError(value);
  }, [value, min, max]);

  const handleChange = (newValue) => {
    onChange(newValue);
    checkError(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(value + 1, max);
    handleChange(newValue);
  };

  const handleDecrease = () => {
    const newValue = Math.max(value - 1, min);
    handleChange(newValue);
  };

  return (
    <div className="form__group field">
      <label className="form__label">{label}</label>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleDecrease}
          className="w-8 h-8 flex items-center justify-center bg-white text-[#878787] rounded-full hover:bg-gray-100 focus:outline-none border-2 border-[#878787] transition-colors duration-200 text-xl font-bold"
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(parseInt(e.target.value, 10) || min)}
          className="form__field w-16 text-center border border-[#878787] rounded"
        />
        <button
          type="button"
          onClick={handleIncrease}
          className="w-8 h-8 flex items-center justify-center bg-white text-[#878787] rounded-full hover:bg-gray-100 focus:outline-none border-2 border-[#878787] transition-colors duration-200 text-xl font-bold"
        >
          +
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default NumberInputField;