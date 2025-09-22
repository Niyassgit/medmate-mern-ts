const Footer = () => {
  return (
    <footer className="bg-[#022b4e] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="MedMate Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="font-bold text-gray-50 text-xl -ml-4 pb-2">
                MedMate
              </span>
            </div>
            <p className="text-blue-100 max-w-xs">
              Creating a trusted space where healthcare professionals build
              connections that truly matter.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Online Consultations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Prescription Management
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Health Monitoring
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Specialist Care
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Our Doctors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Insurance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-400/20 pt-8 text-center text-blue-100">
          <p>
            &copy; 2025 MedMate. All rights reserved. | Built with care for your
            business.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
