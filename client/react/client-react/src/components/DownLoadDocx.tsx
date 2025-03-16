const DownloadDocx = () => {
    const handleDownload = () => {
        // תוכן הקובץ
        const content = `
        <html>
            <head>
                <title>Document</title>
            </head>
            <body>
                <h1>כותרת המתכון</h1>
                <p>זוהי דוגמה למתכון.</p>
            </body>
        </html>
        `;

        // יצירת Blob מהתוכן
        const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);

        // יצירת אלמנט קישור להורדה
        const link = document.createElement('a');
        link.href = url;
        link.download = 'recipe.docx'; // שם הקובץ שיתקבל
        document.body.appendChild(link);
        link.click(); // לחיצה על הקישור להורדה
        document.body.removeChild(link); // הסרת הקישור מהדף
        URL.revokeObjectURL(url); // ניקוי ה-URL
    };

    return (
        <button onClick={handleDownload}>
            הורד קובץ .docx
        </button>
    );
};

export default DownloadDocx;
