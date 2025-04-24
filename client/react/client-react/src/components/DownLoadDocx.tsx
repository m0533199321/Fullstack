// const DownloadDocx = () => {
//     const handleDownload = () => {
    
//         const content = `
//         <html>
//             <head>
//                 <title>Document</title>
//             </head>
//             <body>
//                 <h1>כותרת המתכון</h1>
//                 <p>זוהי דוגמה למתכון.</p>
//             </body>
//         </html>
//         `;

      
//         const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
//         const url = URL.createObjectURL(blob);

      
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'recipe.docx';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     };

//     return (
//         <button onClick={handleDownload}>
//             הורד קובץ .docx
//         </button>
//     );
// };

// export default DownloadDocx;
