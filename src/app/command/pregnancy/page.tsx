'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Baby, MessageCircle, Calendar, FileText,
  CheckCircle2, AlertTriangle, Activity,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const PREGNANCY_PATIENTS = [
  { id: 'P001', name: 'Siti Nurhaliza', week: 28, hpl: '12 Okt 2026', anc: 92,  risk: 'normal', weight: [58, 59.5, 61, 62.5, 64, 65.5, 68],          bp: ['110/70','112/72','108/68','110/70','112/70','110/72','110/70'] },
  { id: 'P004', name: 'Dewi Rahayu',   week: 32, hpl: '25 Sep 2026', anc: 78,  risk: 'high',   weight: [65, 66.5, 68, 70, 71.5, 73, 75, 78],          bp: ['120/80','122/82','125/82','128/84','130/85','132/86','138/88','140/90'] },
  { id: 'P007', name: 'Fatimah Zahra', week: 36, hpl: '30 Jun 2026', anc: 96,  risk: 'normal', weight: [60, 61.5, 63, 65, 66.5, 68, 70, 71, 72],      bp: ['112/72','110/70','112/72','115/74','115/75','115/75','115/75','115/75','115/75'] },
  { id: 'P009', name: 'Maya Sari',     week: 12, hpl: '20 Des 2026', anc: 100, risk: 'normal', weight: [55, 56, 57],                                   bp: ['108/68','110/70','108/70'] },
  { id: 'P011', name: 'Sri Wahyuni',   week: 24, hpl: '25 Okt 2026', anc: 88,  risk: 'normal', weight: [58, 59, 60.5, 62, 63.5, 65],                   bp: ['110/70','112/70','110/72','112/70','110/72','112/72'] },
  { id: 'P017', name: 'Lestari Putri', week: 32, hpl: '22 Sep 2026', anc: 82,  risk: 'normal', weight: [57, 58.5, 60, 62, 63.5, 65, 67, 69],           bp: ['112/72','110/70','112/72','110/72','112/72','110/72','112/70','112/72'] },
]

const ANC_SCHEDULE = [8, 12, 16, 20, 24, 28, 32, 36, 40]

type Patient = typeof PREGNANCY_PATIENTS[0]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ancLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'text-emerald-600' }
  if (score >= 60) return { label: 'Perlu Perhatian', color: 'text-amber-600' }
  return { label: 'Perlu Follow-Up', color: 'text-rose' }
}

function bpCategory(bp: string): 'normal' | 'elevated' | 'high' {
  const [sys] = bp.split('/').map(Number)
  if (sys >= 140) return 'high'
  if (sys >= 130) return 'elevated'
  return 'normal'
}

const BP_PILL: Record<string, string> = {
  normal:   'bg-emerald-50 text-emerald-700',
  elevated: 'bg-amber-50 text-amber-700',
  high:     'bg-rose/10 text-rose font-bold',
}

// ─── Animation helpers ────────────────────────────────────────────────────────

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
  const inView = useInView(ref, { once: true, margin: '-20px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── ANC Timeline ─────────────────────────────────────────────────────────────

function AncTimeline({ patient }: { patient: Patient }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-start gap-0 min-w-max">
        {ANC_SCHEDULE.map((w, i) => {
          const completed = w < patient.week
          const current   = w === patient.week
          const upcoming  = w > patient.week

          return (
            <div key={w} className="flex items-center">
              {/* connector line */}
              {i > 0 && (
                <div
                  className={`w-6 h-0.5 ${
                    completed || current ? 'bg-rose/60' : 'bg-blush/40'
                  }`}
                />
              )}
              <div className="flex flex-col items-center gap-1.5">
                {/* circle node */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    current
                      ? 'border-rose bg-rose text-white shadow-md'
                      : completed
                      ? 'border-rose/50 bg-rose/10 text-rose'
                      : 'border-blush/40 bg-cream text-muted/50'
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 size={14} />
                  ) : current ? (
                    <span className="text-[10px] font-bold">{w}W</span>
                  ) : (
                    <span className="text-[10px]">{w}W</span>
                  )}
                </motion.div>
                {/* label */}
                <span
                  className={`text-[10px] font-semibold ${
                    current ? 'text-rose' : completed ? 'text-sage-dark' : 'text-muted/50'
                  }`}
                >
                  {w}W{completed ? ' ✓' : current ? ' ←' : ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ANC Score ring (CSS-based, no SVG) ──────────────────────────────────────

function AncScoreRing({ score }: { score: number }) {
  const { label, color } = ancLabel(score)
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        {/* track */}
        <div className="absolute inset-0 rounded-full border-8 border-blush/20" />
        {/* filled via conic-gradient */}
        <div
          className="absolute inset-0 rounded-full border-8 border-transparent"
          style={{
            background: `conic-gradient(rgb(194 104 94 / 0.7) ${score * 3.6}deg, transparent 0deg)`,
            borderRadius: '50%',
            mask: 'radial-gradient(circle at center, transparent 55%, black 56%)',
            WebkitMask: 'radial-gradient(circle at center, transparent 55%, black 56%)',
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-extrabold text-ink text-xl leading-none">{score}%</span>
        </div>
      </div>
      <div className={`text-xs font-semibold ${color}`}>{label}</div>
    </div>
  )
}

// ─── Patient detail panel ─────────────────────────────────────────────────────

function PatientDetail({ patient }: { patient: Patient }) {
  const waPhone = '62' + patient.id.slice(1)
  const progress = Math.round((patient.week / 40) * 100)
  const { label: ancLabel_, color: ancColor } = ancLabel(patient.anc)

  // Trimester weight groups
  const tri1 = patient.weight.slice(0, 3)
  const tri2 = patient.weight.slice(3, 6)
  const tri3 = patient.weight.slice(6)

  // Last 3 BP readings
  const lastBp = patient.bp.slice(-3)

  return (
    <div className="space-y-4">

      {/* Overview card */}
      <FadeUp>
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-start gap-4 flex-wrap">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-rose/10 flex items-center justify-center shrink-0">
              <Baby size={24} className="text-rose" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="font-extrabold text-ink text-base">{patient.name}</h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    patient.risk === 'high'
                      ? 'bg-rose/10 text-rose'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {patient.risk === 'high' ? 'High Risk' : 'Normal'}
                </span>
              </div>
              <div className="text-xs text-muted mb-3">
                HPL: <span className="font-semibold text-ink/70">{patient.hpl}</span>
                <span className="mx-2 text-muted/40">·</span>
                Minggu ke-<span className="font-semibold text-ink/70">{patient.week}</span> dari 40
              </div>

              {/* Progress bar */}
              <div className="mb-1 flex items-center justify-between text-[10px] text-muted">
                <span>Minggu 1</span>
                <span className="text-rose font-semibold">Minggu {patient.week}</span>
                <span>Minggu 40</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-cream overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-rose"
                />
              </div>
              <div className="text-[10px] text-muted mt-1">{progress}% perjalanan kehamilan</div>
            </div>

            {/* ANC score */}
            <AncScoreRing score={patient.anc} />
          </div>
        </div>
      </FadeUp>

      {/* ANC Timeline card */}
      <FadeUp delay={0.06}>
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={15} className="text-rose" />
            <h3 className="font-bold text-ink text-sm">ANC Milestone Tracker</h3>
          </div>
          <AncTimeline patient={patient} />
          <div className="mt-3 flex items-center gap-4 text-[10px] text-muted">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose/30 inline-block" /> Selesai</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose inline-block" /> Saat ini</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cream border border-blush/40 inline-block" /> Mendatang</span>
          </div>
        </div>
      </FadeUp>

      {/* Weight + BP row */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Weight progress */}
        <FadeUp delay={0.1}>
          <div className="bg-white rounded-2xl p-5 h-full">
            <h3 className="font-bold text-ink text-sm mb-3 flex items-center gap-2">
              <Activity size={14} className="text-sage-dark" />
              Berat Badan (kg)
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Trimester 1', weights: tri1 },
                { label: 'Trimester 2', weights: tri2 },
                { label: 'Trimester 3', weights: tri3 },
              ].map(({ label, weights }) =>
                weights.length > 0 ? (
                  <div key={label}>
                    <div className="text-[10px] text-muted mb-1">{label}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {weights.map((w, i) => (
                        <span
                          key={i}
                          className="text-xs bg-cream text-ink/70 font-semibold px-2 py-0.5 rounded-lg"
                        >
                          {w} kg
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </FadeUp>

        {/* Blood pressure */}
        <FadeUp delay={0.12}>
          <div className="bg-white rounded-2xl p-5 h-full">
            <h3 className="font-bold text-ink text-sm mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" />
              Tekanan Darah (3 terakhir)
            </h3>
            <div className="space-y-2">
              {lastBp.map((bp, i) => {
                const cat = bpCategory(bp)
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted w-12 shrink-0">
                      #{patient.bp.length - lastBp.length + i + 1}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${BP_PILL[cat]}`}>
                      {bp} mmHg
                    </span>
                    <span className="text-[10px] text-muted capitalize">
                      {cat === 'normal' ? 'Normal' : cat === 'elevated' ? 'Meningkat' : 'Tinggi'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Quick actions */}
      <FadeUp delay={0.16}>
        <div className="bg-white rounded-2xl p-5">
          <h3 className="font-bold text-ink text-sm mb-3">Aksi Cepat</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="inline-flex items-center gap-2 text-xs font-semibold bg-cream text-ink/70 px-3 py-2 rounded-xl hover:bg-blush/20 transition-colors">
              <FileText size={13} />
              Lihat Rekam Medis
            </button>
            <button className="inline-flex items-center gap-2 text-xs font-semibold bg-rose/8 text-rose px-3 py-2 rounded-xl hover:bg-rose/15 transition-colors">
              <Calendar size={13} />
              Buat Appointment Kontrol
            </button>
            <a
              href={`https://wa.me/${waPhone}?text=Halo+${encodeURIComponent(patient.name)}+dari+Klinik+Keluarga`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle size={13} />
              Kirim WA
            </a>
          </div>
        </div>
      </FadeUp>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PregnancyJourney() {
  const [selectedId, setSelectedId] = useState(PREGNANCY_PATIENTS[0].id)
  const selected = PREGNANCY_PATIENTS.find((p) => p.id === selectedId)!

  return (
    <main className="p-4 md:p-6">

      {/* Header */}
      <FadeUp className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h1 className="font-extrabold text-ink text-xl leading-none mb-1">Pregnancy Journey</h1>
            <p className="text-xs text-muted">Tracker kehamilan visual per pasien</p>
          </div>
          <span className="ml-auto text-xs bg-rose/10 text-rose font-bold px-3 py-1.5 rounded-full">
            {PREGNANCY_PATIENTS.length} pasien aktif
          </span>
        </div>
      </FadeUp>

      {/* Patient selector */}
      <FadeUp delay={0.05} className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {PREGNANCY_PATIENTS.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-xl border transition-all text-sm font-semibold ${
                selectedId === p.id
                  ? 'bg-ink text-white border-ink shadow-md'
                  : 'bg-white text-ink/70 border-blush/30 hover:border-rose/40'
              }`}
            >
              <Baby size={14} className={selectedId === p.id ? 'text-blush' : 'text-rose/50'} />
              <span>{p.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedId === p.id ? 'bg-white/15 text-white' : 'bg-cream text-muted'
                }`}
              >
                Mgg {p.week}
              </span>
            </motion.button>
          ))}
        </div>
      </FadeUp>

      {/* Patient detail with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <PatientDetail patient={selected} />
        </motion.div>
      </AnimatePresence>

      <div className="h-8" />
    </main>
  )
}
