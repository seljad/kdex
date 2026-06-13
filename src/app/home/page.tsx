import SwapComponent from "@/components/swap/SwapComponent";
import HeaderComponent from "@/components/pages/home/HeaderComponent";

function HomePage() {
  return (
    <div
      className={"w-full flex xl:flex-row flex-col xl:items-start items-center xl:justify-between justify-start xl:gap-0 lg:gap-28 gap-12 px-main lg:py-main py-6"}>
      <section
        className={"xl:flex-1 flex lg:items-start items-center justify-start lg:text-start text-center flex-col lg:gap-6 gap-3"}>
        <HeaderComponent />
      </section>
      <section className={"xl:flex-1 flex items-center justify-center xl:mt-10"}>
        <SwapComponent withOptions={true} />
      </section>
      <div className={"xl:hidden block w-full h-[200px]"} />
    </div>
  );
}

export default HomePage;