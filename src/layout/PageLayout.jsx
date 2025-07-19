import React from "react";

export default function PageLayout({ children, position = "center" }) {
  return (
    <div
      dir="ltr"
      className={`min-h-screen flex flex-col items-center justify-${position} gap-4 p-4 pt-20`}>
      {children}
    </div>
  );
}
