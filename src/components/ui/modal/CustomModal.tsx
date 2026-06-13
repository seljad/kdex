import React from "react";
import { Modal, ModalContent } from "@nextui-org/react";

interface propsType {
  show: boolean;
  onOpenChange: () => void;
  backdrop?: true | false | "static";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  fullscreen?: true | undefined;
  baseClassName?: string | undefined;
  children: React.ReactNode;
  allowClose?: boolean;
  placement?: "top" | "bottom" | "center" | "auto";
  scrollBehavior?: "inside" | "outside";
}

function CustomModal({
                       show,
                       onOpenChange,
                       children,
                       size,
                       placement,
                       scrollBehavior,
                       allowClose,
                       baseClassName
                     }: propsType) {
  return (
    <Modal isOpen={show} placement={placement}
           onOpenChange={onOpenChange}
           size={size}
           scrollBehavior={scrollBehavior}
           isDismissable={allowClose}
           hideCloseButton={true} className={"overflow-visible"}
           classNames={{
             base: `bg-gradient-to-b from-[#070709] to-[#131414] rounded-[20px] border border-solid border-gray  ${baseClassName}`,
             backdrop: "blur"
           }}>
      <ModalContent className={""}>
        {() => (
          <>
            {children}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CustomModal;