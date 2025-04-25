import { Loader } from "lucide-react";
import React from "react";

export default function Mainloading({ loading }: { loading: boolean }) {
  return <div>{loading && <Loader />}</div>;
}
