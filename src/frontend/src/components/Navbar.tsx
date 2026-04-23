import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Notice", href: "#notices" },
  { label: "About", href: "#about" },
  { label: "Teachers", href: "#teachers" },
  { label: "Results", href: "#results" },
];

const API_URL =
  "https://opensheet.elk.sh/1j4DhJfn0Pj5V9WGm0UQ1dKBmWjbn0dG1lt671C-q4zg/sheet1";

interface SchoolInfo {
  Image: string;
  H1: string;
  H2: string;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [navVisible, setNavVisible] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    Image: "",
    H1: "",
    H2: "",
  });

  const lastScrollY = useRef(0);

  // Fetch school info from API
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: SchoolInfo[]) => {
        if (data?.length > 0) setSchoolInfo(data[0]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const getHomeTrigger = () => {
      const homeEl = document.getElementById("home");
      return homeEl
        ? homeEl.offsetTop + homeEl.offsetHeight
        : window.innerHeight;
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const homeTrigger = getHomeTrigger();

      if (currentY < homeTrigger && currentY > 16) {
        setPastHero(false);
        setNavVisible(false);
        lastScrollY.current = currentY;
        return;
      }

      setPastHero(true);

      if (currentY > lastScrollY.current) {
        setNavVisible(false);
        setMenuOpen(false);
      } else {
        setNavVisible(true);
      }

      setIsScrolled(currentY > 20);

      const sections = ["home", "notices", "about", "teachers", "results", "contact"];
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && currentY >= el.offsetTop - 80) current = id;
      }
      setActiveSection(current);
      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white ${
        isScrolled ? "py-2 shadow-md" : "py-3"
      }`}
      style={{
        transform: navVisible ? "translateY(0)" : "translateY(-110%)",
        opacity: navVisible ? 1 : 0,
        pointerEvents: navVisible && pastHero ? "auto" : "none",
        transition:
          "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, box-shadow 0.3s ease, padding 0.3s ease",
      }}
    >
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6">
        <div className="flex items-center gap-3">
          {schoolInfo.Image && (
            <img
              src={schoolInfo.Image}
              alt={`${schoolInfo.H1} Logo`}
              className="object-contain w-10 h-10"
            />
          )}
          <div className="leading-tight">
            <div className="text-sm font-bold leading-none tracking-wide text-school-navy sm:text-base">
              {schoolInfo.H1}
            </div>
            <div className="text-xs font-medium tracking-widest text-school-gold">
              {schoolInfo.H2}
            </div>
          </div>
        </div>

        <div className="items-center hidden gap-6 lg:flex">
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
            className="px-5 py-2 ml-2 text-sm font-bold tracking-wide text-white uppercase transition-all duration-200 rounded bg-school-gold hover:bg-yellow-600 hover:scale-105 hover:shadow-lg"
          >
            Contact Us
          </button>
        </div>

        <button
          type="button"
          data-ocid="nav.hamburger.toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 lg:hidden text-school-navy"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="bg-white border-t border-gray-100 shadow-lg lg:hidden">
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