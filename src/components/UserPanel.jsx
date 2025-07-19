import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import IconTitleBtn from "./IconTitleBtn";
import SettingIcon from "../icons/SettingIcon";
import LogoutIcon from "../icons/LogoutIcon";

export default function UserPanel() {
  const { signout } = useContext(AuthContext);
  const buttons = [
    // { h4: "Setting", svg: <SettingIcon /> },
    { h4: "Logout", svg: <LogoutIcon />, onClick: signout },
  ];
  return (
    <>
      {buttons.map((btn, index) => (
        <IconTitleBtn
          key={index}
          h4={btn.h4}
          svg={btn.svg}
          position="center"
          className="flex items-center justify-center gap-1 p-2 hover:shadow-xs text-sm rounded-md bg-blue-700 text-blue-50 hover:bg-blue-500"
          onClick={btn.onClick}
        />
      ))}
    </>
  );
}
