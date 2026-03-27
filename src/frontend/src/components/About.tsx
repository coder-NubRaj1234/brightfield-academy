import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Founded", value: 1998, suffix: "", icon: BookOpen },
  { label: "Students", value: 3200, suffix: "+", icon: GraduationCap },
  { label: "Teachers", value: 120, suffix: "+", icon: Users },
  { label: "Awards", value: 85, suffix: "+", icon: Award },
];

function AnimatedCounter({
  target,
  suffix,
}: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / 60);
          const interval = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(start);
            }
          }, 25);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="reveal-left">
            <p className="text-school-gold font-semibold uppercase tracking-widest text-sm mb-3">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-school-navy uppercase mb-6 leading-tight">
              Shaping Futures,
              <br />
              <span className="text-school-gold">Building Character</span>
            </h2>
            <p className="text-school-muted leading-relaxed mb-4">
              Established in 1998, Bright Future Senior Secondary School has
              been a beacon of quality education in the heart of New Delhi. Our
              CBSE-affiliated institution combines rigorous academics with
              values-based character development.
            </p>
            <p className="text-school-muted leading-relaxed mb-6">
              We believe every child possesses unique potential. Our dedicated
              faculty of over 120 teachers work tirelessly to identify and
              nurture that potential, preparing students not just for
              examinations, but for life&apos;s greater challenges.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "CBSE Affiliated – School No. 2730456",
                "State Board Topper 8 years in a row",
                "ISO 9001:2015 certified institution",
                "Fully equipped science & computer labs",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-school-text"
                >
                  <span className="w-5 h-5 rounded-full bg-school-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-school-gold" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              data-ocid="about.learn_more.button"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-school-navy text-white font-bold uppercase tracking-wide px-7 py-3 rounded hover:bg-blue-900 hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              Get in Touch
            </button>
          </div>

          <div className="reveal-right">
            <div className="relative">
              <img
                src="/assets/generated/school-hero.dim_1920x1080.jpg"
                alt="School campus"
                className="w-full h-72 sm:h-96 object-cover rounded-2xl shadow-card-hover"
              />
              <div className="absolute -bottom-6 -left-6 bg-school-gold text-white p-5 rounded-xl shadow-xl">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-xs font-semibold uppercase tracking-wide">
                  Years of Excellence
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {stats.map(({ label, value, suffix, icon: Icon }) => (
                <div
                  key={label}
                  className="text-center bg-school-lightgray rounded-xl p-4"
                >
                  <Icon size={22} className="text-school-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-school-navy">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </div>
                  <div className="text-xs text-school-muted font-medium uppercase tracking-wide">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
