'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const concerns = [
  { emoji: '🤰', text: 'Baru mengetahui sedang hamil dan tidak tahu harus mulai dari mana' },
  { emoji: '👶', text: 'Kehamilan pertama — cemas dengan setiap perubahan yang terjadi' },
  { emoji: '🌸', text: 'Ingin program hamil tapi belum tahu langkah yang tepat' },
  { emoji: '📅', text: 'Jadwal kontrol berantakan, sering terlewat atau bingung kapan harus kontrol' },
  { emoji: '🔍', text: 'Tidak yakin kapan waktu yang tepat untuk USG pertama kali' },
  { emoji: '💭', text: 'Khawatir dengan perkembangan janin namun tidak ada yang bisa ditanya' },
  { emoji: '🏥', text: 'Belum menemukan dokter kandungan yang bisa dipercaya dan nyaman diajak bicara' },
  { emoji: '💊', text: 'Bingung dengan vitamin dan nutrisi yang tepat selama kehamilan' },
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

export default function CommonConcerns() {
  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' })

  return (
    <section className="py-10 md:py-16 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Concerns list */}
          <div>
            <FadeUp>
              <div className="section-tag w-fit mb-4">Kami Memahami Anda</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3 leading-snug">
                Mungkin Anda Sedang{' '}
                <span className="text-rose">Mengalami Ini</span>
              </h2>
              <p className="text-muted leading-relaxed mb-8 max-w-md">
                Setiap ibu memiliki kekhawatirannya masing-masing. Dan itu sangat wajar.
                Kami hadir untuk menjawab setiap pertanyaan dengan sabar dan penuh pengertian.
              </p>
            </FadeUp>

            <motion.div
              ref={gridRef}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
              initial="hidden"
              animate={gridInView ? 'visible' : 'hidden'}
              className="space-y-3"
            >
              {concerns.map((c) => (
                <motion.div
                  key={c.text}
                  variants={{
                    hidden: { opacity: 0, x: -16, filter: 'blur(6px)' },
                    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="flex items-start gap-3 bg-surface rounded-xl px-4 py-3.5 shadow-xs cursor-default"
                >
                  <span className="text-xl shrink-0 mt-0.5">{c.emoji}</span>
                  <p className="text-sm text-ink/80 leading-snug">{c.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Response / solution panel */}
          <FadeUp delay={0.15} className="lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl shadow-float p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-blush/50 flex items-center justify-center mb-6">
                <CheckCircle2 size={28} className="text-rose" />
              </div>

              <h3 className="text-xl font-extrabold text-ink mb-4">
                Apotek Keluarga Hadir Untuk Anda
              </h3>

              <div className="space-y-4 mb-8">
                {[
                  { title: 'Konsultasi Tanpa Rasa Khawatir', desc: 'Ceritakan apa yang Anda rasakan. Tidak ada pertanyaan yang terlalu sederhana bagi kami.' },
                  { title: 'Jadwal Kontrol Terstruktur', desc: 'Kami membuatkan jadwal ANC yang terencana dari trimester pertama hingga persalinan.' },
                  { title: 'Pemantauan Jarak Jauh', desc: 'Tidak perlu menunggu jadwal berikutnya untuk bertanya. WhatsApp kami selalu siap.' },
                  { title: 'Rekam Medis Digital', desc: 'Riwayat kunjungan tersimpan rapi. Kami mengenal perkembangan kehamilan Anda secara personal.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-sage/30 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-sage-dark" />
                    </div>
                    <div>
                      <div className="font-semibold text-ink text-sm mb-0.5">{item.title}</div>
                      <div className="text-xs text-muted leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/booking" className="btn-primary w-full justify-center text-sm">
                    Konsultasi Sekarang <ArrowRight size={15} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <a
                    href="https://wa.me/6285220024400?text=Halo%20dok%2C%20saya%20ingin%20konsultasi%20mengenai%20kehamilan%20saya%20%F0%9F%99%8F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa w-full justify-center text-sm"
                  >
                    <span>💬</span> Tanya via WhatsApp
                  </a>
                </motion.div>
              </div>
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  )
}
