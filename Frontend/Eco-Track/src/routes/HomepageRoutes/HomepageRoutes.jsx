import { Routes, Route } from "react-router-dom";
import Header from "../../components/Layout/Header/Header"; 
import Home from "../../pages/Homepage/Home";
import About from "../../pages/Homepage/About";
import Features from "../../pages/Homepage/Features";
import OurTeam from "../../pages/Homepage/OurTeam";
import ContactUs from "../../pages/Homepage/ContactUs";
import Footer from "../../components/Layout/Footer/Footer";

function HomepageRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
      <Footer />
    </>
  );
}

export default HomepageRoutes;
