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
    {/* <div style={{ marginTop: '10vh', marginLeft: '10vw', marginRight: '20vw' }}> */}
      <Outlet />
    {/* </div> */}
  </>
  );
}

export default LayOut;