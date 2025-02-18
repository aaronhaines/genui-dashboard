import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeSwitcher: React.FC = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "5px 10px",
        backgroundColor: isDarkTheme ? "#444" : "#ddd",
        color: isDarkTheme ? "#fff" : "#000",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        zIndex: 2000,
      }}
    >
      {isDarkTheme ? "Light" : "Dark"} Theme
    </button>
  );
};

export default ThemeSwitcher;
