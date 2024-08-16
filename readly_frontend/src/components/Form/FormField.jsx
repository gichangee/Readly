import './FormField.css';

const FormField = ({ label, type = 'text', value, onChange, multiline = false }) => {
  const inputProps = {
    type,
    value,
    onChange,
    className: "form__field",
    placeholder: label,
    id: label.toLowerCase().replace(' ', '_'),
  };

  return (
    <div className="form__group field">
      {multiline ? (
        <textarea {...inputProps} />
      ) : (
        <input {...inputProps} />
      )}
      <label htmlFor={inputProps.id} className="form__label">{label}</label>
    </div>
  );
};

export default FormField;