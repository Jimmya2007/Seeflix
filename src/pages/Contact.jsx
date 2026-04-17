import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [form, setForm]   = useState({ name: '', email: '', message: '' });
  const [sent, setSent]   = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.sub}>Questions, feedback, or just want to say hello?</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.formWrap}>
            {sent ? (
              <div className={styles.success}>
                <span>✅</span>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. We'll get back to you soon.</p>
                <button onClick={() => { setSent(false); setForm({ name:'', email:'', message:'' }); }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className={styles.form}>
                <div className={styles.field}>
                  <label>Your Name</label>
                  <input
                    type="text" name="name" required
                    placeholder="John Doe"
                    value={form.name} onChange={handle}
                  />
                </div>
                <div className={styles.field}>
                  <label>Email Address</label>
                  <input
                    type="email" name="email" required
                    placeholder="john@example.com"
                    value={form.email} onChange={handle}
                  />
                </div>
                <div className={styles.field}>
                  <label>Message</label>
                  <textarea
                    name="message" required rows="5"
                    placeholder="Your message..."
                    value={form.message} onChange={handle}
                  />
                </div>
                <button type="submit" className={styles.submit}>Send Message</button>
              </form>
            )}
          </div>

          <div className={styles.info}>
            {[
              { icon: '📧', label: 'Email',   value: 'contact@seeflix.com' },
              { icon: '📱', label: 'Phone',   value: '(+509) 3215-0000' },
              { icon: '📍', label: 'Address', value: 'rue Metellus, Pétion-Ville #30' },
            ].map(i => (
              <div key={i.label} className={styles.infoCard}>
                <span className={styles.infoIcon}>{i.icon}</span>
                <div>
                  <p className={styles.infoLabel}>{i.label}</p>
                  <p className={styles.infoValue}>{i.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
