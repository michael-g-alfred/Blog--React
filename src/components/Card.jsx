import { useState, useEffect, useContext, useRef } from "react";
import EditPostForm from "./EditPostForm";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../services/firebase";
import Comments from "./Comments";
import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";
import DotsIcon from "../icons/DotsIcon";
import ImageIcon from "../icons/ImageIcon";
import IconTitleBtn from "./IconTitleBtn";
import EllipsisPanel from "./EllipsisPanel";
import BookmarkIcon from "../icons/BookmarkIcon";

import { AuthContext } from "../context/AuthProvider";
import { usePostContext } from "../context/PostContext";
import PanelLayout from "../layout/PanelLayout";
import UserPostedName from "./UserPostedName";

export default function Card({ post }) {
  // Formats large counts into readable strings, e.g., 1.2K, 3.4M, or empty if zero
  function formatCount(count) {
    if (count <= 0) return "";
    if (count > 999999)
      return ` (${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M)`;
    if (count > 999)
      return ` (${(count / 1000).toFixed(1).replace(/\.0$/, "")}K)`;
    return ` (${count})`;
  }

  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const { dispatch } = usePostContext();

  const [panelOpen, setPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const panelRef = useRef(null);

  // Initialize states based on post data and current user
  const [likeClicked, setLikeClicked] = useState(
    post?.likes?.includes(currentUser?.email) || false
  );
  const [shareClicked, setShareClicked] = useState(
    post?.shares?.includes(currentUser?.email) || false
  );
  const [saveClicked, setSaveClicked] = useState(
    post?.saves?.includes(currentUser?.email) || false
  );

  const likeCount = post?.likes?.length || 0;
  const shareCount = post?.shares?.length || 0;
  const saveCount = post?.saves?.length || 0;

  // Update states when post or currentUser changes
  useEffect(() => {
    if (post && currentUser) {
      setLikeClicked(post.likes?.includes(currentUser.email) || false);
      setShareClicked(post.shares?.includes(currentUser.email) || false);
      setSaveClicked(post.saves?.includes(currentUser.email) || false);
    }
  }, [post, currentUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handlePanelOpening() {
    setPanelOpen((prev) => !prev);
  }

  const getButtonClass = (clicked) => {
    if (!isAuthenticated) return "bg-gray-700 text-gray-50 cursor-not-allowed";
    return clicked
      ? "bg-blue-900 text-white"
      : "bg-blue-700 text-blue-50 hover:bg-blue-500";
  };

  // Handle like functionality
  const handleLike = async () => {
    if (!isAuthenticated || !currentUser || !post) return;

    try {
      const postRef = doc(db, "posts", post.id);
      const isCurrentlyLiked = post.likes?.includes(currentUser.email);

      if (isCurrentlyLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.email),
        });
        dispatch({
          type: "UPDATE_POST",
          payload: {
            id: post.id,
            likes: post.likes.filter((email) => email !== currentUser.email),
          },
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.email),
        });
        dispatch({
          type: "UPDATE_POST",
          payload: {
            id: post.id,
            likes: [...(post.likes || []), currentUser.email],
          },
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // Handle share functionality - Creates a new shared post
  const handleShare = async () => {
    if (!isAuthenticated || !currentUser || !post) return;

    try {
      const isCurrentlyShared = post.shares?.includes(currentUser.email);

      if (isCurrentlyShared) {
        // Remove share tracking
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          shares: arrayRemove(currentUser.email),
        });
        dispatch({
          type: "UPDATE_POST",
          payload: {
            id: post.id,
            shares: post.shares.filter((email) => email !== currentUser.email),
          },
        });
      } else {
        // Create new shared post
        const { id, ...postWithoutId } = post;
        const sharedPost = {
          ...postWithoutId,
          userPosted: {
            uid: currentUser.uid,
            displayName: currentUser.displayName || "",
            email: currentUser.email,
            photoURL: currentUser.photoURL || "",
          },
          submittedAt: new Date().toISOString(),
          likes: [],
          shares: [],
          saves: [],
          isShared: true,
          originalPost: {
            id: post.id,
            userPosted: post.userPosted,
            submittedAt: post.submittedAt,
          },
        };

        // Add the shared post to database
        const docRef = await addDoc(collection(db, "posts"), sharedPost);

        // Add to context
        dispatch({
          type: "ADD_POST",
          payload: { id: docRef.id, ...sharedPost },
        });

        // Update original post share count
        const originalPostRef = doc(db, "posts", post.id);
        await updateDoc(originalPostRef, {
          shares: arrayUnion(currentUser.email),
        });

        dispatch({
          type: "UPDATE_POST",
          payload: {
            id: post.id,
            shares: [...(post.shares || []), currentUser.email],
          },
        });
      }
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  // Handle save functionality
  const handleSave = async () => {
    if (!isAuthenticated || !currentUser || !post) return;

    try {
      const postRef = doc(db, "posts", post.id);
      const isCurrentlySaved = post.saves?.includes(currentUser.email);

      if (isCurrentlySaved) {
        // Unsave
        await updateDoc(postRef, {
          saves: arrayRemove(currentUser.email),
        });
        dispatch({
          type: "UPDATE_POST",
          payload: {
            id: post.id,
            saves: post.saves.filter((email) => email !== currentUser.email),
          },
        });
      } else {
        // Save
        await updateDoc(postRef, {
          saves: arrayUnion(currentUser.email),
        });
        dispatch({
          type: "UPDATE_POST",
          payload: {
            id: post.id,
            saves: [...(post.saves || []), currentUser.email],
          },
        });
      }
    } catch (error) {
      console.error("Error updating save:", error);
    }
  };

  const interactionButtons = [
    {
      key: "like",
      count: likeCount,
      clicked: likeClicked,
      icon: <LikeIcon />,
      onClick: handleLike,
    },
    {
      key: "share",
      count: shareCount,
      clicked: shareClicked,
      icon: <ShareIcon />,
      onClick: handleShare,
    },
    {
      key: "save",
      count: saveCount,
      clicked: saveClicked,
      icon: <BookmarkIcon />,
      onClick: handleSave,
    },
  ];

  if (!post) return null;

  if (isEditing) {
    return <EditPostForm post={post} setIsEditing={setIsEditing} />;
  }

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg shadow-xs">
      {/* Header: User info, timestamp, and ellipsis menu */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {post.userPosted?.photoURL ? (
            <img
              src={post.userPosted.photoURL}
              alt="UserPhoto"
              className="min-w-12 h-12 rounded-full object-cover border-1 border-gray-700 cursor-default"
            />
          ) : (
            <div className="min-w-12 h-12 flex justify-center items-center bg-gray-300 border-1 border-gray-700 text-gray-700 text-sm rounded-full">
              <UserPostedName user={post.userPosted} />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-lg font-bold text-blue-700">
              {post.userPosted?.displayName || "Anonymous"}
            </p>
            <p className="text-xs text-gray-700">{post.submittedAt}</p>
            {/* Show original post info if this is a shared post */}
            {post.isShared && post.originalPost && (
              <p className="text-xs text-gray-500 italic">
                Shared from{" "}
                {post.originalPost.userPosted?.displayName || "Anonymous"}
              </p>
            )}
          </div>
        </div>
        {post.userPosted?.email === currentUser?.email && (
          <div ref={panelRef} className="relative">
            <button
              disabled={!isAuthenticated}
              className="relative flex items-center justify-center p-2 cursor-pointer text-blue-700  hover:bg-blue-700 hover:text-blue-50 rounded-full transition-colors"
              onClick={handlePanelOpening}
              onKeyDown={(e) => e.key === "Enter" && handlePanelOpening()}>
              <DotsIcon />
            </button>
            <PanelLayout
              className={`w-44 absolute right-0 transform ${
                panelOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}>
              <EllipsisPanel
                postId={post.id}
                dispatch={dispatch}
                setPanelOpen={setPanelOpen}
                setIsEditing={setIsEditing}
              />
            </PanelLayout>
          </div>
        )}
      </div>

      {/* Uploaded Image: Displays first file or placeholder icon */}
      {post.files?.[0] ? (
        <img
          src={post.files[0].url}
          alt={post.title}
          className="h-100 w-full object-contain bg-gray-200"
        />
      ) : (
        <div className="w-full flex items-center justify-center bg-gray-200 text-gray-300">
          <ImageIcon width={64} height={64} />
        </div>
      )}

      {/* Content: Title and details of the post */}
      <div className="flex flex-col gap-2 py-2 px-4">
        <h2 className="text-xl font-semibold text-blue-800 line-clamp-2">
          {post.title}
        </h2>
        <p className="h-10 text-sm text-gray-600 line-clamp-4">
          {post.details}
        </p>
      </div>

      {/* Action Buttons: Like, Share, Save with counts and styling */}
      <div className="flex justify-around gap-2 px-4 py-2 text-sm">
        {interactionButtons.map((btn) => (
          <IconTitleBtn
            key={btn.key}
            h4={`${
              btn.key.charAt(0).toUpperCase() + btn.key.slice(1)
            }${formatCount(btn.count)}`}
            svg={btn.icon}
            position="center"
            className={`p-2 ${getButtonClass(btn.clicked)}`}
            disabled={!isAuthenticated}
            onClick={btn.onClick}
          />
        ))}
      </div>
      {isAuthenticated && <Comments postId={post.id} />}
    </div>
  );
}
