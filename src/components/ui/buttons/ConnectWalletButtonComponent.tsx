import ButtonComponent from "@/components/ui/buttons/ButtonComponent";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import truncateString from "@/core/utils/strings";

function ConnectWalletButtonComponent({classname , text}: {classname?: string, text?: string}) {

  const { isConnected, openModal, address } = useWalletConnect();
  return (
    <ButtonComponent className={`bg-transparent !text-white text-[14px] ${classname}`} onClick={() => {
      openModal();
    }}>
      {
        isConnected ? truncateString(address!) : text ?? "Connect Wallet"
      }
    </ButtonComponent>
  );
}

export default ConnectWalletButtonComponent;