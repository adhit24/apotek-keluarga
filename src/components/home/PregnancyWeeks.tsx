'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Baby, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const weeks = [
  {
    week: 8,
    label: 'Minggu 8',
    title: 'Detak Jantung Mulai Terdengar',
    desc: 'Janin sebesar biji kopi. Detak jantung sudah bisa terdeteksi melalui USG. Ini adalah momen emosional yang tidak terlupakan bagi calon ibu.',
    milestone: 'USG Pertama Dianjurkan',
    icon: '❤️',
    color: 'bg-blush/40',
  },
  {
    week: 12,
    label: 'Minggu 12',
    title: 'Akhir Trimester Pertama',
    desc: 'Risiko keguguran menurun signifikan. Janin sudah memiliki semua organ utama. Pemeriksaan TORCH dan skrining awal Down Syndrome dapat dilakukan.',
    milestone: 'Skrining Trimester 1',
    icon: '🌱',
    color: 'bg-sage-light/40',
  },
  {
    week: 20,
    label: 'Minggu 20',
    title: 'USG Anomali & Jenis Kelamin',
    desc: 'Pemeriksaan anatomi janin secara lengkap. Anda bisa mengetahui jenis kelamin bayi. USG 4D memberikan gambaran wajah janin yang memukau.',
    milestone: 'USG Anomali & Morfologi',
    icon: '🔍',
    color: 'bg-blush/40',
  },
  {
    week: 28,
    label: 'Minggu 28',
    title: 'Memasuki Trimester Ketiga',
    desc: 'Janin mulai menyimpan lemak dan tumbuh pesat. Penting memantau posisi janin dan pergerakan aktif. Pemeriksaan tekanan darah rutin sangat dianjurkan.',
    milestone: 'Pantau Pertumbuhan Janin',
    icon: '⚡',
    color: 'bg-sage-light/40',
  },
  {
    week: 36,
    label: 'Minggu 36',
    title: 'Persiapan Persalinan',
    desc: 'Janin sudah hampir siap lahir. Dokter mengevaluasi posisi kepala, berat janin, dan jalur persalinan. Saatnya mempersiapkan tas persalinan dan rencana melahirkan.',
    milestone: 'Evaluasi Persalinan',
    icon: '🎀',
    color: 'bg-blush/40',
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

export default function PregnancyWeeks() {
  const [active, setActive] = useState(0)
  const tabRef = useRef(null)
  const tabInView = useInView(tabRef, { once: true, margin: '-40px' })
  const activeWeek = weeks[active]

  return (
    <section className="py-10 md:py-16 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <FadeUp className="text-center mb-12">
          <div className="section-tag w-fit mx-auto mb-3">Perjalanan Kehamilan</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Setiap Minggu{' '}
            <span className="text-rose">Ada Kejutan Baru</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            Pahami perkembangan kehamilan Anda setiap tahap. Ketahui kapan pemeriksaan penting perlu dilakukan.
          </p>
        </FadeUp>

        {/* Week selector tabs */}
        <motion.div
          ref={tabRef}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate={tabInView ? 'visible' : 'hidden'}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {weeks.map((w, i) => (
            <motion.button
              key={w.week}
              variants={{
                hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
              onClick={() => setActive(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                active === i
                  ? 'bg-rose text-white shadow-btn'
                  : 'bg-white text-ink/60 hover:text-ink shadow-xs'
              }`}
            >
              {active === i && (
                <motion.div
                  layoutId="week-pill"
                  className="absolute inset-0 bg-rose rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {w.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Active week detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`${activeWeek.color} rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center`}
          >
            {/* Left: info */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl">{activeWeek.icon}</span>
                <div>
                  <div className="text-xs font-bold text-rose uppercase tracking-widest">{activeWeek.label}</div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-ink">{activeWeek.title}</h3>
                </div>
              </div>
              <p className="text-muted leading-relaxed mb-6">{activeWeek.desc}</p>
              <div className="inline-flex items-center gap-2 bg-white/70 rounded-xl px-4 py-2.5">
                <Baby size={15} className="text-rose shrink-0" />
                <span className="text-sm font-semibold text-ink">{activeWeek.milestone}</span>
              </div>
            </div>

            {/* Right: CTA card */}
            <div className="bg-white/70 rounded-2xl p-6 shadow-xs">
              <h4 className="font-extrabold text-ink mb-2">Apakah ini usia kehamilan Anda?</h4>
              <p className="text-sm text-muted leading-relaxed mb-5">
                Konsultasikan perkembangan kehamilan minggu {activeWeek.week} Anda dengan dr. Wildan.
                Kami memastikan setiap tahap berjalan optimal.
              </p>
              <div className="space-y-2.5">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/booking" className="btn-primary w-full justify-center text-sm">
                    Konsultasi Minggu {activeWeek.week} <ArrowRight size={14} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <a
                    href={`https://wa.me/6285220024400?text=Halo%20dok%2C%20kehamilan%20saya%20sudah%20minggu%20${activeWeek.week}.%20Saya%20ingin%20konsultasi%20%F0%9F%99%8F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa w-full justify-center text-sm"
                  >
                    <span>💬</span> Tanya via WhatsApp
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <FadeUp delay={0.2} className="flex justify-center gap-3 mt-6">
          <motion.button
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-ink disabled:opacity-30 transition-opacity"
            aria-label="Sebelumnya"
          >
            <ChevronLeft size={16} />
          </motion.button>
          <motion.button
            onClick={() => setActive((a) => Math.min(weeks.length - 1, a + 1))}
            disabled={active === weeks.length - 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-ink disabled:opacity-30 transition-opacity"
            aria-label="Berikutnya"
          >
            <ChevronRight size={16} />
          </motion.button>
        </FadeUp>

      </div>
    </section>
  )
}
