const GuestFooter = () => {
  return (
    <footer className="w-full bg-black text-white py-12">
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
            <p className="text-white/80 max-w-xs">
              Creating a trusted space where healthcare professionals build
              connections that truly matter.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Digital Prescriptions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Medicine Ordering
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Doctor Connections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Health Records
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-white/80">
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
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-white/80">
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
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>
            &copy; 2025 MedMate. All rights reserved. | Built with care for your
            healthcare needs.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GuestFooter;
