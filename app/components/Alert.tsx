import React from "react";

interface AlertProps {
  type?: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}

const typeStyles = {
  success: "bg-green-100 border-green-400 text-green-700",
  error: "bg-red-100 border-red-400 text-red-700",
  info: "bg-blue-100 border-blue-400 text-blue-700",
};

export const Alert: React.FC<AlertProps> = ({ type = "info", message, onClose }) => (
  <div
    className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 border-l-4 p-4 mb-4 rounded shadow ${typeStyles[type]} flex justify-between items-center min-w-[300px] max-w-[90vw]`}
    style={{ pointerEvents: "auto" }}
  >
    <span>{message}</span>
    {onClose && (
      <button onClick={onClose} className="ml-4 text-xl font-bold focus:outline-none">&times;</button>
    )}
  </div>
);

export default Alert;