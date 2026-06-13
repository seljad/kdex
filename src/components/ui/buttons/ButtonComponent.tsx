"use client";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { Button } from "@nextui-org/react";

interface types {
  style?: CSSProperties,
  className?: string,
  children: ReactNode | string,
  disabled?: boolean,
  loading?: boolean,
  onClick?: MouseEventHandler,
  size?: "sm" | "md" | "lg",
  color?: "danger" | "warning",
  outline?: boolean,
  startContent?: ReactNode,
  endContent?: ReactNode,
  type?: "button" | "submit" | "reset"
}

function ButtonComponent(props: types) {
  return (
    <Button disabled={props.disabled} onClick={props.onClick} size={props.size}
            className={`bg-white font-spaceGrotesk border border-solid border-[#2B2B2B] py-3 px-5 rounded-3xl text-center text-gray900 flex items-center justify-center transition-all relative  disabled:cursor-not-allowed disabled:bg-gray disabled:text-gray1 ${props.className}`}
            isLoading={props.loading}
            startContent={props.startContent}
            endContent={props.endContent}
            type={props.type}>{props.children}</Button>
  );
}

export default ButtonComponent;