import React from 'react';
import algiersImg from '../assets/algiers.jpg';

const WebIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
  };

  const contactInfo = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'EMAIL',
      value: 'algeriawander@gmail.com',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'PHONE',
      value: '+213 551 35 0989',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'OFFICE',
      value: 'ESTIN, Amizour, Béjaïa, Algérie',
    },
  ];

  const socialLinks = [
    { label: 'Website', href: '#', Icon: WebIcon },
    { label: 'Instagram', href: 'https://instagram.com/algeriawander', Icon: InstagramIcon },
    { label: 'YouTube', href: 'https://youtube.com/@algeriawander', Icon: YouTubeIcon },
  ];

  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-[#0F4C81] text-6xl font-extrabold tracking-tight">Get in Touch</h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you're planning your next Saharan adventure or seeking recommendations for the Mediterranean coast, our team is here to assist you. Drop us a message below.
          </p>
        </div>

        {/* Form + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">

          {/* Contact Form */}
          <section className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-50 space-y-12">
            <h2 className="text-[#0F4C81] text-3xl font-bold">Send a Message</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[#0F4C81] text-xs font-bold uppercase tracking-widest ml-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Tariq El-Amin"
                  className="w-full bg-[#F8FAFF] rounded-2xl py-4 px-8 text-sm outline-none border border-transparent focus:border-[#006699] transition-all shadow-inner"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[#0F4C81] text-xs font-bold uppercase tracking-widest ml-2">Email Address</label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full bg-[#F8FAFF] rounded-2xl py-4 px-8 text-sm outline-none border border-transparent focus:border-[#006699] transition-all shadow-inner"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[#0F4C81] text-xs font-bold uppercase tracking-widest ml-2">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  className="w-full bg-[#F8FAFF] rounded-2xl py-4 px-8 text-sm outline-none border border-transparent focus:border-[#006699] transition-all shadow-inner"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[#0F4C81] text-xs font-bold uppercase tracking-widest ml-2">Message</label>
                <textarea
                  rows={6}
                  placeholder="Tell us about your travel plans..."
                  className="w-full bg-[#F8FAFF] rounded-3xl py-6 px-8 text-sm outline-none border border-transparent focus:border-[#006699] transition-all shadow-inner resize-none leading-relaxed text-gray-500"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end pt-6">
                <button
                  type="submit"
                  className="bg-[#006699] text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#004d73] transition-all shadow-xl shadow-blue-100"
                >
                  <span>Send Message</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </section>

          {/* Sidebar Info */}
          <aside className="space-y-12">
            {/* Direct Contact Card */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 space-y-10">
              <h2 className="text-[#0F4C81] text-2xl font-bold">Direct Contact</h2>
              <div className="space-y-8">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="bg-[#EEF4FF] p-4 rounded-2xl text-[#006699] h-fit group-hover:bg-[#006699] group-hover:text-white transition-all">
                      {info.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-[10px] font-bold tracking-widest">{info.label}</p>
                      <p className="text-[#0F4C81] text-sm font-bold">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Connect Card */}
            <div className="bg-[#EEF4FF] rounded-[40px] p-10 shadow-sm border border-transparent space-y-10">
              <div className="space-y-4">
                <h2 className="text-[#0F4C81] text-2xl font-bold">Connect With Us</h2>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  Follow our journeys across the dunes and coastlines.
                </p>
              </div>
              <div className="flex gap-4">
                {socialLinks.map(({ label, href, Icon }) => (

                  key = { label }
                    href = { href }
                    target = "_blank"
                    rel = "noopener noreferrer"
                    title = { label }
                    className = "bg-white p-4 rounded-2xl text-[#006699] hover:bg-[#006699] hover:text-white transition-all shadow-sm"
                  >
                  <Icon />
                  </a>
                ))}
            </div>
        </div>
      </aside>

    </div>{/* ← closes grid */ }

  {/* Bottom Banner */ }
  <section className="relative rounded-[40px] overflow-hidden h-96 group shadow-2xl">
    <img
      src={algiersImg}
      alt="Algiers City"
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
    <div className="absolute bottom-12 left-12 space-y-2">
      <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.3em]">Headquarters</p>
      <h3 className="text-white text-5xl font-extrabold tracking-tight">Algiers, The White City</h3>
    </div>
  </section>

      </div > {/* ← closes space-y-16 wrapper */ }
    </div >
  );
};

export default Contact;