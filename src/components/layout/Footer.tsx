import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock, AtSign } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative w-9 h-9 bg-white rounded-lg p-1">
              <Image src="/logo.png" alt="Apotek Keluarga" fill className="object-contain p-0.5" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm text-white tracking-wide">APOTEK</div>
              <div className="font-bold text-sm text-rose-light tracking-wide">KELUARGA</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-5 text-white/60">
            Teman perjalanan kesehatan ibu dan keluarga. Hangat, profesional, terpercaya — di Cirebon.
          </p>
          <a
            href="https://wa.me/6285220024400"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-600 px-4 py-2.5 rounded-btn hover:bg-[#20ba5a] transition-colors"
          >
            <span>💬</span>
            WhatsApp Kami
          </a>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-700 text-white text-sm mb-4 uppercase tracking-wider">Navigasi</h4>
          <ul className="space-y-2.5">
            {[
              { href: '/', label: 'Beranda' },
              { href: '/about', label: 'Profil Dokter' },
              { href: '/services', label: 'Layanan' },
              { href: '/schedule', label: 'Jadwal Praktek' },
              { href: '/booking', label: 'Buat Janji' },
              { href: '/queue', label: 'Cek Antrian' },
              { href: '/contact', label: 'Kontak' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-700 text-white text-sm mb-4 uppercase tracking-wider">Layanan Utama</h4>
          <ul className="space-y-2.5">
            {[
              'Konsultasi Kandungan',
              'USG 2D / 3D / 4D',
              'Program Hamil',
              'Pemantauan Kehamilan',
              'KB & Keluarga Berencana',
              'Konsultasi Menyusui',
              'Konsultasi THT',
            ].map((s) => (
              <li key={s} className="text-sm text-white/60">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-700 text-white text-sm mb-4 uppercase tracking-wider">Kontak & Lokasi</h4>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <MapPin size={16} className="text-rose-light mt-0.5 shrink-0" />
              <span className="text-sm text-white/60 leading-relaxed">
                Jl. Gerilyawan No.5, Simaja Selatan, Kesambi, Kota Cirebon, Jawa Barat
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="text-rose-light mt-0.5 shrink-0" />
              <div className="text-sm text-white/60 space-y-1">
                <a href="tel:085220024400" className="block hover:text-white transition-colors">
                  0852-2002-4400
                </a>
                <a href="tel:08112421983" className="block hover:text-white transition-colors">
                  0811-2421-983
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="text-rose-light mt-0.5 shrink-0" />
              <div className="text-sm text-white/60 space-y-1">
                <div>Senin–Sabtu</div>
                <div>Sesuai jadwal praktek</div>
              </div>
            </li>
            <li className="flex gap-3">
              <AtSign size={16} className="text-rose-light mt-0.5 shrink-0" />
              <a
                href="https://instagram.com/apotekkeluargacirebon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                @apotekkeluargacirebon
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© 2025 Apotek Keluarga Cirebon. Hak cipta dilindungi.</span>
          <span className="script-accent text-white/30 text-base">
            Teman perjalanan kesehatan keluarga
          </span>
        </div>
      </div>
    </footer>
  )
}
