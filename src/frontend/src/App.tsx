import { useEffect } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import NoticeBoard from "./components/NoticeBoard";
import Results from "./components/Results";
import Teachers from "./components/Teachers";

export default function App() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mutationObserver = new MutationObserver(() => {
      const elements = document.querySelectorAll(
        ".reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)",
      );
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          }
        },
        { threshold: 0.08 },
      );
      for (const el of elements) io.observe(el);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => mutationObserver.disconnect();
  }, []);

  return (
    <div className="font-poppins">
      <Navbar />
      <main className="">
        <Hero />
        <NoticeBoard />
        <About />
        <Teachers />
        <Results />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
