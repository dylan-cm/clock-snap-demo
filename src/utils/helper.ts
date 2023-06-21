type RGB = [number, number, number];

export const hexToRgb = (hex: string): RGB => {
  let c: string[];
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex || "#ffffff")) {
    c = (hex || "#ffffff").substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    let rgbNumber = Number("0x" + c.join(""));
    return [(rgbNumber >> 16) & 255, (rgbNumber >> 8) & 255, rgbNumber & 255];
  }
  throw new Error("Bad Hex");
};

export const calculateContrast = (hexColor: string): string => {
  const [r, g, b]: RGB = hexToRgb(hexColor);

  // Calculate the luminance of the color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for lighter colors and white for darker colors
  return luminance > 0.61 ? "black" : "white";
};

export const formatCurrency = (number: number) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);

  return formattedNumber;
};
