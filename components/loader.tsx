"use client";

import { HashLoader } from "react-spinners";

export default function Loader() {
  return (
    <HashLoader
      size={40}
      color="#3e63dd"
      aria-label="Loading Spinner"
      data-testid="loader"
      speedMultiplier={2}
    />
  );
}
