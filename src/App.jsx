
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import BestSellers from "./components/BestSellers";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <BestSellers />
      <Newsletter />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
