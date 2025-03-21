import React from "react";

const AboutSmartChef = () => {
  return (
    <div className="bg-black text-white p-16 rounded-2xl shadow-2xl max-w-6xl mx-auto text-center space-y-12">
      {/* כותרת ראשית */}
      <h1 className="text-5xl text-orange-500 font-extrabold tracking-wide uppercase drop-shadow-lg">
        SmartChef - המהפכה בעולם המתכונים
      </h1>
      
      {/* פסקת פתיחה */}
      <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
        ברוכים הבאים ל-<span className="text-orange-400 font-semibold">SmartChef</span>, אפליקציית הבישול שמשנה את כללי המשחק! במקום מאגר מתכונים קבוע, 
        <span className="text-orange-400">ה-AI</span> שלנו יוצר מתכונים מותאמים אישית, כך שתמיד תקבלו משהו חדש וייחודי שמתאים בדיוק למה שיש לכם בבית.
      </p>
      
      {/* יתרונות האפליקציה */}
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg border-l-4 border-orange-500">
          <h2 className="text-2xl text-orange-400 font-semibold mb-4">AI במקום מאגר מתכונים</h2>
          <p className="text-gray-300">כל מתכון ייחודי ונוצר במיוחד עבורך – אין מתכונים משוכפלים!</p>
        </div>
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg border-l-4 border-orange-500">
          <h2 className="text-2xl text-orange-400 font-semibold mb-4">חוויית משתמש מתקדמת</h2>
          <p className="text-gray-300">עיצוב כהה, מודרני ואינטואיטיבי שנותן חוויית שימוש חלקה ונעימה.</p>
        </div>
      </div>
      
      {/* אזורי האפליקציה */}
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg border-l-4 border-orange-500">
          <h3 className="text-xl text-orange-400 font-semibold mb-4">ספר המתכונים שלי</h3>
          <p className="text-gray-300">שמרו את המתכונים שאתם הכי אוהבים באזור האישי שלכם לגישה מהירה.</p>
        </div>
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg border-l-4 border-orange-500">
          <h3 className="text-xl text-orange-400 font-semibold mb-4">אזור ציבורי למתכונים</h3>
          <p className="text-gray-300">גילוי ושיתוף מתכונים עם קהילת משתמשים מכל העולם.</p>
        </div>
      </div>
      
      {/* קריאה לפעולה */}
      <div className="mt-10">
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-10 py-4 rounded-full shadow-lg uppercase tracking-wider">
          הצטרפו עכשיו ל-SmartChef!
        </button>
      </div>
    </div>
  );
};

export default AboutSmartChef;
