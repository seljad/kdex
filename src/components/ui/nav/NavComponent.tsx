import searchIcon from "@/assets/icons/search.svg";
import logoIcon from "@/assets/images/logo.png";
import menuIcon from "@/assets/icons/menu.svg";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import ImageComponent from "@/components/ui/ImageComponent";
import { Input } from "@nextui-org/input";
import ConnectWalletButtonComponent from "@/components/ui/buttons/ConnectWalletButtonComponent";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

function NavComponent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pathname = usePathname();
  const navItems = useMemo(() => siteConfig.navItems, []);

  useEffect(() => {
    const index = navItems.findIndex(item => pathname === item.link);
    if (index !== -1 && index !== selectedIndex) {
      setSelectedIndex(index);
    }
  }, [pathname, navItems, selectedIndex]);

  const renderNavItem = useCallback((item: {
    icon: string;
    link: string;
    title: string;
  }, index: Key) => (
    <div key={index} className={"flex items-center justify-center gap-1 cursor-pointer"}>
      <div
        className={`bg-[#212121] rounded-full p-3 ${selectedIndex === index ? "opacity-100" : "opacity-0"} transition-all`}>
        <ImageComponent src={item.icon} alt={"Icon"} className={selectedIndex === index ? "" : "opacity-0"} />
      </div>
      <Link href={item.link}
            className={` ${selectedIndex === index ? "text-semibold14" : "text-regular14 text-[#7D7D7D]"}`}>
        {item.title}
      </Link>
    </div>
  ), [selectedIndex]);

  return (
    <nav
      className={"h-navbar w-full lg:py-5 py-2 lg:px-main px-4 border-b border-solid border-gray lg:border-none flex items-center justify-between"}>
      <ImageComponent src={logoIcon} alt={siteConfig.name} className={"w-[78px] object-contain"} />
      <div
        className={`lg:flex hidden w-fit bg-[#0C0C0C] items-center justify-center xl:gap-16 gap-8 border border-solid border-[#2B2B2B] rounded-[32px] transition-all p-2`}>
        <div className={"flex items-center justify-center xl:gap-6 gap-3"}>
          {navItems.map(renderNavItem)}
        </div>
        <Input placeholder={"Search Tokens..."} className={"xl:w-[300px] w-fit"} classNames={{
          input: "border-none !bg-[#181818]",
          inputWrapper: "border border-solid border-[#2B2B2B] rounded-[32px] !bg-[#181818] group-data-[disabled=true]:bg-[#181818] group-data-[hover=true]:bg-[#181818] group-data-[invalid=true]:!bg-transparent",
          mainWrapper: "",
          label: "text-[#A8A8A8] text-sm",
          errorMessage: "text-start text-xs"
        }}
               startContent={<ImageComponent src={searchIcon} alt={"search"} className={"me-1"} />}
        />
      </div>
      <ConnectWalletButtonComponent classname={"lg:flex hidden"} />
      <ImageComponent src={menuIcon} alt={"menu"} className={"lg:hidden"} />
    </nav>
  );
}

export default NavComponent;