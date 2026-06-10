'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Dokter' },
  { href: '/services', label: 'Layanan' },
  { href: '/schedule', label: 'Jadwal' },
  { href: '/queue', label: 'Antrian' },
  { href: '/contact', label: 'Kontak' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <Image
                src="/logo.png"
                alt="Apotek Keluarga"
                fill
                className="object-contain"
              />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm text-ink tracking-wide">APOTEK</div>
              <div className="font-bold text-sm text-rose tracking-wide">KELUARGA</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-600 transition-all duration-200 ${
                    active
                      ? 'bg-blush text-burgundy font-700'
                      : 'text-ink/70 hover:text-ink hover:bg-cream-dark'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6285220024400"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm font-600 text-ink/70 hover:text-sage-dark transition-colors"
            >
              <Phone size={15} />
              <span>0852-2002-4400</span>
            </a>

            <Link href="/booking" className="btn-primary text-sm px-5 py-2.5 hidden md:flex">
              Buat Janji
            </Link>

            <button
              className="md:hidden p-2 rounded-xl hover:bg-blush transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} className="text-ink" /> : <Menu size={22} className="text-ink" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white shadow-float flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-blush">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8">
                    <Image src="/logo.png" alt="Apotek Keluarga" fill className="object-contain" />
                  </div>
                  <span className="font-700 text-ink text-sm">Apotek Keluarga</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-cream-dark"
                >
                  <X size={20} className="text-ink" />
                </button>
              </div>

              <nav className="flex-1 p-5 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-card text-sm font-600 transition-all ${
                        active
                          ? 'bg-blush text-burgundy'
                          : 'text-ink hover:bg-cream'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="p-5 border-t border-blush space-y-3">
                <a
                  href="https://wa.me/6285220024400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa w-full text-sm"
                >
                  <span>💬</span>
                  WhatsApp Konsultasi
                </a>
                <Link href="/booking" className="btn-primary w-full text-sm">
                  Buat Janji Sekarang
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
