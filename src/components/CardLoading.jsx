import ImageIcon from "../icons/ImageIcon";
import DotsIcon from "../icons/DotsIcon";
import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import IconTitleBtn from "./IconTitleBtn";

export default function CardLoading() {
  const buttons = [
    { h4: "Like", svg: <LikeIcon /> },
    { h4: "Share", svg: <ShareIcon /> },
    { h4: "Save", svg: <BookmarkIcon /> },
  ];
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full"></div>
          <div className="flex flex-col gap-1">
            <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center justify-center p-2  text-gray-300">
          <DotsIcon />
        </div>
      </div>

      {/* Uploaded Image */}
      <div className="w-full h-80 flex items-center justify-center bg-gray-200 text-gray-300">
        <ImageIcon width={64} height={64} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 p-4">
        <h2 className="text-lg font-bold bg-gray-300 text-gray-300 rounded-lg animate-pulse">
          Post Title
        </h2>
        <p className="text-sm bg-gray-200 text-gray-200 rounded-lg animate-pulse line-clamp-3">
          This is a short description of the post. It gives more context about
          the uploaded image and the purpose of the post. The purpose of this
          post is to share insights, tell a story, or highlight a moment. Keep
          reading to find out more about what inspired this post and the message
          it conveys.
        </p>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-around gap-2 p-4 text-sm">
        {buttons.map((btn, index) => (
          <IconTitleBtn
            key={index}
            h4={btn.h4}
            svg={btn.svg}
            position="center"
            className="bg-gray-300 text-gray-300 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
