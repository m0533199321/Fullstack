export const recipeEmailBody = (fName: string, path: string): string => {
    return `
            <div style='text-align: right; font-family: Arial, sans-serif;'>
                <h1 style='font-size: 28px; color: #FFA500;'>,היי ${fName}</h1>
                <p style='font-size: 20px; color: #333;'>:הנה המתכון שביקשת</p>
                <p style='font-size: 18px; color: #333;'>
                    <a href="${path}" style='color: #FFA500; text-decoration: none;'>לחץ/י כאן כדי לראות את המתכון</a>
                </p>
                <p style='font-size: 20px; color: #333;'>!מקווה שתיהנה/י ממנו מאוד</p>
                <p style='font-size: 20px; color: #FFA500;'>,בתיאבון</p>
                <p style='font-size: 20px; color: #FFA500;'>smart-chef</p>
            </div>
            `;
};
