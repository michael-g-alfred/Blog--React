import React from "react";

export default function IconTitleBtn({ h4, svg, className, onClick }) {
  return (
    <div
      className={`w-full flex items-center justify-center gap-0.5 p-1 rounded-md text-xs ${className}`}
      onClick={onClick}>
      {svg && svg}
      {h4 && <h4 className="text-md">{h4}</h4>}
    </div>
  );
}
