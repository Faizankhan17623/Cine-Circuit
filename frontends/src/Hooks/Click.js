// Click.js (assumed)
import { useEffect } from "react";

import toast from "react-hot-toast";
const Click = () => {
  useEffect(() => {
    console.log("Custom hook Click ran");
  }, []);

  return toast.success("clicked"); // can return anything: state, function, etc.
};

export default Click;
