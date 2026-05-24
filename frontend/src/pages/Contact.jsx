import React from 'react';
import algiersImg from '../assets/algiers.jpg';

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
      value: 'hello@algeriawander.com'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'PHONE',
      value: '+213 123 456 789'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'OFFICE',
      value: 'Didouche Mourad St, Algiers, Algeria'
    }
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
                  rows="6"
                  placeholder="Tell us about your travel plans..."
                  className="w-full bg-[#F8FAFF] rounded-3xl py-6 px-8 text-sm outline-none border border-transparent focus:border-[#006699] transition-all shadow-inner resize-none leading-relaxed text-gray-500"
                  required
                ></textarea>
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
                {[1, 2, 3].map(i => (
                  <button key={i} className="bg-white p-4 rounded-2xl text-[#006699] hover:bg-[#006699] hover:text-white transition-all shadow-sm">
                    <div className="w-5 h-5 bg-current rounded-full"></div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Banner */}
        <section className="relative rounded-[40px] overflow-hidden h-96 group shadow-2xl">
          <img
            src={algiersImg} alt="Algiers City"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          <div className="absolute bottom-12 left-12 space-y-2">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.3em]">Headquarters</p>
            <h3 className="text-white text-5xl font-extrabold tracking-tight">Algiers, The White City</h3>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;
