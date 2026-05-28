import { useState } from "react";
import { Mail, MessageSquare, Phone, CheckCircle } from "lucide-react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold mb-3">Contact Support</h1>
          <p className="text-muted-foreground text-lg">Have a question or need help? We're here for you.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-muted-foreground">
            Whether you have a bug report, a feature request, or just need help using Symptom Scribe — our support team will get back to you within 24 hours.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Email Support</p>
                <p className="text-muted-foreground text-sm">support@symptomscribe.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Response Time</p>
                <p className="text-muted-foreground text-sm">Within 24 hours on weekdays</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h3 className="text-xl font-semibold">Message Sent!</h3>
              <p className="text-muted-foreground text-sm">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">Send us a message</h3>
              <div>
                <label className="text-sm font-medium block mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select a topic</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                  placeholder="Describe your issue or question..."
                  className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <button onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Send Message
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
