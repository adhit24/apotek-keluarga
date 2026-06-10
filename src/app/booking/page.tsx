'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronRight, ChevronLeft, Check, MapPin, Calendar, Clock,
  User, Phone, MessageSquare, Stethoscope, PartyPopper,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  doctors, locations, services, getDoctorLocationSchedule,
  generateAppointmentId, generateQueueNumber,
  DAY_JS_MAP, type Doctor, type Location, type Session, type TimeSlot,
} from '@/lib/data'

// ── Types ─────────────────────────────────────────────────────────────────────
interface BookingState {
  serviceId: string
  serviceName: string
  serviceDuration: string
  location: Location | null
  doctor: Doctor | null
  date: Date | null          // JS Date
  session: Session | null
  slot: TimeSlot | null
  patientName: string
  patientPhone: string
  patientDob: string
  visitType: string
  notes: string
}

const STEPS = [
  { id: 1, label: 'Layanan', icon: Stethoscope },
  { id: 2, label: 'Lokasi', icon: MapPin },
  { id: 3, label: 'Tanggal', icon: Calendar },
  { id: 4, label: 'Waktu', icon: Clock },
  { id: 5, label: 'Data Diri', icon: User },
  { id: 6, label: 'Konfirmasi', icon: Check },
]

const MONTH_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAY_SHORT = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10 overflow-x-auto pb-1">
      {STEPS.map((step, i) => {
        const done = current > step.id
        const active = current === step.id
        const Icon = step.icon
        return (
          <div key={step.id} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
                  done ? 'bg-sage text-white' : active ? 'bg-rose text-white shadow-btn' : 'bg-blush text-muted'
                }`}
              >
                {done ? <Check size={14} /> : <Icon size={14} />}
              </motion.div>
              <span className={`text-[10px] font-semibold hidden sm:block ${active ? 'text-rose' : done ? 'text-sage-dark' : 'text-muted'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 md:w-12 h-0.5 mx-1 mb-4 shrink-0 ${current > step.id ? 'bg-sage' : 'bg-blush'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Calendar component ────────────────────────────────────────────────────────
function DateCalendar({
  value, onChange, availableDays,
}: {
  value: Date | null
  onChange: (d: Date) => void
  availableDays: number[] // 0=Sun,1=Mon,...
}) {
  const today = new Date(); today.setHours(0,0,0,0)
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date(); d.setDate(1); return d
  })

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const total = new Date(year, month + 1, 0).getDate()
    return { year, month, firstDay, total }
  }, [viewDate])

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))

  const cells: (number | null)[] = [
    ...Array(daysInMonth.firstDay).fill(null),
    ...Array.from({ length: daysInMonth.total }, (_, i) => i + 1),
  ]

  return (
    <div className="bg-surface rounded-card shadow-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-rose text-white">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="font-bold text-base">
          {MONTH_ID[daysInMonth.month]} {daysInMonth.year}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-blush">
        {DAY_SHORT.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-muted py-2">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 p-3 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />
          const date = new Date(daysInMonth.year, daysInMonth.month, day)
          const jsDay = date.getDay()
          const isPast = date < today
          const isAvailable = availableDays.includes(jsDay)
          const isSelected = value?.toDateString() === date.toDateString()
          const isToday = today.toDateString() === date.toDateString()
          const disabled = isPast || !isAvailable

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => onChange(date)}
              className={`aspect-square rounded-xl text-sm font-semibold flex flex-col items-center justify-center gap-0.5 transition-all ${
                isSelected
                  ? 'bg-rose text-white shadow-btn scale-105'
                  : disabled
                  ? 'text-muted/30 cursor-not-allowed'
                  : isAvailable
                  ? 'hover:bg-blush text-ink cursor-pointer'
                  : 'text-muted/50 cursor-not-allowed'
              } ${isToday && !isSelected ? 'ring-2 ring-rose/30' : ''}`}
            >
              {day}
              {isAvailable && !disabled && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-sage" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-5 py-3 border-t border-blush text-xs text-muted">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sage" />Tersedia</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose" />Dipilih</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-light opacity-50" />Tidak tersedia</div>
      </div>
    </div>
  )
}

// ── Step 1: Service ───────────────────────────────────────────────────────────
function Step1({ b, setB, onNext }: { b: BookingState; setB: React.Dispatch<React.SetStateAction<BookingState>>; onNext: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-1">Pilih Layanan</h2>
      <p className="text-muted text-sm mb-7">Layanan apa yang Anda butuhkan?</p>
      <div className="grid sm:grid-cols-2 gap-2.5 mb-8 max-h-[420px] overflow-y-auto pr-1">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => setB((prev) => ({ ...prev, serviceId: s.id, serviceName: s.name, serviceDuration: s.duration }))}
            className={`text-left p-4 rounded-card border-2 transition-all duration-200 ${
              b.serviceId === s.id ? 'border-rose bg-rose/5' : 'border-transparent bg-cream hover:border-blush-deep'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink text-sm">{s.name}</div>
                <div className="text-xs text-muted mt-0.5 truncate">{s.duration}</div>
                <div className="text-xs text-muted/70 mt-1 line-clamp-1">{s.description}</div>
              </div>
              {b.serviceId === s.id && <Check size={16} className="text-rose shrink-0 mt-0.5" />}
            </div>
          </button>
        ))}
      </div>
      <button onClick={onNext} disabled={!b.serviceId} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
        Lanjutkan <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ── Step 2: Location ──────────────────────────────────────────────────────────
function Step2({ b, setB, onNext, onPrev }: { b: BookingState; setB: React.Dispatch<React.SetStateAction<BookingState>>; onNext: () => void; onPrev: () => void }) {
  const thtService = b.serviceId === 'tht'
  const availableDoctors = thtService
    ? doctors.filter((d) => d.id === 'dr-febryanti')
    : doctors

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-1">Pilih Lokasi</h2>
      <p className="text-muted text-sm mb-7">Pilih klinik tempat praktek yang paling mudah dijangkau.</p>

      <div className="space-y-3 mb-8">
        {locations.map((loc) => {
          const hasDoctor = availableDoctors.some((d) =>
            d.locationSchedules.some((ls) => ls.locationId === loc.id && ls.schedule.length > 0)
          )
          if (!hasDoctor) return null
          return (
            <button
              key={loc.id}
              onClick={() => setB((prev) => ({ ...prev, location: loc, doctor: null, date: null, session: null, slot: null }))}
              className={`w-full text-left p-5 rounded-card border-2 transition-all ${
                b.location?.id === loc.id ? 'border-rose bg-rose/5' : 'border-transparent bg-cream hover:border-blush-deep'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-ink text-base mb-1">{loc.name}</div>
                  <div className="flex items-start gap-1.5 text-sm text-muted">
                    <MapPin size={13} className="mt-0.5 shrink-0" />
                    {loc.address}
                  </div>
                </div>
                {b.location?.id === loc.id && (
                  <div className="w-6 h-6 rounded-full bg-rose flex items-center justify-center shrink-0">
                    <Check size={13} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Doctor selection (shown after location) */}
      {b.location && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Pilih Dokter</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {availableDoctors.filter((d) =>
              d.locationSchedules.some((ls) => ls.locationId === b.location!.id && ls.schedule.length > 0)
            ).map((doc) => (
              <button
                key={doc.id}
                onClick={() => setB((prev) => ({ ...prev, doctor: doc, date: null, session: null, slot: null }))}
                className={`text-left p-4 rounded-card border-2 transition-all ${
                  b.doctor?.id === doc.id ? 'border-rose bg-rose/5' : 'border-transparent bg-surface hover:border-blush-deep shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-blush shrink-0">
                    {doc.id === 'dr-wildan'
                      ? <Image src="/dr-wildan.png" alt={doc.name} fill className="object-cover object-top" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">👩‍⚕️</div>
                    }
                  </div>
                  <div>
                    <div className="font-bold text-ink text-sm leading-tight">{doc.name}</div>
                    <div className="text-xs text-rose font-medium">{doc.title}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex gap-3">
        <button onClick={onPrev} className="btn-outline flex-1"><ChevronLeft size={16} /> Kembali</button>
        <button onClick={onNext} disabled={!b.location || !b.doctor} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
          Lanjutkan <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Date ──────────────────────────────────────────────────────────────
function Step3({ b, setB, onNext, onPrev }: { b: BookingState; setB: React.Dispatch<React.SetStateAction<BookingState>>; onNext: () => void; onPrev: () => void }) {
  const schedule = useMemo(() => {
    if (!b.doctor || !b.location) return []
    return getDoctorLocationSchedule(b.doctor.id, b.location.id)
  }, [b.doctor, b.location])

  const availableJsDays = useMemo(() => {
    const dayNameToJs: Record<string, number> = {
      Minggu: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6,
    }
    return schedule.map((s) => dayNameToJs[s.day]).filter((n) => n !== undefined)
  }, [schedule])

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-1">Pilih Tanggal</h2>
      <p className="text-muted text-sm mb-7">
        Tanggal dengan tanda hijau tersedia untuk{' '}
        <span className="text-rose font-semibold">{b.doctor?.name}</span>.
      </p>
      <DateCalendar
        value={b.date}
        onChange={(d) => setB((prev) => ({ ...prev, date: d, session: null, slot: null }))}
        availableDays={availableJsDays}
      />
      {b.date && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-blush/30 rounded-card px-4 py-3 text-sm text-ink">
          📅 Terpilih:{' '}
          <strong>
            {b.date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </strong>
        </motion.div>
      )}
      <div className="flex gap-3 mt-6">
        <button onClick={onPrev} className="btn-outline flex-1"><ChevronLeft size={16} /> Kembali</button>
        <button onClick={onNext} disabled={!b.date} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
          Pilih Waktu <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Time Slot ─────────────────────────────────────────────────────────
function Step4({ b, setB, onNext, onPrev }: { b: BookingState; setB: React.Dispatch<React.SetStateAction<BookingState>>; onNext: () => void; onPrev: () => void }) {
  const sessions = useMemo(() => {
    if (!b.doctor || !b.location || !b.date) return []
    const dayName = DAY_JS_MAP[b.date.getDay()]
    const sched = getDoctorLocationSchedule(b.doctor.id, b.location.id)
    return sched.find((s) => s.day === dayName)?.sessions ?? []
  }, [b.doctor, b.location, b.date])

  const dateLabel = b.date?.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-1">Pilih Waktu</h2>
      <p className="text-muted text-sm mb-7">
        Slot waktu untuk <span className="text-rose font-semibold">{dateLabel}</span>.
        Setiap slot = 1 janji temu.
      </p>

      {sessions.map((session) => (
        <div key={session.id} className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="section-tag">{session.label}</span>
            <span className="text-sm text-muted">{session.startTime} – {session.endTime}</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {session.slots.map((slot) => {
              const full = slot.taken >= slot.quota
              const selected = b.slot?.id === slot.id
              const remaining = slot.quota - slot.taken
              return (
                <button
                  key={slot.id}
                  disabled={full}
                  onClick={() => setB((prev) => ({ ...prev, slot, session }))}
                  className={`rounded-card p-3 text-center transition-all duration-200 border-2 ${
                    full
                      ? 'bg-cream border-transparent cursor-not-allowed opacity-50'
                      : selected
                      ? 'bg-rose border-rose text-white shadow-btn scale-[1.03]'
                      : 'bg-surface border-blush hover:border-rose hover:shadow-soft cursor-pointer'
                  }`}
                >
                  <div className={`font-bold text-base ${selected ? 'text-white' : full ? 'text-muted/50' : 'text-ink'}`}>
                    {slot.time}
                  </div>
                  <div className={`text-xs mt-1 ${selected ? 'text-white/80' : full ? 'text-muted/40' : 'text-sage-dark'}`}>
                    {full ? 'Penuh' : `${remaining} tersisa`}
                  </div>
                  {full && (
                    <div className="text-[10px] text-muted/40 line-through mt-0.5">Tidak tersedia</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-2">
        <button onClick={onPrev} className="btn-outline flex-1"><ChevronLeft size={16} /> Kembali</button>
        <button onClick={onNext} disabled={!b.slot} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
          Lanjutkan <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Step 5: Patient Info ──────────────────────────────────────────────────────
function Step5({ b, setB, onNext, onPrev }: { b: BookingState; setB: React.Dispatch<React.SetStateAction<BookingState>>; onNext: () => void; onPrev: () => void }) {
  const valid = b.patientName.trim().length >= 3 && b.patientPhone.trim().length >= 8 && b.patientDob && b.visitType
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-1">Data Pasien</h2>
      <p className="text-muted text-sm mb-7">Isi informasi berikut. Reminder akan dikirim ke WhatsApp Anda.</p>

      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-3">
          {[{value: true, label: '✨ Pasien Baru'}, {value: false, label: '🔄 Pasien Lama'}].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setB((p) => ({ ...p, visitType: opt.label }))}
              className={`py-3 rounded-card text-sm font-semibold border-2 transition-all ${
                b.visitType === opt.label ? 'border-rose bg-rose/5 text-rose' : 'border-blush bg-cream text-ink hover:border-blush-deep'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {[
          { key: 'patientName', label: 'Nama Lengkap', type: 'text', placeholder: 'Sesuai KTP', icon: <User size={15} className="text-muted" /> },
          { key: 'patientPhone', label: 'Nomor WhatsApp', type: 'tel', placeholder: '08xxxxxxxxxx', icon: <Phone size={15} className="text-muted" /> },
          { key: 'patientDob', label: 'Tanggal Lahir', type: 'date', placeholder: '', icon: <Calendar size={15} className="text-muted" /> },
        ].map(({ key, label, type, placeholder, icon }) => (
          <div key={key}>
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">{label} *</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">{icon}</div>
              <input
                type={type}
                placeholder={placeholder}
                value={b[key as keyof BookingState] as string}
                onChange={(e) => setB((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-card border border-blush bg-surface text-ink text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all placeholder:text-muted/40"
              />
            </div>
          </div>
        ))}

        <div>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Catatan Tambahan (opsional)</label>
          <div className="relative">
            <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-muted" />
            <textarea
              rows={3}
              placeholder="Keluhan atau informasi penting untuk dokter..."
              value={b.notes}
              onChange={(e) => setB((p) => ({ ...p, notes: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-card border border-blush bg-surface text-ink text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all resize-none placeholder:text-muted/40"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onPrev} className="btn-outline flex-1"><ChevronLeft size={16} /> Kembali</button>
        <button onClick={onNext} disabled={!valid} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
          Review Booking <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Step 6: Confirm ───────────────────────────────────────────────────────────
function Step6({ b, onConfirm, onPrev, loading }: { b: BookingState; onConfirm: () => void; onPrev: () => void; loading: boolean }) {
  const dateStr = b.date?.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const rows = [
    { label: 'Layanan', value: b.serviceName },
    { label: 'Lokasi', value: b.location?.name },
    { label: 'Dokter', value: b.doctor ? `${b.doctor.name}, ${b.doctor.title}` : '' },
    { label: 'Tanggal', value: dateStr },
    { label: 'Waktu', value: b.slot?.time },
    { label: 'Nama Pasien', value: b.patientName },
    { label: 'WhatsApp', value: b.patientPhone },
    { label: 'Tgl Lahir', value: b.patientDob },
    { label: 'Tipe Kunjungan', value: b.visitType },
  ]
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-1">Konfirmasi Booking</h2>
      <p className="text-muted text-sm mb-7">Periksa kembali detail janji Anda.</p>

      <div className="bg-cream rounded-card p-5 space-y-2.5 mb-5">
        {rows.map((r) => r.value && (
          <div key={r.label} className="flex justify-between gap-4">
            <span className="text-xs text-muted shrink-0">{r.label}</span>
            <span className="text-sm text-ink font-semibold text-right">{r.value}</span>
          </div>
        ))}
      </div>

      {b.notes && (
        <div className="bg-blush/30 rounded-card p-4 mb-5">
          <div className="text-xs font-bold text-muted mb-1">Catatan</div>
          <p className="text-sm text-ink">{b.notes}</p>
        </div>
      )}

      <div className="bg-sage-light/30 rounded-card p-4 mb-8 flex gap-3">
        <span className="text-lg shrink-0">🔔</span>
        <p className="text-sm text-ink/70 leading-relaxed">
          Reminder otomatis akan dikirim ke WhatsApp <strong>{b.patientPhone}</strong> pada{' '}
          <strong>24 jam</strong> dan <strong>3 jam</strong> sebelum jadwal Anda.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} disabled={loading} className="btn-outline flex-1">
          <ChevronLeft size={16} /> Kembali
        </button>
        <button onClick={onConfirm} disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
          {loading
            ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            : <><Check size={16} /> Konfirmasi Janji</>
          }
        </button>
      </div>
    </div>
  )
}

// ── Success ───────────────────────────────────────────────────────────────────
function Success({ b, appointmentId, queueNumber }: { b: BookingState; appointmentId: string; queueNumber: string }) {
  const dateStr = b.date?.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const waMsg = encodeURIComponent(
    `Halo Apotek Keluarga 👋\n\n` +
    `Saya baru booking:\n` +
    `📋 ID Janji: *${appointmentId}*\n` +
    `🔢 Nomor Antrian: *${queueNumber}*\n` +
    `🩺 Layanan: ${b.serviceName}\n` +
    `📍 Lokasi: ${b.location?.name}\n` +
    `👩‍⚕️ Dokter: ${b.doctor?.name}\n` +
    `📅 ${dateStr}, pukul ${b.slot?.time}\n\n` +
    `Mohon konfirmasinya. Terima kasih 🙏`
  )
  const followUpMsg = encodeURIComponent(
    `Halo Apotek Keluarga 👋\n\n` +
    `Saya ingin menjadwalkan kunjungan kontrol:\n` +
    `📋 Kunjungan sebelumnya: *${appointmentId}*\n` +
    `🩺 Layanan: ${b.serviceName}\n` +
    `👩‍⚕️ Dokter: ${b.doctor?.name}\n\n` +
    `Mohon bantu jadwalkan kontrol berikutnya. Terima kasih 🙏`
  )

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-center py-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-sage-light/50 flex items-center justify-center mx-auto mb-5">
        <div className="w-14 h-14 rounded-full bg-sage flex items-center justify-center">
          <Check size={28} className="text-white" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <PartyPopper size={24} className="text-rose mx-auto mb-2" />
        <span className="script-accent text-3xl block mb-1 text-burgundy">Booking Berhasil!</span>
        <p className="text-muted text-sm mb-8 max-w-xs mx-auto">
          Janji Anda sudah tercatat. Simpan ID dan nomor antrian berikut.
        </p>

        {/* Appointment card */}
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="bg-burgundy text-white rounded-2xl p-6 mb-6 max-w-xs mx-auto shadow-float">
          <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">ID Janji Temu</div>
          <div className="font-extrabold text-2xl tracking-wider mb-4">{appointmentId}</div>
          <div className="h-px bg-white/10 mb-4" />
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-white/50 mb-0.5">Nomor Antrian</div>
              <div className="font-extrabold text-3xl">{queueNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/50 mb-0.5">Waktu</div>
              <div className="font-bold text-base">{b.slot?.time}</div>
              <div className="text-xs text-white/50">{dateStr?.split(', ')[0]}</div>
            </div>
          </div>
        </motion.div>

        <div className="bg-cream rounded-card p-4 mb-6 max-w-xs mx-auto text-left space-y-2 text-sm">
          <div className="flex gap-3"><span className="text-muted shrink-0">Layanan</span><span className="font-semibold text-ink text-right flex-1">{b.serviceName}</span></div>
          <div className="flex gap-3"><span className="text-muted shrink-0">Lokasi</span><span className="font-semibold text-ink text-right flex-1">{b.location?.name}</span></div>
          <div className="flex gap-3"><span className="text-muted shrink-0">Dokter</span><span className="font-semibold text-ink text-right flex-1">{b.doctor?.name}</span></div>
        </div>

        <div className="bg-blush/30 rounded-card p-4 mb-8 max-w-xs mx-auto">
          <p className="text-sm text-ink/70">
            📱 Reminder otomatis ke <strong>{b.patientPhone}</strong> dalam 24 jam & 3 jam sebelum jadwal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`https://wa.me/6285220024400?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="btn-wa">
            <span>💬</span> Konfirmasi via WhatsApp
          </a>
          <Link href="/queue" className="btn-outline">Pantau Antrian</Link>
          <Link href="/" className="btn-outline">Beranda</Link>
        </div>

        {/* Follow-up CTA */}
        <div className="mt-8 pt-6 border-t border-blush/40 max-w-xs mx-auto">
          <p className="text-xs text-muted mb-3">Ingin jadwalkan kunjungan kontrol berikutnya?</p>
          <a
            href={`https://wa.me/6285220024400?text=${followUpMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-btn border-2 border-sage text-sage font-bold text-sm hover:bg-sage hover:text-white transition-all"
          >
            📅 Booking Kontrol Berikutnya
          </a>
          <p className="text-xs text-muted/60 mt-2">Kami akan bantu atur jadwal kontrol lewat WhatsApp</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const empty: BookingState = {
  serviceId: '', serviceName: '', serviceDuration: '',
  location: null, doctor: null, date: null, session: null, slot: null,
  patientName: '', patientPhone: '', patientDob: '', visitType: '', notes: '',
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [b, setB] = useState<BookingState>(empty)
  const [done, setDone] = useState(false)
  const [appointmentId, setAppointmentId] = useState('')
  const [queueNumber, setQueueNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1400))
    setAppointmentId(generateAppointmentId())
    setQueueNumber(generateQueueNumber())
    setDone(true)
    setLoading(false)
  }

  const slide = { enter: { opacity: 0, x: 24 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="section-tag mb-3 mx-auto w-fit">Booking Online</div>
            <h1 className="text-3xl font-extrabold text-ink mb-1">Buat Janji Temu</h1>
            <p className="text-muted text-sm">Selesai dalam kurang dari 60 detik</p>
          </div>

          <div className="bg-surface rounded-2xl shadow-card p-6 md:p-10">
            {!done && <StepIndicator current={step} />}
            <AnimatePresence mode="wait">
              {done ? (
                <Success key="done" b={b} appointmentId={appointmentId} queueNumber={queueNumber} />
              ) : (
                <motion.div key={step} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: 'easeOut' }}>
                  {step === 1 && <Step1 b={b} setB={setB} onNext={() => setStep(2)} />}
                  {step === 2 && <Step2 b={b} setB={setB} onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
                  {step === 3 && <Step3 b={b} setB={setB} onNext={() => setStep(4)} onPrev={() => setStep(2)} />}
                  {step === 4 && <Step4 b={b} setB={setB} onNext={() => setStep(5)} onPrev={() => setStep(3)} />}
                  {step === 5 && <Step5 b={b} setB={setB} onNext={() => setStep(6)} onPrev={() => setStep(4)} />}
                  {step === 6 && <Step6 b={b} onConfirm={confirm} onPrev={() => setStep(5)} loading={loading} />}
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
