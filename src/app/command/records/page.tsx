'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Search, FileText, ChevronDown, ChevronUp, Download,
  Activity, Heart, Ruler, Weight, X,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const RECORDS = [
  {
    id: 'MR-001',
    patient: 'Siti Nurhaliza',
    date: '10 Jun 2026',
    service: 'ANC Konsultasi',
    vitals: { bp: '110/70', weight: '68 kg', height: '160 cm' },
    subjective: 'Pasien mengeluhkan nyeri punggung bagian bawah dan sering kencing malam hari. Pergerakan janin aktif.',
    objective: 'TD 110/70 mmHg, BB 68 kg (naik 1.5 kg dari kunjungan sebelumnya). DJJ 148x/mnt. TFU 28 cm.',
    assessment: 'Kehamilan 28 minggu normal. Nyeri punggung fisiologis. Tidak ada tanda pre-eklampsia.',
    plan: 'Kontrol 4 minggu, USG morfologi, suplemen kalsium 500mg/hari, senam hamil.',
    attachments: ['USG_28W_Siti.pdf', 'Lab_Darah_Jun26.pdf'],
    week: 28,
  },
  {
    id: 'MR-002',
    patient: 'Dewi Rahayu',
    date: '12 Jun 2026',
    service: 'ANC High Risk',
    vitals: { bp: '140/90', weight: '78 kg', height: '158 cm' },
    subjective: 'Pasien mengeluhkan sakit kepala ringan dan bengkak pada kaki. Gerakan janin baik.',
    objective: 'TD 140/90 mmHg — meningkat dari 130/85. Proteinuria +1. Edema tungkai bilateral.',
    assessment: 'Kehamilan 32 minggu dengan preeklampsia ringan. Perlu monitoring ketat.',
    plan: 'Rawat jalan, antihipertensi labetalol 100mg 2x1, kontrol 1 minggu, pantau protein urin.',
    attachments: ['USG_32W_Dewi.pdf', 'Lab_Urin_Jun26.pdf', 'CTG_Jun26.pdf'],
    week: 32,
  },
  {
    id: 'MR-003',
    patient: 'Fatimah Zahra',
    date: '13 Jun 2026',
    service: 'ANC Konsultasi',
    vitals: { bp: '115/75', weight: '72 kg', height: '162 cm' },
    subjective: 'Pasien merasakan kontraksi ringan, persiapan persalinan. Cemas menjelang HPL.',
    objective: 'TD 115/75. DJJ 152x/mnt. Kepala sudah masuk panggul. TFU 35 cm.',
    assessment: 'Kehamilan 36 minggu, presentasi kepala, siap untuk persalinan.',
    plan: 'Persiapan persalinan, hospital bag, tanda-tanda persalinan, hubungi segera jika kontraksi 5 mnt.',
    attachments: ['USG_36W_Fatimah.pdf'],
    week: 36,
  },
]

type Record = (typeof RECORDS)[number]

// ─── SOAP section labels ──────────────────────────────────────────────────────

const SOAP_SECTIONS = [
  { key: 'subjective',  label: 'S — Subjective',  description: 'Keluhan Pasien',   color: 'text-blue-700',    bg: 'bg-blue-50'    },
  { key: 'objective',   label: 'O — Objective',   description: 'Pemeriksaan Fisik', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { key: 'assessment',  label: 'A — Assessment',  description: 'Diagnosis',         color: 'text-amber-700',   bg: 'bg-amber-50'   },
  { key: 'plan',        label: 'P — Plan',        description: 'Rencana Terapi',    color: 'text-purple-700',  bg: 'bg-purple-50'  },
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('')
}

function bpColor(bp: string) {
  const [sys] = bp.split('/').map(Number)
  if (sys >= 140) return 'text-rose'
  if (sys >= 130) return 'text-amber-600'
  return 'text-emerald-600'
}

// ─── FadeUp ───────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── SOAP Collapsible section ─────────────────────────────────────────────────

function SoapSection({
  sectionKey,
  label,
  description,
  color,
  bg,
  content,
}: {
  sectionKey: string
  label: string
  description: string
  color: string
  bg: string
  content: string
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-blush/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
            <span className={`text-xs font-extrabold ${color}`}>{sectionKey[0].toUpperCase()}</span>
          </div>
          <div className="text-left">
            <div className={`text-sm font-bold ${color}`}>{label}</div>
            <div className="text-xs text-muted">{description}</div>
          </div>
        </div>
        <div className="text-muted">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              <p className="text-sm text-ink leading-relaxed">{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Record detail panel ──────────────────────────────────────────────────────

function RecordDetail({ record }: { record: Record }) {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-5 border-b border-blush/20">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-12 h-12 rounded-2xl bg-ink flex items-center justify-center shrink-0">
            <span className="text-white font-extrabold text-base">{initials(record.patient)}</span>
          </div>
          <div>
            <div className="font-extrabold text-ink text-lg leading-tight">{record.patient}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted">{record.date}</span>
              <span className="text-muted">·</span>
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                {record.service}
              </span>
              <span className="text-muted">·</span>
              <span className="text-xs text-muted">{record.id}</span>
            </div>
          </div>
        </div>
        {record.week > 0 && (
          <div className="mt-2 text-xs text-muted">Usia kehamilan: <span className="font-bold text-ink">{record.week} minggu</span></div>
        )}
      </div>

      {/* Vitals */}
      <div className="p-5 border-b border-blush/20">
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-3">Tanda Vital</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-cream rounded-xl p-3 text-center">
            <Heart size={14} className={`mx-auto mb-1 ${bpColor(record.vitals.bp)}`} />
            <div className={`font-extrabold text-base ${bpColor(record.vitals.bp)}`}>{record.vitals.bp}</div>
            <div className="text-[10px] text-muted mt-0.5">Tekanan Darah</div>
          </div>
          <div className="bg-cream rounded-xl p-3 text-center">
            <Weight size={14} className="mx-auto mb-1 text-sage-dark" />
            <div className="font-extrabold text-base text-ink">{record.vitals.weight}</div>
            <div className="text-[10px] text-muted mt-0.5">Berat Badan</div>
          </div>
          <div className="bg-cream rounded-xl p-3 text-center">
            <Ruler size={14} className="mx-auto mb-1 text-sage-dark" />
            <div className="font-extrabold text-base text-ink">{record.vitals.height}</div>
            <div className="text-[10px] text-muted mt-0.5">Tinggi Badan</div>
          </div>
        </div>
      </div>

      {/* SOAP notes */}
      <div className="p-5 border-b border-blush/20">
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-3">Catatan SOAP</div>
        <div className="space-y-2">
          {SOAP_SECTIONS.map((s) => (
            <SoapSection
              key={s.key}
              sectionKey={s.key}
              label={s.label}
              description={s.description}
              color={s.color}
              bg={s.bg}
              content={record[s.key]}
            />
          ))}
        </div>
      </div>

      {/* Attachments */}
      <div className="p-5">
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-3">Lampiran</div>
        <div className="space-y-2">
          {record.attachments.map((file) => (
            <motion.button
              key={file}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,240,245,0.6)' }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-blush/20 bg-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={14} className="text-muted" />
                <span className="text-sm text-ink font-medium">{file}</span>
              </div>
              <Download size={13} className="text-muted" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecordsPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(RECORDS[0]?.id ?? null)

  const filtered = RECORDS.filter((r) =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.service.toLowerCase().includes(search.toLowerCase())
  )

  const selectedRecord = RECORDS.find((r) => r.id === selectedId) ?? null

  return (
    <main className="p-4 md:p-6 h-full">
      {/* Page heading */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <h1 className="font-extrabold text-ink text-2xl">Medical Records</h1>
          <div className="sm:ml-auto relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pasien atau layanan…"
              className="w-full pl-8 pr-8 py-2 text-sm bg-white border border-blush/30 rounded-xl text-ink placeholder:text-muted focus:outline-none focus:border-blush/60"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </FadeUp>

      {/* Two-panel layout */}
      <FadeUp delay={0.08}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: '60vh' }}>
          {/* Left panel — record list */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-float overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-blush/20 shrink-0">
              <div className="text-xs font-bold text-muted uppercase tracking-wide">
                {filtered.length} Rekam Medis
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-blush/10">
              {filtered.map((r) => (
                <motion.button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full text-left px-4 py-3.5 transition-colors ${
                    selectedId === r.id ? 'bg-cream' : 'hover:bg-cream/50'
                  }`}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.12 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{initials(r.patient)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-ink text-sm truncate">{r.patient}</div>
                      <div className="text-xs text-muted mt-0.5">{r.service}</div>
                      <div className="text-[10px] text-muted mt-0.5">{r.date} · {r.id}</div>
                    </div>
                    {selectedId === r.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-rose mt-1.5 shrink-0" />
                    )}
                  </div>
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-10 text-muted">
                  <FileText size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Rekam medis tidak ditemukan</p>
                </div>
              )}
            </div>
          </div>

          {/* Right panel — record detail */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-float overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {selectedRecord ? (
                <motion.div
                  key={selectedRecord.id}
                  className="flex-1 overflow-hidden"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  style={{ height: '100%' }}
                >
                  <RecordDetail record={selectedRecord} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="flex-1 flex flex-col items-center justify-center py-20 text-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p className="font-semibold text-base">Pilih rekam medis</p>
                  <p className="text-sm mt-1 text-muted/60">Klik salah satu rekam medis di kiri untuk melihat detail</p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted/50">
                    <Activity size={12} />
                    <span>SOAP notes · Tanda Vital · Lampiran</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </FadeUp>
    </main>
  )
}
