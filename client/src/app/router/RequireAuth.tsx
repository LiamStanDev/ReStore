import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configStore";

// for protect some route
const RequireAuth = () => {
  // 確認是否存在登入
  const { user } = useAppSelector((state) => state.acount);
  const location = useLocation();
  if (!user) {
    console.log(location);
    return <Navigate to={"/login"} state={{ from: location }} />;
  }
  return <Outlet />;
};

export default RequireAuth;
