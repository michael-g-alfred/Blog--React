import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function PhotoName() {
  const { currentUser } = useContext(AuthContext);
  const getInitials = (name) => {
    if (!name) return "GU";
    const words = name.trim().split(" ");
    const firstTwo = words.slice(0, 2);
    return firstTwo.map((w) => w[0]?.toUpperCase()).join("");
  };
  return <div>{getInitials(currentUser?.displayName)}</div>;
}
