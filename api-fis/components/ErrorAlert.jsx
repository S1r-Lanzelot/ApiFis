import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

export const ErrorAlert = ({ err }) => {
  const [errorString, setErrorString] = useState("Something went wrong.");

  useEffect(() => {
    console.error(err);

    if (typeof err === "string") {
      setErrorString(err);
    } else {
      setErrorString(err?.message || err?.data?.message || "Something went wrong.");
    }
  }, [err]);

  return <Alert severity="error">{errorString}</Alert>;
};
