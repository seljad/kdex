import { tv } from "tailwind-variants";

export const buttonStyles = tv({
  base: "flex items-center justify-center rounded-3xl transition-all relative disabled:bg-disable-color",
  variants: {
    color: {
      white: "bg-white !text-gray900",
      dark: "bg-button-dark-gradient shadow-[0px_4px_10px_0px_#00000033] text-white"
    },
    border: {
      true: "border border-solid border-gray"
    },
    size: {
      sm: "text-regular14",
      md: "text-base font-spaceGrotesk",
      lg: "text-4xl lg:text-6xl"
    },
    fullWidth: {
      true: "w-full block",
      false: "w-fit"
    }
  },
  defaultVariants: {
    color: "white",
    border: false,
    fullWidth: true,
    size: "md"
  },
  compoundVariants: [
    {
      color: [
        "dark",
        "white"
      ],
      class: ""
    }
  ]
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
