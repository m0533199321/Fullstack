import { Outlet, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./Redux/AuthSlice";
import SideHeader from "./SideHeader";
const SESSION_DURATION = 2 * 60 * 60 * 1000;

const LayOut = () => {

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     dispatch(fetchUser() as any);
  //   }
  // }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("⛔ Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionStart");
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUser() as any);
    }
  }, []);

  useEffect(() => {
    console.log("🔁 useEffect triggered");
    let sessionStart = localStorage.getItem("sessionStart");

    if (!sessionStart) {
      sessionStart = Date.now().toString();
      // localStorage.setItem("sessionStart", sessionStart);
      console.log("✅ New sessionStart set:", sessionStart);
    }

    const elapsed = Date.now() - parseInt(sessionStart);
    const timeLeft = SESSION_DURATION - elapsed;

    console.log("⏱️ Time left:", timeLeft);

    if (timeLeft <= 0) {
      handleLogout();
    } else {
      const timer = setTimeout(() => {
        handleLogout();
      }, timeLeft);

      return () => clearTimeout(timer);
    }
  }, []);


  return (<>
    <SideHeader />
    <Outlet />
  </>
  );
}

export default LayOut;

// import type React from "react"

// import { useState, useEffect } from "react"
// import SideHeader from "./SideHeader"

// interface LayoutProps {
//   children: React.ReactNode
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

//   useEffect(() => {
//     // Listen for header collapse state changes
//     const handleHeaderCollapse = (e: CustomEvent) => {
//       setIsHeaderCollapsed(e.detail.collapsed)
//     }

//     window.addEventListener("headerCollapse" as any, handleHeaderCollapse)

//     return () => {
//       window.removeEventListener("headerCollapse" as any, handleHeaderCollapse)
//     }
//   }, [])

//   useEffect(() => {
//     if (isHeaderCollapsed) {
//       document.body.classList.add("collapsed-header")
//     } else {
//       document.body.classList.remove("collapsed-header")
//     }
//   }, [isHeaderCollapsed])

//   return (
//     <div className="app-layout">
//       <SideHeader />
//       <main className="main-content">{children}</main>
//     </div>
//   )
// }

// export default Layout