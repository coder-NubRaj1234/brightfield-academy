import {
  Facebook,
  GraduationCap,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-school-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/school-logo-transparent.dim_200x200.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="leading-tight">
                <div className="font-bold text-sm tracking-wide">
                  BRIGHT FUTURE
                </div>
                <div className="text-school-gold text-xs tracking-widest">
                  SR. SEC. SCHOOL
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Nurturing excellence since 1998. Providing quality education that
              shapes leaders of tomorrow.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <button
                  type="button"
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-school-gold transition-colors duration-200"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 text-school-gold">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", id: "home" },
                { label: "About Us", id: "about" },
                { label: "Our Teachers", id: "teachers" },
                { label: "Results", id: "results" },
                { label: "Contact", id: "contact" },
              ].map(({ label, id }) => (
                <li key={id}>
                  <button
                    type="button"
                    data-ocid={`footer.${id}.link`}
                    onClick={() => scrollTo(id)}
                    className="text-sm text-white/60 hover:text-school-gold transition-colors flex items-center gap-1"
                  >
                    <span className="text-school-gold/40">›</span> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 text-school-gold">
              Academics
            </h4>
            <ul className="space-y-2">
              {[
                "Primary School (I–V)",
                "Middle School (VI–VIII)",
                "Secondary (IX–X)",
                "Senior Secondary (XI–XII)",
                "Science Stream",
                "Commerce Stream",
                "Humanities Stream",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-white/60 flex items-center gap-1">
                    <GraduationCap size={12} className="text-school-gold/60" />{" "}
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 text-school-gold">
              Contact Info
            </h4>
            <div className="space-y-3 text-sm text-white/60">
              <p>
                14, Nehru Vihar, Timarpur,
                <br />
                Delhi – 110054
              </p>
              <p>📞 +91 11 2345 6789</p>
              <p>📧 info@brightfuture.edu</p>
              <p>⏰ Mon–Sat: 8:00 AM – 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {year} Bright Future Senior Secondary School. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-school-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
