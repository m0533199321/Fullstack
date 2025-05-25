export const recipeEmailBody = (fName: string, path: string): string => {
    return `
  <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
    <div style="background-color: #FFA500; padding: 10px 20px; border-radius: 8px 8px 0 0; color: white;">
      <h2 style="margin: 0;">הודעה אוטומטית מ smart-chef</h2>
    </div>
    <div style="padding: 20px; background-color: white; border: 1px solid #eee; border-top: none;">
      <h1 style="font-size: 28px; color: #FFA500; margin-top: 0;">היי ${fName},</h1>
      <p style="font-size: 20px; color: #333;">הנה המתכון שביקשת:</p>
      <p style="font-size: 18px; color: #333;">
        <a href="${path}" style="color: #FFA500; text-decoration: none; font-weight: bold;">לחץ/י כאן כדי לראות את המתכון</a>
      </p>
      <p style="font-size: 20px; color: #333;">מקווה שתיהנה/י ממנו מאוד!</p>
      <p style="font-size: 20px; color: #FFA500;">בתיאבון,</p>
      <p style="font-size: 20px; color: #FFA500;">smart-chef</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 14px; color: gray;">ההודעה נשלחה אוטומטית מאפליקציית ניהול המתכונים - Smart Chef</p>
    </div>
  </div>
`;
};
