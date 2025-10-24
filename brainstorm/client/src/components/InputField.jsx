// src/components/InputField.jsx
const InputField = ({ label, type = "text", placeholder, value, onChange, name, autoComplete }) => {
  return (
    <div>
      <label className="block text-gray-700 mb-1 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}          // controlled input
        onChange={onChange}    // updates parent state
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
    </div>
  );
};

export default InputField;
