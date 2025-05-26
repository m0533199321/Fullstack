export const registerEmailBody = (fName: string): string => {
    return `
  <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
    <div style="background-color: #FFA500; padding: 10px 20px; border-radius: 8px 8px 0 0; color: white;">
      <h2 style="margin: 0;">הודעת הצטרפות - אפליקציית Smart Chef</h2>
    </div>
    <div style="padding: 20px; background-color: white; border: 1px solid #eee; border-top: none;">
      <h1 style="font-size: 28px; color: #FFA500; margin-top: 0;">ברוכים הבאים!</h1>
      <p style="font-size: 20px; color: #333;">היי ${fName},</p>
      <p style="font-size: 18px; color: #333;">איזה כיף שאת/ה כאן! אנחנו שמחים מאוד שהצטרפת לקהילה שלנו.</p>
      <p style="font-size: 18px; color: #333;">מעכשיו, תוכל/י ליהנות ממגוון רחב של פיצ'רים שישדרגו את חוויית הבישול שלך:</p>
      <ul style="font-size: 18px; color: #333; padding-right: 20px;">
        <li>🍽️ <strong>מתכונים טעימים ומגוונים:</strong> קבל/י גישה למאגר עשיר של מתכונים, מכל הסוגים ולכל הטעמים.</li>
        <li>🛒 <strong>ניהול מתכונים קל ונוח:</strong> שמור/י את המתכונים האהובים עליך, צור/י רשימות קניות ושתף/י מתכונים עם חברים.</li>
        <li>👩‍🍳 <strong>קהילה חמה ותומכת:</strong> הצטרף/י לקהילה של אוהבי בישול, שתף/י מתכונים וטיפים, וקבל/י השראה.</li>
      </ul>
      <p style="font-size: 18px; color: #333;">אנו מזמינים אותך להתחיל לחקור את האפליקציה, לגלות מתכונים חדשים, ולשתף את היצירות שלך איתנו.</p>
      <p style="font-size: 18px; color: #333;">אם יש לך שאלות או בקשות – אנחנו כאן בשבילך.</p>
      <p style="font-size: 20px; color: #FFA500;">בתיאבון,</p>
      <p style="font-size: 20px; color: #FFA500;">smart-chef</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 14px; color: gray;">ההודעה נשלחה אוטומטית מאפליקציית ניהול המתכונים - Smart Chef</p>
    </div>
  </div>
`;
};
