import { Input } from "@nextui-org/input";
import ImageComponent from "@/components/ui/ImageComponent";
import ethIcon from "@/assets/icons/eth.svg";
import { usePositionStore } from "@/store/usePositionStore";

function DepositAmountsComponent({ onFirstDepositAmountChanges, onSecondDepositAmountChanges }: {
  onFirstDepositAmountChanges?: (value: string) => void;
  onSecondDepositAmountChanges?: (value: string) => void;
}) {

  const {
    token1,
    token2,
    depositAmountToken2Value,
    depositAmountToken1Value,
    updateDepositAmountToken2Value,
    updateDepositAmountToken1Value,
    updateIsFirstDepositChangedValue
  } = usePositionStore();

  return (
    <div className={"flex flex-col items-stretch justify-stretch gap-3"}>
      <header className={"flex items-center justify-between"}>
        <p className={"text-semibold14 "}>Deposit amounts</p>
      </header>
      <div className={"relative"}>
        <Input
          value={depositAmountToken1Value}
          onValueChange={(value) => {
            updateDepositAmountToken1Value?.(value);
            updateIsFirstDepositChangedValue?.(true);
            onFirstDepositAmountChanges?.(value);
          }}
          description={"$7.75B"}
          type={"number"}
          classNames={{
            base: "bg-[#181818] rounded-xl p-3",
            mainWrapper: "gap-2",
            inputWrapper: "!bg-transparent !p-0 h-fit min-h-0",
            innerWrapper: "p-0",
            input: "!text-white !font-spaceGrotesk !font-bold !text-[20px]",
            helperWrapper: "p-0"
          }}
        />
        <div className={"absolute right-3 top-1/2 -translate-y-1/2"}>
          <div
            className={"flex items-center justify-between gap-3"}>
            <div className={"flex items-center justify-start gap-2"}>
              <ImageComponent src={ethIcon} alt={""} className={"rounded-full w-6 h-6 aspect-square"} />
              <p className={"text-semibold14"}>{token1?.name}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={"relative"}>
        <Input
          value={depositAmountToken2Value}
          onValueChange={(value) => {
            updateDepositAmountToken2Value?.(value);
            updateIsFirstDepositChangedValue?.(false);
            onSecondDepositAmountChanges?.(value);
          }}
          type={"number"}
          description={"$7.75B"}
          classNames={{
            base: "bg-[#181818] rounded-xl p-3",
            mainWrapper: "gap-2",
            inputWrapper: "!bg-transparent !p-0 h-fit min-h-0",
            innerWrapper: "p-0",
            input: "!text-white !font-spaceGrotesk !font-bold !text-[20px]",
            helperWrapper: "p-0"
          }}
        />
        <div className={"absolute right-3 top-1/2 -translate-y-1/2"}>
          <div
            className={"flex items-center justify-between gap-3"}>
            <div className={"flex items-center justify-start gap-2"}>
              <ImageComponent src={ethIcon} alt={""} className={"rounded-full w-6 h-6 aspect-square"} />
              <p className={"text-semibold14"}>{token2?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepositAmountsComponent;