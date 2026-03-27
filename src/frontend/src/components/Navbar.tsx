import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Teachers", href: "#teachers" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = ["home", "about", "teachers", "results", "contact"];
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 80) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white/95 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/school-logo-transparent.dim_200x200.png"
            alt="Bright Future School Logo"
            className="h-10 w-10 object-contain"
          />
          <div className="leading-tight">
            <div className="text-school-navy font-bold text-sm sm:text-base tracking-wide leading-none">
              BRIGHT FUTURE
            </div>
            <div className="text-school-gold text-xs font-medium tracking-widest">
              SENIOR SECONDARY SCHOOL
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.href}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              onClick={() => scrollTo(link.href)}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                activeSection === link.href.replace("#", "")
                  ? "text-school-gold border-b-2 border-school-gold pb-0.5"
                  : "text-school-navy hover:text-school-gold"
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            data-ocid="nav.apply_now.button"
            onClick={() => scrollTo("#contact")}
            className="ml-2 bg-school-gold text-white text-sm font-bold uppercase tracking-wide px-5 py-2 rounded transition-all duration-200 hover:bg-yellow-600 hover:scale-105 hover:shadow-lg"
          >
            Apply Now
          </button>
        </div>

        <button
          type="button"
          data-ocid="nav.hamburger.toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-school-navy"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="flex flex-col py-2">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                onClick={() => scrollTo(link.href)}
                className={`text-left px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-school-gold bg-school-lightgray"
                    : "text-school-navy hover:text-school-gold hover:bg-school-lightgray"
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="px-6 py-3">
              <button
                type="button"
                data-ocid="nav.mobile.apply_now.button"
                onClick={() => scrollTo("#contact")}
                className="w-full bg-school-gold text-white text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded hover:bg-yellow-600 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
