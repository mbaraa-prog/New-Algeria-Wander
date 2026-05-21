import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const team = [
    {
      name: 'Amira Benali',
      role: 'Founder & Explorer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400'
    },
    {
      name: 'Tariq Mansouri',
      role: 'Head of Content',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400'
    },
    {
      name: 'Lina Haddad',
      role: 'Lead Designer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=2000" 
          alt="Sahara Dunes" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center space-y-6 px-6">
          <h1 className="text-white text-6xl md:text-7xl font-extrabold tracking-tight">Discover the Hidden Gems</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            We are dedicated to showcasing the breathtaking duality of Algeria, from the refreshing clarity of the Mediterranean coast to the timeless warmth of the Sahara.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="max-w-7xl mx-auto py-32 px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">Our Mission</h2>
            <div className="w-20 h-1.5 bg-[#FF7F50] rounded-full"></div>
          </div>
          <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
            <p>
              Empowering travelers to discover the hidden gems of Algeria through curated experiences and insightful guides. We believe in sustainable tourism that respects local communities and preserves natural beauty.
            </p>
            <p>
              Our platform serves as a sophisticated companion for the modern traveler, offering a minimalist, airy design that lets the vibrant imagery of Algerian landscapes take center stage.
            </p>
          </div>
        </div>
        <div className="rounded-[40px] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-700">
          <img 
            src="https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=1200" 
            alt="Coastal Algeria" 
            className="w-full h-[500px] object-cover"
          />
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="bg-[#F8FAFF] py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">Meet the Team</h2>
            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
              A passionate group of explorers, designers, and storytellers dedicated to bringing you the best of Algeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div className="h-80 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-10 text-center space-y-2">
                  <h4 className="text-[#0F4C81] text-2xl font-bold">{member.name}</h4>
                  <p className="text-[#FF7F50] font-bold text-sm uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight leading-tight">Ready to Start Your Journey?</h2>
          <p className="text-gray-400 text-xl font-medium">
            Join us in exploring the rich history, diverse landscapes, and vibrant culture of Algeria. Let's make memories that last a lifetime.
          </p>
          <Link 
            to="/wilayas" 
            className="inline-block bg-[#006699] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-[#004d73] transition-all shadow-xl shadow-blue-100"
          >
            Explore Destinations
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
