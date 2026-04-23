import { useEffect, useRef, useState } from "react";
import {
  Facebook,
  GraduationCap,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const API_URL =
  "https://opensheet.elk.sh/1Q4oWW-9W_y-Kq0OMfCs23NQlL23qV6h1nuEFuDz4X0M/FOOTER-SECTION-DATA";

interface FooterRow {
  School_Logo_URl?: string;
  School_short_name?: string;
  School_full_name?: string;
  Tag_line?: string;
  Facebook_link?: string;
  "X-link"?: string;
  "Instagram-link"?: string;
  Youtube_link?: string;
  Academics?: string;
  Address?: string;
  Contact_number?: string;
  School_gmail_id?: string;
  School_office_time?: string;
}

// ── useInView — bulletproof version ──────────────────────────────────────────
// Triggers immediately if already on screen, uses IntersectionObserver if not,
// and falls back with a 600ms timeout so animations ALWAYS run even if the
// observer fires late or the footer is at the very bottom on first load.
function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Force-check immediately on mount
    const check = () => {
      const el = ref.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        setInView(true);
        return true;
      }
      return false;
    };

    if (check()) return; // already visible — done

    // Observer for scroll-into-view
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px 100px 0px" },
    );
    if (ref.current) obs.observe(ref.current);

    // Hard fallback: always animate after 800ms regardless
    const fallback = setTimeout(() => setInView(true), 800);

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, [threshold]);

  return { ref, inView };
}

// ── AnimatedLine ──────────────────────────────────────────────────────────────
function AnimatedLine({
  inView,
  delay = 0,
}: {
  inView: boolean;
  delay?: number;
}) {
  return (
    <div
      style={{
        height: 2,
        background: "linear-gradient(90deg, #C9910A, #f5c842, #C9910A)",
        borderRadius: 2,
        transformOrigin: "left",
        transform: inView ? "scaleX(1)" : "scaleX(0)",
        transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        marginBottom: 16,
        width: 48,
      }}
    />
  );
}

// ── SocialButton ──────────────────────────────────────────────────────────────
function SocialButton({
  icon: Icon,
  label,
  href,
  index,
  inView,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: `1px solid ${hovered ? "#C9910A" : "rgba(255,255,255,0.2)"}`,
        background: hovered ? "#C9910A" : "rgba(255,255,255,0.05)",
        color: "#fff",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: inView
          ? hovered
            ? "translateY(-3px) scale(1.12)"
            : "translateY(0) scale(1)"
          : "translateY(16px) scale(0.85)",
        opacity: inView ? 1 : 0,
        transitionDelay: `${600 + index * 80}ms`,
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <Icon size={14} />
    </a>
  );
}

// ── ContactItem ───────────────────────────────────────────────────────────────
function ContactItem({
  icon: Icon,
  text,
  inView,
  delay,
}: {
  icon: React.ElementType;
  text: string;
  inView: boolean;
  delay: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        fontSize: 13,
        color: "rgba(255,255,255,0.65)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(16px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <span style={{ marginTop: 2, flexShrink: 0, color: "#C9910A" }}>
        <Icon size={13} />
      </span>
      <span style={{ lineHeight: 1.65, whiteSpace: "pre-line" }}>{text}</span>
    </div>
  );
}

// ── QuickLink ─────────────────────────────────────────────────────────────────
function QuickLink({
  label,
  id,
  inView,
  delay,
}: {
  label: string;
  id: string;
  inView: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <li
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-14px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        listStyle: "none",
      }}
    >
      <button
        type="button"
        onClick={() =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: 13,
          color: hovered ? "#C9910A" : "rgba(255,255,255,0.6)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
          transition: "color 0.22s",
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: hovered ? "translateX(4px)" : "translateX(0)",
            transition: "transform 0.22s",
            color: "#C9910A",
            opacity: hovered ? 1 : 0.45,
            fontSize: 15,
          }}
        >
          ›
        </span>
        {label}
      </button>
    </li>
  );
}

// ── AcademicItem ──────────────────────────────────────────────────────────────
function AcademicItem({
  item,
  inView,
  delay,
}: {
  item: string;
  inView: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-14px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        listStyle: "none",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: hovered ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.6)",
          transition: "color 0.22s",
          cursor: "default",
        }}
      >
        <GraduationCap
          size={12}
          style={{
            color: "#C9910A",
            flexShrink: 0,
            opacity: hovered ? 1 : 0.65,
            transform: hovered
              ? "rotate(-10deg) scale(1.2)"
              : "rotate(0) scale(1)",
            transition: "transform 0.28s, opacity 0.28s",
          }}
        />
        {item}
      </span>
    </li>
  );
}

// ── FloatingParticles ─────────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 11) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    size: (i % 3) + 1.5,
    animDelay: (i * 0.4) % 6,
    duration: 4 + (i % 4),
    opacity: 0.06 + (i % 5) * 0.04,
  }));
  return (
    <>
      <style>{`
        @keyframes fp-float {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-12px) scale(1.3); }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "#C9910A",
              opacity: p.opacity,
              animation: `fp-float ${p.duration}s ease-in-out ${p.animDelay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ── WaveDivider ───────────────────────────────────────────────────────────────
function WaveDivider() {
  return (
    <div
      style={{ lineHeight: 0, overflow: "hidden", background: "transparent" }}
    >
      <svg
        viewBox="0 0 1440 56"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%" }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,28 C360,56 720,0 1080,28 C1260,42 1380,16 1440,28 L1440,56 L0,56 Z"
          fill="#0f1f3d"
        />
      </svg>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({
  title,
  inView,
  delay,
}: {
  title: string;
  inView: boolean;
  delay: number;
}) {
  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(-12px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#C9910A",
          marginBottom: 8,
          margin: "0 0 8px",
        }}
      >
        {title}
      </p>
      <AnimatedLine inView={inView} delay={delay + 60} />
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();
  const [data, setData] = useState<FooterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: footerRef, inView } = useInView(0.05);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((rows: FooterRow[]) => {
        setData(rows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Footer fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <footer
        style={{
          background: "#0f1f3d",
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
          padding: "40px 0",
          fontSize: 14,
        }}
      >
        Loading…
      </footer>
    );
  }

  // ── All data lives in row[0] ──────────────────────────────────────────────
  const info = data[0];
  if (!info) {
    return (
      <footer
        style={{
          background: "#0f1f3d",
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
          padding: "40px 0",
          fontSize: 14,
        }}
      >
        Could not load footer data.
      </footer>
    );
  }

  // Academics collected from every row (each row has one entry)
  const academics = data.map((r) => r.Academics).filter(Boolean) as string[];

  const schoolFullName =
    info.School_full_name?.trim() || "Bright Future School";
  const schoolShortName = info.School_short_name?.trim() || "";

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: info.Facebook_link },
    { icon: Twitter, label: "Twitter", href: info["X-link"] },
    { icon: Instagram, label: "Instagram", href: info["Instagram-link"] },
    { icon: Youtube, label: "YouTube", href: info.Youtube_link },
  ].filter((s) => s.href?.trim());

  return (
    <>
      <style>{`
        @keyframes footer-brand-in {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes footer-glow-pulse {
          0%,100% { box-shadow: 0 0 0   0   rgba(201,145,10,0);    }
          50%      { box-shadow: 0 0 18px 4px rgba(201,145,10,0.28); }
        }
        @keyframes footer-bottom-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes footer-border-draw {
          from { width: 0%;   }
          to   { width: 100%; }
        }
      `}</style>

      <WaveDivider />

      <footer
        ref={footerRef}
        style={{
          background:
            "linear-gradient(165deg, #0f1f3d 0%, #0a1628 55%, #07101e 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <FloatingParticles />

        {/* Gold grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage:
              "linear-gradient(rgba(201,145,10,0.045) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(201,145,10,0.045) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* ── Main grid ─────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "72px 24px 52px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "52px 40px",
            }}
          >
            {/* ── Brand + Social ──────────────────────── */}
            <div
              style={{
                animation: inView
                  ? "footer-brand-in 0.8s cubic-bezier(0.16,1,0.3,1) 80ms both"
                  : "none",
              }}
            >
              {/* Logo + school name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                {info.School_Logo_URl?.trim() && (
                  <div
                    style={{
                      borderRadius: "50%",
                      border: "2px solid rgba(201,145,10,0.55)",
                      padding: 2,
                      flexShrink: 0,
                      animation: inView
                        ? "footer-glow-pulse 3s ease-in-out 1.2s infinite"
                        : "none",
                    }}
                  >
                    <img
                      src={info.School_Logo_URl}
                      alt="School Logo"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                )}
                <div style={{ lineHeight: 1.35, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#fff",
                      lineHeight: 1.4,
                    }}
                  >
                    {schoolFullName}
                  </div>
                  {schoolShortName && (
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        color: "#C9910A",
                        textTransform: "uppercase",
                        marginTop: 2,
                      }}
                    >
                      {schoolShortName}
                    </div>
                  )}
                </div>
              </div>

              {/* Tagline */}
              {info.Tag_line?.trim() && (
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.72,
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: 22,
                    borderLeft: "2px solid rgba(201,145,10,0.45)",
                    paddingLeft: 12,
                  }}
                >
                  {info.Tag_line}
                </p>
              )}

              {/* Social icons */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {socialLinks.map(({ icon, label, href }, i) => (
                  <SocialButton
                    key={label}
                    icon={icon}
                    label={label}
                    href={href}
                    index={i}
                    inView={inView}
                  />
                ))}
              </div>
            </div>

            {/* ── Quick Links ──────────────────────────── */}
            <div>
              <SectionHeading title="Quick Links" inView={inView} delay={180} />
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {[
                  { label: "Home", id: "home" },
                  { label: "About Us", id: "about" },
                  { label: "Our Teachers", id: "teachers" },
                  { label: "Results", id: "results" },
                  { label: "Contact", id: "contact" },
                ].map(({ label, id }, i) => (
                  <QuickLink
                    key={id}
                    label={label}
                    id={id}
                    inView={inView}
                    delay={280 + i * 65}
                  />
                ))}
              </ul>
            </div>

            {/* ── Academics ────────────────────────────── */}
            <div>
              <SectionHeading title="Academics" inView={inView} delay={320} />
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                {academics.map((item, i) => (
                  <AcademicItem
                    key={item}
                    item={item}
                    inView={inView}
                    delay={420 + i * 65}
                  />
                ))}
              </ul>
            </div>

            {/* ── Contact Info ─────────────────────────── */}
            <div>
              <SectionHeading
                title="Contact Info"
                inView={inView}
                delay={460}
              />
              <div
                style={{ display: "flex", flexDirection: "column", gap: 13 }}
              >
                {info.Address?.trim() && (
                  <ContactItem
                    icon={MapPin}
                    text={info.Address}
                    inView={inView}
                    delay={560}
                  />
                )}
                {info.Contact_number?.trim() && (
                  <ContactItem
                    icon={Phone}
                    text={`+${info.Contact_number}`}
                    inView={inView}
                    delay={620}
                  />
                )}
                {info.School_gmail_id?.trim() && (
                  <ContactItem
                    icon={Mail}
                    text={info.School_gmail_id}
                    inView={inView}
                    delay={680}
                  />
                )}
                {info.School_office_time?.trim() && (
                  <ContactItem
                    icon={Clock}
                    text={info.School_office_time}
                    inView={inView}
                    delay={740}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Animated gold shimmer line */}
          <div
            style={{
              height: 1,
              marginTop: -1,
              width: "100%",
              background:
                "linear-gradient(90deg, transparent 0%, #C9910A 50%, transparent 100%)",
              animation: inView
                ? "footer-border-draw 1.4s cubic-bezier(0.16,1,0.3,1) 700ms both"
                : "none",
            }}
          />

          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "18px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              animation: inView
                ? "footer-bottom-in 0.7s ease 900ms both"
                : "none",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.32)",
                margin: 0,
              }}
            >
              © {year} {schoolFullName}. All rights reserved.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.32)",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#C9910A",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                caffeine.ai <ArrowUpRight size={11} />
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
