'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Building2, Users, Calendar, Bell, Edit3, Plus, Check, MapPin, Phone, Mail, FileText } from 'lucide-react'

const TABS = ['Profil Klinik', 'Staf', 'Jadwal Praktik', 'Notifikasi'] as const
type Tab = typeof TABS[number]

const STAFF = [
  { name:'dr. Wildan A. Sutrisno', role:'Owner / Dokter SpOG', email:'wildan@apotek.keluarga', status:'active', avatar:'W', color:'bg-rose/10 text-rose' },
  { name:'Sari Indah',             role:'Admin',               email:'sari@apotek.keluarga',   status:'active', avatar:'S', color:'bg-blush/20 text-ink' },
  { name:'Budi Santoso',           role:'Kasir',               email:'budi@apotek.keluarga',   status:'active', avatar:'B', color:'bg-sage/20 text-sage-dark' },
  { name:'Rina Fitriani',          role:'Perawat',             email:'rina@apotek.keluarga',   status:'active', avatar:'R', color:'bg-amber-50 text-amber-700' },
]

interface ScheduleDay {
  day: string; status: boolean; start: string; end: string; location: string
}

const INITIAL_SCHEDULE: ScheduleDay[] = [
  { day:'Senin',  status:true,  start:'08:00', end:'16:00', location:'Apotek Keluarga' },
  { day:'Selasa', status:true,  start:'08:00', end:'16:00', location:'Apotek Keluarga' },
  { day:'Rabu',   status:true,  start:'08:00', end:'16:00', location:'RS Medimas' },
  { day:'Kamis',  status:true,  start:'11:00', end:'18:00', location:'RS Medimas' },
  { day:'Jumat',  status:true,  start:'08:00', end:'16:00', location:'Apotek Keluarga' },
  { day:'Sabtu',  status:true,  start:'08:00', end:'13:00', location:'Apotek Keluarga' },
  { day:'Minggu', status:false, start:'—',     end:'—',     location:'—' },
]

const NOTIFICATIONS = [
  { key:'reminder_h1',    label:'Reminder appointment H-1 via WA',   desc:'Kirim pesan WA otomatis 1 hari sebelum appointment' },
  { key:'reminder_h2',    label:'Reminder appointment H-2 via WA',   desc:'Kirim pesan WA otomatis 2 hari sebelum appointment' },
  { key:'noshow_alert',   label:'Notifikasi no-show otomatis',        desc:'Alert jika pasien tidak hadir sesuai jadwal' },
  { key:'daily_report',   label:'Laporan harian via email',           desc:'Ringkasan aktivitas klinik dikirim setiap pukul 20:00' },
  { key:'stock_alert',    label:'Alert stok kritis',                  desc:'Notifikasi jika stok item di bawah minimum' },
  { key:'anc_followup',   label:'Follow-up ANC otomatis',             desc:'Reminder follow-up untuk pasien ANC yang belum kontrol' },
]

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!on)}
      className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${on ? 'bg-ink' : 'bg-muted/30'}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
        animate={{ left: on ? '22px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profil Klinik')
  const [schedule, setSchedule] = useState<ScheduleDay[]>(INITIAL_SCHEDULE)
  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATIONS.map(n => [n.key, true]))
  )
  const [saved, setSaved] = useState(false)

  const toggleDay = (i: number) => {
    setSchedule(prev => prev.map((d, idx) => idx === i ? { ...d, status: !d.status } : d))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabIcons: Record<Tab, React.ReactNode> = {
    'Profil Klinik':    <Building2 size={14} />,
    'Staf':             <Users size={14} />,
    'Jadwal Praktik':   <Calendar size={14} />,
    'Notifikasi':       <Bell size={14} />,
  }

  const CLINIC_FIELDS = [
    { label:'Nama Klinik',       value:'Apotek Keluarga',                              icon: Building2 },
    { label:'Dokter',            value:'dr. Wildan A. Sutrisno, SpOG',                  icon: Users },
    { label:'Telepon 1',         value:'0811-242-1983',                                 icon: Phone },
    { label:'Telepon 2',         value:'0852-2002-4400',                                icon: Phone },
    { label:'Alamat',            value:'Jl. Gerilyawan No.5, Pekiringan, Kesambi, Cirebon', icon: MapPin },
    { label:'Email',             value:'apotek.keluarga@gmail.com',                     icon: Mail },
    { label:'Nomor SIP',         value:'SIP-123/DINKES/2020',                           icon: FileText },
  ]

  return (
    <main className="p-4 md:p-6">
      <FadeUp className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Settings</h1>
        <p className="text-sm text-muted mt-0.5">Konfigurasi klinik & sistem</p>
      </FadeUp>

      {/* Tab nav */}
      <FadeUp delay={0.05} className="flex gap-2 flex-wrap mb-6">
        {TABS.map(tab => (
          <motion.button
            key={tab}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-ink text-white' : 'bg-white text-muted shadow-float hover:text-ink'
            }`}
          >
            {tabIcons[tab]} {tab}
          </motion.button>
        ))}
      </FadeUp>

      {/* Tab: Profil Klinik */}
      {activeTab === 'Profil Klinik' && (
        <FadeUp>
          <div className="bg-white rounded-2xl shadow-float p-5 space-y-3">
            {CLINIC_FIELDS.map(field => (
              <div key={field.label} className="flex items-center gap-3 p-3 bg-cream rounded-xl">
                <field.icon size={15} className="text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted mb-0.5">{field.label}</div>
                  <div className="text-sm font-semibold text-ink truncate">{field.value}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted"
                >
                  <Edit3 size={14} />
                </motion.button>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={handleSave}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-ink text-white py-3 rounded-xl font-semibold text-sm"
            >
              {saved ? <><Check size={15} /> Tersimpan!</> : 'Simpan Perubahan'}
            </motion.button>
          </div>
        </FadeUp>
      )}

      {/* Tab: Staf */}
      {activeTab === 'Staf' && (
        <FadeUp>
          <div className="flex justify-end mb-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 text-sm font-semibold text-ink bg-white shadow-float px-4 py-2 rounded-xl"
            >
              <Plus size={14} /> Tambah Staf
            </motion.button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {STAFF.map((staff, i) => (
              <motion.div
                key={staff.email}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-4 shadow-float"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold ${staff.color}`}>
                    {staff.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-ink text-sm">{staff.name}</div>
                    <div className="text-xs text-muted">{staff.email}</div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Aktif</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-cream text-ink px-2 py-1 rounded-lg font-medium">{staff.role}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 text-xs text-muted hover:text-ink"
                  >
                    <Edit3 size={12} /> Edit
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      )}

      {/* Tab: Jadwal Praktik */}
      {activeTab === 'Jadwal Praktik' && (
        <FadeUp>
          <div className="bg-white rounded-2xl shadow-float overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream">
                  <th className="text-left px-4 py-3 text-xs text-muted font-semibold">Hari</th>
                  <th className="text-left px-4 py-3 text-xs text-muted font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-muted font-semibold">Jam</th>
                  <th className="text-left px-4 py-3 text-xs text-muted font-semibold hidden md:table-cell">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((day, i) => (
                  <tr key={day.day} className="border-b border-cream/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink">{day.day}</td>
                    <td className="px-4 py-3">
                      <Toggle on={day.status} onChange={() => toggleDay(i)} />
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {day.status ? `${day.start} – ${day.end}` : '—'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {day.status && (
                        <span className="text-xs bg-cream text-ink px-2 py-0.5 rounded-full">{day.location}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-ink text-white py-3 rounded-xl font-semibold text-sm"
          >
            {saved ? <><Check size={15} /> Jadwal Tersimpan!</> : 'Simpan Jadwal'}
          </motion.button>
        </FadeUp>
      )}

      {/* Tab: Notifikasi */}
      {activeTab === 'Notifikasi' && (
        <FadeUp>
          <div className="bg-white rounded-2xl shadow-float divide-y divide-cream mb-4">
            {NOTIFICATIONS.map(notif => (
              <div key={notif.key} className="flex items-center justify-between px-5 py-4">
                <div className="flex-1 mr-4">
                  <div className="text-sm font-semibold text-ink">{notif.label}</div>
                  <div className="text-xs text-muted mt-0.5">{notif.desc}</div>
                </div>
                <Toggle
                  on={notifs[notif.key]}
                  onChange={v => setNotifs(prev => ({ ...prev, [notif.key]: v }))}
                />
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-ink text-white py-3 rounded-xl font-semibold text-sm"
          >
            {saved ? <><Check size={15} /> Pengaturan Tersimpan!</> : 'Simpan Pengaturan'}
          </motion.button>
        </FadeUp>
      )}
    </main>
  )
}
