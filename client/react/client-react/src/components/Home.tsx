// import '../styles/Home.css';
// import About from './About';
// import LastRecipes from './LastRecipes';

// const Home = () => {
//     return (
//         <div className="home-page">
//             <section style={{ marginTop: '20vh', height: '100vh' }}>
//                 <video src="../../videos/macaroons.mp4" autoPlay loop muted className="background-video" />
//             </section>

//             <section>
//                 <LastRecipes />
//             </section>

//             <section>
//                 <About />
//             </section>


//         </div>
//     );

// };

// export default Home;

// import { useEffect, useState, useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import '../styles/Home.css';
// import About from './About';
// import LastRecipes from './LastRecipes';
// import { ChefHat, Search, BookOpen, Star, Users } from 'lucide-react';

// const Home = () => {
//     const [isLoaded, setIsLoaded] = useState(false);
//     const heroRef = useRef<HTMLDivElement>(null);
//     const { scrollYProgress } = useScroll();
//     const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
//     const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

//     useEffect(() => {
//         setIsLoaded(true);

//         const handleParallax = () => {
//             const scrollPosition = window.scrollY;
//             if (heroRef.current) {
//                 heroRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
//             }
//         };

//         window.addEventListener('scroll', handleParallax);
//         return () => window.removeEventListener('scroll', handleParallax);
//     }, []);

//     return (
//         <div className="home-page">
//             {/* Hero Section */}
//             <section className="hero-section">
//                 {/* <div className="video-container" ref={heroRef}>
//                     <video
//                         src="../../videos/macaroons.mp4"
//                         autoPlay
//                         loop
//                         muted
//                         className="background-video"
//                     />
//                     <div className="video-overlay"></div>
//                 </div> */}

//                 <motion.div
//                     className="hero-content"
//                     initial={{ opacity: 0, y: 50 }}
//                     animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
//                     transition={{ duration: 0.8, delay: 0.2 }}
//                     style={{ opacity, scale }}
//                 >
//                     <div className="logo-container">
//                         <ChefHat className="logo-icon" size={60} />
//                         <h1 className="logo-text">SmartChef</h1>
//                     </div>
//                     <h2 className="hero-tagline">המהפכה הקולינרית החכמה</h2>
//                     <p className="hero-description">
//                         מתכונים מותאמים אישית בעזרת בינה מלאכותית, בדיוק לפי הטעם והמצרכים שלך
//                     </p>

//                     <div className="hero-search">
//                         <Search className="search-icon" size={24} />
//                         <input
//                             type="text"
//                             placeholder="חפש מתכון, מרכיב או סגנון בישול..."
//                             className="search-input"
//                         />
//                         <button className="search-button">חפש</button>
//                     </div>

//                     <div className="hero-features">
//                         <div className="feature">
//                             <ChefHat size={24} />
//                             <span>מתכונים אינסופיים</span>
//                         </div>
//                         <div className="feature">
//                             <Star size={24} />
//                             <span>התאמה אישית</span>
//                         </div>
//                         <div className="feature">
//                             <BookOpen size={24} />
//                             <span>ספר מתכונים אישי</span>
//                         </div>
//                         <div className="feature">
//                             <Users size={24} />
//                             <span>קהילה תומכת</span>
//                         </div>
//                     </div>

//                     <motion.div
//                         className="scroll-indicator"
//                         animate={{ y: [0, 10, 0] }}
//                         transition={{ repeat: Infinity, duration: 1.5 }}
//                     >
//                         <span>גלול למטה</span>
//                         <div className="scroll-arrow">↓</div>
//                     </motion.div>
//                 </motion.div>
//             </section>

//             {/* Recipe Showcase */}
//             <section className="recipe-showcase">
//                 <div className="section-header">
//                     <h2>המתכונים האחרונים</h2>
//                     <div className="section-divider">
//                         <div className="divider-line"></div>
//                         <ChefHat size={24} />
//                         <div className="divider-line"></div>
//                     </div>
//                     <p>גלה את המתכונים החדשים והמרגשים שנוצרו לאחרונה</p>
//                 </div>

//                 <LastRecipes />

//                 <div className="showcase-cta">
//                     <button className="cta-button">צור מתכון חדש</button>
//                     <button className="cta-button outline">גלה עוד מתכונים</button>
//                 </div>
//             </section>

//             {/* How It Works */}
//             <section className="how-it-works">
//                 <div className="section-header light">
//                     <h2>איך זה עובד?</h2>
//                     <div className="section-divider">
//                         <div className="divider-line"></div>
//                         <ChefHat size={24} />
//                         <div className="divider-line"></div>
//                     </div>
//                     <p>בשלושה צעדים פשוטים תוכלו ליצור את המתכון המושלם</p>
//                 </div>

//                 <div className="steps-container">
//                     <motion.div
//                         className="step"
//                         initial={{ opacity: 0, y: 50 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                     >
//                         <div className="step-number">1</div>
//                         <h3>בחר מצרכים</h3>
//                         <p>הזן את המצרכים שיש לך בבית או שאתה מעוניין להשתמש בהם</p>
//                     </motion.div>

//                     <div className="step-connector"></div>

//                     <motion.div
//                         className="step"
//                         initial={{ opacity: 0, y: 50 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                         viewport={{ once: true }}
//                     >
//                         <div className="step-number">2</div>
//                         <h3>הגדר העדפות</h3><h3>בחר את סוג המנה, רמת הקושי והעדפות תזונתיות</h3>
//                     </motion.div>

//                     <div className="step-connector"></div>

//                     <motion.div
//                         className="step"
//                         initial={{ opacity: 0, y: 50 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                         viewport={{ once: true }}
//                     >
//                         <div className="step-number">3</div>
//                         <h3>קבל מתכון</h3>
//                         <p>המערכת תיצור עבורך מתכון מותאם אישית בשניות</p>
//                     </motion.div>
//                 </div>
//             </section>

//             {/* Testimonials */}
//             <section className="testimonials">
//                 <div className="section-header">
//                     <h2>מה המשתמשים אומרים</h2>
//                     <div className="section-divider">
//                         <div className="divider-line"></div>
//                         <ChefHat size={24} />
//                         <div className="divider-line"></div>
//                     </div>
//                 </div>

//                 <div className="testimonials-container">
//                     <motion.div
//                         className="testimonial"
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         whileInView={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                     >
//                         <div className="testimonial-content">
//                             <p>"מאז שהתחלתי להשתמש ב-SmartChef, הבישול שלי השתדרג פלאים. אני מקבלת רעיונות חדשים בכל פעם!"</p>
//                         </div>
//                         <div className="testimonial-author">
//                             <div className="author-avatar">רמ</div>
//                             <div className="author-info">
//                                 <h4>רונית מזרחי</h4>
//                                 <div className="rating">
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>

//                     <motion.div
//                         className="testimonial"
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         whileInView={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                         viewport={{ once: true }}
//                     >
//                         <div className="testimonial-content">
//                             <p>"האפליקציה פשוט מדהימה! אני כבר לא צריך לחפש מתכונים באינטרנט, הכל נוצר במיוחד בשבילי."</p>
//                         </div>
//                         <div className="testimonial-author">
//                             <div className="author-avatar">אכ</div>
//                             <div className="author-info">
//                                 <h4>אלון כהן</h4>
//                                 <div className="rating">
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star" size={16} />
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>

//                     <motion.div
//                         className="testimonial"
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         whileInView={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                         viewport={{ once: true }}
//                     >
//                         <div className="testimonial-content">
//                             <p>"הצלחתי להכין ארוחות מדהימות עם המצרכים שהיו לי בבית, בלי לצאת לקניות. חוסך זמן וכסף!"</p>
//                         </div>
//                         <div className="testimonial-author">
//                             <div className="author-avatar">דל</div>
//                             <div className="author-info">
//                                 <h4>דנה לוי</h4>
//                                 <div className="rating">
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                     <Star className="star filled" size={16} />
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </div>
//             </section>

//             {/* About Section */}
//             <section className="about-section-wrapper">
//                 <About />
//             </section>

//             {/* Call to Action */}
//             <section className="cta-section">
//                 <motion.div
//                     className="cta-content"
//                     initial={{ opacity: 0, y: 50 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.8 }}
//                     viewport={{ once: true }}
//                 >
//                     <h2>מוכנים להתחיל?</h2>
//                     <p>הצטרפו למהפכה הקולינרית והתחילו ליצור מתכונים מותאמים אישית עוד היום!</p>
//                     <button className="main-cta-button">
//                         <ChefHat size={24} />
//                         <span>התחל ליצור מתכונים</span>
//                     </button>
//                 </motion.div>
//             </section>

//             {/* Footer */}
//             <footer className="home-footer">
//                 <div className="footer-content">
//                     <div className="footer-logo">
//                         <ChefHat size={36} />
//                         <h3>SmartChef</h3>
//                     </div>
//                     <p>© 2023 SmartChef. כל הזכויות שמורות.</p>
//                     <div className="footer-links">
//                         <a href="#">תנאי שימוש</a>
//                         <a href="#">מדיניות פרטיות</a>
//                         <a href="#">צור קשר</a>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default Home;

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import '../styles/Home.css';
import About from './About';
import LastRecipes from './LastRecipes';
import { ChefHat, BookOpen, Star, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './Redux/Store';
import avatar1 from "../../images/profiles/1.jpg";
import avatar3 from "../../images/profiles/3.jpg";
import avatar4 from "../../images/profiles/4.jpg";

const Home = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    const heroSlides = [
        {
            title: "מתכונים מותאמים אישית",
            description: "מערכת שיוצרת מתכונים ייחודיים בדיוק לפי הטעם שלך",
            image: "/placeholder.svg?height=1080&width=1920",
            color: "#ff9800"
        },
        {
            title: "גלה טעמים חדשים",
            description: "שילובי טעמים מפתיעים ורעיונות קולינריים שלא חשבת עליהם",
            image: "/placeholder.svg?height=1080&width=1920",
            color: "#ff5722"
        },
        {
            title: "בישול חכם וקל",
            description: "מתכונים שמותאמים למצרכים שיש לך בבית, בלי לצאת לקניות",
            image: "/placeholder.svg?height=1080&width=1920",
            color: "#ffb300"
        }
    ];

    const goTo = (path: string) => {
        if (path.startsWith("#")) {
            const element = document.querySelector(path);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            if (!isAuthenticated) return navigate("/login");
            navigate(path);
        }
    };


    useEffect(() => {
        setIsLoaded(true);

        const handleParallax = () => {
            const scrollPosition = window.scrollY;
            if (heroRef.current) {
                heroRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            }
        };

        window.addEventListener('scroll', handleParallax);

        // Auto-rotate slides
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);

        return () => {
            window.removeEventListener('scroll', handleParallax);
            clearInterval(slideInterval);
        };
    }, [heroSlides.length]);

    return (
        <div className="home-page">

            <section className="hero-section">
                <div className="hero-background" ref={heroRef}>

                    <div className="particles-container">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${5 + Math.random() * 10}s`
                                }}
                            ></div>
                        ))}
                    </div>

                    <div className="gradient-overlay"></div>
                </div>

                <div className="hero-content-wrapper">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isLoaded ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ opacity, scale }}
                    >
                        <motion.div
                            className="logo-container"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="logo-glow"></div>
                            <ChefHat className="home-logo-icon" size={80} />
                            <h1 className="home-logo-text">SmartChef</h1>
                        </motion.div>

                        <div className="hero-slider">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    className="slide-content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h2 className="hero-tagline" style={{ color: heroSlides[currentSlide].color }}>
                                        {heroSlides[currentSlide].title}
                                    </h2>
                                    <p className="hero-description">
                                        {heroSlides[currentSlide].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="slider-indicators">
                                {heroSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                                        onClick={() => setCurrentSlide(index)}
                                        style={{ backgroundColor: index === currentSlide ? heroSlides[index].color : undefined }}
                                    />
                                ))}
                            </div>
                        </div>

                        <motion.div
                            className="hero-features"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <div className="feature" onClick={() => goTo('/public-recipes')}>
                                <div className="feature-icon-container">
                                    <ChefHat size={24} />
                                </div>
                                <span>מתכונים אינסופיים</span>
                            </div>
                            <div className="feature" onClick={() => goTo('/request')}>
                                <div className="feature-icon-container">
                                    <Star size={24} />
                                </div>
                                <span>התאמה אישית</span>
                            </div>
                            <div className="feature" onClick={() => goTo('/private-recipes')}>
                                <div className="feature-icon-container">
                                    <BookOpen size={24} />
                                </div>
                                <span>ספר מתכונים אישי</span>
                            </div>
                            <div className="feature" onClick={() => goTo("#recommendations")}>
                                <div className="feature-icon-container">
                                    <Users size={24} />
                                </div>
                                <span>קהילה תומכת</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="hero-cta"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            {!isAuthenticated && <button className="primary-cta" onClick={() => goTo("/login")}>
                                <Sparkles size={20} />
                                <span>התחבר/י עכשיו</span>
                            </button>}
                            {isAuthenticated && <button className="primary-cta" onClick={() => goTo("/request")}>
                                <Sparkles size={20} />
                                <span>מתכון חדש</span>
                            </button>}
                        </motion.div>

                        <motion.div
                            className="scroll-indicator"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <span>גלול למטה</span>
                            <div className="scroll-arrow">↓</div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="how-it-works">
                <div className="section-header light">
                    <h2>איך זה עובד?</h2>
                    <div className="section-divider">
                        <div className="divider-line"></div>
                        <ChefHat size={24} />
                        <div className="divider-line"></div>
                    </div>
                    <p>בשלושה צעדים פשוטים תוכלו ליצור את המתכון המושלם</p>
                </div>

                <div className="steps-container">
                    <motion.div
                        className="step"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="step-number">1</div>
                        <h3>בחר מצרכים</h3>
                        <p>הזן את המצרכים שיש לך בבית או שאתה מעוניין להשתמש בהם</p>
                    </motion.div>

                    <div className="step-connector"></div>

                    <motion.div
                        className="step"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="step-number">2</div>
                        <h3>הגדר העדפות</h3>
                        <p>בחר את סוג המנה, רמת הקושי והעדפות תזונתיות</p>
                    </motion.div>

                    <div className="step-connector"></div>

                    <motion.div
                        className="step"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="step-number">3</div>
                        <h3>קבל מתכון</h3>
                        <p>המערכת תיצור עבורך מתכון מותאם אישית בשניות</p>
                    </motion.div>
                </div>
            </section>

            <section className="recipe-showcase">
                <div className="section-header">
                    <h2>המתכונים האחרונים</h2>
                    <div className="section-divider">
                        <div className="divider-line"></div>
                        <ChefHat size={24} />
                        <div className="divider-line"></div>
                    </div>
                    <p>גלה את המתכונים החדשים והמרגשים שנוצרו לאחרונה</p>
                </div>

                <LastRecipes />

                <div className="showcase-cta">
                    {!isAuthenticated && <button className="cta-button" onClick={() => goTo("/login")}>צור מתכון חדש</button>}
                    {isAuthenticated && <button className="cta-button" onClick={() => goTo("/request")}>צור מתכון חדש</button>}
                    {!isAuthenticated && <button className="cta-button outline" onClick={() => goTo("/login")}>גלה עוד מתכונים</button>}
                    {isAuthenticated && <button className="cta-button outline" onClick={() => goTo("/public-recipes")}>גלה עוד מתכונים</button>}
                </div>
            </section>

            <section className="testimonials">
                <div className="section-header">
                    <h2>מה המשתמשים אומרים</h2>
                    <div className="section-divider">
                        <div className="divider-line"></div>
                        <ChefHat size={24} />
                        <div className="divider-line"></div>
                    </div>
                </div>

                <div className="testimonials-container" id="recommendations">
                    <motion.div
                        className="testimonial"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="testimonial-content">
                            <p>"מאז שהתחלתי להשתמש ב-SmartChef, הבישול שלי השתדרג פלאים. אני מקבלת רעיונות חדשים בכל פעם!"</p>
                        </div>
                        <div className="testimonial-author">
                            <img src={avatar1} className="author-avatar" alt="" />
                            <div className="author-info">
                                <h4>רונית מזרחי</h4>
                                <div className="rating">
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="testimonial"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="testimonial-content">
                            <p>"האפליקציה פשוט מדהימה! אני כבר לא צריך לחפש מתכונים באינטרנט, הכל נוצר במיוחד בשבילי."</p>
                        </div>
                        <div className="testimonial-author">
                        <img src={avatar4} className="author-avatar" alt="" />
                        <div className="author-info">
                                <h4>אלון כהן</h4>
                                <div className="rating">
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star" size={16} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="testimonial"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="testimonial-content">
                            <p>"הצלחתי להכין ארוחות מדהימות עם המצרכים שהיו לי בבית, בלי לצאת לקניות. חוסך זמן וכסף!"</p>
                        </div>
                        <div className="testimonial-author">
                        <img src={avatar3} className="author-avatar" alt="" />
                        <div className="author-info">
                                <h4>דנה לוי</h4>
                                <div className="rating">
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                    <Star className="star filled" size={16} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section-wrapper">
                <About />
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <motion.div
                    className="cta-content"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2>מוכנים להתחיל?</h2>
                    <p>הצטרפו למהפכה הקולינרית והתחילו ליצור מתכונים מותאמים אישית עוד היום!</p>
                    <button className="main-cta-button">
                        <ChefHat size={24} />
                        {!isAuthenticated && <span onClick={() => goTo("/login")}>התחל ליצור מתכונים</span>}
                        {isAuthenticated && <span onClick={() => goTo("/request")}>התחל ליצור מתכונים</span>}
                    </button>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <ChefHat size={36} />
                        <h3>SmartChef</h3>
                    </div>
                    <p>© 2025 SmartChef. כל הזכויות שמורות.</p>
                    <div className="footer-links">
                        <a href="#">תנאי שימוש</a>
                        <a href="#">מדיניות פרטיות</a>
                        <a href="#">צור קשר</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
