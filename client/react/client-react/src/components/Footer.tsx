// import React from "react";
// import { Link } from "react-router-dom";

// const Footer: React.FC = () => {
//   return (
//     <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-wrap justify-between">
//           <div className="w-full md:w-1/4 mb-8 md:mb-0">
//             <Link to="/" className="text-primary font-playfair text-3xl font-bold">
//               Chef<span className="text-white">Cinema</span>
//             </Link>
//             <p className="mt-4 text-gray-400 text-sm leading-relaxed">
//               Where culinary artistry meets the magic of cinema. Discover recipes inspired by the 
//               world of film and create your own culinary masterpieces.
//             </p>
//           </div>
          
//           <div className="w-full md:w-1/4 mb-8 md:mb-0">
//             <h3 className="font-playfair text-lg mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/recipes" className="text-gray-400 hover:text-primary transition-colors">
//                   Recipes
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">
//                   About
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>
          
//           <div className="w-full md:w-1/4 mb-8 md:mb-0">
//             <h3 className="font-playfair text-lg mb-4">Categories</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
//                   Film-Inspired
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
//                   Quick & Easy
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
//                   Gourmet
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
//                   Desserts
//                 </Link>
//               </li>
//             </ul>
//           </div>
          
//           <div className="w-full md:w-1/4">
//             <h3 className="font-playfair text-lg mb-4">Newsletter</h3>
//             <p className="text-gray-400 text-sm mb-4">
//               Subscribe to get the latest recipes and cooking tips
//             </p>
//             <div className="flex">
//               <input 
//                 type="email" 
//                 placeholder="Your email"
//                 className="bg-gray-900 border border-gray-700 rounded-l px-4 py-2 w-full focus:outline-none focus:border-primary" 
//               />
//               <button className="bg-primary px-4 py-2 rounded-r text-white font-medium">
//                 Join
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
//           <p className="text-gray-500 text-sm">
//             &copy; {new Date().getFullYear()} ChefCinema. All rights reserved.
//           </p>
//           <div className="mt-4 md:mt-0 flex space-x-4">
//             <a href="#" className="text-gray-400 hover:text-primary transition-colors">
//               Privacy Policy
//             </a>
//             <a href="#" className="text-gray-400 hover:text-primary transition-colors">
//               Terms of Service
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;