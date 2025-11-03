import { useTheme } from "next-themes";

export const useToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, onThemeToggle: handleThemeToggle };
};
