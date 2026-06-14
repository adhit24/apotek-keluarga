'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, MapPin, Phone, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const trustPoints = [
  'Konsultasi langsung dengan SpOG berpengalaman',
  'Antrian digital — tidak perlu antre lama',
  'Hasil USG langsung dijelaskan saat konsultasi',
  'Pendampingan dari awal hingga persalinan',
]

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  )
}

export default function EmotionalCTA() {
  return (
    <section className="py-10 md:py-16 bg-cream overflow-hidden relative">
      {/* Background ambient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blush/40 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-sage-light/30 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative">

        {/* Top: Emotional message */}
        <FadeUp className="text-center mb-14">
          <div className="w-14 h-14 rounded-2xl bg-blush/50 flex items-center justify-center mx-auto mb-6">
            <Heart size={26} className="text-rose" />
          </div>

          <span className="script-accent text-4xl md:text-5xl block mb-4 text-rose">
            Kami memahami perjalanan Anda.
          </span>

          <p className="text-lg md:text-xl text-ink/70 leading-relaxed max-w-2xl mx-auto mb-3">
            Setiap perjalanan kehamilan adalah pengalaman yang berharga dan unik.
            Kami hadir untuk mendampingi Anda dengan pelayanan yang hangat,
            profesional, dan penuh perhatian — dari kunjungan pertama hingga
            momen kelahiran yang mengharukan.
          </p>

          <p className="text-base text-muted font-medium italic">
            — dr. Wildan A. Sutrisno, SpOG
          </p>
        </FadeUp>

        {/* Main CTA block */}
        <FadeUp delay={0.1}>
          <div className="bg-ink rounded-3xl overflow-hidden shadow-float">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: text */}
              <div className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-snug">
                  Siap Memulai Perjalanan<br />
                  <span className="text-blush">Bersama Kami?</span>
                </h2>

                <p className="text-white/50 text-sm leading-relaxed mb-7">
                  Booking sekarang hanya membutuhkan 2 menit. Kami akan menyiapkan segala sesuatunya untuk Anda.
                </p>

                {/* Trust points */}
                <div className="space-y-2.5 mb-8">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-sage/40 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-sage-light" />
                      </div>
                      <span className="text-sm text-white/60">{point}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Link href="/booking" className="btn-primary w-full justify-center text-sm">
                      Buat Janji Sekarang <ArrowRight size={15} />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <a
                      href="https://wa.me/6285220024400?text=Halo%20Apotek%20Keluarga%20%F0%9F%91%8B%0ASaya%20ingin%20konsultasi%20dan%20membuat%20janji%20dengan%20dr.%20Wildan.%20Mohon%20bantu%20saya.%20Terima%20kasih%20%F0%9F%99%8F"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-wa w-full justify-center text-sm"
                    >
                      <span>💬</span> WhatsApp Konsultasi
                    </a>
                  </motion.div>
                </div>
              </div>

              {/* Right: info + logo */}
              <div className="bg-white/5 p-8 md:p-12 flex flex-col justify-between">
                <div className="space-y-5 mb-8">
                  <div>
                    <div className="text-xs text-white/30 uppercase tracking-widest mb-1.5">Lokasi</div>
                    <a
                      href="https://maps.google.com/?q=Jl.+Gerilyawan+No.5+Cirebon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-white/70 hover:text-white transition-colors"
                    >
                      <MapPin size={14} className="text-blush shrink-0 mt-0.5" />
                      <span className="text-sm">Jl. Gerilyawan No.5, Pekiringan, Kesambi, Kota Cirebon</span>
                    </a>
                  </div>

                  <div>
                    <div className="text-xs text-white/30 uppercase tracking-widest mb-1.5">Telepon / WA</div>
                    <a
                      href="tel:+6285220024400"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                    >
                      <Phone size={14} className="text-blush shrink-0" />
                      0852-2002-4400
                    </a>
                  </div>

                  <div>
                    <div className="text-xs text-white/30 uppercase tracking-widest mb-2">Jam Praktik</div>
                    <div className="space-y-1 text-sm text-white/60">
                      <div className="flex justify-between">
                        <span>Senin – Jumat</span>
                        <span className="text-white/80">08:00 – 16:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sabtu</span>
                        <span className="text-white/80">08:00 – 13:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minggu</span>
                        <span className="text-rose/70">Tutup</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo */}
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 shrink-0">
                    <Image src="/logo.png" alt="Apotek Keluarga" fill className="object-contain p-1" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-sm tracking-widest">APOTEK</div>
                    <div className="font-extrabold text-blush text-sm tracking-widest">KELUARGA</div>
                    <div className="text-xs text-white/30 mt-0.5">dr. Wildan A. Sutrisno, SpOG</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
