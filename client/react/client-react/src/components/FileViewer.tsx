// import React, { useEffect, useState } from 'react';
// import { fetchAddToMyBook } from './Services/RecipeService';
// import { RecipePostModel } from '../models/RecipeType';
// import { useAppSelector } from './Redux/Store';
// import mammoth from 'mammoth';
// import '../styles/FileViewer.css';
// import { uploadRecipeService } from './Services/RequestService';
// import chef from "../../images/back/chef.png"

// interface FileViewerProps {
//     fileUrl: Blob | string;
//     onClose: () => void | null;
//     details: string[] | null;
// }

// const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, onClose, details }) => {
//     const user = useAppSelector((state) => state.auth.user);
//     const [htmlContent, setHtmlContent] = useState('');
//     const [direction, setDirection] = useState<'ltr' | 'rtl'>('rtl');

//     useEffect(() => {
//         const fetchDocx = async () => {
//             console.log(details);
//             let response;
//             if (typeof (fileUrl) === "string") {
//                 response = await fetch(fileUrl);
//             }
//             else {
//                 response = fileUrl;
//             }
//             const arrayBuffer = await response.arrayBuffer();
//             const { value } = await mammoth.convertToHtml({ arrayBuffer });
//             setHtmlContent(value);

//             // ספירת המילים בעברית
//             const hebrewWords = value.match(/[א-ת]+/g);
//             const hebrewWordCount = hebrewWords ? hebrewWords.reduce((count, word) => count + word.split(/\s+/).length, 0) : 0;

//             // קביעת הכיוון
//             if (hebrewWordCount >= 5) {
//                 setDirection('rtl'); // אם יש לפחות 5 מילים בעברית
//             } else {
//                 setDirection('ltr'); // אחרת, טקסט באנגלית
//             }
//         };

//         fetchDocx();
//     }, [fileUrl]);

//     // console.log(fileUrl);
//     // console.log(details);
//     const onSelect = async () => {
//         console.log(details);
//         if (details && user && typeof (fileUrl) != 'string') {
//             const result = await uploadRecipeService(fileUrl, user.id)
//             const recipePostModel: RecipePostModel = {
//                 title: details[0],
//                 degree: Number(details[1]),
//                 isPublic: false,
//                 picture: "",
//                 path: result,
//                 // category: Number(details[1]),
//             }
//             console.log(recipePostModel);
//             if (user) {
//                 await fetchAddToMyBook(user.id, recipePostModel);
//                 console.log("הוספה לספר המתכונים שלי");
//                 onClose();
//             }
//         }
//     }

//     const styles = {
//         container: {
//             backgroundColor: '#000000',
//             color: '#ffffff',
//             padding: '20px',
//             borderRadius: '8px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//             display: 'flex' as 'flex',
//             flexDirection: 'column' as 'column',
//             alignItems: 'flex-end',
//         } as React.CSSProperties,
//         buttonContainer: {
//             display: 'flex' as 'flex',
//             justifyContent: 'flex-end',
//             width: '100%',
//             marginBottom: '20px',
//             marginTop: '10px',
//         } as React.CSSProperties,
//         button: {
//             backgroundColor: '#000000',
//             color: '#FFA500',
//             border: 'none',
//             borderRadius: '4px',
//             padding: '10px 15px',
//             cursor: 'pointer',
//             margin: '0 5px',
//             transition: 'transform 0.2s',
//             display: 'flex',
//             alignItems: 'flex-end',
//             height: '100%',
//         } as React.CSSProperties,
//         buttonHover: {
//             transform: 'translateY(-1px)',
//         },
//         iframe: {
//             width: '100%',
//             height: '80vh',
//             border: 'none',
//             backgroundColor: 'white',
//             borderRadius: '4px',
//             overflow: 'auto'
//         } as React.CSSProperties
//     };

//     return (
//         <>
//             <div style={styles.container}>
//                 {details != null &&
//                     <div className="file-buttonContainer">
//                         <button
//                             style={styles.button}
//                             onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
//                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                             onClick={onClose}
//                         >
//                             חזרה לבחירת מתכון אחר
//                         </button>
//                         <button
//                             style={styles.button}
//                             onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
//                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                             onClick={onSelect}
//                         >
//                             הוספה לספר המתכונים שלי
//                         </button>
//                     </div>}
//                 <img src={chef} alt="chef" className="file-recipe-image" />
//                 <div style={{ height: '25vh' }}></div>
//                 <div className="file-recipe-container">
//                     {direction === 'ltr' &&
//                         <div className="file-docx-viewer" style={{ direction }}>
//                             <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
//                         </div>}
//                     {direction === 'rtl' &&
//                         <div className="docx-viewer" style={{ direction }}>
//                             <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
//                         </div>}
//                 </div>
//             </div>
//         </>
//     );

// };

// export default FileViewer;

