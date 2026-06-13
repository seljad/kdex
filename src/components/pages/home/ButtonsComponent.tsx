"use client";
import DarkButtonComponent from "@/components/ui/buttons/DarkButtonComponent";
import ButtonComponent from "@/components/ui/buttons/ButtonComponent";
import ImageComponent from "@/components/ui/ImageComponent";
import arrowIcon from "@/assets/icons/arrow_right.svg";

function ButtonsComponent() {
  return (
    <div className={"w-full flex lg:items-center items-stretch justify-start lg:flex-row flex-col gap-5"}>
      <ButtonComponent onClick={() => {
      }}>
        <div className={"flex items-center justify-center gap-3"}>
          <p className={"font-spaceGrotesk text-base"}>Start Trading In Dex</p>
          <ImageComponent src={arrowIcon} alt={"Arrow"} />
        </div>
      </ButtonComponent>
      <DarkButtonComponent onClick={() => {
      }} className={"text-regular14 font-sans"}>
        Why US?
      </DarkButtonComponent>
    </div>
  );
}

export default ButtonsComponent;