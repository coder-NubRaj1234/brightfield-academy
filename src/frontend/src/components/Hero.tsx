import { useEffect, useState, useCallback, useRef } from "react";

const API_URL =
  "https://opensheet.elk.sh/1_nnKqYJVIO6E_lWXqNwCiQEgL1OEZViPK9NFptO8M2I/sheet1";

interface SlideData {
  H1: string;
  H2: string;
  H3: string;
  IMAGE: string;
}

const SLIDE_DURATION = 6000;
const TRANSITION_MS = 600;

export default function Hero() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [h1, setH1] = useState("");
  const [h2Lines, setH2Lines] = useState<string[]>([]);
  const [h3, setH3] = useState("");
  const [current, setCurrent] = useState(0);
  const [entering, setEntering] = useState(-1);
  const [leaving, setLeaving] = useState(-1);
  const [contentKey, setContentKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transRef = useRef(false);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data: SlideData[]) => {
        if (!data?.length) return;
        setH1(data[0].H1 || "");
        setH2Lines((data[0].H2 || "").split(/\r?\n/).filter(Boolean));
        setH3(data[0].H3 || "");
        setSlides(data.filter((d) => d.IMAGE));
      });
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        if (!transRef.current) {
          const next = (c + 1) % slides.length;
          transRef.current = true;
          setLeaving(c);
          setEntering(next);
          setTimeout(() => {
            setCurrent(next);
            setLeaving(-1);
            setEntering(-1);
            setContentKey((k) => k + 1);
            transRef.current = false;
          }, TRANSITION_MS);
        }
        return c;
      });
    }, SLIDE_DURATION);
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const goTo = useCallback(
    (i: number) => {
      if (i === current) return;
      transRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      setLeaving(current);
      setEntering(i);
      transRef.current = true;
      setTimeout(() => {
        setCurrent(i);
        setLeaving(-1);
        setEntering(-1);
        setContentKey((k) => k + 1);
        transRef.current = false;
        startTimer();
      }, TRANSITION_MS);
    },
    [current, startTimer]
  );

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const isMulti = slides.length > 1;

  return (
    <>
      <style>{`
        @keyframes kb1 {
          0%   { transform: scale(1.0) translate(0px,0px); }
          100% { transform: scale(1.1) translate(-15px,-8px); }
        }
        @keyframes kb2 {
          0%   { transform: scale(1.1) translate(-15px,-8px); }
          100% { transform: scale(1.0) translate(8px,4px); }
        }
        @keyframes kb3 {
          0%   { transform: scale(1.04) translate(8px,4px); }
          100% { transform: scale(1.1) translate(-8px,6px); }
        }
        @keyframes kb4 {
          0%   { transform: scale(1.1) translate(-8px,6px); }
          100% { transform: scale(1.03) translate(12px,-4px); }
        }
        @keyframes slideIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes slideOut {
          from { opacity:1; } to { opacity:0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes expandLine {
          from { width:0; opacity:0; } to { width:50px; opacity:1; }
        }
        @keyframes expandCenter {
          from { transform:scaleX(0); opacity:0; }
          to   { transform:scaleX(1); opacity:1; }
        }
        @keyframes goldShimmer {
          0%   { background-position:-400px center; }
          100% { background-position:400px center; }
        }
        @keyframes progressFill {
          from { transform:scaleX(0); } to { transform:scaleX(1); }
        }
        @keyframes scrollBounce {
          0%,100% { transform:translateY(0); opacity:1; }
          50%      { transform:translateY(10px); opacity:0.25; }
        }
        @keyframes btnShine {
          0%   { left:-100%; } 100% { left:200%; }
        }
        .hbg { position:relative; overflow:hidden; }
        .hbg::after {
          content:''; position:absolute; top:0; left:-100%;
          width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);
          transform:skewX(-20deg);
        }
        .hbg:hover::after { animation:btnShine 0.5s ease forwards; }
      `}</style>

      <section
        id="home"
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: 64,
          boxSizing: "border-box",
        }}
      >
        {/* ── BG slides ── */}
        {slides.map((slide, i) => {
          const isActive = i === current && entering === -1;
          const isEntering = i === entering;
          const isLeaving = i === leaving;
          if (!isActive && !isEntering && !isLeaving) return null;
          const kb = ["kb1","kb2","kb3","kb4"][i % 4];
          return (
            <div
              key={slide.IMAGE}
              style={{
                position:"absolute", inset:0,
                zIndex: isEntering ? 2 : 1,
                animation: isEntering
                  ? `slideIn ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1) forwards`
                  : isLeaving
                  ? `slideOut ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1) forwards`
                  : "none",
                opacity: isActive ? 1 : undefined,
              }}
            >
              <div style={{
                position:"absolute", inset:"-5%",
                backgroundImage:`url('${slide.IMAGE}')`,
                backgroundSize:"cover", backgroundPosition:"center",
                animation:`${kb} ${SLIDE_DURATION + TRANSITION_MS}ms ease-in-out forwards`,
              }} />
            </div>
          );
        })}

        {/* ── Overlays ── */}
        <div style={{ position:"absolute",inset:0,zIndex:5,background:"rgba(5,10,30,0.5)" }} />
        <div style={{ position:"absolute",inset:0,zIndex:5,background:"linear-gradient(to top,rgba(0,0,15,0.8) 0%,rgba(0,0,15,0.25) 40%,transparent 70%)" }} />
        <div style={{ position:"absolute",inset:0,zIndex:5,background:"linear-gradient(to bottom,rgba(0,0,15,0.35) 0%,transparent 25%)" }} />
        <div style={{ position:"absolute",inset:0,zIndex:5,background:"radial-gradient(ellipse at center,transparent 45%,rgba(0,0,20,0.5) 100%)" }} />

        {/* ── Content ── */}
        <div
          key={contentKey}
          style={{
            position:"relative", zIndex:10,
            textAlign:"center",
            maxWidth:820, margin:"0 auto",
            padding:"0 20px",
            color:"#fff",
            display:"flex", flexDirection:"column", alignItems:"center",
          }}
        >
          {/* Accent dots row */}
          <div style={{
            display:"flex", alignItems:"center", gap:12, marginBottom:12,
            animation:"fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) 0.1s both",
          }}>
            <span style={{ display:"inline-block",height:1,background:"linear-gradient(to right,transparent,rgba(212,160,23,0.8))",animation:"expandLine 0.6s ease 0.15s both" }} />
            <span style={{ width:5,height:5,borderRadius:"50%",background:"#d4a017",display:"inline-block",boxShadow:"0 0 6px 2px rgba(212,160,23,0.5)" }} />
            <span style={{ width:5,height:5,borderRadius:"50%",background:"rgba(212,160,23,0.4)",display:"inline-block" }} />
            <span style={{ display:"inline-block",height:1,background:"linear-gradient(to left,transparent,rgba(212,160,23,0.8))",animation:"expandLine 0.6s ease 0.15s both" }} />
          </div>

          {/* H1 tagline */}
          {h1 && (
            <p style={{
              fontSize:"clamp(12px,1.5vw,14px)", fontWeight:600,
              letterSpacing:"0.32em", textTransform:"uppercase", marginBottom:12,
              background:"linear-gradient(90deg,#b8860b 0%,#f5c842 30%,#fffacd 50%,#f5c842 70%,#b8860b 100%)",
              backgroundSize:"400px 100%",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              animation:"fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) 0.18s both, goldShimmer 4s linear 1s infinite",
            }}>
              {h1}
            </p>
          )}

          {/* H2 school name */}
          <h1 style={{ fontWeight:800, lineHeight:1.12, margin:0, fontSize:"clamp(2rem,5.5vw,3.5rem)" }}>
            {h2Lines[0] && (
              <span style={{
                display:"block", color:"#fff", letterSpacing:"0.05em",
                textShadow:"0 2px 30px rgba(0,0,0,0.6)",
                animation:"fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.28s both",
              }}>
                {h2Lines[0]}
              </span>
            )}
            {h2Lines[1] && (
              <span style={{
                display:"block",
                background:"linear-gradient(90deg,#c8940a 0%,#f5c842 40%,#ffeaa0 55%,#f5c842 70%,#c8940a 100%)",
                backgroundSize:"400px 100%",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                letterSpacing:"0.08em", fontSize:"0.75em", marginTop:4,
                animation:"fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.38s both, goldShimmer 5s linear 1.5s infinite",
              }}>
                {h2Lines[1]}
              </span>
            )}
          </h1>

          {/* Divider */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:8, margin:"14px auto 14px",
            animation:"expandCenter 0.6s cubic-bezier(0.4,0,0.2,1) 0.46s both",
            transformOrigin:"center",
          }}>
            <span style={{ flex:1,maxWidth:60,height:"0.5px",background:"rgba(255,255,255,0.22)" }} />
            <span style={{ width:3,height:3,borderRadius:"50%",background:"rgba(255,255,255,0.35)",display:"inline-block" }} />
            <span style={{ width:26,height:1.5,borderRadius:2,background:"linear-gradient(90deg,#d4a017,#f5c842)" }} />
            <span style={{
              padding:"2px 10px", border:"0.5px solid rgba(212,160,23,0.45)",
              borderRadius:2, fontSize:8, letterSpacing:"0.22em",
              color:"rgba(212,160,23,0.8)", textTransform:"uppercase", fontWeight:600,
            }}>Est. 1998</span>
            <span style={{ width:26,height:1.5,borderRadius:2,background:"linear-gradient(90deg,#f5c842,#d4a017)" }} />
            <span style={{ width:3,height:3,borderRadius:"50%",background:"rgba(255,255,255,0.35)",display:"inline-block" }} />
            <span style={{ flex:1,maxWidth:60,height:"0.5px",background:"rgba(255,255,255,0.22)" }} />
          </div>

          {/* H3 */}
          {h3 && (
            <p style={{
              maxWidth:560, margin:"0 auto 20px",
              fontSize:"clamp(14px,1.8vw,17px)", lineHeight:1.7,
              color:"rgba(215,220,230,0.88)", fontWeight:400,
              textShadow:"0 1px 16px rgba(0,0,0,0.5)",
              animation:"fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.54s both",
            }}>
              {h3}
            </p>
          )}

          {/* Buttons — equal width via fixed 160px */}
          <div style={{
            display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap",
            marginBottom: 0,
            animation:"fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.64s both",
          }}>
            <button
              type="button"
              className="hbg"
              onClick={() => scrollTo("about")}
              style={{
                width: 160,
                padding:"11px 0",
                background:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.32)",
                color:"#fff", fontWeight:700, fontSize:11,
                letterSpacing:"0.18em", textTransform:"uppercase",
                borderRadius:3, cursor:"pointer",
                transition:"background 0.22s, border-color 0.22s, transform 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Discover More
            </button>

            <button
              type="button"
              className="hbg"
              onClick={() => scrollTo("contact")}
              style={{
                width: 160,
                padding:"11px 0",
                background:"linear-gradient(135deg,#c8940a 0%,#e8b820 45%,#f5c842 60%,#d4a017 100%)",
                border:"none", color:"#1a0d00", fontWeight:800, fontSize:11,
                letterSpacing:"0.18em", textTransform:"uppercase",
                borderRadius:3, cursor:"pointer",
                transition:"transform 0.18s, box-shadow 0.22s",
                boxShadow:"0 3px 16px rgba(212,160,23,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 7px 28px rgba(212,160,23,0.52)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 3px 16px rgba(212,160,23,0.35)";
              }}
            >
              Apply Now
            </button>
          </div>

          {/* Radio pills — 20px below buttons */}
          {isMulti && (
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:7,
              marginTop: 20,
              animation:"fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.76s both",
            }}>
              {slides.map((_,i) => {
                const isActive = i === current;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i+1}`}
                    onClick={() => goTo(i)}
                    style={{
                      position:"relative",
                      width: isActive ? 38 : 7,
                      height: 7,
                      borderRadius: 4,
                      border:"none", padding:0,
                      cursor: isActive ? "default" : "pointer",
                      background: isActive ? "transparent" : "rgba(255,255,255,0.3)",
                      transition:"width 0.3s cubic-bezier(0.4,0,0.2,1), background 0.25s",
                      overflow:"hidden",
                    }}
                  >
                    {isActive && (
                      <>
                        <span style={{ position:"absolute",inset:0,borderRadius:4,background:"rgba(255,255,255,0.18)" }} />
                        <span
                          key={`f-${current}`}
                          style={{
                            position:"absolute",top:0,left:0,
                            height:"100%",width:"100%",borderRadius:4,
                            background:"linear-gradient(90deg,#d4a017,#f5c842)",
                            transformOrigin:"left center",
                            animation:`progressFill ${SLIDE_DURATION}ms linear forwards`,
                          }}
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Slide counter top-right ── */}
        {isMulti && (
          <div style={{
            position:"absolute", top:80, right:24, zIndex:15,
            display:"flex", alignItems:"center", gap:5,
          }}>
            <span style={{ fontSize:19,fontWeight:800,color:"#f5c842",lineHeight:1,fontVariantNumeric:"tabular-nums" }}>
              {String(current+1).padStart(2,"0")}
            </span>
            <div style={{ display:"flex",flexDirection:"column",gap:3 }}>
              {slides.map((_,i) => (
                <div key={i} style={{
                  width:16, height:"1.5px",
                  background: i===current ? "#f5c842" : "rgba(255,255,255,0.28)",
                  borderRadius:1, transition:"background 0.4s",
                }} />
              ))}
            </div>
            <span style={{ fontSize:11,fontWeight:500,color:"rgba(255,255,255,0.4)",lineHeight:1,fontVariantNumeric:"tabular-nums" }}>
              {String(slides.length).padStart(2,"0")}
            </span>
          </div>
        )}

        {/* ── Prev/Next arrows bottom-right ── */}
        {isMulti && (
          <div style={{ position:"absolute",bottom:20,right:24,zIndex:15,display:"flex",gap:7 }}>
            {[{ dir:-1,path:"M14 7L8 13L14 19" },{ dir:1,path:"M8 7L14 13L8 19" }].map(({ dir,path }) => (
              <button
                key={dir}
                type="button"
                onClick={() => goTo((current+dir+slides.length)%slides.length)}
                style={{
                  width:36,height:36,borderRadius:3,
                  border:"1px solid rgba(255,255,255,0.22)",
                  background:"rgba(255,255,255,0.07)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"pointer",
                  transition:"background 0.18s,border-color 0.18s,transform 0.14s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background="rgba(212,160,23,0.22)";
                  e.currentTarget.style.borderColor="rgba(212,160,23,0.65)";
                  e.currentTarget.style.transform="scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background="rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor="rgba(255,255,255,0.22)";
                  e.currentTarget.style.transform="scale(1)";
                }}
              >
                <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                  <path d={path} stroke="rgba(255,255,255,0.78)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* ── Scroll indicator bottom-left ── */}
        <div style={{
          position:"absolute", bottom:20, left:24, zIndex:15,
          display:"flex",flexDirection:"column",alignItems:"center",gap:5,
        }}>
          <div style={{
            width:1,height:34,
            background:"linear-gradient(to bottom,transparent,rgba(212,160,23,0.65))",
            animation:"scrollBounce 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize:8,letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)" }}>
            Scroll
          </span>
        </div>
      </section>
    </>
  );
}