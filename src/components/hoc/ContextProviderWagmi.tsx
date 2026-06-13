"use client";
import { defaultNetwork, networks, projectId, wagmiAdapter } from "@/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit, Metadata } from "@reown/appkit/react";
import { type ReactNode } from "react";
import { Config, WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata: Metadata = {
  name: "Test",
  description: "Test for swap",
  url: "https://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/179229932"]
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [...networks],
  defaultNetwork: defaultNetwork,
  metadata: metadata,
  privacyPolicyUrl: "https://sajjadev.com",
  enableCoinbase: false,
  features: {
    swaps: false,
    socials: false,
    email: false,
    emailShowWallets: false,
    allWallets: false,
    analytics: false
  }
});


function ContextProvider({ children }: { children?: ReactNode; }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;