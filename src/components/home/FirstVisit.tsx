'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ClipboardList, MessageSquare, Stethoscope, Scan, FileText, CalendarCheck,
} from 'lucide-react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const visitSteps = [
  {
    icon: ClipboardList,
    num: '1',
    title: 'Registrasi',
    desc: 'Daftarkan diri dengan mengisi data sederhana. Antrian digital menjaga waktu Anda tetap terencana.',
    duration: '~5 mnt',
  },
  {
    icon: MessageSquare,
    num: '2',
    title: 'Konsultasi Awal',
    desc: 'Ceritakan keluhan, riwayat kehamilan, dan pertanyaan Anda. dr. Wildan mendengarkan dengan penuh perhatian.',
    duration: '~15 mnt',
  },
  {
    icon: Stethoscope,
    num: '3',
    title: 'Pemeriksaan Fisik',
    desc: 'Pemeriksaan fisik menyeluruh sesuai kondisi Anda — tenang, nyaman, dan profesional.',
    duration: '~10 mnt',
  },
  {
    icon: Scan,
    num: '4',
    title: 'USG (bila diperlukan)',
    desc: 'Bila diindikasikan, USG dilakukan untuk memastikan kondisi janin dan kehamilan Anda secara akurat.',
    duration: '~15 mnt',
  },
  {
    icon: FileText,
    num: '5',
    title: 'Diagnosis & Rekomendasi',
    desc: 'Dokter menjelaskan temuan dengan bahasa yang mudah dipahami, lengkap dengan anjuran dan resep bila perlu.',
    duration: '~10 mnt',
  },
  {
    icon: CalendarCheck,
    num: '6',
    title: 'Rencana Kontrol Berikutnya',
    desc: 'Anda pulang dengan jadwal kontrol berikutnya yang jelas, sehingga perjalanan kehamilan tetap terencana.',
    duration: 'Terjadwal',
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

export default function FirstVisit() {
  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' })

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <FadeUp className="max-w-2xl mb-14">
          <div className="section-tag w-fit mb-3">Kunjungan Pertama</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4 leading-snug">
            Apa yang Akan Anda Dapatkan{' '}
            <span className="text-rose">Saat Kunjungan Pertama?</span>
          </h2>
          <p className="text-muted leading-relaxed">
            Kami tahu kunjungan pertama ke dokter kandungan bisa terasa menegangkan.
            Ini yang akan Anda alami — dan mengapa tidak perlu khawatir.
          </p>
        </FadeUp>

        {/* Steps grid */}
        <motion.div
          ref={gridRef}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
        >
          {visitSteps.map((step) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -5, boxShadow: '0 14px 36px rgba(194,104,94,0.10)' }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                className="bg-cream rounded-2xl p-6 relative overflow-hidden group"
              >
                {/* Step number watermark */}
                <div className="absolute top-4 right-4 text-5xl font-extrabold text-blush/30 leading-none select-none">
                  {step.num}
                </div>

                <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center mb-4 group-hover:bg-rose/15 transition-colors">
                  <Icon size={18} className="text-rose" />
                </div>

                <h3 className="font-bold text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4">{step.desc}</p>

                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage-dark bg-sage-light/40 px-2.5 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-dark" />
                  {step.duration}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom reassurance */}
        <FadeUp delay={0.2}>
          <div className="bg-blush/40 rounded-3xl px-8 py-8 flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="max-w-xl">
              <p className="font-bold text-ink mb-1.5">Tidak perlu khawatir. Kami siap mendampingi Anda.</p>
              <p className="text-sm text-muted leading-relaxed">
                Tim kami memastikan Anda merasa nyaman sejak langkah pertama masuk. Tidak ada pertanyaan yang terlalu sederhana — kami di sini untuk Anda.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="shrink-0">
              <Link href="/booking" className="btn-primary whitespace-nowrap">
                Buat Janji Pertama <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
