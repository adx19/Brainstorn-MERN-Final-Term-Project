// src/components/Toast.jsx
import { useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const Toast = ({ type = "success", message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // auto-close after duration
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icon =
    type === "success" ? (
      <CheckCircleIcon className="w-6 h-6 text-green-600" />
    ) : (
      <XCircleIcon className="w-6 h-6 text-red-600" />
    );

  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const borderColor = type === "success" ? "border-green-400" : "border-red-400";

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 ${bgColor} border-l-4 ${borderColor} p-4 rounded shadow-lg animate-slide-in`}
    >
      {icon}
      <span className="text-gray-700">{message}</span>
    </div>
  );
};

export default Toast;
