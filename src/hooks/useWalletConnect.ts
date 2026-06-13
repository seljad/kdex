import { useAccount, useConnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

export const useWalletConnect = () => {
  const { connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  return {
    isConnected: isConnected && address !== undefined && connectors !== undefined,
    openModal: open,
    address: address
  };
};