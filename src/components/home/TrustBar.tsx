'use client'

import { ShieldCheck, Users, Star, HeartPulse, Award } from 'lucide-react'

const stats = [
  { icon: Award,       value: '10+',    unit: 'Tahun',   label: 'Pengalaman Klinis' },
  { icon: Users,       value: '5.000+', unit: 'Pasien',  label: 'Telah Ditangani' },
  { icon: Star,        value: '4.9',    unit: '/5',      label: 'Rating Kepuasan' },
  { icon: HeartPulse,  value: '3.000+', unit: 'Kasus',   label: 'Pemeriksaan USG' },
  { icon: ShieldCheck, value: 'SpOG',   unit: '',        label: 'Spesialis Bersertifikat' },
]

// Duplicate for seamless loop
const ticker = [...stats, ...stats, ...stats]

export default function TrustBar() {
  return (
    <section className="bg-ink py-4 overflow-hidden">
      <div
        className="flex gap-0 w-max"
        style={{
          animation: 'ticker-scroll 28s linear infinite',
        }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {ticker.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-8 border-r border-white/10 shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-rose/20 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-blush" />
              </div>
              <div className="flex items-baseline gap-1 mr-1">
                <span className="text-xl font-extrabold text-burgundy tabular-nums leading-none">
                  {s.value}
                </span>
                {s.unit && (
                  <span className="text-xs font-semibold text-blush/70">{s.unit}</span>
                )}
              </div>
              <span className="text-xs text-white/40 whitespace-nowrap">{s.label}</span>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  )
}
