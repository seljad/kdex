import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit-common";
import { bscTestnet, polygon, tron } from "@reown/appkit/networks";
import ethIcon from "@/assets/icons/eth.svg";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

if (!projectId) {
  throw new Error("Project ID is not defined");
}
// export const ganacheNetwork: CaipNetwork = {
//   id: `eip155:1337`, // You should replace this with the appropriate CaipNetworkId type value
//   chainId: 1337, // Ganache's default Chain ID
//   chainNamespace: "eip155", // Assuming "evm" is a valid namespace for EVM-based chains
//   name: "Ganache",
//   currency: "ETH", // Ether as the currency
//   explorerUrl: "", // Ganache typically doesn't have an explorer, so you can leave it empty or use a placeholder
//   rpcUrl: "http://192.168.10.23:8545", // Replace with your server's IP and port for Ganache
//   imageUrl: undefined, // Optional: you can leave this undefined or provide a URL to an image
//   imageId: undefined // Optional: similar to imageUrl
// };

// export const bscTestnetNetwork: CaipNetwork = {
//   caipNetworkId: undefined,
//   nativeCurrency: undefined,
//   rpcUrls: { default: undefined },
//   id: `eip155:97`,
//   // chainId: bscTestnet.id,
//   chainNamespace: "eip155",
//   name: bscTestnet.name
//   // currency: "tBNB", // Ether as the currency
//   // explorerUrl: bscTestnet.blockExplorers.default.url, // Ganache typically doesn't have an explorer, so you can leave it empty or use a placeholder
//   // rpcUrl: "https://bsc-testnet-rpc.publicnode.com" // Replace with your server's IP and port for Ganache
// };

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [bscTestnet];
export const networksIcons = [
  { id: bscTestnet.id, icon: ethIcon },
  { id: polygon.id, icon: ethIcon },
  { id: tron.id, icon: ethIcon },
];
export const defaultNetwork: AppKitNetwork = bscTestnet;
// export const networks: CaipNetwork[] = [sepolia];
// export const defaultNetwork: CaipNetwork = sepolia;
export const wagmiAdapter = new WagmiAdapter({
  // storage: createStorage({
  //   storage: localStorage
  // }),
  ssr: true,
  projectId,
  networks,
});