import React from "react";
import Button from "./Button";

interface ExitButtonProps {
  onExit: () => void;
  label?: string;
  className?: string;
}

const ExitButton: React.FC<ExitButtonProps> = ({
  onExit,
  label = "Exit",
  className = "",
}) => {
  return (
    <Button
      onClick={onExit}
      variant="ghost"
      size="sm"
      className={`flex items-center space-x-2 ${className}`}
    >
      <span className="text-gray-700">❌ {label}</span>
    </Button>
  );
};

export default ExitButton;
