import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import PageLayout from "../layout/PageLayout";

const CLOUDINARY_UPLOAD_PRESET = "profile-pics";
const CLOUDINARY_CLOUD_NAME = "dpndvovax";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/invalid-email":
        return "Invalid email format.";
      case "auth/weak-password":
        return "Weak password. Must be at least 6 characters.";
      case "auth/user-not-found":
        return "User not found.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/too-many-requests":
        return "Too many login attempts. Try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const signup = async (email, password, username, avatar) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let photoURL = "";
      // Cloudinary upload logic
      if (avatar) {
        const data = new FormData();
        data.append("file", avatar);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: data,
        });

        const file = await res.json();
        photoURL = file.secure_url;
      }

      await updateProfile(user, { displayName: username, photoURL });
      await saveUserToFirestore({ ...user, displayName: username, photoURL });
      const firestoreUser = await fetchUserFromFirestore(user.uid);
      setCurrentUser(firestoreUser);
      return user;
    } catch (error) {
      const message = handleFirebaseError(error);
      setError(message);
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const firestoreUser = await fetchUserFromFirestore(user.uid);
      setCurrentUser(firestoreUser);
      return user;
    } catch (error) {
      const message = handleFirebaseError(error);
      setError(message);
      throw error;
    }
  };

  const signout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      setError(handleFirebaseError(error));
    }
  };

  const updateUserPhoto = async (imageURL) => {
    if (!auth.currentUser) throw new Error("No user is currently logged in.");
    await updateProfile(auth.currentUser, { photoURL: imageURL });
    await auth.currentUser.reload();
    setCurrentUser(auth.currentUser);
  };

  const saveUserToFirestore = async (user) => {
    if (!user?.uid) {
      throw new Error("Invalid user object: missing uid");
    }
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
    });
  };

  const fetchUserFromFirestore = async (uid) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestoreUser = await fetchUserFromFirestore(user.uid);
        setCurrentUser(firestoreUser);
      } else {
        setCurrentUser(null);
      }
      setGlobalLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        error,
        signup,
        signin,
        signout,
        updateUserPhoto,
      }}>
      {globalLoading ? (
        <PageLayout>
          <span className="inline-block w-6 h-6 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></span>
        </PageLayout>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
