// src/components/Button.jsx
const Button = ({ text, color = "blue", onClick, fullWidth = false }) => {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    pink: "bg-pink-500 hover:bg-pink-600 text-white",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-black",
    gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90",
  };

  return (
    <button
      onClick={onClick}
      className={`${colors[color]} ${fullWidth ? "w-full" : ""} py-2 px-4 rounded font-medium transition`}
    >
      {text}
    </button>
  );
};

export default Button;
