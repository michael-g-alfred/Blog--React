import IconTitleBtn from "./IconTitleBtn";
import TrashIcon from "../icons/TrashIcon";
import PanelLayout from "../layout/PanelLayout";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function EllipsisPanel({ postId, dispatch, setPanelOpen }) {
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      dispatch({ type: "DELETE_POST", payload: postId });
      setPanelOpen(false);
    } catch (err) {
      console.error("Failed to delete post from Firebase:", err);
    }
  };

  const buttons = [
    {
      h4: "Delete",
      svg: <TrashIcon />,
      onClick: handleDelete,
    },
  ];

  return (
    <>
      {buttons.map((btn, index) => (
        <IconTitleBtn
          key={index}
          h4={btn.h4}
          svg={btn.svg}
          position="center"
          onClick={btn.onClick}
          className="w-full flex items-center justify-center gap-1 p-2 hover:shadow-xs text-sm rounded-md bg-blue-700    
                            text-blue-50 hover:bg-blue-500 cursor-pointer"
        />
      ))}
    </>
  );
}
