// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const imagesArr = [
//   "../../images/categories/1.jpg",
//   "../../images/categories/2.jpg",
//   "../../images/categories/3.jpg",
//   "../../images/categories/4.jpg",
//   "../../images/categories/5.jpg",
//   "../../images/categories/6.jpg",
//   "../../images/categories/7.jpg",
//   "../../images/categories/8.jpg",
//   "../../images/categories/9.jpg",
//   "../../images/categories/10.jpg"
// ];

// const Images = () => {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prevIndex) => (prevIndex + 1) % imagesArr.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//     <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
//       <motion.img
//         key={index}
//         src={imagesArr[index]}
//         alt="food"
//         className="absolute w-full h-full object-cover"
//         initial={{ opacity: 0, scale: 1.05 }}
//         animate={{ opacity: 0.8, scale: 1 }}
//         transition={{ duration: 1.5 }}
//       />
//     </div>
//     </>
//   );
// }

// export default Images;