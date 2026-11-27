
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustBadges from "../components/TrustBadges";
import Categories from "../components/Categories";
import BestSellers from "../components/BestSellers";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <Categories />
        <BestSellers />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

export default Home;
