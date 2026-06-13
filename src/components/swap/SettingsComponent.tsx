import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import ImageComponent from "@/components/ui/ImageComponent";
import settingIcon from "@/assets/icons/setting.svg";
import alertIcon from "@/assets/icons/alert.svg";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import ButtonComponent from "@/components/ui/buttons/ButtonComponent";
import { Dispatch, FC, memo, SetStateAction, useCallback, useEffect, useState } from "react";
import { useSwapStore } from "@/store/swapStore";

interface SettingsState {
  localSlippage: "custom" | "auto";
  localSlippageValue?: number;
  localTransactionDeadline?: number;
}

interface SettingsPopoverContentProps {
  states: SettingsState;
  setStates: Dispatch<SetStateAction<SettingsState>>;
  onSave: () => void;
}

const SettingsPopoverContent: FC<SettingsPopoverContentProps> = memo(
  ({ states, setStates, onSave }) => (
    <PopoverContent className="w-[315px] bg-[#131414] border border-solid border-gray rounded-xl py-4 px-3">
      <div className="w-full flex flex-col items-start justify-start gap-[20px]">
        <p className="font-spaceGrotesk font-bold text-[20px]">Settings</p>

        <div className="w-full flex items-start justify-center gap-3 flex-col">
          <div className="flex items-center justify-center gap-1">
            <ImageComponent src={alertIcon} alt="" className="w-5" />
            <p className="text-semibold14">Max. slippage</p>
          </div>
          <RadioGroup
            orientation="horizontal"
            classNames={{ wrapper: "gap-5" }}
            value={states.localSlippage}
            onValueChange={(value) => setStates((prev) => ({ ...prev, localSlippage: value as "custom" | "auto" }))}
          >
            <Radio value="auto" size="sm" classNames={{ label: "text-regular14" }}>Auto</Radio>
            <Radio value="custom" size="sm" classNames={{ label: "text-regular14" }}>Custom</Radio>
          </RadioGroup>
          {states.localSlippage === "custom" && (
            <Input
              placeholder="Enter Slippage Amount"
              type="number"
              className="w-full text-white"
              value={states.localSlippageValue?.toString()}
              onValueChange={(value) => setStates((prev) => ({
                ...prev,
                localSlippageValue: Number.parseInt(value)
              }))}
              classNames={{
                input: "border-none !bg-[#181818] !text-white",
                inputWrapper: "border border-solid border-gray rounded-[12px] !bg-[#181818]",
                label: "text-white text-sm",
                errorMessage: "text-start text-xs"
              }}
            />
          )}
        </div>

        <Divider className="bg-gray" />

        <div className="w-full flex items-start justify-center gap-3 flex-col">
          <div className="flex items-center justify-center gap-1">
            <ImageComponent src={alertIcon} alt="" className="w-5" />
            <p className="text-semibold14">Transaction deadline</p>
          </div>
          <Input
            placeholder="10 Minutes"
            type="number"
            className="w-full text-white"
            value={states.localTransactionDeadline?.toString()}
            onValueChange={(value) => setStates((prev) => ({
              ...prev,
              localTransactionDeadline: Number.parseInt(value)
            }))}
            classNames={{
              input: "border-none !bg-[#181818] !text-white",
              inputWrapper: "border border-solid border-gray rounded-[12px] !bg-[#181818]",
              label: "text-white text-sm",
              errorMessage: "text-start text-xs"
            }}
          />
        </div>

        <ButtonComponent className="w-full" onClick={onSave}>
          Save Changes
        </ButtonComponent>
      </div>
    </PopoverContent>
  )
);

const SettingsComponent: FC = () => {
  const { settings, updateSettings } = useSwapStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [states, setStates] = useState<SettingsState>({
    localSlippage: settings.slippage,
    localSlippageValue: settings.slippageValue,
    localTransactionDeadline: settings.transactionDeadline
  });

  const handleOpenChange = useCallback((open: boolean) => setIsOpen(open), []);

  // Reset to store values when the Popover closes without saving
  useEffect(() => {
    if (!isOpen) {
      setStates({
        localSlippage: settings.slippage,
        localSlippageValue: settings.slippageValue,
        localTransactionDeadline: settings.transactionDeadline
      });
    }
  }, [isOpen, settings.slippage, settings.slippageValue, settings.transactionDeadline]);

  const handleSaveChanges = useCallback(() => {
    updateSettings({
      slippage: states.localSlippage,
      slippageValue: states.localSlippageValue,
      transactionDeadline: states.localTransactionDeadline
    });
    setIsOpen(false);
  }, [states, updateSettings]);

  return (
    <>
      <div className="lg:hidden h-[1px] flex-grow bg-gray w-full"></div>
      <Popover placement="bottom" offset={10} backdrop="opaque" isOpen={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger>
          <div
            className="aspect-square rounded-full bg-[#0C0C0C] w-12 h-12 flex items-center justify-center cursor-pointer">
            <ImageComponent src={settingIcon} alt="settings"
                            className="bg-[#212121] rounded-full w-9 h-9 aspect-square p-2" />
          </div>
        </PopoverTrigger>
        <SettingsPopoverContent states={states} setStates={setStates} onSave={handleSaveChanges} />
      </Popover>
      <div className="lg:hidden h-[1px] flex-grow bg-gray w-full"></div>
      <div className="lg:block hidden w-[1px] h-16 bg-gray" />
    </>
  );
};

export default memo(SettingsComponent);