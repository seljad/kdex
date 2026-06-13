"use client";
import { Suspense } from "react";
import ButtonComponent from "@/components/ui/buttons/ButtonComponent";
import { useDisclosure } from "@nextui-org/react";
import { retryDynamicImport } from "@/components/retryDynamicImport";
import { Spinner } from "@nextui-org/spinner";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import ConnectWalletButtonComponent from "@/components/ui/buttons/ConnectWalletButtonComponent";

const AddLiquidityModal = retryDynamicImport(() => import("@/components/pages/positions/AddLiquidityModal"));
const LargeDeviceTableComponent = retryDynamicImport(() =>
  import("@/components/pages/positions/LargeDeviceTableComponent")
);
const MobileViewComponent = retryDynamicImport(() =>
  import("@/components/pages/positions/MobileViewComponent")
);

function PositionsPage() {

  const { isOpen, onClose, onOpenChange } = useDisclosure();
  const {address} = useWalletConnect();

  return (
    <>
      <div className={"w-full h-full flex flex-wrap items-start justify-center md:gap-0 gap-10 px-main py-main"}>
        <div className={"w-full flex flex-col gap-6"}>
          <div className={"flex items-center justify-between"}>
            <p className={"font-spaceGrotesk text-[20px] font-bold"}>Your Positions</p>
            <ButtonComponent onClick={onOpenChange} className={"md:flex hidden"}>
              New Position
            </ButtonComponent>
          </div>
          {
            address ? <>
              <LargeDeviceTableComponent />
              <MobileViewComponent />
            </>: <ConnectWalletButtonComponent classname={'w-fit m-auto'} text={"Please Connect your wallet first"}/>
          }
          <ButtonComponent onClick={onOpenChange} className={"md:hidden flex sticky bottom-4"}>
            New Position
          </ButtonComponent>
        </div>
      </div>
      <Suspense fallback={<Spinner />}>
        {isOpen && <AddLiquidityModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />}
      </Suspense>
    </>
  );
}

export default PositionsPage;