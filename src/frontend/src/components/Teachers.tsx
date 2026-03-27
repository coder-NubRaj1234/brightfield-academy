import { Briefcase, GraduationCap, Mail, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Teacher, teachers } from "../data/schoolData";

function TeacherModal({
  teacher,
  onClose,
}: { teacher: Teacher; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropInteract = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      data-ocid="teachers.modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={handleBackdropInteract}
      onKeyDown={handleBackdropInteract}
      aria-modal="true"
      aria-label={`${teacher.name} details`}
    >
      <div
        ref={modalRef}
        className="animate-modal-in bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-school-navy p-6 text-white text-center relative">
          <button
            type="button"
            data-ocid="teachers.modal.close_button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={16} />
          </button>
          <img
            src={teacher.photo}
            alt={teacher.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-school-gold"
          />
          <h3 className="text-xl font-bold">{teacher.name}</h3>
          <p className="text-school-gold font-medium text-sm mt-1">
            {teacher.subject}
          </p>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-school-muted text-sm leading-relaxed">
            {teacher.bio}
          </p>
          <div className="space-y-3">
            {[
              { icon: GraduationCap, label: "Faculty", value: teacher.faculty },
              {
                icon: Briefcase,
                label: "Experience",
                value: teacher.experience,
              },
              {
                icon: GraduationCap,
                label: "Education",
                value: teacher.education,
              },
              { icon: Mail, label: "Email", value: teacher.email },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon
                  size={16}
                  className="text-school-gold mt-0.5 flex-shrink-0"
                />
                <div>
                  <span className="text-xs text-school-muted font-medium uppercase tracking-wide">
                    {label}
                  </span>
                  <p className="text-sm text-school-text font-medium">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Teachers() {
  const [selected, setSelected] = useState<Teacher | null>(null);

  return (
    <section id="teachers" className="py-20 bg-school-lightgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal">
          <p className="text-school-gold font-semibold uppercase tracking-widest text-sm mb-2">
            Our Faculty
          </p>
          <h2 className="text-3xl font-bold uppercase text-school-navy">
            Meet Our Educators
          </h2>
          <p className="text-school-muted mt-3 max-w-xl mx-auto text-sm">
            Our team of dedicated professionals brings decades of expertise and
            genuine passion to every classroom.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {teachers.map((teacher, i) => (
            <button
              type="button"
              key={teacher.id}
              data-ocid={`teachers.item.${i + 1}`}
              onClick={() => setSelected(teacher)}
              className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 cursor-pointer transition-all duration-300 reveal text-left"
              style={{ transitionDelay: `${(i % 8) * 60}ms` }}
            >
              <div className="overflow-hidden h-48 sm:h-52">
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-school-text text-sm leading-tight mb-1">
                  {teacher.name}
                </h3>
                <p className="text-school-muted text-xs">{teacher.subject}</p>
                <span className="mt-2 inline-block text-xs bg-school-navy/5 text-school-navy px-2 py-0.5 rounded-full font-medium">
                  {teacher.faculty}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <TeacherModal teacher={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
