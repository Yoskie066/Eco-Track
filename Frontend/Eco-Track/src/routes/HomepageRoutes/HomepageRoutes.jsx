import { Routes, Route } from "react-router-dom";
import Layout from "../../components/Layout/Layout/layout"; 
import Home from "../../pages/Homepage/Home";
import About from "../../pages/Homepage/About";
import Features from "../../pages/Homepage/Features";
import OurTeam from "../../pages/Homepage/OurTeam";
import ContactUs from "../../pages/Homepage/ContactUs";


function HomepageRoutes() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
           <Route path="/" element={<Home />} />
           <Route path="/home" element={<Home />} />
           <Route path="/about" element={<About />} />
           <Route path="/features" element={<Features />} />
           <Route path="/our-team" element={<OurTeam />} />
           <Route path="/contact-us" element={<ContactUs />} />
        </Route>
      </Routes>

    </>
  );
}

export default HomepageRoutes;
