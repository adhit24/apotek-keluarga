import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, AtSign } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Dokter' },
  { href: '/services', label: 'Layanan' },
  { href: '/schedule', label: 'Jadwal' },
  { href: '/articles', label: 'Artikel' },
  { href: '/booking', label: 'Buat Janji' },
  { href: '/queue', label: 'Antrian' },
  { href: '/contact', label: 'Kontak' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      {/* Main row */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-16 h-16 bg-white rounded-xl p-1.5 shrink-0">
              <Image src="/logo.png" alt="Apotek Keluarga" fill className="object-contain p-0.5" />
            </div>
            <div className="leading-snug">
              <div className="font-extrabold text-base text-white tracking-widest">APOTEK</div>
              <div className="font-extrabold text-base tracking-widest" style={{ color: '#EAC9CD' }}>KELUARGA</div>
              <div className="text-xs text-white/40 mt-0.5">dr. Wildan A. Sutrisno, SpOG — Cirebon</div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact quick */}
          <div className="flex flex-col gap-2 text-sm text-white/50 shrink-0">
            <a href="https://wa.me/6285220024400" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={13} />
              0852-2002-4400
            </a>
            <div className="flex items-center gap-2">
              <MapPin size={13} />
              Jl. Gerilyawan No.5, Cirebon
            </div>
            <a href="https://instagram.com/apotekkeluargacirebon" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors">
              <AtSign size={13} />
              @apotekkeluargacirebon
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-white/30">
            © 2025 Apotek Keluarga Cirebon. Hak cipta dilindungi.
          </span>

          {/* Powered by Kinaryaloka */}
          <a
            href="https://www.kinaryaloka.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
              Powered by
            </span>
            <div className="relative w-5 h-5 rounded-md overflow-hidden shrink-0 opacity-60 group-hover:opacity-90 transition-opacity">
              <Image src="/logo_kinarya.png" alt="Kinaryaloka" fill className="object-contain" />
            </div>
            <span className="text-xs font-semibold text-white/40 group-hover:text-white/70 transition-colors tracking-wide">
              Kinaryaloka
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
