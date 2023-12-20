import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configStore";
import { toast } from "react-toastify";

interface Props {
  roles?: string[];
}

// for protect some route
const RequireAuth = ({ roles }: Props) => {
  // 確認是否存在登入
  const { user } = useAppSelector((state) => state.acount);
  const location = useLocation();
  if (!user) {
    console.log(location);
    return <Navigate to={"/login"} state={{ from: location }} />;
  }

  // 這邊要作到如果允許的 roles 中，ueser 也有就允許進入，否則不行
  if (roles && !roles.some((r) => user.roles?.includes(r))) {
    toast.error("Not authorized to access this area");
    return <Navigate to={"/catalog"} />;
  }

  return <Outlet />;
};

export default RequireAuth;
