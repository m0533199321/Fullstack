import '../styles/Home.css';
import About from './About';
import LastRecipes from './LastRecipes';
import Google from './Google';

const Home = () => {
    return (
        <div className="home-page">
            <section style={{ marginTop: '20vh', height: '100vh' }}>
                <video src="../../videos/macaroons.mp4" autoPlay loop muted className="background-video" />
            </section>

            <section><Google/></section>

            <section>
                <LastRecipes />
            </section>

            <section>
                <About />
            </section>


        </div>
    );

};

export default Home;

