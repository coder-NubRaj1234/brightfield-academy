import { useEffect, useState } from "react";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('/assets/generated/school-hero.dim_1920x1080.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.58)" }}
      />

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.1s" }}
        >
          <p className="text-school-gold font-semibold uppercase tracking-[0.3em] text-sm sm:text-base mb-4">
            Welcome to Excellence in Education
          </p>
        </div>

        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.25s" }}
        >
          <h1
            className="font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
          >
            BRIGHT FUTURE
            <br />
            <span className="text-school-gold">SENIOR SECONDARY SCHOOL</span>
          </h1>
        </div>

        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.4s" }}
        >
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nurturing young minds to become tomorrow&apos;s leaders through
            academic excellence, character development, and holistic education
            since 1998.
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "0.55s" }}
        >
          <button
            type="button"
            data-ocid="hero.learn_more.button"
            onClick={() => scrollTo("about")}
            className="px-8 py-3.5 bg-school-navy text-white font-bold uppercase tracking-wide rounded hover:bg-blue-900 hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            Learn More
          </button>
          <button
            type="button"
            data-ocid="hero.apply_now.button"
            onClick={() => scrollTo("contact")}
            className="px-8 py-3.5 bg-school-gold text-white font-bold uppercase tracking-wide rounded hover:bg-yellow-600 hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            Apply Now
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60">
        <div className="w-px h-12 bg-white/30 animate-pulse" />
        <span className="text-xs uppercase tracking-widest">Scroll</span>
      </div>
    </section>
  );
}
