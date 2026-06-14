'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  CalendarCheck, Clock, Stethoscope, Scan, Bell, HeartHandshake, Baby,
} from 'lucide-react'

const steps = [
  {
    icon: CalendarCheck,
    num: '01',
    title: 'Booking Online',
    desc: 'Kapan saja, 24 jam — lewat website atau WhatsApp.',
    color: 'bg-blush/50',
    iconColor: 'text-rose',
  },
  {
    icon: Clock,
    num: '02',
    title: 'Datang Sesuai Jadwal',
    desc: 'Antrian digital siap. Pantau status dari rumah.',
    color: 'bg-cream',
    iconColor: 'text-burgundy',
  },
  {
    icon: Stethoscope,
    num: '03',
    title: 'Konsultasi',
    desc: 'dr. Wildan mendengarkan dengan sabar & empati.',
    color: 'bg-blush/50',
    iconColor: 'text-rose',
  },
  {
    icon: Scan,
    num: '04',
    title: 'USG & Evaluasi',
    desc: 'USG 4D terkini, gambar jelas dan akurat.',
    color: 'bg-cream',
    iconColor: 'text-sage-dark',
  },
  {
    icon: Bell,
    num: '05',
    title: 'Reminder Kontrol',
    desc: 'Pengingat WA otomatis, jadwal tidak terlewat.',
    color: 'bg-blush/50',
    iconColor: 'text-rose',
  },
  {
    icon: HeartHandshake,
    num: '06',
    title: 'Pendampingan',
    desc: 'Riwayat tersimpan, kami memantau perjalanan Anda.',
    color: 'bg-cream',
    iconColor: 'text-burgundy',
  },
  {
    icon: Baby,
    num: '07',
    title: 'Persiapan Persalinan',
    desc: 'Siap bersama menyambut momen istimewa kelahiran.',
    color: 'bg-blush/50',
    iconColor: 'text-rose',
  },
]

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  )
}

export default function PatientJourney() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-80px' })

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <FadeUp className="text-center mb-12">
          <div className="section-tag w-fit mx-auto mb-3">Perjalanan Bersama Kami</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Setiap Langkah,{' '}
            <span className="text-rose">Kami Dampingi</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            Dari booking pertama hingga persiapan persalinan — kami hadir di setiap momen perjalanan kesehatan Anda.
          </p>
        </FadeUp>

        {/* Horizontal timeline — scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 pb-3">
          <div className="relative min-w-[680px]">

            {/* Horizontal connector line — runs through center of nodes */}
            <div
              ref={lineRef}
              className="absolute top-5 overflow-hidden"
              style={{
                left: `calc(100% / 14)`,
                right: `calc(100% / 14)`,
                height: '1px',
                background: 'rgba(194,104,94,0.18)',
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={lineInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                style={{ transformOrigin: 'left', height: '100%', background: 'rgba(194,104,94,0.55)' }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-7 gap-2">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={step.num} className="flex flex-col items-center gap-3.5">

                    {/* Node circle */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 22,
                        delay: i * 0.06 + 0.2,
                      }}
                      className="w-10 h-10 rounded-full bg-white border-2 border-blush/70 flex items-center justify-center z-10 shrink-0 shadow-float"
                    >
                      <span className="text-[11px] font-extrabold text-rose tabular-nums">{step.num}</span>
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.55,
                        delay: i * 0.06 + 0.38,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{
                        y: -4,
                        boxShadow: '0 10px 28px rgba(194,104,94,0.13)',
                        transition: { type: 'spring', stiffness: 320, damping: 24 },
                      }}
                      className={`${step.color} rounded-2xl p-3.5 w-full flex flex-col items-center text-center cursor-default`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/75 flex items-center justify-center mb-2.5 shrink-0">
                        <Icon size={15} className={step.iconColor} />
                      </div>
                      <h3 className="font-bold text-ink text-[11px] leading-tight mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-muted text-[10.5px] leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>

                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
