'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calculator, CalendarDays, Heart, Flower2 } from 'lucide-react'

const tools = [
  {
    icon: Calculator,
    title: 'Kalkulator HPL',
    desc: 'Hitung Hari Perkiraan Lahir berdasarkan hari pertama haid terakhir Anda.',
    badge: 'Segera Hadir',
    iconBg: 'bg-rose/10',
    iconColor: 'text-rose',
  },
  {
    icon: CalendarDays,
    title: 'Kalkulator Usia Kehamilan',
    desc: 'Ketahui usia kehamilan Anda saat ini dan tonggak perkembangan yang akan dicapai.',
    badge: 'Segera Hadir',
    iconBg: 'bg-blush/40',
    iconColor: 'text-rose',
  },
  {
    icon: Heart,
    title: 'Jadwal ANC Otomatis',
    desc: 'Dapatkan jadwal Antenatal Care yang dipersonalisasi berdasarkan usia kehamilan Anda.',
    badge: 'Segera Hadir',
    iconBg: 'bg-sage/20',
    iconColor: 'text-sage-dark',
  },
  {
    icon: Flower2,
    title: 'Kalkulator Masa Subur',
    desc: 'Tentukan jendela kesuburan Anda untuk membantu perencanaan dan program kehamilan.',
    badge: 'Segera Hadir',
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

export default function HealthTools() {
  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' })

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <FadeUp className="text-center mb-12">
          <div className="section-tag w-fit mx-auto mb-3">Tools Kesehatan</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Alat Bantu{' '}
            <span className="text-rose">Kehamilan Anda</span>
          </h2>
          <p className="text-muted max-w-lg mx-auto leading-relaxed">
            Kami sedang mempersiapkan kalkulator dan alat bantu digital yang akan mempermudah perjalanan kehamilan Anda.
          </p>
        </FadeUp>

        {/* Tools grid */}
        <motion.div
          ref={gridRef}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <motion.div
                key={tool.title}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(58,42,44,0.09)' }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                className="bg-cream rounded-2xl p-6 relative overflow-hidden group"
              >
                {/* Coming soon overlay */}
                <div className="absolute inset-0 rounded-2xl bg-white/40 opacity-0 group-hover:opacity-0 transition-opacity pointer-events-none" />

                <div className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} className={tool.iconColor} />
                </div>

                <div className="inline-flex items-center gap-1.5 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-amber-600">{tool.badge}</span>
                </div>

                <h3 className="font-bold text-ink mb-2">{tool.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{tool.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom notice */}
        <FadeUp delay={0.2} className="mt-10 text-center">
          <p className="text-sm text-muted">
            Ingin diberitahu saat tools ini diluncurkan?{' '}
            <a
              href="https://wa.me/6285220024400?text=Halo%2C%20saya%20ingin%20mendapatkan%20info%20saat%20tools%20kesehatan%20Apotek%20Keluarga%20diluncurkan%20%F0%9F%99%8F"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose font-semibold hover:underline"
            >
              Daftarkan nomor WhatsApp Anda →
            </a>
          </p>
        </FadeUp>

      </div>
    </section>
  )
}
