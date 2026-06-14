'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, Users, Star, HeartPulse, Award } from 'lucide-react'

const stats = [
  { icon: Award,       value: '10+',    unit: 'Tahun',    label: 'Pengalaman Klinis' },
  { icon: Users,       value: '5.000+', unit: 'Pasien',   label: 'Telah Ditangani' },
  { icon: Star,        value: '4.9',    unit: '/5',       label: 'Rating Kepuasan' },
  { icon: HeartPulse,  value: '3.000+', unit: 'Kasus',    label: 'Pemeriksaan USG' },
  { icon: ShieldCheck, value: 'SpOG',   unit: '',         label: 'Spesialis Bersertifikat' },
]

function CountUp({ value, delay }: { value: string; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="text-2xl md:text-3xl font-extrabold text-burgundy tabular-nums"
    >
      {value}
    </motion.span>
  )
}

export default function TrustBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section className="bg-ink py-8 md:py-10 overflow-hidden">
      <motion.div
        ref={ref}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="max-w-6xl mx-auto px-4"
      >
        {/* Mobile: 2-column grid | Desktop: horizontal flex */}
        <div className="grid grid-cols-2 lg:flex lg:justify-between lg:items-center gap-4 lg:gap-0">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                className={`flex items-center gap-3 group${i === 4 ? ' col-span-2 justify-self-center' : ''}`}
              >
                {/* Divider — desktop only */}
                {i > 0 && (
                  <div className="hidden lg:block w-px h-10 bg-white/10 mr-2 shrink-0" />
                )}
                <div className="w-10 h-10 rounded-xl bg-rose/20 flex items-center justify-center shrink-0 group-hover:bg-rose/30 transition-colors">
                  <Icon size={17} className="text-blush" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1">
                    <CountUp value={s.value} delay={i * 0.08} />
                    {s.unit && (
                      <span className="text-sm text-blush/70 font-semibold">{s.unit}</span>
                    )}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5 leading-tight whitespace-nowrap">{s.label}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
