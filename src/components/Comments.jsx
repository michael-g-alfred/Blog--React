import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import TrashIcon from "../icons/TrashIcon";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text,
      createdAt: new Date().toISOString(),
      user: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
      },
    });

    setText("");
  };

  const handleDelete = async (commentId) => {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    const commentSnap = await getDoc(commentRef);
    if (commentSnap.exists()) {
      const commentData = commentSnap.data();
      if (commentData.user.uid !== currentUser.uid) return;
      await deleteDoc(commentRef);
    }
  };

  return (
    <div className="py-2 px-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-2">
        <input
          className="flex-1 border p-2 rounded-md text-sm"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="text-blue-600 font-semibold cursor-pointer">
          Comment
        </button>
      </form>
      {comments.length > 0 && (
        <button
          onClick={() => setShowComments(!showComments)}
          className={`text-blue-600 font-semibold ${
            showComments ? "mb-2" : ""
          }`}>
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      )}
      {showComments && (
        <div
          className="max-h-64
           overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {comment.user?.photoURL ? (
                  <img
                    src={comment.user.photoURL}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                    {comment.user.displayName?.[0] || "?"}
                  </div>
                )}
                <div className="text-sm text-gray-800">
                  <strong>{comment.user.displayName}: </strong>
                  {comment.text}
                </div>
              </div>
              {currentUser?.uid === comment.user.uid && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-600 hover:text-red-500 text-2xl cursor-pointer">
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
