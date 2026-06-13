import clsx from "clsx";
import { Input } from "@nextui-org/input";
import ImageComponent from "@/components/ui/ImageComponent";
import searchIcon from "@/assets/icons/search.svg";

function HeaderComponent() {
  return (
    <header className={"w-fit flex flex-col items-center justify-center gap-3"}>
      <h1 className={clsx(
        "w-fit font-spaceGrotesk lg:text-[4rem] text-[44px] leading-tight",
        "text-transparent bg-clip-text bg-gradient-73 from-[#FFFFFF00] via-[#fff] to-[#FFFFFF00]"
      )}>
        A New Era Of<br />Crypto Exchange
      </h1>
      <p className={"text-regular14 text-gray1 w-fit m-auto"}>Lorem Ipsumis simply dummy text of the
        printing and typesetting industry. Lorem Ipsum has<br />been the industry's
        standard dummy text</p>
      <Input placeholder={"Search Tokens..."} className={"w-full mt-3"} classNames={{
        input: "border-none !bg-[#181818]",
        inputWrapper: "border border-solid border-[#2B2B2B] rounded-[32px] !bg-[#181818] group-data-[disabled=true]:bg-[#181818] group-data-[hover=true]:bg-[#181818] group-data-[invalid=true]:!bg-transparent",
        mainWrapper: "",
        label: "text-[#A8A8A8] text-sm",
        errorMessage: "text-start text-xs"
      }}
             startContent={<ImageComponent src={searchIcon} alt={"search"} className={"me-1"} />}
      />
    </header>
  );
}

export default HeaderComponent;