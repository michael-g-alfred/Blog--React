import React from "react";

export default function UserPostedName({ user }) {
  return <div>{user?.displayName?.slice(0, 2).toUpperCase() || "US"}</div>;
}
