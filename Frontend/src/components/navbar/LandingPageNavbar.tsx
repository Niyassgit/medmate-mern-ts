import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LandingPageNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Info", path: "/info" },
    { name: "Guest", path: "/guest-info" },
  ];

  return (
    <nav className="relative flex items-center justify-between bg-gradient-to-b from-[#022b4e] to-[#185891]/90 px-6 h-16 py-3 shadow-lg z-50">
      {/* Logo Section */}
      <div 
        className="flex items-center gap-0 cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <img
          src="/logo.png"
          alt="MedMate Logo"
          className="h-12 w-auto object-contain"
        />
        <span className="font-bold text-gray-50 text-xl -ml-2">
          MedMate
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
        {navLinks.map((link) => (
          <Button
            key={link.name}
            variant="ghost"
            className="hover:bg-white/10 text-gray-50 transition-colors"
            onClick={() => {
              navigate(link.path);
              setIsOpen(false);
            }}
          >
            {link.name}
          </Button>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-50 hover:bg-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-[#022b4e] border-t border-white/10 shadow-xl md:hidden z-40 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  className="w-full justify-start text-gray-50 hover:bg-white/10 py-6 text-lg"
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
                >
                  {link.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingPageNavbar;

