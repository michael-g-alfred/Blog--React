import React from "react";
import IconTitleBtn from "./IconTitleBtn";
import HomeIcon from "../icons/HomeIcon";
import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";
import FileIcon from "../icons/FileIcon";
import BookmarkIcon from "../icons/BookmarkIcon";

export default function Floatingbar({ selectedTab, onSelectTab }) {
  const buttons = [
    { h4: "Home", svg: <HomeIcon /> },
    { h4: "Posts", svg: <FileIcon /> },
    { h4: "Likes", svg: <LikeIcon /> },
    { h4: "Shares", svg: <ShareIcon /> },
    { h4: "Save", svg: <BookmarkIcon /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95vw] max-w-sm sm:max-w-md lg:max-w-lg flex justify-center items-center gap-1 p-1 rounded-xl border-3 border-b-6 border-blue-900 backdrop-blur-xs bg-blue-50/70 overflow-hidden">
      {buttons.map((btn, index) => (
        <IconTitleBtn
          key={index}
          h4={btn.h4}
          svg={btn.svg}
          className={`${
            selectedTab === btn.h4
              ? "bg-blue-950 text-blue-50"
              : "bg-blue-700 text-blue-50 hover:bg-blue-500"
          }`}
          position="center"
          onClick={() => onSelectTab(btn.h4)}
        />
      ))}
    </div>
  );
}
