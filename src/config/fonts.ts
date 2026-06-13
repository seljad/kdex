import { Inter as FontSans, Space_Grotesk as FontSpaceGrotesk } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const fontSpaceGrotesk = FontSpaceGrotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});
