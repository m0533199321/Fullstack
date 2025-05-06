// const privateShows = ({showPrivate, showPublic, privateClick, publicClick}: {showPrivate: boolean, showPublic: boolean, privateClick: () => void, publicClick: () => void}) => {
//     return (<>
//         {showPrivate ? (<>
//             <button style={{
//                 color: 'orange', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
//                 display: 'inlineBlock', paddingBottom: '5px'
//             }} onClick={privateClick}>פרטיים</button>
//             <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
//             <button className={showPublic ? "private-title-with-underline" : ""} style={{
//                 color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
//             }} onClick={publicClick}>מומלצים</button>
//         </>) : (<>
//             {showPublic ? (<>
//                 <button style={{
//                     color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
//                 }} onClick={privateClick}>פרטיים</button>
//                 <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
//                 <button className={showPublic ? "private-title-with-underline" : ""} style={{
//                     color: 'orange', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
//                     display: 'inlineBlock', paddingBottom: '5px'
//                 }} onClick={publicClick}>מומלצים</button>
//             </>) : (<>
//                 <button style={{
//                     color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold',
//                 }} onClick={privateClick}>פרטיים</button>
//                 <div style={{ borderLeft: '2px solid orange', height: '20px', margin: '0 10px' }}></div>
//                 <button className={showPublic ? "private-title-with-underline" : ""} style={{
//                     color: 'white', margin: '0 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '30px', fontWeight: 'bold'
//                 }} onClick={publicClick}>מומלצים</button>
//             </>)}

//         </>)}
//     </>)
// }

// export default privateShows;

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Lock, Award, ChefHat } from "lucide-react"
// import "../styles/PrivateShows.css"

// interface RecipeCategorySelectorProps {
//   showPrivate: boolean
//   showPublic: boolean
//   privateClick: () => void
//   publicClick: () => void
// }

// const PrivateShows = ({
//   showPrivate,
//   showPublic,
//   privateClick,
//   publicClick,
// }: RecipeCategorySelectorProps) => {
//   const [hoverPrivate, setHoverPrivate] = useState(false)
//   const [hoverPublic, setHoverPublic] = useState(false)
//   const [animateIcon, setAnimateIcon] = useState(false)

//   useEffect(() => {
//     // Trigger icon animation when category changes
//     setAnimateIcon(true)
//     const timer = setTimeout(() => setAnimateIcon(false), 1000)
//     return () => clearTimeout(timer)
//   }, [showPrivate, showPublic])

//   return (
//     <div className="recipe-category-container">
//       {/* <div className="recipe-category-wrapper"> */}
//     {/* //     <div className="recipe-category-header">
//     //       <ChefHat className="recipe-category-chef-icon" />
//     //       <h2 className="recipe-category-title">קטגוריות מתכונים</h2>
//     //     </div> */}

//         <div className="recipe-category-buttons">
//           <motion.button
//             className={`recipe-category-button ${showPrivate ? "active" : ""}`}
//             onClick={privateClick}
//             onMouseEnter={() => setHoverPrivate(true)}
//             onMouseLeave={() => setHoverPrivate(false)}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <div className="recipe-category-content">
//               <motion.div
//                 className="recipe-category-icon-wrapper"
//                 animate={
//                   animateIcon && showPrivate
//                     ? {
//                         scale: [1, 1.2, 1],
//                         rotate: [0, 10, -10, 0],
//                       }
//                     : {}
//                 }
//                 transition={{ duration: 0.5 }}
//               >
//                 <Lock className="recipe-category-icon" />
//                 <div className="recipe-category-icon-glow"></div>
//               </motion.div>
//               <span className="recipe-category-label">פרטיים</span>
//             </div>

//             <AnimatePresence>
//               {(showPrivate || hoverPrivate) && (
//                 <motion.div
//                   className="recipe-category-indicator"
//                   initial={{ width: 0, opacity: 0 }}
//                   animate={{ width: "100%", opacity: 1 }}
//                   exit={{ width: 0, opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               )}
//             </AnimatePresence>
//           </motion.button>

//           <div className="recipe-category-divider">
//             <div className="recipe-category-divider-line"></div>
//             <div className="recipe-category-divider-circle"></div>
//             <div className="recipe-category-divider-line"></div>
//           </div>

//           <motion.button
//             className={`recipe-category-button ${showPublic ? "active" : ""}`}
//             onClick={publicClick}
//             onMouseEnter={() => setHoverPublic(true)}
//             onMouseLeave={() => setHoverPublic(false)}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <div className="recipe-category-content">
//               <motion.div
//                 className="recipe-category-icon-wrapper"
//                 animate={
//                   animateIcon && showPublic
//                     ? {
//                         scale: [1, 1.2, 1],
//                         rotate: [0, 10, -10, 0],
//                       }
//                     : {}
//                 }
//                 transition={{ duration: 0.5 }}
//               >
//                 <Award className="recipe-category-icon" />
//                 <div className="recipe-category-icon-glow"></div>
//               </motion.div>
//               <span className="recipe-category-label">מומלצים</span>
//             </div>

//             <AnimatePresence>
//               {(showPublic || hoverPublic) && (
//                 <motion.div
//                   className="recipe-category-indicator"
//                   initial={{ width: 0, opacity: 0 }}
//                   animate={{ width: "100%", opacity: 1 }}
//                   exit={{ width: 0, opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               )}
//             </AnimatePresence>
//           </motion.button>
//         </div>

//         {/* <div className="recipe-category-badge">
//           <span className="recipe-category-badge-text">
//             {showPrivate ? "המתכונים הפרטיים שלך" : "המתכונים המומלצים"}
//           </span>
//         </div> */}
//       {/* </div> */}
//     </div>
//   )
// }

// export default PrivateShows

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Lock, Award } from "lucide-react"
// import "../styles/PrivateShows.css"

// interface PrivateShowsProps {
//   showPrivate: boolean
//   showPublic: boolean
//   privateClick: () => void
//   publicClick: () => void
// }

// const PrivateShows = ({ showPrivate, showPublic, privateClick, publicClick }: PrivateShowsProps) => {
//   const [hoverPrivate, setHoverPrivate] = useState(false)
//   const [hoverPublic, setHoverPublic] = useState(false)
//   const [animateIcon, setAnimateIcon] = useState(false)

//   useEffect(() => {
//     setAnimateIcon(true)
//     const timer = setTimeout(() => setAnimateIcon(false), 1000)
//     return () => clearTimeout(timer)
//   }, [showPrivate, showPublic])

//   return (
//     <div className="category-container">
//       <div className="category-buttons">
//         <motion.button
//           className={`category-button ${showPrivate ? "active" : ""}`}
//           onClick={privateClick}
//           onMouseEnter={() => setHoverPrivate(true)}
//           onMouseLeave={() => setHoverPrivate(false)}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <div className="category-content">
//             <motion.div
//               className="category-icon-wrapper"
//               animate={
//                 animateIcon && showPrivate
//                   ? {
//                       scale: [1, 1.2, 1],
//                       rotate: [0, 10, -10, 0],
//                     }
//                   : {}
//               }
//               transition={{ duration: 0.5 }}
//             >
//               <Lock className="category-icon" />
//               <div className="category-icon-glow"></div>
//             </motion.div>
//             <span className="category-label">פרטיים</span>
//           </div>

//           <AnimatePresence>
//             {(showPrivate || hoverPrivate) && (
//               <motion.div
//                 className="category-indicator"
//                 initial={{ width: 0, opacity: 0 }}
//                 animate={{ width: "100%", opacity: 1 }}
//                 exit={{ width: 0, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               />
//             )}
//           </AnimatePresence>
//         </motion.button>

//         <div className="category-divider">
//           <div className="category-divider-line"></div>
//           <div className="category-divider-circle"></div>
//           <div className="category-divider-line"></div>
//         </div>

//         <motion.button
//           className={`category-button ${showPublic ? "active" : ""}`}
//           onClick={publicClick}
//           onMouseEnter={() => setHoverPublic(true)}
//           onMouseLeave={() => setHoverPublic(false)}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <div className="category-content">
//             <motion.div
//               className="category-icon-wrapper"
//               animate={
//                 animateIcon && showPublic
//                   ? {
//                       scale: [1, 1.2, 1],
//                       rotate: [0, 10, -10, 0],
//                     }
//                   : {}
//               }
//               transition={{ duration: 0.5 }}
//             >
//               <Award className="category-icon" />
//               <div className="category-icon-glow"></div>
//             </motion.div>
//             <span className="category-label">מומלצים</span>
//           </div>

//           <AnimatePresence>
//             {(showPublic || hoverPublic) && (
//               <motion.div
//                 className="category-indicator"
//                 initial={{ width: 0, opacity: 0 }}
//                 animate={{ width: "100%", opacity: 1 }}
//                 exit={{ width: 0, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               />
//             )}
//           </AnimatePresence>
//         </motion.button>
//       </div>
//     </div>
//   )
// }

// export default PrivateShows

import type React from "react"
import "../styles/PrivateShows.css"

interface PrivateShowsProps {
  showPrivate: boolean
  showPublic: boolean
  privateClick: () => void
  publicClick: () => void
}

const PrivateShows: React.FC<PrivateShowsProps> = ({ showPrivate, showPublic, privateClick, publicClick }) => {
  return (
    <div className="privateShows-recipe-toggle-wrapper">
      <div className="privateShows-recipe-toggle-container">
        <div className={`privateShows-toggle-slider ${showPublic ? "right" : "left"}`}></div>
        <button className={`privateShows-toggle-option ${showPrivate ? "active" : ""}`} onClick={privateClick}>
          פרטי
        </button>
        <button className={`privateShows-toggle-option ${showPublic ? "active" : ""}`} onClick={publicClick}>
          ציבורי
        </button>
      </div>
    </div>
  )
}

export default PrivateShows