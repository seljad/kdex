export default function truncateString(text: string): string {
  if (text.length <= 9) {
    return text;
  }
  const firstPart = text.slice(0, 5); // First 5 characters
  const lastPart = text.slice(-4); // Last 4 characters
  return `${firstPart}...${lastPart}`;
}
