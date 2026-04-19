import { parseThemeColor, useMantineTheme } from "@mantine/core";

export function useMantineLogoColors({ color, inverted }) {
  const theme = useMantineTheme();

  const parsedColor = parseThemeColor({
    color: color || "blue",
    theme,
  });

  const mainColor = parsedColor.isThemeColor
    ? theme.colors[parsedColor.color][5]
    : color;

  return {
    background: inverted ? theme.white : mainColor,
    color: inverted ? mainColor : theme.white,
  };
}