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
  { href: '/articles', label: 'Artikel' },
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

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft py-2' : 'bg-transparent py-4'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-16 h-16 shrink-0"
              whileHover={{ scale: 1.07, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <Image
                src="/logo.png"
                alt="Apotek Keluarga"
                fill
                className="object-contain"
              />
            </motion.div>
            <div className="leading-snug">
              <div className="font-extrabold text-base text-ink tracking-widest">APOTEK</div>
              <div className="font-extrabold text-base text-rose tracking-widest">KELUARGA</div>
            </div>
          </Link>

          {/* Desktop nav with sliding pill indicator */}
          <div className="hidden md:flex items-center gap-0.5 relative">
            {navLinks.map((link, i) => {
              const active = pathname === link.href
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 block ${
                      active ? 'text-burgundy' : 'text-ink/70 hover:text-ink'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-blush rounded-full"
                        style={{ zIndex: -1 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.label}
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6285220024400"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-sage-dark transition-colors"
            >
              <Phone size={14} />
              <span>0852-2002-4400</span>
            </a>

            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link href="/booking" className="btn-primary text-sm px-5 py-2.5 hidden md:flex">
                Buat Janji
              </Link>
            </motion.div>

            <motion.button
              className="md:hidden p-2 rounded-xl hover:bg-blush transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={22} className="text-ink" />
                    </motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={22} className="text-ink" />
                    </motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

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
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white shadow-float flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-blush">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 shrink-0">
                    <Image src="/logo.png" alt="Apotek Keluarga" fill className="object-contain" />
                  </div>
                  <div className="leading-snug">
                    <div className="font-extrabold text-sm text-ink tracking-widest">APOTEK</div>
                    <div className="font-extrabold text-sm text-rose tracking-widest">KELUARGA</div>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-cream-dark">
                  <X size={20} className="text-ink" />
                </button>
              </div>

              <nav className="flex-1 p-5 flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const active = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={link.href}
                        className={`px-4 py-3 rounded-card text-sm font-semibold transition-all flex items-center justify-between ${
                          active ? 'bg-blush text-burgundy' : 'text-ink hover:bg-cream'
                        }`}
                      >
                        {link.label}
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-rose" />}
                      </Link>
                    </motion.div>
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
                  <span>💬</span> WhatsApp Konsultasi
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
