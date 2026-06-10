'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Stethoscope,
  PartyPopper,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { doctors, services, type Doctor, type Session, type TimeSlot } from '@/lib/data'

// ── Types ─────────────────────────────────────────────────────────────────────
interface BookingState {
  service: string
  serviceObj: (typeof services)[0] | null
  doctor: Doctor | null
  dayName: string
  session: Session | null
  slot: TimeSlot | null
  patientName: string
  patientPhone: string
  patientNotes: string
  isNewPatient: boolean
}

const STEPS = [
  { id: 1, label: 'Layanan', icon: Stethoscope },
  { id: 2, label: 'Dokter & Jadwal', icon: Calendar },
  { id: 3, label: 'Pilih Slot', icon: Clock },
  { id: 4, label: 'Data Pasien', icon: User },
  { id: 5, label: 'Konfirmasi', icon: Check },
]

const DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

// ── Queue number generator ────────────────────────────────────────────────────
function getNextQueueNumber(): string {
  if (typeof window === 'undefined') return 'AK-001'
  const stored = localStorage.getItem('ak_queue_counter')
  const next = stored ? parseInt(stored) + 1 : 1
  localStorage.setItem('ak_queue_counter', String(next))
  return `AK-${String(next).padStart(3, '0')}`
}

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = current > step.id
        const active = current === step.id
        const Icon = step.icon
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  scale: active ? 1.1 : 1,
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  done
                    ? 'step-indicator-done'
                    : active
                    ? 'step-indicator-active'
                    : 'step-indicator-pending'
                }`}
              >
                {done ? (
                  <Check size={16} />
                ) : (
                  <Icon size={15} />
                )}
              </motion.div>
              <span
                className={`text-[10px] font-semibold hidden sm:block ${
                  active ? 'text-rose' : done ? 'text-sage-dark' : 'text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-10 md:w-16 h-0.5 mx-1 mb-4 transition-colors duration-300 ${
                  current > step.id ? 'bg-sage' : 'bg-blush'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Step 1: Select Service ────────────────────────────────────────────────────
function Step1Service({
  booking,
  setBooking,
  onNext,
}: {
  booking: BookingState
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>
  onNext: () => void
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2">Pilih Layanan</h2>
      <p className="text-muted mb-8">Layanan apa yang Anda butuhkan hari ini?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setBooking((b) => ({ ...b, service: s.id, serviceObj: s }))
            }}
            className={`group text-left p-4 rounded-card transition-all duration-200 border-2 ${
              booking.service === s.id
                ? 'border-rose bg-rose/5 shadow-btn'
                : 'border-transparent bg-cream hover:border-blush-deep hover:bg-blush/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="font-semibold text-ink text-sm">{s.name}</div>
                <div className="text-xs text-muted mt-0.5">{s.duration}</div>
              </div>
              {booking.service === s.id && (
                <div className="ml-auto shrink-0">
                  <Check size={16} className="text-rose" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!booking.service}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
      >
        Lanjutkan
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ── Step 2: Select Doctor & Day ───────────────────────────────────────────────
function Step2DoctorDay({
  booking,
  setBooking,
  onNext,
  onPrev,
}: {
  booking: BookingState
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>
  onNext: () => void
  onPrev: () => void
}) {
  const filteredDoctors =
    booking.serviceObj?.category === 'THT'
      ? doctors.filter((d) => d.id === 'dr-febryanti')
      : booking.serviceObj?.category === 'THT'
      ? doctors
      : doctors

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2">Pilih Dokter & Hari</h2>
      <p className="text-muted mb-8">Pilih dokter dan hari praktek yang sesuai.</p>

      <div className="space-y-8">
        {/* Doctor selection */}
        <div>
          <div className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Dokter</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDoctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setBooking((b) => ({ ...b, doctor: doc, dayName: '', session: null, slot: null }))}
                className={`text-left p-4 rounded-card border-2 transition-all duration-200 ${
                  booking.doctor?.id === doc.id
                    ? 'border-rose bg-rose/5'
                    : 'border-transparent bg-cream hover:border-blush-deep'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-blush shrink-0">
                    {doc.id === 'dr-wildan' ? (
                      <Image src="/dr-wildan.png" alt={doc.name} fill className="object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👩‍⚕️</div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-ink text-sm">{doc.name}</div>
                    <div className="text-xs text-rose font-medium">{doc.title}</div>
                    <div className="text-xs text-muted mt-0.5">{doc.specialization}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Day selection */}
        {booking.doctor && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Hari Praktek</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {DAY_ORDER.map((day) => {
                const schedule = booking.doctor!.schedule.find((s) => s.day === day)
                const hasSessions = schedule && schedule.sessions.length > 0
                return (
                  <button
                    key={day}
                    disabled={!hasSessions}
                    onClick={() => {
                      setBooking((b) => ({
                        ...b,
                        dayName: day,
                        session: null,
                        slot: null,
                      }))
                    }}
                    className={`py-2.5 px-3 rounded-btn text-sm font-semibold transition-all ${
                      !hasSessions
                        ? 'bg-cream text-muted/40 cursor-not-allowed line-through'
                        : booking.dayName === day
                        ? 'slot-selected'
                        : 'slot-available'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onPrev} className="btn-outline flex-1">
          <ChevronLeft size={16} /> Kembali
        </button>
        <button
          onClick={onNext}
          disabled={!booking.doctor || !booking.dayName}
          className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
        >
          Lanjutkan <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Select Slot ───────────────────────────────────────────────────────
function Step3Slot({
  booking,
  setBooking,
  onNext,
  onPrev,
}: {
  booking: BookingState
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>
  onNext: () => void
  onPrev: () => void
}) {
  const daySchedule = booking.doctor?.schedule.find((s) => s.day === booking.dayName)

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2">Pilih Waktu</h2>
      <p className="text-muted mb-8">
        Pilih sesi dan slot waktu yang tersedia pada{' '}
        <span className="text-rose font-semibold">{booking.dayName}</span>.
      </p>

      {daySchedule?.sessions.map((session) => (
        <div key={session.id} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold bg-blush text-burgundy px-3 py-1 rounded-full">
              {session.label}
            </span>
            <span className="text-sm text-muted">
              {session.startTime} – {session.endTime}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {session.slots.map((slot) => {
              const full = slot.taken >= slot.quota
              const selected = booking.slot?.id === slot.id
              return (
                <button
                  key={slot.id}
                  disabled={full}
                  onClick={() => setBooking((b) => ({ ...b, slot, session }))}
                  className={`slot-card ${
                    full
                      ? 'slot-full'
                      : selected
                      ? 'slot-selected'
                      : 'slot-available'
                  }`}
                >
                  <div className="font-bold text-sm">{slot.time}</div>
                  <div className="text-[10px] mt-0.5 opacity-70">
                    {full ? 'Penuh' : `${slot.quota - slot.taken} sisa`}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted mb-8">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded slot-available" />
          Tersedia
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded slot-selected" />
          Dipilih
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded slot-full" />
          Penuh
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} className="btn-outline flex-1">
          <ChevronLeft size={16} /> Kembali
        </button>
        <button
          onClick={onNext}
          disabled={!booking.slot}
          className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
        >
          Lanjutkan <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Patient Info ──────────────────────────────────────────────────────
function Step4PatientInfo({
  booking,
  setBooking,
  onNext,
  onPrev,
}: {
  booking: BookingState
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>
  onNext: () => void
  onPrev: () => void
}) {
  const valid = booking.patientName.trim().length >= 3 && booking.patientPhone.trim().length >= 8

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2">Data Pasien</h2>
      <p className="text-muted mb-8">Isi informasi berikut agar kami bisa menghubungi Anda.</p>

      <div className="space-y-5">
        {/* Status */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
            Status Pasien
          </label>
          <div className="flex gap-3">
            {[
              { value: true, label: '✨ Pasien Baru' },
              { value: false, label: '🔄 Pasien Lama' },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setBooking((b) => ({ ...b, isNewPatient: opt.value }))}
                className={`flex-1 py-3 rounded-card text-sm font-semibold border-2 transition-all ${
                  booking.isNewPatient === opt.value
                    ? 'border-rose bg-rose/5 text-rose'
                    : 'border-blush bg-cream text-ink hover:border-blush-deep'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
            Nama Lengkap *
          </label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Nama sesuai KTP"
              value={booking.patientName}
              onChange={(e) => setBooking((b) => ({ ...b, patientName: e.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 rounded-card border border-blush bg-surface text-ink placeholder:text-muted/50 text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
            Nomor WhatsApp *
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={booking.patientPhone}
              onChange={(e) => setBooking((b) => ({ ...b, patientPhone: e.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 rounded-card border border-blush bg-surface text-ink placeholder:text-muted/50 text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
            />
          </div>
          <p className="text-xs text-muted mt-1.5">
            Nomor antrian akan dikirim ke WhatsApp ini.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
            Catatan Tambahan (opsional)
          </label>
          <div className="relative">
            <MessageSquare size={16} className="absolute left-4 top-4 text-muted" />
            <textarea
              placeholder="Keluhan atau informasi penting untuk dokter..."
              value={booking.patientNotes}
              onChange={(e) => setBooking((b) => ({ ...b, patientNotes: e.target.value }))}
              rows={3}
              className="w-full pl-11 pr-4 py-3.5 rounded-card border border-blush bg-surface text-ink placeholder:text-muted/50 text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onPrev} className="btn-outline flex-1">
          <ChevronLeft size={16} /> Kembali
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
        >
          Konfirmasi <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Step 5: Confirmation ──────────────────────────────────────────────────────
function Step5Confirm({
  booking,
  onConfirm,
  onPrev,
  loading,
}: {
  booking: BookingState
  onConfirm: () => void
  onPrev: () => void
  loading: boolean
}) {
  const items = [
    { label: 'Layanan', value: booking.serviceObj?.name ?? '—' },
    { label: 'Dokter', value: booking.doctor ? `${booking.doctor.name}, ${booking.doctor.title}` : '—' },
    { label: 'Hari', value: booking.dayName || '—' },
    { label: 'Sesi', value: booking.session ? `${booking.session.label} (${booking.session.startTime}–${booking.session.endTime})` : '—' },
    { label: 'Waktu', value: booking.slot?.time ?? '—' },
    { label: 'Nama Pasien', value: booking.patientName || '—' },
    { label: 'WhatsApp', value: booking.patientPhone || '—' },
    { label: 'Status', value: booking.isNewPatient ? 'Pasien Baru' : 'Pasien Lama' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2">Konfirmasi Booking</h2>
      <p className="text-muted mb-8">Periksa kembali detail janji Anda sebelum mengkonfirmasi.</p>

      <div className="bg-cream rounded-card p-5 space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between items-start gap-4">
            <span className="text-xs text-muted font-medium shrink-0">{item.label}</span>
            <span className="text-sm text-ink font-semibold text-right">{item.value}</span>
          </div>
        ))}
      </div>

      {booking.patientNotes && (
        <div className="bg-blush/30 rounded-card p-4 mb-6">
          <div className="text-xs font-bold text-muted mb-1">Catatan Dokter</div>
          <p className="text-sm text-ink">{booking.patientNotes}</p>
        </div>
      )}

      <div className="bg-sage-light/30 rounded-card p-4 mb-8 flex items-start gap-3">
        <span className="text-xl">ℹ️</span>
        <p className="text-sm text-ink/70 leading-relaxed">
          Dengan mengkonfirmasi, Anda setuju untuk hadir sesuai slot yang dipilih.
          Nomor antrian akan dikirim ke WhatsApp Anda segera setelah konfirmasi.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} className="btn-outline flex-1" disabled={loading}>
          <ChevronLeft size={16} /> Kembali
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-70"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <>Konfirmasi Booking <Check size={18} /></>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ booking, queueNumber }: { booking: BookingState; queueNumber: string }) {
  const waMessage = encodeURIComponent(
    `Halo Apotek Keluarga, saya baru saja booking:\n\n` +
    `Nama: ${booking.patientName}\n` +
    `Layanan: ${booking.serviceObj?.name}\n` +
    `Dokter: ${booking.doctor?.name}, ${booking.doctor?.title}\n` +
    `Hari: ${booking.dayName}\n` +
    `Waktu: ${booking.slot?.time}\n` +
    `Nomor Antrian: ${queueNumber}\n\n` +
    `Mohon konfirmasinya. Terima kasih 🙏`
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-8"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-sage-light/40 flex items-center justify-center mx-auto mb-6"
      >
        <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center">
          <Check size={32} className="text-white" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <PartyPopper size={28} className="text-rose mx-auto mb-3" />
        <span className="script-accent text-3xl block mb-2 text-burgundy">Booking Berhasil!</span>
        <h2 className="text-2xl font-bold text-ink mb-2">
          Sampai jumpa, {booking.patientName.split(' ')[0]}!
        </h2>
        <p className="text-muted mb-8 max-w-sm mx-auto">
          Janji Anda sudah kami catat. Nomor antrian Anda:
        </p>

        {/* Queue number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="inline-block bg-burgundy text-white rounded-2xl px-12 py-6 mb-8 shadow-float"
        >
          <div className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">
            Nomor Antrian Anda
          </div>
          <div className="text-5xl font-extrabold tracking-wide">{queueNumber}</div>
          <div className="text-xs text-white/60 mt-2">
            {booking.dayName} · {booking.slot?.time}
          </div>
        </motion.div>

        {/* Details */}
        <div className="bg-cream rounded-card p-5 mb-8 text-left max-w-sm mx-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Layanan</span>
            <span className="font-semibold text-ink">{booking.serviceObj?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Dokter</span>
            <span className="font-semibold text-ink">{booking.doctor?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Waktu</span>
            <span className="font-semibold text-ink">{booking.dayName} · {booking.slot?.time}</span>
          </div>
        </div>

        {/* Reminder info */}
        <div className="bg-blush/30 rounded-card p-4 mb-8 max-w-sm mx-auto">
          <p className="text-sm text-ink/70">
            📱 Reminder otomatis akan dikirim via WhatsApp{' '}
            <strong>{booking.patientPhone}</strong> 24 jam dan 3 jam sebelum jadwal.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/6285220024400?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
          >
            <span>💬</span>
            Konfirmasi via WhatsApp
          </a>
          <Link href="/queue" className="btn-outline">
            Pantau Antrian
          </Link>
          <Link href="/" className="btn-outline">
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Booking Page ─────────────────────────────────────────────────────────
const defaultBooking: BookingState = {
  service: '',
  serviceObj: null,
  doctor: null,
  dayName: '',
  session: null,
  slot: null,
  patientName: '',
  patientPhone: '',
  patientNotes: '',
  isNewPatient: true,
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState<BookingState>(defaultBooking)
  const [done, setDone] = useState(false)
  const [queueNumber, setQueueNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500)) // simulate API
    const q = getNextQueueNumber()
    setQueueNumber(q)
    setDone(true)
    setLoading(false)
  }

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="section-tag mb-4 mx-auto w-fit">Booking Online</div>
            <h1 className="text-3xl font-extrabold text-ink mb-2">Buat Janji</h1>
            <p className="text-muted">Mudah, cepat, tanpa antre panjang</p>
          </div>

          {/* Card */}
          <div className="bg-surface rounded-2xl shadow-card p-6 md:p-10">
            {!done && <StepIndicator current={step} />}

            <AnimatePresence mode="wait">
              {done ? (
                <SuccessScreen booking={booking} queueNumber={queueNumber} key="success" />
              ) : (
                <motion.div
                  key={step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {step === 1 && (
                    <Step1Service booking={booking} setBooking={setBooking} onNext={() => setStep(2)} />
                  )}
                  {step === 2 && (
                    <Step2DoctorDay
                      booking={booking}
                      setBooking={setBooking}
                      onNext={() => setStep(3)}
                      onPrev={() => setStep(1)}
                    />
                  )}
                  {step === 3 && (
                    <Step3Slot
                      booking={booking}
                      setBooking={setBooking}
                      onNext={() => setStep(4)}
                      onPrev={() => setStep(2)}
                    />
                  )}
                  {step === 4 && (
                    <Step4PatientInfo
                      booking={booking}
                      setBooking={setBooking}
                      onNext={() => setStep(5)}
                      onPrev={() => setStep(3)}
                    />
                  )}
                  {step === 5 && (
                    <Step5Confirm
                      booking={booking}
                      onConfirm={handleConfirm}
                      onPrev={() => setStep(4)}
                      loading={loading}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
