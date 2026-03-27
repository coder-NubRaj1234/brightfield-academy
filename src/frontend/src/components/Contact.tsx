import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (f: FormState): FormErrors => {
    const e: FormErrors = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = "Enter a valid email address";
    if (!f.message.trim()) e.message = "Message is required";
    else if (f.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validate(updated));
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTouched({});
    }, 1200);
  };

  const inputClass = (field: keyof FormState) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
      touched[field] && errors[field]
        ? "border-red-400 focus:ring-red-300 bg-red-50"
        : touched[field] && !errors[field]
          ? "border-green-400 focus:ring-green-300 bg-green-50"
          : "border-gray-200 focus:ring-school-navy/30"
    }`;

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal">
          <p className="text-school-gold font-semibold uppercase tracking-widest text-sm mb-2">
            Contact Us
          </p>
          <h2 className="text-3xl font-bold uppercase text-school-navy">
            Get In Touch
          </h2>
          <p className="text-school-muted mt-3 max-w-xl mx-auto text-sm">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="reveal-left">
            {submitted ? (
              <div
                data-ocid="contact.success_state"
                className="h-full flex flex-col items-center justify-center py-16 text-center"
              >
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-school-navy mb-2">
                  Message Sent!
                </h3>
                <p className="text-school-muted text-sm">
                  Thank you for contacting us. We&apos;ll get back to you within
                  24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-school-gold font-semibold text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                data-ocid="contact.modal"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wide text-school-navy mb-1.5"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    data-ocid="contact.name.input"
                    type="text"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={inputClass("name")}
                  />
                  {touched.name && errors.name && (
                    <p
                      data-ocid="contact.name_error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wide text-school-navy mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    data-ocid="contact.email.input"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={inputClass("email")}
                  />
                  {touched.email && errors.email && (
                    <p
                      data-ocid="contact.email_error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold uppercase tracking-wide text-school-navy mb-1.5"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    data-ocid="contact.message.textarea"
                    rows={5}
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    className={`${inputClass("message")} resize-none`}
                  />
                  {touched.message && errors.message && (
                    <p
                      data-ocid="contact.field_error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  data-ocid="contact.submit_button"
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-school-navy text-white font-bold uppercase tracking-wide py-3 rounded-lg hover:bg-blue-900 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-70"
                >
                  {submitting ? (
                    <span className="animate-spin-loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send size={16} />
                  )}
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="reveal-right space-y-6">
            <div className="bg-school-lightgray rounded-2xl p-8 space-y-6">
              {[
                {
                  icon: MapPin,
                  label: "Our Address",
                  value: "14, Nehru Vihar, Timarpur,\nDelhi – 110054, India",
                },
                {
                  icon: Phone,
                  label: "Phone Number",
                  value: "+91 11 2345 6789\n+91 98765 43210",
                },
                {
                  icon: Mail,
                  label: "Email Address",
                  value: "info@brightfuture.edu\nadmissions@brightfuture.edu",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-12 h-12 bg-school-navy rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-school-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-school-muted mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-school-text font-medium whitespace-pre-line">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-school-lightgray rounded-2xl overflow-hidden h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-school-navy mx-auto mb-2" />
                <p className="text-sm text-school-muted font-medium">
                  Delhi – 110054, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
