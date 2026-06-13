import clsx from "clsx";
import ButtonsComponent from "@/components/pages/home/ButtonsComponent";

function HeaderComponent() {
  return (
    <>
      <div
        className={"w-fit flex items-center justify-center gap-2 border border-solid border-gray rounded-4xl py-[6px] px-3"}>
        <p className={"text-regular14"}>Try our secure market now!</p>
        <p>-</p>
        <p className={"text-semibold14 cursor-pointer"}>Learn More</p>
      </div>
      <h1 className={clsx(
        "font-spaceGrotesk lg:text-[4rem] text-[44px] leading-tight",
        "text-transparent bg-clip-text bg-gradient-73 from-[#FFFFFF00] via-[#fff] to-[#FFFFFF00]"
      )}>Decentralized<br />Peer-toPeer.2<br />is Available Now</h1>
      <p className={"text-regular14 text-gray1"}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book.
      </p>
      <ButtonsComponent />
    </>
  );
}

export default HeaderComponent;