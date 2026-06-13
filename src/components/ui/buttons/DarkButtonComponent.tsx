"use client";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { Button } from "@nextui-org/react";

interface ButtonProps {
  style?: CSSProperties;
  className?: string;
  children: ReactNode | string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler;
  size?: "sm" | "md" | "lg";
  color?: "danger" | "warning";
  outline?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  type?: "button" | "submit" | "reset";
}

function DarkButtonComponent(props: ButtonProps) {
  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick}
      size={props.size}
      className={`bg-button-dark-gradient shadow-[0px_4px_10px_0px_#00000033] font-spaceGrotesk border border-solid border-[#2B2B2B] !py-2 !px-4 rounded-3xl text-center !text-white flex items-center justify-center transition-all disabled:bg-disable-color ${props.className}`}
      isLoading={props.loading}
      startContent={props.startContent}
      endContent={props.endContent}
      type={props.type}
    >
      {props.children}
    </Button>
  );
}

export default DarkButtonComponent;
