import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight, Calendar, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { doctors, locations } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Jadwal Praktik — dr. Wildan SpOG Cirebon',
  description:
    'Jadwal praktik dr. Wildan A. Sutrisno, SpOG di Apotek Keluarga dan RS Medimas Cirebon. Cek ketersediaan jadwal dan booking online langsung.',
  keywords: ['jadwal dokter kandungan Cirebon', 'jadwal SpOG Cirebon', 'jam praktek dr Wildan Cirebon'],
  openGraph: {
    title: 'Jadwal Praktik dr. Wildan SpOG | Apotek Keluarga Cirebon',
    description: 'Lihat jadwal praktek dan booking online dokter kandungan Cirebon.',
    type: 'website',
  },
}

const DAY_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default function SchedulePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-cream">
        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 mb-14 text-center">
          <div className="section-tag mb-4 mx-auto w-fit">
            <Calendar size={13} />
            Jadwal Praktek
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">
            Jadwal Lengkap Dokter
          </h1>
          <p className="text-muted text-lg max-w-lg mx-auto">
            Pilih dokter dan hari yang sesuai, lalu booking online dalam hitungan menit.
          </p>
        </section>

        {/* Doctors */}
        {doctors.map((doc) => (
          <section key={doc.id} className="max-w-6xl mx-auto px-4 mb-14">
            {/* Doctor header */}
            <div className="bg-surface rounded-2xl shadow-soft p-6 mb-6 flex items-center gap-5">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-blush shrink-0">
                <Image src={doc.photo} alt={doc.name} fill className="object-cover object-top" />
              </div>
              <div className="flex-1">
                <h2 className="font-extrabold text-ink text-xl">{doc.name}, {doc.title}</h2>
                <p className="text-muted text-sm">{doc.specialization}</p>
              </div>
              <Link href="/booking" className="btn-primary text-sm hidden sm:flex">
                Booking <ArrowRight size={15} />
              </Link>
            </div>

            {/* Per-location schedules */}
            {doc.locationSchedules.map((ls) => {
              const location = locations.find((l) => l.id === ls.locationId)
              if (!location) return null
              return (
                <div key={ls.locationId} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={14} className="text-rose" />
                    <span className="font-bold text-ink text-base">{location.name}</span>
                    <span className="text-xs text-muted">— {location.address}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {DAY_ORDER.map((day) => {
                      const daySched = ls.schedule.find((s) => s.day === day)
                      const hasSessions = daySched && daySched.sessions.length > 0
                      return (
                        <div
                          key={day}
                          className={`rounded-card p-5 ${hasSessions ? 'bg-surface shadow-soft' : 'bg-cream opacity-60'}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className={`font-bold text-base ${hasSessions ? 'text-ink' : 'text-muted'}`}>
                              {day}
                            </h3>
                            {!hasSessions && (
                              <span className="text-xs text-muted/60 italic">Tidak praktek</span>
                            )}
                          </div>

                          {hasSessions &&
                            daySched.sessions.map((session) => {
                              const available = session.slots.filter((s) => s.taken < s.quota).length
                              const total = session.slots.length
                              return (
                                <div key={session.id} className="mb-3 last:mb-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold bg-blush text-burgundy px-2 py-0.5 rounded-full">
                                      {session.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted mb-1">
                                    <Clock size={13} />
                                    {session.startTime} – {session.endTime}
                                  </div>
                                  <div className="text-xs text-sage-dark font-medium">
                                    {available}/{total} slot tersedia
                                  </div>
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {session.slots.map((slot) => (
                                      <div
                                        key={slot.id}
                                        title={`${slot.time} — ${slot.taken >= slot.quota ? 'Penuh' : `${slot.quota - slot.taken} sisa`}`}
                                        className={`w-2 h-2 rounded-full ${
                                          slot.taken >= slot.quota ? 'bg-muted-light' : 'bg-sage'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div className="sm:hidden mt-4 text-center">
              <Link href="/booking" className="btn-primary w-full">
                Booking <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        ))}

        {/* Legend */}
        <div className="max-w-6xl mx-auto px-4 mb-10 flex flex-wrap gap-4 text-xs text-muted justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sage" /> Slot tersedia
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-light" /> Slot penuh
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-blush/40 rounded-2xl p-10">
            <h2 className="text-2xl font-extrabold text-ink mb-3">Siap Membuat Janji?</h2>
            <p className="text-muted mb-6">
              Booking online tersedia 24 jam. Pilih slot favorit Anda sekarang.
            </p>
            <Link href="/booking" className="btn-primary">
              Buat Janji Sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
