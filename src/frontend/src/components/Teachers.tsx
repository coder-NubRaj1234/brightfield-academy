import {
  Briefcase,
  Facebook,
  GraduationCap,
  Mail,
  Mars,
  MessageCircle,
  Phone,
  Star,
  Venus,
  X,
  ChevronDown,
  ChevronUp,
  Crown,
  Shield,
  ZoomIn,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState, useCallback } from "react";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  image: string;
  description: string;
  phone: string;
  facebook: string;
  whatsapp: string;
  Exprince: string;
  Education: string;
  "Gamil-id": string;
  "special ": string;
  gender: string;
}

// ── COLOR THEMES PER CATEGORY ──────────────────────────────
const MALE_THEME = {
  bg: "linear-gradient(160deg,#0c1c3d 0%,#1a3560 100%)",
  border: "rgba(59,130,246,0.3)",
  topBar: "linear-gradient(90deg,#2563eb,#60a5fa,#2563eb)",
  avatarRing: "linear-gradient(135deg,#2563eb,#60a5fa)",
  avatarBorder: "#0c1c3d",
  nameColor: "#fff",
  subjectColor: "rgba(147,197,253,0.9)",
  divider: "rgba(59,130,246,0.18)",
  iconBg: "rgba(59,130,246,0.12)",
  iconBorder: "rgba(59,130,246,0.22)",
  shadow: "0 4px 18px rgba(0,0,0,0.28)",
  hoverShadow: "0 16px 40px rgba(37,99,235,0.28)",
};

const FEMALE_THEME = {
  bg: "linear-gradient(160deg,#1a0a2e 0%,#2d1060 100%)",
  border: "rgba(168,85,247,0.3)",
  topBar: "linear-gradient(90deg,#7c3aed,#c084fc,#7c3aed)",
  avatarRing: "linear-gradient(135deg,#7c3aed,#c084fc)",
  avatarBorder: "#1a0a2e",
  nameColor: "#fff",
  subjectColor: "rgba(216,180,254,0.9)",
  divider: "rgba(168,85,247,0.18)",
  iconBg: "rgba(168,85,247,0.12)",
  iconBorder: "rgba(168,85,247,0.22)",
  shadow: "0 4px 18px rgba(0,0,0,0.28)",
  hoverShadow: "0 16px 40px rgba(124,58,237,0.28)",
};

const SPECIAL_THEME = {
  bg: "linear-gradient(160deg,#052e16 0%,#065f46 100%)",
  border: "rgba(52,211,153,0.3)",
  topBar: "linear-gradient(90deg,#059669,#34d399,#059669)",
  avatarRing: "linear-gradient(135deg,#059669,#34d399)",
  avatarBorder: "#052e16",
  nameColor: "#fff",
  subjectColor: "rgba(110,231,183,0.9)",
  divider: "rgba(52,211,153,0.18)",
  iconBg: "rgba(52,211,153,0.12)",
  iconBorder: "rgba(52,211,153,0.22)",
  shadow: "0 4px 18px rgba(0,0,0,0.28)",
  hoverShadow: "0 16px 40px rgba(5,150,105,0.28)",
};

const LEADERSHIP_THEME = {
  bg: "linear-gradient(160deg,#0f172a 0%,#1e293b 100%)",
  border: "rgba(30,41,59,0.3)",
  topBar: "linear-gradient(90deg,#334155,#475569,#334155)",
  avatarRing: "linear-gradient(135deg,#334155,#475569)",
  avatarBorder: "#0f172a",
  nameColor: "#fff",
  subjectColor: "#f1f5f9",
  divider: "rgba(30,41,59,0.18)",
  iconBg: "rgba(30,41,59,0.12)",
  iconBorder: "rgba(30,41,59,0.22)",
  shadow: "0 4px 18px rgba(0,0,0,0.28)",
  hoverShadow: "0 16px 40px rgba(30,41,59,0.28)",
};

function getCardTheme(gender: string, isSpecial: boolean, isLeadership: boolean) {
  if (isLeadership) return LEADERSHIP_THEME;
  if (isSpecial) return SPECIAL_THEME;
  if (gender?.toLowerCase() === "female") return FEMALE_THEME;
  return MALE_THEME;
}

function getImageUrl(url: string, name: string): string {
  if (!url || url.trim() === "") {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a3560&color=fff&size=400`;
  }
  return url.trim();
}

function getSpecial(teacher: Teacher): string {
  return (teacher["special "] || "").trim();
}

function getRoleBadgeStyle(role: string): { bg: string; color: string } {
  const r = role.toLowerCase();
  if (r.includes("princip") && !r.includes("vice"))
    return { bg: "linear-gradient(135deg,#d4a843,#f5c842)", color: "#0f2044" };
  if (r.includes("head"))
    return { bg: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff" };
  if (r.includes("vice"))
    return { bg: "linear-gradient(135deg,#2563eb,#60a5fa)", color: "#fff" };
  return { bg: "linear-gradient(135deg,#059669,#34d399)", color: "#fff" };
}

function getRoleIcon(role: string) {
  const r = role.toLowerCase();
  if (r.includes("princip") && !r.includes("vice")) return Crown;
  if (r.includes("head") || r.includes("vice")) return Shield;
  return Star;
}

// ── SCROLL REVEAL HOOK ─────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── RESPONSIVE GRID COLUMNS HOOK ───────────────────────────
function useGridColumns(isLeadership: boolean) {
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (isLeadership) {
        if (w < 480) setCols(1);
        else if (w < 768) setCols(2);
        else setCols(3);
      } else {
        if (w < 400) setCols(2);
        else if (w < 640) setCols(2);
        else if (w < 900) setCols(3);
        else if (w < 1200) setCols(4);
        else setCols(5);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [isLeadership]);
  return cols;
}

// ── PHOTO LIGHTBOX ─────────────────────────────────────────
function PhotoLightbox({
  src, name, subject, theme, isLeadership, onClose,
}: {
  src: string; name: string; subject: string; theme: any; isLeadership: boolean; onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)", animation: "lbFadeIn .25s ease" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes lbFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes lbPopIn{from{opacity:0;transform:scale(.75)}to{opacity:1;transform:scale(1)}}
      `}</style>
      <button type="button" onClick={onClose}
        className="absolute flex items-center justify-center w-10 h-10 transition-all duration-200 rounded-full top-5 right-5 hover:scale-110 hover:rotate-90"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}>
        <X size={16} className="text-white" />
      </button>
      <div style={{ animation: "lbPopIn .4s cubic-bezier(.34,1.56,.64,1)" }}>
        <div className="p-1 rounded-full"
          style={{ background: theme.avatarRing, border: `2px solid ${theme.avatarBorder}`, boxShadow: theme.hoverShadow }}>
          <img
            src={src} alt={name}
            className="object-cover rounded-full"
            style={{ width: "clamp(160px,40vw,280px)", height: "clamp(160px,40vw,280px)", border: `4px solid ${theme.avatarBorder}` }}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a3560&color=fff&size=400`; }}
          />
        </div>
      </div>
      <div className="px-4 mt-5 text-center" style={{ animation: "lbPopIn .5s .08s cubic-bezier(.34,1.56,.64,1) both" }}>
        <p className="text-lg font-semibold uppercase" style={{ color: theme.nameColor }}>{name}</p>
        {subject ? (
          <span className="inline-flex items-center px-3 py-1 mt-1 text-sm font-bold tracking-wide rounded-full"
            style={{ background: theme.topBar, color: theme.nameColor }}>{subject}</span>
        ) : null}
      </div>
    </div>
  );
}

// ── TEACHER MODAL ──────────────────────────────────────────
function TeacherModal({
  teacher, onClose, onPhotoClick, theme, isLeadership,
}: {
  teacher: Teacher; onClose: () => void; onPhotoClick: () => void; theme: any; isLeadership: boolean;
}) {
  const special = getSpecial(teacher);
  const email = teacher["Gamil-id"];
  const RoleIcon = special ? getRoleIcon(special) : Star;
  const badge = special ? getRoleBadgeStyle(special) : null;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(8,12,28,0.85)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full overflow-y-auto"
        style={{
          background: theme.bg,
          borderRadius: "24px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          maxWidth: "min(100%, 28rem)",
          maxHeight: "90dvh",
        }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div className="w-full h-1" style={{ background: theme.topBar }} />
        <button type="button" onClick={onClose}
          className="absolute z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-full top-4 right-4 hover:scale-110 hover:rotate-90"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}>
          <X size={14} className="text-white" />
        </button>

        <div className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div className="relative flex-shrink-0">
            <div className="p-[2.5px] rounded-full"
              style={{ background: theme.avatarRing, border: `2px solid ${theme.avatarBorder}` }}>
              <button type="button" className="relative block rounded-full group" onClick={onPhotoClick} title="View photo">
                <img
                  src={getImageUrl(teacher.image, teacher.name)} alt={teacher.name}
                  className="object-cover rounded-full"
                  style={{ width: "clamp(60px,15vw,80px)", height: "clamp(60px,15vw,80px)", border: `2px solid ${theme.avatarBorder}` }}
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=1a3560&color=fff&size=200`; }}
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 rounded-full opacity-0 group-hover:opacity-100"
                  style={{ background: "rgba(0,0,0,0.45)" }}>
                  <ZoomIn size={18} className="text-white" />
                </div>
              </button>
            </div>
            {special && badge && (
              <div className="absolute flex items-center justify-center w-6 h-6 rounded-full -bottom-1 -right-1"
                style={{ background: badge.bg, border: `2px solid ${theme.avatarBorder}` }}>
                <RoleIcon size={10} style={{ color: badge.color }} fill={badge.color} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold leading-tight uppercase truncate sm:text-lg" style={{ color: theme.nameColor }}>
              {teacher.name}
            </h3>
            {teacher.subject ? (
              <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold tracking-wide mt-0.5"
                style={{ background: theme.topBar, color: theme.nameColor }}>{teacher.subject}</span>
            ) : null}
            {special && badge && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                style={{ background: badge.bg, color: badge.color }}>
                <RoleIcon size={8} fill="currentColor" /> {special}
              </span>
            )}
          </div>
        </div>

        <div className="h-px mx-4 sm:mx-6" style={{ background: theme.divider }} />

        <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:px-6 sm:py-4">
          {teacher.description && (
            <p className="text-xs leading-relaxed px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {teacher.description}
            </p>
          )}
          {[
            { icon: Briefcase, label: "Experience", value: teacher.Exprince },
            { icon: GraduationCap, label: "Education", value: teacher.Education },
            { icon: Mail, label: "Email", value: email },
          ].filter((i) => i.value).map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7"
                style={{ background: theme.iconBg, border: `1px solid ${theme.iconBorder}` }}>
                <Icon size={12} style={{ color: "rgb(244,175,16)" }} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "rgb(244,175,16)" }}>{label}</p>
                <p className="text-xs font-medium text-white/85 truncate mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 px-4 pb-4 sm:px-6 sm:pb-5">
          {teacher.phone && (
            <a href={`tel:${teacher.phone}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:opacity-80 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#1a3560,#0f2044)" }}>
              <Phone size={11} /> Call
            </a>
          )}
          {teacher.whatsapp && (
            <a href={`https://wa.me/${teacher.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:opacity-80 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)" }}>
              <MessageCircle size={11} /> WhatsApp
            </a>
          )}
          {teacher.facebook && (
            <a href={teacher.facebook} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:opacity-80 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)" }}>
              <Facebook size={11} /> Facebook
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-80 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#d4a843,#f5c842)", color: "#0f2044" }}>
              <Mail size={11} /> Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── UNIFIED CARD ───────────────────────────────────────────
function UnifiedCard({
  teacher, onClick, onPhotoClick, index, isLeadership = false,
}: {
  teacher: Teacher; onClick: () => void; onPhotoClick: () => void; index: number; isLeadership?: boolean;
}) {
  const { ref, visible } = useReveal();
  const special = getSpecial(teacher);
  const email = teacher["Gamil-id"];
  const theme = getCardTheme(teacher.gender, !!special && !isLeadership, isLeadership);
  const badge = special ? getRoleBadgeStyle(special) : null;
  const RoleIcon = special ? getRoleIcon(special) : Star;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.94)",
        transition: `opacity 0.55s ${(index % 5) * 0.07}s, transform 0.55s ${(index % 5) * 0.07}s cubic-bezier(.34,1.56,.64,1)`,
      }}
    >
      <button type="button" onClick={onClick} className="relative w-full text-left group">
        <div
          className="relative overflow-hidden transition-all duration-300 rounded-2xl group-hover:-translate-y-2"
          style={{
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = theme.hoverShadow; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = theme.shadow; }}
        >
          <div className="h-[3px] w-full" style={{ background: theme.topBar }} />

          <div className="flex flex-col items-center gap-1.5 sm:gap-2 px-2 sm:px-3 pt-3 sm:pt-4 pb-3 sm:pb-4 text-center">
            {/* Avatar */}
            <div className="relative">
              <div className="p-[2.5px] rounded-full" style={{ background: theme.avatarRing }}>
                <button type="button" className="relative block rounded-full group/photo"
                  onClick={(e) => { e.stopPropagation(); onPhotoClick(); }} title="View photo">
                  <img
                    src={getImageUrl(teacher.image, teacher.name)} alt={teacher.name}
                    className="object-cover rounded-full"
                    style={{
                      width: "clamp(48px,9vw,64px)",
                      height: "clamp(48px,9vw,64px)",
                      border: `2.5px solid ${theme.avatarBorder}`,
                    }}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=1a3560&color=fff&size=200`; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 rounded-full opacity-0 group-hover/photo:opacity-100"
                    style={{ background: "rgba(0,0,0,0.42)" }}>
                    <ZoomIn size={14} className="text-white" />
                  </div>
                </button>
              </div>
              {isLeadership && special && badge && (
                <div className="absolute flex items-center justify-center w-5 h-5 rounded-full -bottom-1 -right-1"
                  style={{ background: badge.bg, border: `2px solid ${theme.avatarBorder}` }}>
                  <RoleIcon size={8} style={{ color: badge.color }} fill={badge.color} />
                </div>
              )}
            </div>

            {isLeadership && special && badge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase"
                style={{ background: badge.bg, color: badge.color, fontSize: "clamp(7px,1.5vw,8.5px)" }}>
                <RoleIcon size={7} fill="currentColor" /> {special}
              </span>
            )}

            <h3
              className="w-full font-bold leading-tight text-center uppercase line-clamp-2"
              style={{ color: theme.nameColor, minHeight: "2.4em", fontSize: "clamp(9px,1.8vw,12.5px)" }}
            >
              {teacher.name}
            </h3>

            {teacher.subject ? (
              <span
                className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full font-bold tracking-wide max-w-full"
                style={{ background: theme.topBar, color: theme.nameColor, fontSize: "clamp(8px,1.5vw,10px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}
              >
                {teacher.subject}
              </span>
            ) : null}

            {!isLeadership && special && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold tracking-wide"
                style={{ background: "linear-gradient(135deg,#059669,#34d399)", color: "#fff", fontSize: "clamp(7px,1.5vw,8.5px)" }}>
                <Star size={7} fill="currentColor" /> {special}
              </span>
            )}

            <div className="w-full h-px" style={{
              background: isLeadership
                ? "linear-gradient(90deg,rgb(51,65,85),rgb(71,85,105),rgb(51,65,85))"
                : theme.divider,
              margin: "2px 0",
            }} />

            {/* Contact icons */}
            <div className="flex justify-center gap-1 sm:gap-1.5">
              {teacher.phone && (
                <span className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{ width: "clamp(22px,4.5vw,28px)", height: "clamp(22px,4.5vw,28px)", background: theme.iconBg, border: `1px solid ${theme.iconBorder}` }}>
                  <Phone size={10} style={{ color: theme.subjectColor }} />
                </span>
              )}
              {teacher.whatsapp && (
                <span className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{ width: "clamp(22px,4.5vw,28px)", height: "clamp(22px,4.5vw,28px)", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)" }}>
                  <MessageCircle size={10} className="text-green-400" />
                </span>
              )}
              {teacher.facebook && (
                <span className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{ width: "clamp(22px,4.5vw,28px)", height: "clamp(22px,4.5vw,28px)", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
                  <Facebook size={10} className="text-blue-400" />
                </span>
              )}
              {email && (
                <span className="flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{ width: "clamp(22px,4.5vw,28px)", height: "clamp(22px,4.5vw,28px)", background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.25)" }}>
                  <Mail size={10} style={{ color: "#d4a843" }} />
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

// ── COLLAPSIBLE GRID ───────────────────────────────────────
function CollapsibleGrid({
  teachers, onSelect, onPhotoSelect, isLeadership = false,
}: {
  teachers: Teacher[]; onSelect: (t: Teacher) => void; onPhotoSelect: (t: Teacher) => void; isLeadership?: boolean;
}) {
  const cols = useGridColumns(isLeadership);
  const ROW_SIZE = cols;
  const [expanded, setExpanded] = useState(false);
  const [hidingIndices, setHidingIndices] = useState<Set<number>>(new Set());
  const hasMore = teachers.length > ROW_SIZE;
  const gridRef = useRef<HTMLDivElement>(null);

  const renderAll = expanded || hidingIndices.size > 0;
  const displayed = renderAll ? teachers : teachers.slice(0, ROW_SIZE);

  const handleCollapse = useCallback(() => {
    if (!expanded) return;
    const extras = new Set(Array.from({ length: teachers.length - ROW_SIZE }, (_, k) => ROW_SIZE + k));
    setHidingIndices(extras);
    window.scrollTo({ top: gridRef.current?.offsetTop || 0, behavior: "smooth" });
    const maxDelay = (teachers.length - ROW_SIZE - 1) * 40 + 380;
    setTimeout(() => { setExpanded(false); setHidingIndices(new Set()); }, maxDelay);
  }, [expanded, teachers.length, ROW_SIZE]);

  // Reset when layout changes
  useEffect(() => { setExpanded(false); setHidingIndices(new Set()); }, [cols]);

  return (
    <div>
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: "clamp(8px,1.5vw,14px)",
        }}
      >
        {displayed.map((teacher, i) => {
          const isHiding = hidingIndices.has(i);
          return (
            <div key={teacher.id}
              style={isHiding ? {
                opacity: 0,
                transform: "translateY(18px) scale(0.93)",
                transition: `opacity 0.32s ${(i - ROW_SIZE) * 0.04}s ease, transform 0.32s ${(i - ROW_SIZE) * 0.04}s ease`,
                pointerEvents: "none",
              } : undefined}
            >
              <UnifiedCard
                teacher={teacher}
                onClick={() => onSelect(teacher)}
                onPhotoClick={() => onPhotoSelect(teacher)}
                index={i}
                isLeadership={isLeadership}
              />
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-5 sm:mt-6">
          <button type="button"
            onClick={() => { expanded ? handleCollapse() : setExpanded(true); }}
            className="flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,#1a3560,#0f2044)", color: "white", border: "1px solid rgba(212,168,67,0.3)" }}>
            {expanded
              ? <><ChevronUp size={15} /> Show Less</>
              : <><ChevronDown size={15} /> Show All {teachers.length} Teachers</>
            }
          </button>
        </div>
      )}
    </div>
  );
}

// ── SECTION HEADER ─────────────────────────────────────────────
function SectionHeader({
  label, icon, leftIcon, rightIcon, emoji, background, textColor, borderColor, hrColor,
}: {
  label: string; icon?: ReactNode; leftIcon?: ReactNode; rightIcon?: ReactNode;
  emoji?: string; background?: string; textColor?: string; borderColor?: string; hrColor?: string;
}) {
  const { ref, visible } = useReveal();
  const resolvedTextColor = textColor ?? "#1a3560";
  const resolvedBorderColor = borderColor ?? "rgba(26,53,96,0.1)";
  const resolvedHrColor = hrColor ?? "rgba(26,53,96,0.2)";
  return (
    <div ref={ref} className="flex items-center gap-3 mb-5 sm:gap-4 sm:mb-6"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(12px)", transition: "opacity 0.5s, transform 0.5s" }}>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${resolvedHrColor})` }} />
      <span
        className="flex items-center justify-center gap-2 font-bold tracking-widest uppercase px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap"
        style={{ background: background ?? "rgba(26,53,96,0.06)", color: resolvedTextColor, border: `1px solid ${resolvedBorderColor}`, fontSize: "clamp(9px,2vw,11px)" }}
      >
        {leftIcon || icon || emoji}
        {label}
        {rightIcon}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${resolvedHrColor})` }} />
    </div>
  );
}

// ── ANIMATED SECTION WRAPPER ───────────────────────────────────
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: `opacity 0.6s ${delay}s, transform 0.6s ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────
export default function Teachers() {
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [lightboxTeacher, setLightboxTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref: headerRef, visible: headerVisible } = useReveal();

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1J80cz9rN9rvfy_KjXc3WVvW4knrd9Na5iEljutLM_xU/Sheet1")
      .then((res) => { if (!res.ok) throw new Error("Network error"); return res.json(); })
      .then((data) => { setTeachers(data); setLoading(false); })
      .catch(() => { setError("Failed to load teachers. Please try again later."); setLoading(false); });
  }, []);

  const specialTeachers = teachers.filter((t) => getSpecial(t) !== "");
  const normalTeachers = teachers.filter((t) => getSpecial(t) === "");
  const topRoles = ["princip", "head", "vice"];
  const topTeachers = specialTeachers.filter((t) => topRoles.some((r) => getSpecial(t).toLowerCase().includes(r)));
  const otherSpecialTeachers = specialTeachers.filter((t) => !topRoles.some((r) => getSpecial(t).toLowerCase().includes(r)));
  const maleTeachers = normalTeachers.filter((t) => t.gender?.toLowerCase() === "male");
  const femaleTeachers = normalTeachers.filter((t) => t.gender?.toLowerCase() === "female");

  const selectedTheme = selected ? (() => {
    const special = getSpecial(selected);
    const isLeadership = topTeachers.some((t) => t.id === selected.id);
    return getCardTheme(selected.gender, !!special && !isLeadership, isLeadership);
  })() : null;
  const selectedIsLeadership = selected ? topTeachers.some((t) => t.id === selected.id) : false;

  const lightboxTheme = lightboxTeacher ? (() => {
    const special = getSpecial(lightboxTeacher);
    const isLeadership = topTeachers.some((t) => t.id === lightboxTeacher.id);
    return getCardTheme(lightboxTeacher.gender, !!special && !isLeadership, isLeadership);
  })() : null;
  const lightboxIsLeadership = lightboxTeacher ? topTeachers.some((t) => t.id === lightboxTeacher.id) : false;

  return (
    <section id="teachers" className="py-12 sm:py-20"
      style={{ background: "linear-gradient(180deg,#f4f6fb 0%,#eef1f8 100%)" }}>
      <div className="px-3 mx-auto sm:px-4 max-w-7xl lg:px-6">

        {/* Header */}
        <div ref={headerRef} className="mb-10 text-center sm:mb-14"
          style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? "none" : "translateY(-16px)", transition: "opacity 0.7s, transform 0.7s" }}>
          <p className="mb-2 text-xs font-bold tracking-widest uppercase" style={{ color: "#d4a843" }}>Our Faculty</p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl" style={{ color: "#1a3560" }}>
            Meet Our Educators
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3 mb-4">
            <div className="w-12 h-px" style={{ background: "linear-gradient(to right,transparent,#d4a843)" }} />
            <Star size={12} style={{ color: "#d4a843" }} fill="#d4a843" />
            <div className="w-12 h-px" style={{ background: "linear-gradient(to left,transparent,#d4a843)" }} />
          </div>
          <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: "#64748b" }}>
            Our team of dedicated professionals brings decades of expertise and genuine passion to every classroom.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: "rgba(212,168,67,0.2)" }} />
              <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: "#d4a843" }} />
            </div>
            <span className="text-sm font-medium" style={{ color: "#64748b" }}>Loading teachers…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="py-10 text-center">
            <p className="inline-block px-6 py-3 text-sm text-red-500 border border-red-100 bg-red-50 rounded-2xl">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-10 sm:space-y-14">

            {topTeachers.length > 0 && (
              <RevealSection>
                <SectionHeader
                  label="School Leadership"
                  leftIcon={<Crown size={14} style={{ color: "#fff" }} fill="#fff" />}
                  rightIcon={<Crown size={14} style={{ color: "#fff" }} fill="#fff" />}
                  background={LEADERSHIP_THEME.bg}
                  textColor="#fff"
                  borderColor="rgba(255,255,255,0.16)"
                  hrColor="rgba(71,85,105,0.55)"
                />
                <CollapsibleGrid teachers={topTeachers} onSelect={setSelected} onPhotoSelect={setLightboxTeacher} isLeadership />
              </RevealSection>
            )}

            {otherSpecialTeachers.length > 0 && (
              <RevealSection delay={0.1}>
                <SectionHeader label="Special Staff" emoji="⭐" hrColor="rgba(5,150,105,0.45)" />
                <CollapsibleGrid teachers={otherSpecialTeachers} onSelect={setSelected} onPhotoSelect={setLightboxTeacher} />
              </RevealSection>
            )}

            {maleTeachers.length > 0 && (
              <RevealSection delay={0.15}>
                <SectionHeader
                  label="Male Teachers"
                  icon={<Mars size={16} style={{ color: "#fff" }} />}
                  background={MALE_THEME.bg}
                  textColor="#fff"
                  borderColor="rgba(255,255,255,0.16)"
                  hrColor="rgba(37,99,235,0.45)"
                />
                <CollapsibleGrid teachers={maleTeachers} onSelect={setSelected} onPhotoSelect={setLightboxTeacher} />
              </RevealSection>
            )}

            {femaleTeachers.length > 0 && (
              <RevealSection delay={0.2}>
                <SectionHeader
                  label="Female Teachers"
                  icon={<Venus size={16} style={{ color: "#fff" }} />}
                  background={FEMALE_THEME.bg}
                  textColor="#fff"
                  borderColor="rgba(255,255,255,0.16)"
                  hrColor="rgba(124,58,237,0.45)"
                />
                <CollapsibleGrid teachers={femaleTeachers} onSelect={setSelected} onPhotoSelect={setLightboxTeacher} />
              </RevealSection>
            )}

          </div>
        )}
      </div>

      {selected && (
        <TeacherModal
          teacher={selected}
          onClose={() => setSelected(null)}
          onPhotoClick={() => setLightboxTeacher(selected)}
          theme={selectedTheme}
          isLeadership={selectedIsLeadership}
        />
      )}
      {lightboxTeacher && (
        <PhotoLightbox
          src={getImageUrl(lightboxTeacher.image, lightboxTeacher.name)}
          name={lightboxTeacher.name}
          subject={lightboxTeacher.subject}
          theme={lightboxTheme}
          isLeadership={lightboxIsLeadership}
          onClose={() => setLightboxTeacher(null)}
        />
      )}
    </section>
  );
}
