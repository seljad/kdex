import { toast, ToastOptions } from "react-toastify";

const showToast = ({ message, type = "success", id, onClick, description }: {
  message?: any,
  description?: any,
  type?: "success" | "error" | "warning" | "loading" | "update" | "dismiss",
  id?: string | number,
  onClick?: any
}): string | number | undefined | void => {

  if (type === "update" && !id) return;

  const options: ToastOptions = {
    onClick: onClick,
    autoClose: 3000
  };

  switch (type) {
    case "success":
      return toast.success(message, options);
    case "error":
      return toast.error(message, options);
    case "warning":
      return toast.warning(message, options);
    case "loading":
      return toast.loading(message, options);
    case "update":
      return toast.update(id!, { ...options, render: message });
    case "dismiss":
      return toast.dismiss(id);
    default:
      return toast(<p className={"!text-white"}>{message}</p>, options);
  }
};

export default showToast;
