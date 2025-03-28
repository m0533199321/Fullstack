import '../styles/Home.css'; // יצירת קובץ CSS לעיצוב
import About from './About';
import LastRecipes from './LastRecipes';

const Home = () => {
    return (
        <div className="home-page">
            {/* סעיף 1: סרטון רקע עם טקסט */}
            <section className="hero-section">
                <video src="../../videos/cow.mp4" autoPlay loop muted className="background-video" />
                <div className="hero-content">
                    <h1 style={{ fontSize: '150px', color: 'black', margin: 'auto' }}>smart-chef</h1>
                    {/* <p>חוויה ויזואלית מרהיבה</p> */}
                </div>
            </section>

            <LastRecipes />
            <About />
        </div>
    );

};

export default Home;