import emailjs from "@emailjs/browser";
import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";

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

interface SchoolInfo {
  School_Address: string;
  "School_Phone_Number_Primary ": string;
  School_Phone_Number_Secondary: string;
  School_Address_Map_URL: string;
  School_Email_Address_Primary: string;
  School_Email_Address_Secondary: string;
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
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);

  // ✅ Fetch school info from API
  useEffect(() => {
    fetch(
      "https://opensheet.elk.sh/1HfA4gg_fyUkrgWRpRdvX71WDAso5aoUGVJ6JTae47iQ/School_Info_for_Contact_Section"
    )
      .then((res) => res.json())
      .then((data) => setSchoolInfo(data[0]))
      .catch((err) => console.error("Failed to fetch school info:", err));
  }, []);

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

    emailjs
      .send(
        "service_6dekmtf",
        "template_zeuxvth",
        {
          name: form.name,
          email: form.email,
          message: form.message,
          time: new Date().toLocaleString(),
        },
        "3cwUjPIsF0gKXOm_U"
      )
      .then(() => {
        setSubmitting(false);
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
        setTouched({});
      })
      .catch(() => {
        setSubmitting(false);
        alert("Something went wrong. Please try again.");
      });
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
    <section id="contact" className="py-20 bg-white ">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="mb-12 text-center reveal">
          <p className="mb-2 text-sm font-semibold tracking-widest uppercase text-school-gold">
            Contact Us
          </p>
          <h2 className="text-3xl font-bold uppercase text-school-navy">
            Get In Touch
          </h2>
          <p className="max-w-xl mx-auto mt-3 text-sm text-school-muted">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* ── Left: Form ── */}
          <div className="reveal-left">
            {submitted ? (
              <div
                data-ocid="contact.success_state"
                className="flex flex-col items-center justify-center h-full py-16 text-center"
              >
                <CheckCircle size={64} className="mb-4 text-green-500" />
                <h3 className="mb-2 text-xl font-bold text-school-navy">
                  Message Sent!
                </h3>
                <p className="text-sm text-school-muted">
                  Thank you for contacting us. We&apos;ll get back to you within
                  24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-school-gold hover:underline"
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
                      className="mt-1 text-xs text-red-500"
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
                      className="mt-1 text-xs text-red-500"
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
                      className="mt-1 text-xs text-red-500"
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
                    <span className="inline-block w-4 h-4 border-2 border-white rounded-full animate-spin-loader border-t-transparent" />
                  ) : (
                    <Send size={16} />
                  )}
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* ── Right: Info + Map ── */}
          <div className="space-y-6 reveal-right">
            {/* Contact Info Cards */}
            <div className="p-8 space-y-6 bg-school-lightgray rounded-2xl">
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-school-navy rounded-xl">
                  <MapPin size={20} className="text-school-gold" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-school-muted">
                    Our Address
                  </p>
                  <p className="text-sm font-medium text-school-text">
                    {schoolInfo?.School_Address ?? "Loading..."}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-school-navy rounded-xl">
                  <Phone size={20} className="text-school-gold" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-school-muted">
                    Phone Number
                  </p>
              <p className="text-sm font-medium text-school-text">
  {schoolInfo?.["School_Phone_Number_Primary "] ?? "Loading..."}
</p>
<p className="text-sm font-medium text-school-text">
  {schoolInfo?.School_Phone_Number_Secondary ?? ""}
</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-school-navy rounded-xl">
                  <Mail size={20} className="text-school-gold" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wide uppercase text-school-muted">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-school-text">
                    {schoolInfo?.School_Email_Address_Primary ?? "Loading..."}
                  </p>
                  <p className="text-sm font-medium text-school-text">
                    {schoolInfo?.School_Email_Address_Secondary ?? ""}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Google Map Embed */}
            <div className="h-56 overflow-hidden rounded-2xl bg-school-lightgray">
              {schoolInfo ? (
                <iframe
                  title="School Location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    schoolInfo.School_Address,
                  )}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MapPin
                      size={32}
                      className="mx-auto mb-2 text-school-navy"
                    />
                    <p className="text-sm font-medium text-school-muted">
                      Loading map...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Open in Google Maps button */}
            {schoolInfo && (
              <a
                href={schoolInfo.School_Address_Map_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-school-navy text-school-navy text-sm font-semibold hover:bg-school-navy hover:text-white transition-all duration-200"
              >
                <MapPin size={16} />
                Open in Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


