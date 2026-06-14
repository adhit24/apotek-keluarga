'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const galleryItems = [
  {
    id: 1,
    title: 'Ruang Tunggu',
    desc: 'Ruang tunggu yang nyaman dengan suasana hangat dan menenangkan.',
    color: 'from-blush/60 to-cream',
    emoji: '🛋️',
  },
  {
    id: 2,
    title: 'Ruang Konsultasi',
    desc: 'Ruang konsultasi privat dan kondusif untuk diskusi bersama dokter.',
    color: 'from-sage/20 to-sage-light/30',
    emoji: '🩺',
  },
  {
    id: 3,
    title: 'Ruang USG',
    desc: 'Fasilitas USG 4D terkini dengan layar HD untuk pengalaman yang berkesan.',
    color: 'from-burgundy/10 to-blush/30',
    emoji: '📡',
  },
  {
    id: 4,
    title: 'Area Registrasi',
    desc: 'Proses pendaftaran yang mudah dan ramah dengan staf terlatih.',
    color: 'from-cream to-blush/40',
    emoji: '📋',
  },
  {
    id: 5,
    title: 'Tim Medis Kami',
    desc: 'Tim dokter dan paramedis berpengalaman yang siap melayani dengan sepenuh hati.',
    color: 'from-sage-light/40 to-sage/20',
    emoji: '👩‍⚕️',
  },
  {
    id: 6,
    title: 'Suasana Klinik',
    desc: 'Lingkungan klinik yang bersih, nyaman, dan membuat Anda merasa seperti di rumah.',
    color: 'from-blush/40 to-cream',
    emoji: '🏥',
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

export default function ClinicGallery() {
  const [selected, setSelected] = useState<null | typeof galleryItems[0]>(null)
  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' })

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <FadeUp className="text-center mb-12">
          <div className="section-tag w-fit mx-auto mb-3">Klinik Kami</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Kenali Klinik Kami{' '}
            <span className="text-rose">Sebelum Berkunjung</span>
          </h2>
          <p className="text-muted max-w-lg mx-auto leading-relaxed">
            Kami ingin Anda merasa nyaman bahkan sebelum melangkah masuk. Inilah suasana Apotek Keluarga.
          </p>
        </FadeUp>

        {/* Gallery grid */}
        <motion.div
          ref={gridRef}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {galleryItems.map((item, i) => (
            <motion.button
              key={item.id}
              variants={{
                hidden: { opacity: 0, scale: 0.94, filter: 'blur(8px)' },
                visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(item)}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${item.color} aspect-[4/3] flex flex-col items-center justify-center gap-3 group cursor-pointer ${
                i === 0 ? 'md:col-span-2 md:row-span-2 md:aspect-auto' : ''
              }`}
              aria-label={`Lihat ${item.title}`}
            >
              {/* Emoji placeholder */}
              <span className="text-5xl md:text-6xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                {item.emoji}
              </span>
              <div className="text-center px-4">
                <div className="font-bold text-ink text-sm md:text-base">{item.title}</div>
                <div className="text-xs text-muted hidden md:block mt-1 leading-snug max-w-[200px]">{item.desc}</div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-all duration-300 rounded-2xl" />
            </motion.button>
          ))}
        </motion.div>

        <FadeUp delay={0.15} className="text-center mt-8">
          <p className="text-sm text-muted">
            Foto klinik akan segera tersedia.{' '}
            <a
              href="https://wa.me/6285220024400"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose font-semibold hover:underline"
            >
              Kunjungi kami langsung →
            </a>
          </p>
        </FadeUp>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-lg w-full rounded-3xl bg-gradient-to-br ${selected.color} p-12 flex flex-col items-center text-center shadow-float`}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Tutup"
              >
                <X size={15} className="text-ink" />
              </button>
              <span className="text-7xl mb-5">{selected.emoji}</span>
              <h3 className="text-xl font-extrabold text-ink mb-2">{selected.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{selected.desc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
