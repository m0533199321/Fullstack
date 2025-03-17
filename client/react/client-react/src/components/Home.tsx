// import { Button, Typography, Grid, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const HomePage = () => {
//   const navigate = useNavigate();

//   const goToPublicRecipes = () => {
//     navigate("/public-recipes");
//   };

//   const goToPrivateRecipes = () => {
//     navigate("/private-recipes");
//   };

//   return (
//     <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
//       {/* תמונה רקע */}
//       <Box
//         sx={{
//           backgroundImage: "url('https://source.unsplash.com/1600x900/?food')",
//           backgroundSize: "cover",
//           height: "60vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "center",
//           color: "white",
//           backgroundPosition: "center",
//         }}
//       >
//         <Typography variant="h3" sx={{ fontWeight: "bold", fontFamily: "Roboto" }}>
//           Welcome to Recipe World
//         </Typography>
//       </Box>

//       {/* תוכן עמוד */}
//       <Box sx={{ padding: "2rem 5rem" }}>
//         <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "2rem" }}>
//           Explore Amazing Recipes
//         </Typography>

//         <Grid container spacing={4} justifyContent="center">
//           <Grid item xs={12} sm={6} md={4}>
//             <Box
//               sx={{
//                 backgroundImage: "url('https://source.unsplash.com/1600x900/?cooking')",
//                 backgroundSize: "cover",
//                 height: "300px",
//                 borderRadius: "10px",
//                 boxShadow: 3,
//               }}
//             >
//               <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//                 <Button
//                   variant="contained"
//                   sx={{
//                     backgroundColor: "#FFA500",
//                     color: "white",
//                     fontSize: "1.2rem",
//                     padding: "10px 20px",
//                     borderRadius: "5px",
//                   }}
//                   onClick={goToPublicRecipes}
//                 >
//                   Public Recipes
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>

//           <Grid item xs={12} sm={6} md={4}>
//             <Box
//               sx={{
//                 backgroundImage: "url('https://source.unsplash.com/1600x900/?chef')",
//                 backgroundSize: "cover",
//                 height: "300px",
//                 borderRadius: "10px",
//                 boxShadow: 3,
//               }}
//             >
//               <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//                 <Button
//                   variant="contained"
//                   sx={{
//                     backgroundColor: "#FFA500",
//                     color: "white",
//                     fontSize: "1.2rem",
//                     padding: "10px 20px",
//                     borderRadius: "5px",
//                   }}
//                   onClick={goToPrivateRecipes}
//                 >
//                   Private Recipes
//                 </Button>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default HomePage;


// // import { motion } from "framer-motion";
// // import { FaSearch, FaRegBookmark, FaUsers } from "react-icons/fa";
// // import Button from "@mui/material/Button";
// // import Images from "./Images";
// // import './HomeStyle.css';

// // export default function HomePage() {
// //     const backgroundImage = Images();

// //     return (
// //         <div className="bg-gray-950 text-white min-h-screen flex flex-col items-center p-8 relative overflow-hidden">
// //             {/* Background image */}
// //             <div
// //                 className="background-image"
// //                 style={{ backgroundImage: `url(${backgroundImage})` }}
// //             ></div>

// //             {/* Background overlay */}
// //             <div className="transparent-overlay"></div>

// //             {/* Header */}
// //             <motion.h1
// //                 className="text-6xl font-extrabold mb-6 text-center relative z-10"
// //                 initial={{ opacity: 0, y: -20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ duration: 0.8 }}
// //             >
// //                 ברוכים הבאים ל- SmartChef
// //             </motion.h1>

// //             <motion.p
// //                 className="text-xl text-gray-300 text-center max-w-3xl mb-8 relative z-10"
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 transition={{ delay: 0.3, duration: 0.8 }}
// //             >
// //                 אפליקציית המתכונים האולטימטיבית! מצאו מתכונים חכמים, התאימו אותם להעדפות שלכם, ושמרו אותם בספר אישי.
// //             </motion.p>

// //             {/* Features */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full max-w-5xl relative z-10">
// //                 <FeatureCard
// //                     icon={<FaSearch size={50} />}
// //                     title="חיפוש מתכונים חכם"
// //                     description="בקשו כל מתכון ו-AI ימצא עבורכם את האפשרות המושלמת."
// //                 />
// //                 <FeatureCard
// //                     icon={<FaRegBookmark size={50} />}
// //                     title="ספר מתכונים אישי"
// //                     description="שמרו את המתכונים שלכם וצרו ספר מתכונים מותאם אישית."
// //                 />
// //                 <FeatureCard
// //                     icon={<FaUsers size={50} />}
// //                     title="שיתוף מתכונים"
// //                     description="שתפו את היצירות שלכם עם הקהילה וקבלו פידבק!"
// //                 />
// //             </div>

// //             {/* Call to Action */}
// //             <motion.div
// //                 className="mt-12 relative z-10"
// //                 initial={{ opacity: 0, scale: 0.9 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 transition={{ delay: 0.5, duration: 0.8 }}
// //             >
// //                 <Button className="px-8 py-4 text-xl bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-transform transform hover:scale-105">
// //                     התחילו עכשיו
// //                 </Button>
// //             </motion.div>
// //         </div>
// //     );
// // }

// // function FeatureCard({ icon, title, description }) {
// //     return (
// //         <motion.div
// //             className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-xl"
// //             whileHover={{ scale: 1.05 }}
// //         >
// //             <div className="text-red-400 mb-4">{icon}</div>
// //             <h3 className="text-2xl font-semibold mb-2">{title}</h3>
// //             <p className="text-gray-400 text-base">{description}</p>
// //         </motion.div>
// //     );
// // }
