import { Outlet } from "react-router";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./Redux/AuthSlice";
import SideHeader from "./SideHeader";

const LayOut = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUser() as any);
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