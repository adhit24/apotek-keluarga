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
    desc: 'Pilih dokter, layanan, dan jadwal yang nyaman untuk Anda — kapan saja, 24 jam lewat website atau WhatsApp.',
    color: 'bg-blush/60',
    iconColor: 'text-rose',
  },
  {
    icon: Clock,
    num: '02',
    title: 'Datang Sesuai Jadwal',
    desc: 'Nomor antrian digital disiapkan untukmu. Pantau status antrian secara real-time dari rumah.',
    color: 'bg-cream',
    iconColor: 'text-burgundy',
  },
  {
    icon: Stethoscope,
    num: '03',
    title: 'Pemeriksaan & Konsultasi',
    desc: 'dr. Wildan memberikan konsultasi menyeluruh, mendengarkan keluhan Anda dengan sabar dan empati.',
    color: 'bg-blush/60',
    iconColor: 'text-rose',
  },
  {
    icon: Scan,
    num: '04',
    title: 'USG & Evaluasi',
    desc: 'USG 4D terkini untuk memantau perkembangan janin dengan gambar yang jelas dan akurat.',
    color: 'bg-cream',
    iconColor: 'text-sage-dark',
  },
  {
    icon: Bell,
    num: '05',
    title: 'Reminder Kontrol',
    desc: 'Anda akan mendapatkan pengingat otomatis via WhatsApp agar tidak melewatkan jadwal kontrol penting.',
    color: 'bg-blush/60',
    iconColor: 'text-rose',
  },
  {
    icon: HeartHandshake,
    num: '06',
    title: 'Pendampingan Berkelanjutan',
    desc: 'Riwayat kunjungan Anda tersimpan. Kami memantau perjalanan kesehatan Anda dari kunjungan ke kunjungan.',
    color: 'bg-cream',
    iconColor: 'text-burgundy',
  },
  {
    icon: Baby,
    num: '07',
    title: 'Persiapan Persalinan',
    desc: 'Bersama, kami mempersiapkan Anda untuk momen berharga kelahiran buah hati dengan penuh keyakinan.',
    color: 'bg-blush/60',
    iconColor: 'text-rose',
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

export default function PatientJourney() {
  const lineRef = useRef(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-100px' })

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <FadeUp className="text-center mb-16">
          <div className="section-tag w-fit mx-auto mb-3">Perjalanan Bersama Kami</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Setiap Langkah,{' '}
            <span className="text-rose">Kami Dampingi</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            Dari booking pertama hingga persiapan persalinan — kami hadir di setiap momen perjalanan kesehatan Anda.
          </p>
        </FadeUp>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute left-1/2 -translate-x-px top-8 bottom-8 w-px bg-blush/60 overflow-hidden"
          >
            <motion.div
              initial={{ scaleY: 0 }}
              animate={lineInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top' }}
              className="w-full h-full bg-rose/40"
            />
          </div>

          <div className="space-y-6 lg:space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isLeft = i % 2 === 0
              return (
                <FadeUp key={step.num} delay={i * 0.06}>
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${i > 0 ? 'lg:-mt-2' : ''}`}>
                    {/* Content — alternates left/right */}
                    <div className={`${isLeft ? 'lg:order-1 lg:text-right' : 'lg:order-3 lg:text-left'} mb-4 lg:mb-0`}>
                      <motion.div
                        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(194,104,94,0.10)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`inline-block rounded-2xl px-6 py-5 ${step.color} max-w-sm w-full`}
                      >
                        <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
                          <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center shrink-0">
                            <Icon size={17} className={step.iconColor} />
                          </div>
                          <h3 className="font-bold text-ink text-base">{step.title}</h3>
                        </div>
                        <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                      </motion.div>
                    </div>

                    {/* Center node */}
                    <div className="hidden lg:flex order-2 justify-center items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 280, damping: 22, delay: i * 0.06 + 0.3 }}
                        className="w-11 h-11 rounded-full bg-white shadow-float border-2 border-blush flex items-center justify-center z-10"
                      >
                        <span className="text-xs font-extrabold text-rose">{step.num}</span>
                      </motion.div>
                    </div>

                    {/* Empty spacer for opposite side */}
                    <div className={`hidden lg:block ${isLeft ? 'order-3' : 'order-1'}`} />
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
