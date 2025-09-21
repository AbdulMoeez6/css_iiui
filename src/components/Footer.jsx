// app/components/Footer.tsx (or .jsx)
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaDiscord } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="section py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white/80">
          © {new Date().getFullYear()} The Computer Science Society
        </div>

        <nav className="flex gap-4 text-2xl text-white/80">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF aria-hidden="true" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram aria-hidden="true" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn aria-hidden="true" />
          </a>
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" aria-label="Discord">
            <FaDiscord aria-hidden="true" />
          </a>
        </nav>

        <a className="btn" href="/about#join">Join Us</a>
      </div>
    </footer>
  );
}
