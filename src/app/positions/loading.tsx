import { Spinner } from "@nextui-org/spinner";

function Loading() {
  return (
    <div className={"w-full h-full flex items-center justify-center"}>
      <Spinner size={"lg"} color={"white"} />
    </div>
  );
}

export default Loading;