import { Outlet } from "react-router";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./Redux/AuthSlice";

const LayOut = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUser() as any);
    }
  }, []);

  return (<>
    <Header />
    <Outlet />
  </>
  );
}

export default LayOut;