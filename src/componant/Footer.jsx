import { useState } from "react";
import { motion } from "framer-motion";
import { GithubIcon, TwitterIcon, LinkedinIcon, MailIcon } from "lucide-react";

const Footer = ({ isDarkMode }) => {
  const socialLinks = [
    {
      icon: <GithubIcon />,
      href: "#",
      color: isDarkMode ? "text-purple-300" : "text-blue-600",
      link: "https://github.com/RajBhut",
    },
    {
      icon: <TwitterIcon />,
      href: "#",
      color: isDarkMode ? "text-purple-300" : "text-blue-600",
    },
    {
      icon: <LinkedinIcon />,
      href: "#",
      color: isDarkMode ? "text-purple-300" : "text-blue-600",
    },
    {
      icon: <MailIcon />,
      href: "",
      color: isDarkMode ? "text-purple-300" : "text-blue-600",
      link: "",
    },
  ];

  return (
    <footer
      className={`relative z-10 py-16 ${
        isDarkMode ? "bg-black/20" : "bg-white/10"
      } backdrop-blur-lg`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center"
        >
          <h2
            className={`text-4xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Join Our Community
          </h2>

          <div className="flex justify-center space-x-6 mb-8">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className={`text-3xl ${link.color} transition-colors duration-300`}
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          <p
            className={`mb-4 ${isDarkMode ? "text-white/70" : "text-gray-600"}`}
          >
            © {new Date().getFullYear()} oncomp. All rights reserved.
          </p>

          <div className="flex justify-center space-x-6">
            {["Privacy Policy", "Terms of Service"].map((link, index) => (
              <a
                key={index}
                href="#"
                className={`
                  ${
                    isDarkMode
                      ? "text-white/70 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  } transition-colors`}
              >
                {link}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
