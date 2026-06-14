'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bell, CalendarCheck, ClipboardList, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Bell,
    title: 'Reminder Kontrol',
    desc: 'Notifikasi otomatis mengingatkan jadwal kontrol dan pemeriksaan penting agar tidak ada yang terlewat.',
    iconBg: 'bg-rose/10',
    iconColor: 'text-rose',
  },
  {
    icon: CalendarCheck,
    title: 'Jadwal ANC Terstruktur',
    desc: 'Jadwal Antenatal Care dari trimester pertama hingga persalinan tersusun rapi dan mudah dipantau.',
    iconBg: 'bg-blush/40',
    iconColor: 'text-rose',
  },
  {
    icon: ClipboardList,
    title: 'Riwayat Kunjungan',
    desc: 'Semua catatan kunjungan dan hasil pemeriksaan tersimpan. Akses kapan saja dari dashboard pasien.',
    iconBg: 'bg-sage/20',
    iconColor: 'text-sage-dark',
  },
  {
    icon: Clock,
    title: 'Antrian Digital Real-Time',
    desc: 'Pantau posisi antrian secara langsung dari rumah. Datang saat giliran Anda hampir tiba.',
    iconBg: 'bg-burgundy/10',
    iconColor: 'text-burgundy',
  },
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

export default function PregnancyCompanion() {
  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' })

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Feature grid */}
          <div>
            <FadeUp className="mb-10">
              <div className="section-tag w-fit mb-3">Pendamping Digital</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4 leading-snug">
                Klinik Modern{' '}
                <span className="text-rose">untuk Ibu Modern</span>
              </h2>
              <p className="text-muted leading-relaxed max-w-md">
                Kami menghadirkan fitur digital yang mempermudah perjalanan kehamilan Anda — dari booking hingga reminder kontrol, semua dalam satu platform.
              </p>
            </FadeUp>

            <motion.div
              ref={gridRef}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              animate={gridInView ? 'visible' : 'hidden'}
              className="grid sm:grid-cols-2 gap-4"
            >
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={f.title}
                    variants={{
                      hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(194,104,94,0.09)' }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    className="bg-cream rounded-2xl p-5 group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon size={18} className={f.iconColor} />
                    </div>
                    <h3 className="font-bold text-ink text-sm mb-1.5">{f.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>

            <FadeUp delay={0.3} className="mt-8 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/dashboard" className="btn-primary text-sm">
                  Buka Dashboard Saya <ArrowRight size={15} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/queue" className="btn-outline text-sm">
                  Cek Antrian
                </Link>
              </motion.div>
            </FadeUp>
          </div>

          {/* Right: Phone mockup / visual */}
          <FadeUp delay={0.12} className="hidden lg:block">
            <div className="relative mx-auto max-w-sm">
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-blush/30 blur-3xl rounded-full scale-90 pointer-events-none" />

              {/* Mockup card */}
              <div className="relative bg-white rounded-3xl shadow-float p-6 border border-blush/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-muted">Kehamilan Anda</div>
                    <div className="font-extrabold text-ink">Minggu ke-24</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center">
                    <Bell size={16} className="text-rose" />
                  </div>
                </div>

                {/* Progress ring visual */}
                <div className="flex justify-center mb-5">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#EAC9CD" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="40" fill="none" stroke="#C2685E" strokeWidth="8"
                        strokeLinecap="round" strokeDasharray="251.2"
                        initial={{ strokeDashoffset: 251.2 }}
                        whileInView={{ strokeDashoffset: 251.2 * (1 - 24 / 40) }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-extrabold text-ink">24</div>
                      <div className="text-xs text-muted">minggu</div>
                    </div>
                  </div>
                </div>

                {/* Next appointment */}
                <div className="bg-cream rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted mb-0.5">Kontrol Berikutnya</div>
                      <div className="font-semibold text-ink text-sm">Rabu, 25 Juni 2025</div>
                      <div className="text-xs text-muted">09:00 — dr. Wildan</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center">
                      <CalendarCheck size={14} className="text-rose" />
                    </div>
                  </div>
                </div>

                {/* Reminder pills */}
                <div className="flex gap-2 flex-wrap">
                  {['Reminder WA ✓', 'ANC Minggu 28', 'USG Terjadwal'].map((tag) => (
                    <span key={tag} className="text-xs bg-sage-light/40 text-sage-dark font-semibold px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  )
}
