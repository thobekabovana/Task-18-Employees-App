// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-pink-100 text-black py-10 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-around gap-8">
        {footerSections.map((section, index) => (
          <div key={index} className="w-40">
            <h3 className="text-sm font-semibold mb-2 text-pink-500">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-pink-400 hover:text-pink-600 text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-pink-300 pt-6 flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 max-w-6xl mx-auto">
        <form className="flex flex-wrap justify-center items-center gap-2">
          <label htmlFor="email" className="text-sm text-pink-500">Subscribe to Employee Updates</label>
          <input
            type="email"
            id="email"
            placeholder="Email address"
            className="px-4 py-2 rounded-md border border-pink-300 focus:outline-none focus:ring focus:ring-pink-300"
          />
          <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md">
            Subscribe
          </button>
        </form>

        <select className="px-4 py-2 rounded-md bg-pink-500 text-white">
          <option value="US">English</option>
          <option value="FR">French</option>
          <option value="ES">Spanish</option>
        </select>

        <div className="flex space-x-4">
          {socialLinks.map((icon, idx) => (
            <a key={idx} href="#" className="text-pink-500 text-2xl">
              <i className={`fab fa-${icon}`}></i>
            </a>
          ))}
        </div>
      </div>

      <div className="text-center text-gray-800 text-sm mt-6">
        <p>© 2024 Employee Resources Inc. All rights reserved. Terms of Use | Privacy Policy</p>
        <p>Contact: HR Hotline (123-456-7890)</p>
      </div>
    </footer>
  );
};

// Footer section data
const footerSections = [
  {
    title: "Employee Resources",
    links: [
      { label: "Employee Portal", href: "#" },
      { label: "Benefits", href: "#" },
      { label: "Career Development", href: "#" },
      { label: "Training Programs", href: "#" },
      { label: "Employee Discounts", href: "#" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Contact HR", href: "#" },
      { label: "Policies", href: "#" }
    ]
  },
  {
    title: "Community",
    links: [
      { label: "Employee Stories", href: "#" },
      { label: "Events", href: "#" },
      { label: "Volunteer Opportunities", href: "#" },
      { label: "Recognition Programs", href: "#" }
    ]
  },
  {
    title: "Learning & Growth",
    links: [
      { label: "Workshops", href: "#" },
      { label: "Mentorship", href: "#" },
      { label: "Leadership Development", href: "#" },
      { label: "Online Courses", href: "#" }
    ]
  }
];

// Social media links
const socialLinks = ["linkedin", "twitter", "facebook-f", "youtube"];

export default Footer;
