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
import TrustBar from '@/components/home/TrustBar'
import PatientJourney from '@/components/home/PatientJourney'
import CommonConcerns from '@/components/home/CommonConcerns'
import FirstVisit from '@/components/home/FirstVisit'
import GoogleReviews from '@/components/home/GoogleReviews'
import PregnancyCompanion from '@/components/home/PregnancyCompanion'
import PregnancyWeeks from '@/components/home/PregnancyWeeks'
import HealthTools from '@/components/home/HealthTools'
import ClinicGallery from '@/components/home/ClinicGallery'
import EmotionalCTA from '@/components/home/EmotionalCTA'

// ── Animation primitives ──────────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
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
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger grid container
function StaggerGrid({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
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
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-3xl bg-blush/40 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] max-w-xl bg-sage-light/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5 }}
              className="section-tag mb-6"
            >
              <Stethoscope size={13} />
              Dokter Kandungan & THT — Cirebon
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.08 }}
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
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.65, delay: 0.18 }}
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
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/booking" className="btn-primary text-base px-7 py-3.5">
                  Buat Janji Sekarang
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
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
              ].map((b, i) => (
                <motion.div
                  key={b.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  className="flex items-center gap-1.5"
                >
                  <span>{b.icon}</span>
                  <span className="font-medium">{b.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Photo column */}
          <motion.div
            initial={{ opacity: 0, x: 40, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative mx-8">
              {/* Arch photo */}
              <div className="arch-card bg-blush/60 w-64 h-[22rem] md:w-72 md:h-[26rem] overflow-hidden">
                <Image
                  src="/dr-wildan.png"
                  alt="dr. Wildan A. Sutrisno, SpOG"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Doctor name strip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.95 }}
                className="absolute bottom-0 left-0 right-0 bg-burgundy/90 backdrop-blur-sm text-white px-5 py-3 text-center rounded-b-[2rem]"
              >
                <div className="font-bold text-sm">dr. Wildan A. Sutrisno</div>
                <div className="text-xs text-white/70">SpOG · Dokter Kandungan</div>
              </motion.div>

              {/* Rating badge — floating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.7 }}
                className="absolute -left-14 top-[52%]"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                  className="bg-white rounded-card shadow-card px-3.5 py-2.5 flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center shrink-0">
                    <Star size={16} className="text-rose fill-rose" />
                  </div>
                  <div>
                    <div className="font-extrabold text-ink text-sm leading-tight">4.9/5</div>
                    <div className="text-[11px] text-muted">200+ Pasien Puas</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Queue badge — floating offset */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.85 }}
                className="absolute -right-14 top-[42%]"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 1.2 }}
                  className="bg-white rounded-card shadow-card px-3.5 py-2.5"
                >
                  <div className="text-[11px] text-muted mb-0.5">Antrian Digital</div>
                  <div className="font-extrabold text-rose text-base leading-tight">AK-007</div>
                  <div className="text-[11px] text-sage-dark font-medium">Estimasi 15 menit</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted/50"
      >
        <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
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

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((service) => (
            <StaggerItem key={service.id}>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>
                <Link
                  href={`/services#${service.slug}`}
                  className="group block bg-cream hover:bg-blush/20 rounded-card p-6 transition-colors duration-200 hover:shadow-card h-full"
                >
                  <motion.div
                    className="text-4xl mb-4 w-fit"
                    whileHover={{ scale: 1.2, rotate: -6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="font-bold text-ink text-base mb-2 group-hover:text-rose transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-rose text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1 duration-200">
                    Selengkapnya <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <FadeUp delay={0.35} className="text-center mt-10">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/services" className="btn-outline">
              Lihat Semua Layanan
              <ArrowRight size={16} />
            </Link>
          </motion.div>
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
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -right-4 top-8 bg-burgundy text-white rounded-card px-5 py-3 text-center shadow-float"
              >
                <div className="font-extrabold text-2xl">10+</div>
                <div className="text-xs text-white/70">Tahun Pengalaman</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1.5 }}
                className="absolute -left-4 bottom-10 bg-white rounded-card px-4 py-2.5 shadow-card flex items-center gap-2"
              >
                <CheckCircle2 size={18} className="text-sage-dark" />
                <div>
                  <div className="text-xs font-bold text-ink">Anggota POGI</div>
                  <div className="text-xs text-muted">Tersertifikasi</div>
                </div>
              </motion.div>
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
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.02 }}
                    className="bg-surface rounded-card p-4 shadow-xs"
                  >
                    <div className="text-xs text-muted mb-1 font-medium">{item.label}</div>
                    <div className="text-sm font-bold text-ink">{item.value}</div>
                  </motion.div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.2} className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/about" className="btn-primary">
                  Profil Lengkap <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a href="https://wa.me/6285220024400" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <span>💬</span> Tanya Dokter
                </a>
              </motion.div>
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

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyItems.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(194,104,94,0.12)' }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="bg-cream rounded-card p-6 h-full cursor-default"
              >
                <motion.div
                  className="text-3xl mb-4 w-fit"
                  whileHover={{ scale: 1.25, rotate: -8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="font-bold text-ink text-base mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
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
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 350 }}
              >
                <Star size={20} className="text-rose fill-rose" />
              </motion.div>
            ))}
            <span className="ml-2 text-muted text-sm font-medium">4.9 / 5 rata-rata</span>
          </div>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t) => (
            <StaggerItem key={t.id}>
              <motion.div
                whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(110,42,48,0.1)' }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="bg-surface rounded-card p-6 shadow-soft h-full flex flex-col cursor-default"
              >
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
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
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
            <Clock size={12} /> Jadwal Praktek
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
              <motion.div
                key={d.day}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
                className={`grid grid-cols-3 px-5 py-3.5 items-center transition-colors hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''} ${d.day === 'Minggu' ? 'opacity-40' : ''}`}
              >
                <div className="text-white font-semibold text-sm">{d.day}</div>
                <div className={`text-sm ${d.wildan === 'Libur' ? 'text-white/30 italic' : 'text-blush font-medium'}`}>{d.wildan}</div>
                <div className={`text-sm ${d.feb === 'Libur' ? 'text-white/30 italic' : 'text-sage-light font-medium'}`}>{d.feb}</div>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.3} className="text-center mt-8 flex flex-wrap justify-center gap-4">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/booking" className="btn-primary bg-white! text-rose! border-white shadow-none">
              Booking Sekarang <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/schedule" className="btn-outline border-white/40 text-white hover:bg-white/10">
              Jadwal Lengkap
            </Link>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Articles ──────────────────────────────────────────────────────────────────
function ArticlesPreview() {
  const emojiMap: Record<string, string> = {
    Kehamilan: '🤰', USG: '📡', 'Program Hamil': '🌸', Panduan: '📖',
  }
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeUp className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="section-tag mb-4">Edukasi Kesehatan</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink">Artikel & Tips Kehamilan</h2>
          </div>
          <Link href="/articles" className="btn-outline shrink-0">
            Semua Artikel <ArrowRight size={15} />
          </Link>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <StaggerItem key={article.id}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              >
                <Link
                  href={`/articles/${article.slug}`}
                  className="group block bg-cream rounded-card overflow-hidden hover:shadow-card transition-shadow duration-300 h-full"
                >
                  <div className="h-44 bg-gradient-to-br from-blush/40 to-sage-light/30 flex items-center justify-center relative overflow-hidden">
                    <motion.span
                      className="text-6xl opacity-30"
                      whileHover={{ scale: 1.15, opacity: 0.5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {emojiMap[article.category] ?? '📖'}
                    </motion.span>
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
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
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
            <FadeUp key={faq.id} delay={i * 0.04}>
              <div className="bg-surface rounded-card overflow-hidden shadow-xs">
                <motion.button
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="font-semibold text-ink text-sm pr-4">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: open === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 text-muted"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </motion.button>
                <AnimatePresence initial={false}>
                  {open === faq.id && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 pb-5 pt-1 text-muted text-sm leading-relaxed border-t border-blush/40">
                        {faq.answer}
                      </div>
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
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/booking" className="btn-primary text-base px-8 py-4">
                Buat Janji Sekarang <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a
                href="https://wa.me/6285220024400"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa text-base px-8 py-4"
              >
                <span className="text-xl">💬</span>
                Tanya via WhatsApp
              </a>
            </motion.div>
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
        {/* ── Core ── */}
        <Hero />
        <TrustBar />
        <FeaturedServices />
        <PatientJourney />
        <AboutDoctorSection />
        <CommonConcerns />
        <WhyChooseUs />
        <FirstVisit />
        <GoogleReviews />
        <SchedulePreview />
        <PregnancyCompanion />
        <PregnancyWeeks />
        <ClinicGallery />
        <ArticlesPreview />
        <HealthTools />
        <FAQSection />
        <EmotionalCTA />
      </main>
      <Footer />
    </>
  )
}
