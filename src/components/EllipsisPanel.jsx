import IconTitleBtn from "./IconTitleBtn";
import TrashIcon from "../icons/TrashIcon";
import PanelLayout from "../layout/PanelLayout";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import EditIcon from "../icons/EditIcon";

export default function EllipsisPanel({
  postId,
  dispatch,
  setPanelOpen,
  setIsEditing,
}) {
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      dispatch({ type: "DELETE_POST", payload: postId });
      setPanelOpen(false);
    } catch (err) {
      console.error("Failed to delete post from Firebase:", err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setPanelOpen(false);
  };

  const buttons = [
    {
      h4: "Edit Post",
      svg: <EditIcon />,
      onClick: handleEdit,
    },
    {
      h4: "Delete Post",
      svg: <TrashIcon />,
      onClick: handleDelete,
    },
  ];

  return (
    <>
      {buttons.map((btn, index) => (
        <div key={index}>
          <IconTitleBtn
            h4={btn.h4}
            svg={btn.svg}
            position="center"
            onClick={btn.onClick}
            className="w-full flex items-center justify-center px-4 py-2 hover:shadow-xs text-sm rounded-md bg-blue-700 text-blue-50 hover:bg-blue-500 cursor-pointer"
          />
          {index < buttons.length - 1 && (
            <hr className="mt-1 mb-.5 border-.5 rounded border-gray-300" />
          )}
        </div>
      ))}
    </>
  );
}
