// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const NavBar: React.FC = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <nav
//       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         isScrolled
//           ? "bg-black bg-opacity-90 backdrop-blur-sm py-3"
//           : "bg-transparent py-5"
//       }`}
//     >
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         <Link to="/" className="text-primary font-playfair text-3xl font-bold">
//           Chef<span className="text-white">Cinema</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex space-x-8">
//           <NavLink to="/">Home</NavLink>
//           <NavLink to="/recipes">Recipes</NavLink>
//           <NavLink to="/about">About</NavLink>
//           <NavLink to="/contact">Contact</NavLink>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-white focus:outline-none"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           {isMenuOpen ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16m-7 6h7"
//               />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-black bg-opacity-95 py-4">
//           <div className="container mx-auto px-4 flex flex-col space-y-3">
//             <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
//               Home
//             </MobileNavLink>
//             <MobileNavLink to="/recipes" onClick={() => setIsMenuOpen(false)}>
//               Recipes
//             </MobileNavLink>
//             <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>
//               About
//             </MobileNavLink>
//             <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
//               Contact
//             </MobileNavLink>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
//   <Link
//     to={to}
//     className="text-white font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
//   >
//     {children}
//   </Link>
// );

// const MobileNavLink = ({
//   to,
//   children,
//   onClick,
// }: {
//   to: string;
//   children: React.ReactNode;
//   onClick: () => void;
// }) => (
//   <Link
//     to={to}
//     className="text-white text-lg font-medium py-2 hover:text-primary transition-colors block"
//     onClick={onClick}
//   >
//     {children}
//   </Link>
// );

// export default NavBar;