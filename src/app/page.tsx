'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Star,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Stethoscope,
  CheckCircle2,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { services, testimonials, articles, faqs, whyItems } from '@/lib/data'

// ── Animation helpers ─────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream">
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-3xl bg-blush/40 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] max-w-xl bg-sage-light/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="section-tag mb-6"
            >
              <Stethoscope size={13} />
              Dokter Kandungan & THT — Cirebon
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
            >
              <span className="script-accent text-3xl md:text-4xl block mb-2">
                Bersama merawat,
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-ink leading-[1.15] mb-6">
                Menemani Perjalanan{' '}
                <span className="text-rose">Kesehatan Ibu</span>{' '}
                dan Keluarga
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted text-lg leading-relaxed mb-8 max-w-lg"
            >
              Konsultasi kandungan, USG kehamilan, program hamil, dan layanan
              kesehatan keluarga — dengan pelayanan hangat, profesional, dan
              penuh perhatian di Cirebon.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/booking" className="btn-primary text-base px-7 py-3.5">
                Buat Janji Sekarang
                <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/6285220024400"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa text-base px-7 py-3.5"
              >
                <span className="text-lg">💬</span>
                WhatsApp Konsultasi
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-5 mt-10 text-sm text-muted"
            >
              {[
                { icon: '✅', text: 'Dokter SpOG Bersertifikat' },
                { icon: '📅', text: 'Booking Online 24 Jam' },
                { icon: '🏥', text: 'Antrian Digital' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5">
                  <span>{b.icon}</span>
                  <span className="font-medium">{b.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="arch-card bg-blush/60 w-72 h-96 md:w-80 md:h-[28rem] overflow-hidden">
                <Image
                  src="/dr-wildan.png"
                  alt="dr. Wildan A. Sutrisno, SpOG"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -left-6 top-10 bg-white rounded-card shadow-card px-4 py-3 flex items-center gap-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center">
                  <Star size={18} className="text-rose fill-rose" />
                </div>
                <div>
                  <div className="font-extrabold text-ink text-base">4.9/5</div>
                  <div className="text-xs text-muted">200+ Pasien Puas</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.85 }}
                className="absolute -right-5 bottom-16 bg-white rounded-card shadow-card px-4 py-3"
              >
                <div className="text-xs text-muted mb-1">Antrian Digital</div>
                <div className="font-extrabold text-rose text-lg">AK-007</div>
                <div className="text-xs text-sage-dark font-medium">Estimasi 15 menit</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.95 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-burgundy/90 backdrop-blur-sm text-white rounded-card px-5 py-2.5 text-center whitespace-nowrap"
              >
                <div className="font-bold text-sm">dr. Wildan A. Sutrisno</div>
                <div className="text-xs text-white/70">SpOG · Dokter Kandungan</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted/50"
      >
        <span className="text-xs font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── Featured Services ─────────────────────────────────────────────────────────
function FeaturedServices() {
  const featured = services.filter((s) => s.highlight)
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeUp className="text-center mb-12">
          <div className="section-tag mb-4 mx-auto w-fit">Layanan Unggulan</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Apa yang Bisa Kami Bantu?
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Layanan kesehatan kandungan dan keluarga yang lengkap, didampingi dokter spesialis berpengalaman.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((service, i) => (
            <FadeUp key={service.id} delay={i * 0.08}>
              <Link
                href={`/services#${service.slug}`}
                className="group block bg-cream hover:bg-blush/30 rounded-card p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-bold text-ink text-base mb-2 group-hover:text-rose transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted text-sm leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-rose text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Selengkapnya <ArrowRight size={14} />
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.4} className="text-center mt-10">
          <Link href="/services" className="btn-outline">
            Lihat Semua Layanan
            <ArrowRight size={16} />
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}

// ── About Doctor ──────────────────────────────────────────────────────────────
function AboutDoctorSection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <FadeIn>
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div className="bg-blush/50 rounded-2xl p-2">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">
                  <Image
                    src="/dr-wildan.png"
                    alt="dr. Wildan A. Sutrisno, SpOG"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -right-4 top-8 bg-burgundy text-white rounded-card px-5 py-3 text-center shadow-float">
                <div className="font-extrabold text-2xl">10+</div>
                <div className="text-xs text-white/70">Tahun Pengalaman</div>
              </div>
              <div className="absolute -left-4 bottom-10 bg-white rounded-card px-4 py-2.5 shadow-card flex items-center gap-2">
                <CheckCircle2 size={18} className="text-sage-dark" />
                <div>
                  <div className="text-xs font-bold text-ink">Anggota POGI</div>
                  <div className="text-xs text-muted">Tersertifikasi</div>
                </div>
              </div>
            </div>
          </FadeIn>

          <div>
            <FadeUp>
              <div className="section-tag mb-5">Profil Dokter</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-2">
                dr. Wildan A. Sutrisno
              </h2>
              <p className="text-rose font-semibold text-lg mb-6">
                Spesialis Obstetri & Ginekologi (SpOG)
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="text-muted leading-relaxed mb-6 text-base">
                Dokter kandungan yang dikenal hangat dan teliti. dr. Wildan berdedikasi
                mendampingi setiap ibu dari momen program hamil, perjalanan kehamilan,
                hingga pasca melahirkan — dengan pendekatan personal yang membuat pasien
                merasa aman dan dipahami.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Spesialisasi', value: 'Obstetri & Ginekologi' },
                  { label: 'Sertifikasi', value: 'SpOG — POGI' },
                  { label: 'Lokasi Praktek', value: 'Cirebon, Jawa Barat' },
                  { label: 'Konsultasi via', value: 'WhatsApp & Online' },
                ].map((item) => (
                  <div key={item.label} className="bg-surface rounded-card p-4 shadow-xs">
                    <div className="text-xs text-muted mb-1 font-medium">{item.label}</div>
                    <div className="text-sm font-bold text-ink">{item.value}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.2} className="flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary">
                Profil Lengkap
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/6285220024400"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <span>💬</span>
                Tanya Dokter
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Why Choose Us ─────────────────────────────────────────────────────────────
function WhyChooseUs() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeUp className="text-center mb-14">
          <div className="section-tag mb-4 mx-auto w-fit">Keunggulan Kami</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Mengapa Pilih Apotek Keluarga?
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Kami bukan sekadar klinik. Kami teman perjalanan kesehatan yang menemani Anda di setiap tahap.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyItems.map((item, i) => (
            <FadeUp key={item.title} delay={i * 0.07}>
              <div className="group bg-cream rounded-card p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-ink text-base mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-20 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <FadeUp className="text-center mb-14">
          <div className="section-tag mb-4 mx-auto w-fit">Kata Mereka</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Ratusan Ibu Sudah Mempercayai Kami
          </h2>
          <div className="flex items-center justify-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="text-rose fill-rose" />
            ))}
            <span className="ml-2 text-muted text-sm font-medium">4.9 / 5 rata-rata</span>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t, i) => (
            <FadeUp key={t.id} delay={i * 0.06}>
              <div className="bg-surface rounded-card p-6 shadow-soft h-full flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-rose fill-rose" />
                  ))}
                </div>
                <p className="text-ink/80 text-sm leading-relaxed flex-1 mb-5">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-blush">
                  <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center font-bold text-rose text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-ink text-sm">{t.name}</div>
                    <div className="text-xs text-muted">{t.role} · {t.date}</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Schedule Preview ──────────────────────────────────────────────────────────
function SchedulePreview() {
  const days = [
    { day: 'Senin', wildan: '17.00–19.00', feb: '17.00–selesai' },
    { day: 'Selasa', wildan: '15.00–18.00', feb: '17.00–selesai' },
    { day: 'Rabu', wildan: '11.00–12.00 & 15.00–18.00', feb: '17.00–selesai' },
    { day: 'Kamis', wildan: '11.00–12.00 & 15.00–18.00', feb: '17.00–selesai' },
    { day: 'Jumat', wildan: '17.00–19.00', feb: '17.00–selesai' },
    { day: 'Sabtu', wildan: '11.00–15.00', feb: '09.00–selesai' },
    { day: 'Minggu', wildan: 'Libur', feb: 'Libur' },
  ]

  return (
    <section className="py-20 bg-burgundy">
      <div className="max-w-6xl mx-auto px-4">
        <FadeUp className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-full px-4 py-1.5 mb-4">
            <Clock size={12} />
            Jadwal Praktek
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Kapan Kami Bisa Melayani Anda?
          </h2>
          <p className="text-white/60 text-base max-w-md mx-auto">
            Pilih hari dan dokter yang sesuai. Booking online tersedia 24 jam.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/10 px-5 py-3 text-xs font-bold text-white/60 uppercase tracking-wider">
              <div>Hari</div>
              <div>dr. Wildan (SpOG)</div>
              <div>dr. Febryanti (THT)</div>
            </div>
            {days.map((d, i) => (
              <div
                key={d.day}
                className={`grid grid-cols-3 px-5 py-3.5 items-center ${i % 2 === 0 ? 'bg-white/5' : ''} ${d.day === 'Minggu' ? 'opacity-40' : ''}`}
              >
                <div className="text-white font-semibold text-sm">{d.day}</div>
                <div className={`text-sm ${d.wildan === 'Libur' ? 'text-white/30 italic' : 'text-blush font-medium'}`}>
                  {d.wildan}
                </div>
                <div className={`text-sm ${d.feb === 'Libur' ? 'text-white/30 italic' : 'text-sage-light font-medium'}`}>
                  {d.feb}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.3} className="text-center mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/booking" className="btn-primary bg-white! text-rose! border-white shadow-none">
            Booking Sekarang
            <ArrowRight size={16} />
          </Link>
          <Link href="/schedule" className="btn-outline border-white/40 text-white hover:bg-white/10">
            Jadwal Lengkap
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Articles ──────────────────────────────────────────────────────────────────
function ArticlesPreview() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeUp className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="section-tag mb-4">Edukasi Kesehatan</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink">
              Artikel & Tips Kehamilan
            </h2>
          </div>
          <Link href="/articles" className="btn-outline shrink-0">
            Semua Artikel <ArrowRight size={15} />
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <FadeUp key={article.id} delay={i * 0.08}>
              <div className="group bg-cream rounded-card overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <div className="h-44 bg-gradient-to-br from-blush to-blush-deep flex items-center justify-center">
                  <span className="text-5xl opacity-60">📖</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-rose bg-blush/50 px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted">{article.readTime} baca</span>
                  </div>
                  <h3 className="font-bold text-ink text-base leading-snug mb-2 group-hover:text-rose transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted text-sm line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  <div className="mt-4 text-xs text-muted/70">{article.date}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-3xl mx-auto px-4">
        <FadeUp className="text-center mb-12">
          <div className="section-tag mb-4 mx-auto w-fit">FAQ</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">
            Pertanyaan yang Sering Ditanya
          </h2>
          <p className="text-muted">Tidak menemukan jawaban? Hubungi kami via WhatsApp.</p>
        </FadeUp>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeUp key={faq.id} delay={i * 0.05}>
              <div className="bg-surface rounded-card overflow-hidden shadow-xs">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-blush/20 transition-colors"
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                >
                  <span className="font-semibold text-ink text-sm pr-4">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: open === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-muted"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {open === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 pb-5 text-muted text-sm leading-relaxed">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-20 bg-blush/40">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <FadeUp>
          <span className="script-accent text-4xl block mb-3">Siap memulai?</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-5">
            Buat Janji Konsultasi Hari Ini
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Jadwalkan kunjungan Anda sekarang. Proses booking mudah, cepat, dan tanpa antre lama.
            Kami siap menyambut Anda dengan hangat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="btn-primary text-base px-8 py-4">
              Buat Janji Sekarang <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/6285220024400"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-base px-8 py-4"
            >
              <span className="text-xl">💬</span>
              Tanya via WhatsApp
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-sage-dark" />
              Jl. Gerilyawan No.5, Cirebon
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-sage-dark" />
              0852-2002-4400
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedServices />
        <AboutDoctorSection />
        <WhyChooseUs />
        <Testimonials />
        <SchedulePreview />
        <ArticlesPreview />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
