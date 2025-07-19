import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import Card from "../components/Card";
import PageLayout from "../layout/PageLayout";
import Floatingbar from "../components/Floatingbar";
import { useState, useContext, useMemo } from "react";
import { usePostContext } from "../context/PostContext";
import { AuthContext } from "../context/AuthProvider";
import PostForm from "../components/PostForm";
import CreatePostTrigger from "../components/CreatePostTrigger";

export default function Home() {
  const [isShowForm, setIsShowForm] = useState(false);
  const { state, dispatch } = usePostContext();
  const { posts } = state;
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState("Home");

  const filteredPosts = useMemo(() => {
    if (!currentUser) return posts;

    switch (selectedTab) {
      case "Posts":
        return posts.filter(
          (post) => post?.userPosted?.email === currentUser.email
        );
      case "Likes":
        return posts.filter((post) => post?.likes?.includes(currentUser.email));
      case "Shares":
        return posts.filter(
          (post) => post?.shares?.includes(currentUser.email) && !post.isShared
        );
      case "Save":
        return posts.filter((post) => post?.saves?.includes(currentUser.email));
      default:
        return [...posts].sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
        );
    }
  }, [posts, selectedTab, currentUser]);

  const handleTogglePostForm = () => {
    setIsShowForm((prev) => !prev);
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleAddPost = async (newPost) => {
    const postToSave = {
      ...newPost,
      userPosted: {
        uid: currentUser?.uid || "",
        displayName: currentUser?.displayName || "",
        email: currentUser?.email || "",
        photoURL: currentUser?.photoURL || "",
      },
      submittedAt: new Date().toISOString(),
      likes: [],
      shares: [],
      saves: [],
      isShared: false,
    };

    try {
      const docRef = await addDoc(collection(db, "posts"), postToSave);
      dispatch({ type: "ADD_POST", payload: { id: docRef.id, ...postToSave } });
      setIsShowForm(false);
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  };

  return (
    <PageLayout position="start">
      {isAuthenticated && (
        <CreatePostTrigger
          onClick={handleTogglePostForm}
          currentUser={currentUser}
        />
      )}

      {isShowForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
          <PostForm
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl"
            onClose={handleCloseForm}
            onAddPost={handleAddPost}
          />
        </div>
      )}

      <div className="grid grid-cols-1  gap-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </div>

      <p className="flex flex-col items-center justify-center text-md text-center text-blue-700">
        You've reached the end 🎉
      </p>

      {isAuthenticated && (
        <Floatingbar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      )}
    </PageLayout>
  );
}
