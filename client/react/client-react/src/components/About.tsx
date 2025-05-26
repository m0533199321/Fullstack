import { motion } from 'framer-motion';
import '../styles/About.css';
import { ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './Redux/Store';

const About = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const goTo = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div
      className="about-container"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="about-header">
        <h2>אודות SmartChef</h2>
        <div className="about-divider">
          <span></span>
          <div className="divider-icon"><ChefHat size={40} /></div>
          <span></span>
        </div>
      </div>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">🚀</span>
        </div>
        <div className="section-content">
          <h3>ברוכים הבאים ל-SmartChef!</h3>
          <p>
            ברוכים הבאים ל-SmartChef, האפליקציה שמשנה את כל מה שחשבתם על עולם הבישול והמתכונים! אין כאן מאגר מתכונים ישן ומוגבל – כאן כל מתכון שנוצר הוא חדש, ייחודי ומותאם בדיוק לך. בעזרת טכנולוגיית AI מתקדמת, SmartChef מאפשרת לכל משתמש לקבל מתכונים שנוצרו באופן אישי, בהתבסס על המצרכים שיש לו בבית, ההעדפות הקולינריות שלו, והצרכים האישיים שלו – הכל בלחיצת כפתור!
          </p>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">🤖</span>
        </div>
        <div className="section-content">
          <h3>בינה מלאכותית במקום מאגר מתכונים קבוע</h3>
          <p>
            בניגוד לכל האפליקציות שמציעות מאגרי מתכונים שמישהו הזין בעבר, SmartChef לא מחזיקה מאגר נתונים של מתכונים כלל! כל מתכון שמתקבל נוצר בזמן אמת, במיוחד עבור המשתמש, לפי הדרישות שלו. היתרונות בכך הם עצומים:
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>גיוון אינסופי – אין מתכונים חוזרים ונשנים, כל מתכון הוא חדש!</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>התאמה אישית מושלמת – לא תקבלו מתכונים עם מרכיבים שאין לכם או שאתם לא אוהבים.</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>יצירתיות קולינרית – האפליקציה ממציאה שילובים חדשים ומרגשים בכל פעם מחדש.</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">📚</span>
        </div>
        <div className="section-content">
          <h3>ספר המתכונים האישי שלך</h3>
          <p>
            כל משתמש ב-SmartChef מקבל אזור אישי ייחודי שנקרא "ספר המתכונים שלי". זהו המקום בו ניתן לשמור את המתכונים שהכי אהבתם, לחזור אליהם בכל זמן ולבשל אותם שוב ושוב. המערכת לומדת את ההעדפות שלך ובפעם הבאה שתבקש מתכון, היא תדע להציע לך משהו שתאהב אפילו יותר!
          </p>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">👥</span>
        </div>
        <div className="section-content">
          <h3>מתכונים ציבוריים ושיתוף קהילתי</h3>
          <p>
            מעבר לספר המתכונים האישי, קיים גם אזור ציבורי של מתכונים. כאן ניתן לשתף מתכונים שנוצרו על ידי המשתמשים, לגלות רעיונות חדשים וללמוד מהקהילה.
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>ניתן להעביר מתכון אישי לאזור הציבורי ולשתף אותו עם כולם.</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>ניתן להוסיף מתכון ציבורי לספר האישי שלך ולשמור אותו לשימוש עתידי.</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>לכל מתכון ציבורי אפשר להגיב, לדרג ולהציע שדרוגים.</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">🔍</span>
        </div>
        <div className="section-content">
          <h3>חיפוש מתוחכם שמבין אותך</h3>
          <p>
            כדי למצוא את המתכון המושלם, SmartChef עושה שימוש באלגוריתם חיפוש חכם שמבוסס על AI מתקדם.
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>ניתן להזין את המצרכים שיש לך בבית, ולקבל רק מתכונים שתוכל להכין בלי לצאת לקניות.</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>ניתן לציין אילו מאכלים אתה אוהב או לא אוהב, ולקבל תוצאות מותאמות אישית.</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>אפשר לחפש לפי סוג ארוחה, למשל ארוחת בוקר, ארוחת חג, קינוחים ועוד.</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">✨</span>
        </div>
        <div className="section-content">
          <h3>חוויית משתמש ייחודית ומתקדמת</h3>
          <p>
            האפליקציה עוצבה בקפידה כדי לספק חוויית משתמש מושלמת.
          </p>
          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>עיצוב כהה ויוקרתי שמעניק תחושה מודרנית ונעימה לעין.</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>מהירות וביצועים גבוהים – קבלת מתכון תוך שניות!</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>ממשק ידידותי עם ניווט קליל ונוח לכל משתמש.</span>
            </li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="about-section why-choose" variants={itemVariants}>
        <div className="section-icon">
          <span className="icon-bg">🏆</span>
        </div>
        <div className="section-content">
          <h3>למה לבחור ב-SmartChef?</h3>
          <div className="why-choose-grid">
            <div className="why-choose-item">
              <div className="why-icon">🤖</div>
              <p>אין מאגר נתונים קבוע – כל מתכון נוצר מאפס, במיוחד בשבילך.</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">🎯</div>
              <p>AI מתקדם – יצירת מתכונים מותאמים אישית בלחיצת כפתור.</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">📕</div>
              <p>אזור אישי לשמירת מתכונים אהובים.</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">👨‍👩‍👧‍👦</div>
              <p>קהילה חיה ונושמת של בשלנים, שיתוף מתכונים ותגובות.</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">🔍</div>
              <p>חיפוש חכם לפי מצרכים זמינים, סוג ארוחה והעדפות אישיות.</p>
            </div>
            <div className="why-choose-item">
              <div className="why-icon">💻</div>
              <p>חוויית משתמש חדשנית עם עיצוב מודרני ומושך.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {!isAuthenticated &&
        <motion.footer className="about-footer" variants={itemVariants}>
          <h3>הצטרפו למהפכה עכשיו!</h3>
          <p>אם אתם מחפשים דרך חדשה, חכמה ומהנה לבשל, SmartChef היא הבחירה המושלמת עבורכם! אין צורך יותר לבזבז זמן בחיפוש מתכונים באינטרנט – פשוט תנו לאפליקציה לעשות את העבודה בשבילכם. הורידו את SmartChef עוד היום והתחילו לבשל כמו מקצוענים!</p>
      {!isAuthenticated && <button className="about-cta" onClick={() => (goTo("/login"))}>התחל עכשיו</button>}
        </motion.footer>}
    </motion.div>
  );
};

export default About;

