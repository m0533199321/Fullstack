// import { useEffect, useState } from "react";
// import { fetchRecipeDetails, uploadRecipeService } from "./Services/PythonService";
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { Document, ImageRun, Packer, Paragraph, TextRun } from "docx";
// import { useAppSelector } from "./Redux/Store";
// import { Button } from "@mui/material";

// const python = ({ request, onClose }: { request: string, onClose: () => void | null }) => {
//     const [recipeDetails, setRecipeDetails] = useState<["", [], []]>(["", [], []]);
//     const user = useAppSelector((state) => state.auth.user);

//     const fetchRecipe = async (request: string) => {
//         const recipe = await fetchRecipeDetails(request);
//         console.log(typeof (recipe));
//         try {
//             const stringifiedRecipe = JSON.parse(recipe);
//             console.log(stringifiedRecipe);

//             // const stringifiedRecipe = recipe.split('[').toString();
//             // console.log(typeof(stringifiedRecipe));

//             if (recipe) {
//                 setRecipeDetails(stringifiedRecipe);
//             }
//         }
//         catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => {
//         fetchRecipe(request);
//     }, [request])
//     const handleSaveInRecipes = async () => {
//         const imageUrl = '../../images/back/word.png';
//         const response = await fetch(imageUrl);
//         const blob = await response.blob();
//         const imageObjectURL = URL.createObjectURL(blob);

//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         const img = new Image();
//         img.src = imageObjectURL;

//         img.onload = () => {
//             // קביעת מידות הקנבס
//             canvas.width = img.width;
//             canvas.height = img.height;

//             const margin = 20; // הגדרת שוליים
//             let currentY = margin + 30; // מיקום התחלתי עם שוליים
//             const pageHeight = canvas.height - margin; // גובה הדף המותר

//             if (ctx) {
//                 // ציור התמונה על הקנבס
//                 ctx.drawImage(img, 0, 0);

//                 // הוספת כותרת
//                 ctx.font = '20px Arial';
//                 ctx.fillStyle = 'white';
//                 ctx.textAlign = 'center';
//                 ctx.direction = 'rtl';
//                 ctx.fillText(recipeDetails[0], canvas.width / 2, currentY);
//                 currentY += 30; // עדכון המיקום

//                 // מיקוד לימין
//                 ctx.textAlign = 'right';
//                 ctx.font = '12px Arial';
//                 ctx.fillText('רכיבים:', canvas.width - margin, currentY);
//                 currentY += 20; // עדכון המיקום

//                 recipeDetails[1].forEach((ingredient, index) => {
//                     if (currentY > pageHeight) {
//                         // אם התוכן חורג מהדף, צור דף חדש
//                         createNewPage();
//                         currentY = margin + 30; // אפס את המיקום
//                     }
//                     ctx.fillText(`• ${ingredient}`, canvas.width - margin, currentY);
//                     currentY += 20; // עדכון המיקום
//                 });

//                 // הוספת הוראות הכנה
//                 ctx.fillText('הוראות הכנה:', canvas.width - margin, currentY);
//                 currentY += 20; // עדכון המיקום

//                 recipeDetails[2].forEach((instruction, index) => {
//                     if (currentY > pageHeight) {
//                         // אם התוכן חורג מהדף, צור דף חדש
//                         createNewPage();
//                         currentY = margin + 30; // אפס את המיקום
//                     }
//                     ctx.fillText(instruction, canvas.width - margin, currentY);
//                     currentY += 20; // עדכון המיקום
//                 });

//                 // המרת הקנבס לקובץ תמונה
//                 canvas.toBlob(async (blob) => {
//                     if (user && blob) {
//                         await uploadRecipeService(blob, user.id);
//                     }
//                 }, 'image/png');
//             }
//         };

//         const createNewPage = () => {
//             // פונקציה ליצירת דף חדש
//             const newCanvas = document.createElement('canvas');
//             const newCtx = newCanvas.getContext('2d');
//             newCanvas.width = canvas.width;
//             newCanvas.height = canvas.height;

//             if (newCtx) {
//                 // הוספת עיצוב לדף החדש
//                 newCtx.fillStyle = 'white'; // רקע לבן
//                 newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
//             }

//             // כאן תוכל להמשיך לכתוב על הדף החדש
//             // לדוגמה, תוכל לקרוא לפונקציה handleSaveInRecipes שוב עם newCanvas
//         };
//     };




//     // const handleSaveInRecipes = async () => {
//     //     const imageData = await fetch('../../images/back/word.png').then(res => res.arrayBuffer());
//     //     const doc = new Document({
//     //         sections: [{
//     //             properties: {},
//     //             children: [
//     //                 // הוספת תמונה כרקע
//     //                 new Paragraph({
//     //                     children: [
//     //                         new ImageRun({
//     //                             data: imageData,
//     //                             transformation: {
//     //                                 width: 1200, // גודל התמונה שיתפרס על כל העמוד
//     //                                 height: 800,
//     //                             },
//     //                             type: "png",
//     //                         }),
//     //                     ],
//     //                     alignment: "center",
//     //                     spacing: { after: 200 },
//     //                 }),

//     //                 // הוספת טקסט מעל התמונה
//     //                 new Paragraph({
//     //                     text: "כותרת המתכון",
//     //                     spacing: { after: 200 },
//     //                     alignment: "center",
//     //                     children: [
//     //                         new TextRun({
//     //                             text: "כותרת המתכון",
//     //                             bold: true,
//     //                             size: 32,
//     //                             color: "#FFFFFF", // צבע הכיתוב ללבן
//     //                         }),
//     //                     ],
//     //                 }),

//     //                 new Paragraph({
//     //                     text: "רכיבים:",
//     //                     spacing: { after: 200 },
//     //                     alignment: "center",
//     //                     children: [
//     //                         new TextRun({
//     //                             text: "רכיבים:",
//     //                             bold: true,
//     //                             size: 24,
//     //                             color: "#FFFFFF", // צבע הכיתוב ללבן
//     //                         }),
//     //                     ],
//     //                 }),

//     //                 ...recipeDetails[1].map(ingredient => new Paragraph({
//     //                     text: `• ${ingredient}`,
//     //                     alignment: "center",
//     //                     spacing: { after: 100 },
//     //                     children: [
//     //                         new TextRun({
//     //                             text: `• ${ingredient}`,
//     //                             color: "#FFFFFF", // צבע הכיתוב ללבן
//     //                         }),
//     //                     ],
//     //                 })),

//     //                 new Paragraph({
//     //                     text: "הוראות הכנה:",
//     //                     spacing: { after: 200 },
//     //                     alignment: "center",
//     //                     children: [
//     //                         new TextRun({
//     //                             text: "הוראות הכנה:",
//     //                             bold: true,
//     //                             size: 24,
//     //                             color: "#FFFFFF", // צבע הכיתוב ללבן
//     //                         }),
//     //                     ],
//     //                 }),

//     //                 ...recipeDetails[2].map(instruction => new Paragraph({
//     //                     text: instruction,
//     //                     alignment: "center",
//     //                     spacing: { after: 100 },
//     //                     children: [
//     //                         new TextRun({
//     //                             text: instruction,
//     //                             color: "#FFFFFF", // צבע הכיתוב ללבן
//     //                         }),
//     //                     ],
//     //                 })),
//     //             ],
//     //         }],
//     //     });

//     //     Packer.toBlob(doc).then(async blob => {
//     //         if (user) {
//     //             await uploadRecipeService(blob, user.id);
//     //         }
//     //     }).catch(error => {
//     //         console.error("שגיאה ביצירת הקובץ:", error);
//     //     });
//     // }



//     // const handleSaveInRecipes = async () => {
//     //     const pdf = new jsPDF();
//     //     const recipeContainer = document.createElement('div');
//     //     recipeContainer.style.textAlign = 'right';
//     //     recipeContainer.style.marginTop = '20vh';
//     //     recipeContainer.style.border = '2px solid orange';
//     //     recipeContainer.style.padding = '20px';
//     //     recipeContainer.style.borderRadius = '10px';
//     //     recipeContainer.style.direction = 'rtl';
//     //     recipeContainer.style.width = '50%';
//     //     recipeContainer.style.marginLeft = 'auto';
//     //     recipeContainer.style.marginRight = 'auto';
//     //     recipeContainer.style.backgroundImage = 'url(../../images/back/chef.png)';
//     //     recipeContainer.style.backgroundSize = 'cover';
//     //     recipeContainer.style.color = 'white';

//     //     if (recipeDetails[0] !== '') {
//     //         const title = document.createElement('h1');
//     //         title.style.textAlign = 'center';
//     //         title.innerText = recipeDetails[0];
//     //         recipeContainer.appendChild(title);

//     //         const ingredientsTitle = document.createElement('h2');
//     //         ingredientsTitle.innerText = 'רכיבים:';
//     //         recipeContainer.appendChild(ingredientsTitle);

//     //         const ingredientsList = document.createElement('ul');
//     //         ingredientsList.style.listStyleType = 'none';
//     //         ingredientsList.style.padding = '0';
//     //         recipeDetails[1].forEach((ingredient, index) => {
//     //             const li = document.createElement('li');
//     //             li.innerHTML = `• ${ingredient}`;
//     //             ingredientsList.appendChild(li);
//     //         });
//     //         recipeContainer.appendChild(ingredientsList);

//     //         const instructionsTitle = document.createElement('h2');
//     //         instructionsTitle.innerText = 'הוראות הכנה:';
//     //         recipeContainer.appendChild(instructionsTitle);

//     //         const instructionsList = document.createElement('ul');
//     //         instructionsList.style.listStyleType = 'none';
//     //         instructionsList.style.padding = '0';
//     //         recipeDetails[2].forEach((instruction, index) => {
//     //             const li = document.createElement('li');
//     //             li.innerText = instruction;
//     //             instructionsList.appendChild(li);
//     //         });
//     //         recipeContainer.appendChild(instructionsList);

//     //         document.body.appendChild(recipeContainer); // הוסף את האלמנט לדף

//     //         // המתן לטעינת התמונה
//     //         setTimeout(async () => {
//     //             const canvas = await html2canvas(recipeContainer);
//     //             const imgData = canvas.toDataURL('image/png');
//     //             pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // הוסף את התמונה ל-PDF

//     //             // שמירת ה-PDF ל-blob
//     //             const pdfBlob = pdf.output('blob');

//     //             // העלאת ה-PDF ל-AWS
//     //             if (pdfBlob && user) {
//     //                 try {
//     //                     await uploadRecipeService(pdfBlob, user.id); // העלאת הקובץ ל-AWS
//     //                 } catch (error) {
//     //                     console.error("שגיאה בהעלאת הקובץ:", error);
//     //                 }
//     //             }

//     //             document.body.removeChild(recipeContainer); // הסר את האלמנט לאחר התפיסה
//     //         }, 100); // המתן 100 מילישניות
//     //     }
//     // }

//     // const handleSaveInRecipes = async () => {
//     //     const recipeContainer = document.createElement('div');
//     //     recipeContainer.style.textAlign = 'right';
//     //     recipeContainer.style.marginTop = '20vh';
//     //     recipeContainer.style.border = '2px solid orange';
//     //     recipeContainer.style.padding = '20px';
//     //     recipeContainer.style.borderRadius = '10px';
//     //     recipeContainer.style.direction = 'rtl';
//     //     recipeContainer.style.width = '50%';
//     //     recipeContainer.style.marginLeft = 'auto';
//     //     recipeContainer.style.marginRight = 'auto';
//     //     recipeContainer.style.backgroundImage = '../../images/back/chef.png';
//     //     recipeContainer.style.backgroundSize = 'cover';
//     //     recipeContainer.style.color = 'white';

//     //     if (recipeDetails[0] !== '') {
//     //         const title = document.createElement('h1');
//     //         title.style.textAlign = 'center';
//     //         title.innerText = recipeDetails[0];
//     //         recipeContainer.appendChild(title);

//     //         const ingredientsTitle = document.createElement('h2');
//     //         ingredientsTitle.innerText = 'רכיבים:';
//     //         recipeContainer.appendChild(ingredientsTitle);

//     //         const ingredientsList = document.createElement('ul');
//     //         ingredientsList.style.listStyleType = 'none';
//     //         ingredientsList.style.padding = '0';
//     //         recipeDetails[1].forEach((ingredient, index) => {
//     //             const li = document.createElement('li');
//     //             li.innerHTML = `• ${ingredient}`;
//     //             ingredientsList.appendChild(li);
//     //         });
//     //         recipeContainer.appendChild(ingredientsList);

//     //         const instructionsTitle = document.createElement('h2');
//     //         instructionsTitle.innerText = 'הוראות הכנה:';
//     //         recipeContainer.appendChild(instructionsTitle);

//     //         const instructionsList = document.createElement('ul');
//     //         instructionsList.style.listStyleType = 'none';
//     //         instructionsList.style.padding = '0';
//     //         recipeDetails[2].forEach((instruction, index) => {
//     //             const li = document.createElement('li');
//     //             li.innerText = instruction;
//     //             instructionsList.appendChild(li);
//     //         });
//     //         recipeContainer.appendChild(instructionsList);

//     //         document.body.appendChild(recipeContainer);
//     //         const canvas = await html2canvas(recipeContainer);
//     //         canvas.toBlob(async (blob) => {
//     //             if (blob && user) {
//     //                 try {
//     //                     await uploadRecipeService(blob, user.id);
//     //                 } catch (error) {
//     //                     console.error("שגיאה בהעלאת הקובץ:", error);
//     //                 }
//     //             }
//     //         });
//     //         document.body.removeChild(recipeContainer);
//     //         onClose();
//     //     }
//     // }

//     const styles = {
//         button: {
//             zIndex: 10000,
//             // backgroundColor: 'red',
//             backgroundColor: '#000000',
//             color: '#FFA500',
//             border: 'none',
//             borderRadius: '4px',
//             padding: '10px 15px',
//             cursor: 'pointer',
//             margin: '0 5px',
//             transition: 'transform 0.2s',
//             display: 'inline',
//             alignItems: 'flex-end',
//             height: '100%',
//             marginTop: '15vh',
//         } as React.CSSProperties,
//         buttonHover: {
//             transform: 'translateY(-1px)',
//         }
//     }


//     return (
//         <>
//             <div id="recipe-container" style={{
//                 textAlign: 'center',
//                 marginTop: '20vh',
//                 border: '2px solid orange',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 direction: 'rtl',
//                 width: '50%',
//                 marginLeft: 'auto',
//                 marginRight: 'auto'
//             }}>
//                 {recipeDetails[0] != '' && recipeDetails[0] != "" ? (
//                     <>
//                         {recipeDetails[0] == "Error: No recipe found" && Array.isArray(recipeDetails[1]) && recipeDetails[1].length == 0 && Array.isArray(recipeDetails[2]) && recipeDetails[2].length == 0 ? (
//                             <div style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '50px' }}>אין רכיב להצעה</div>
//                         ) : (<>
//                             <button
//                                 style={styles.button}
//                                 onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
//                                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                                 onClick={handleSaveInRecipes}
//                             >הוספה לספר המתכונים שלי</button>
//                             <button
//                                 style={styles.button}
//                                 onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
//                                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                                 onClick={onClose}
//                             >
//                                 חזרה לבחירת מתכון אחר
//                             </button>
//                             <h1 style={{ marginLeft: 'auto', marginRight: 'auto' }}>{recipeDetails[0]}</h1>
//                             <h2 style={{ marginLeft: '80vw' }}>רכיבים:</h2>
//                             <ul style={{ listStyleType: 'none', padding: 0 }}>
//                                 {Array.isArray(recipeDetails[1]) && recipeDetails[1].map((ingredient, index) => (
//                                     <li key={index} style={{ textAlign: 'right', margin: '5px 0' }}>
//                                         <span style={{ marginRight: '10px', marginLeft: '5px', fontSize: '25px' }}>•</span>
//                                         {ingredient}
//                                     </li>
//                                 ))}
//                             </ul>
//                             <h2 style={{ marginLeft: '40vw' }}>הוראות הכנה:</h2>
//                             <ul style={{ listStyleType: 'none', padding: 0 }}>
//                                 {Array.isArray(recipeDetails[2]) && recipeDetails[2].map((instruction, index) => (
//                                     <li key={index} style={{ textAlign: 'right', margin: '15px 0' }}>
//                                         {instruction}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </>)}
//                     </>
//                 ) : (
//                     <p>טוען מתכון...</p>
//                 )}
//             </div>

//         </>
//     )
// }
// export default python;
