import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, GraduationCap, Award, ArrowRight, Calendar } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { doctors } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Tentang Kami — dr. Wildan A. Sutrisno, SpOG',
  description:
    'Kenali dr. Wildan A. Sutrisno, SpOG — dokter kandungan berpengalaman di Cirebon. Spesialis obstetri & ginekologi, USG, program hamil, dan kesehatan keluarga.',
  keywords: ['dr Wildan SpOG Cirebon', 'dokter kandungan Cirebon', 'SpOG Cirebon', 'Apotek Keluarga'],
  openGraph: {
    title: 'Tentang dr. Wildan A. Sutrisno, SpOG | Apotek Keluarga',
    description: 'Dokter kandungan spesialis obstetri & ginekologi di Cirebon.',
    type: 'website',
  },
}

export default function AboutPage() {
  const wildan = doctors.find((d) => d.id === 'dr-wildan')!
  const feb = doctors.find((d) => d.id === 'dr-febryanti')!

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-cream">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 mb-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="section-tag mb-6">Tim Dokter Kami</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-ink leading-tight mb-6">
                Dokter Spesialis yang{' '}
                <span className="text-rose">Peduli & Profesional</span>
              </h1>
              <p className="text-muted text-lg leading-relaxed mb-8">
                Tim dokter Apotek Keluarga hadir untuk menemani Anda dengan
                pendekatan yang hangat, teliti, dan penuh empati. Kami percaya
                bahwa kesehatan adalah perjalanan yang harus ditempuh bersama.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/booking" className="btn-primary">
                  Buat Janji <ArrowRight size={16} />
                </Link>
                <a
                  href="https://wa.me/6285220024400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa"
                >
                  <span>💬</span> Tanya Dokter
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="arch-card bg-blush/50 overflow-hidden aspect-[4/5] max-w-sm mx-auto">
                <Image
                  src="/dr-wildan.png"
                  alt={wildan.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute -right-4 top-8 bg-burgundy text-white rounded-card px-5 py-3 shadow-float text-center">
                <div className="font-extrabold text-2xl">10+</div>
                <div className="text-xs text-white/70">Tahun Pengalaman</div>
              </div>
            </div>
          </div>
        </section>

        {/* dr. Wildan */}
        <section className="bg-surface py-16 mb-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="section-tag mb-5">Spesialis Kandungan</div>
                <h2 className="text-3xl font-extrabold text-ink mb-1">dr. Wildan A. Sutrisno</h2>
                <p className="text-rose font-semibold text-lg mb-6">Spesialis Obstetri & Ginekologi (SpOG)</p>
                <p className="text-muted leading-relaxed mb-8">{wildan.bio}</p>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Education */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap size={18} className="text-rose" />
                      <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Pendidikan</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {wildan.education.map((edu) => (
                        <li key={edu} className="flex items-start gap-2.5 text-sm text-muted">
                          <CheckCircle2 size={15} className="text-sage-dark mt-0.5 shrink-0" />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expertise */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award size={18} className="text-rose" />
                      <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Keahlian</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {[
                        'Pemantauan Kehamilan',
                        'USG 2D / 3D / 4D',
                        'Program Hamil',
                        'KB & Keluarga Berencana',
                        'Kesehatan Reproduksi Wanita',
                        'Perawatan Nifas',
                      ].map((s) => (
                        <li key={s} className="flex items-start gap-2.5 text-sm text-muted">
                          <CheckCircle2 size={15} className="text-sage-dark mt-0.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Schedule card */}
              <div className="bg-cream rounded-card p-6 shadow-soft h-fit">
                <div className="flex items-center gap-2 mb-5">
                  <Calendar size={18} className="text-rose" />
                  <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Jadwal Praktek</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: 'Senin', time: '17.00–19.00' },
                    { day: 'Selasa', time: '15.00–18.00' },
                    { day: 'Rabu', time: '11.00–12.00 & 15.00–18.00' },
                    { day: 'Kamis', time: '11.00–12.00 & 15.00–18.00' },
                    { day: 'Jumat', time: '17.00–19.00' },
                    { day: 'Sabtu', time: '11.00–15.00' },
                  ].map(({ day, time }) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-ink">{day}</span>
                      <span className="text-muted">{time}</span>
                    </div>
                  ))}
                </div>
                <Link href="/booking" className="btn-primary w-full mt-6 text-sm">
                  Booking Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* dr. Febryanti */}
        <section className="bg-cream py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="section-tag mb-5">Spesialis THT</div>
                <h2 className="text-3xl font-extrabold text-ink mb-1">dr. Febryanti Purnamasari</h2>
                <p className="text-rose font-semibold text-lg mb-6">Spesialis THT — Bedah Kepala & Leher (Sp.THT-KL)</p>
                <p className="text-muted leading-relaxed mb-8">{feb.bio}</p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap size={18} className="text-rose" />
                      <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Pendidikan</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {feb.education.map((edu) => (
                        <li key={edu} className="flex items-start gap-2.5 text-sm text-muted">
                          <CheckCircle2 size={15} className="text-sage-dark mt-0.5 shrink-0" />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award size={18} className="text-rose" />
                      <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Keahlian</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {['Gangguan Telinga', 'Masalah Hidung & Sinusitis', 'Gangguan Tenggorokan', 'Bedah THT', 'Kesehatan Anak THT'].map(
                        (s) => (
                          <li key={s} className="flex items-start gap-2.5 text-sm text-muted">
                            <CheckCircle2 size={15} className="text-sage-dark mt-0.5 shrink-0" />
                            {s}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Schedule card */}
              <div className="bg-surface rounded-card p-6 shadow-soft h-fit">
                <div className="flex items-center gap-2 mb-5">
                  <Calendar size={18} className="text-rose" />
                  <h3 className="font-bold text-ink text-sm uppercase tracking-wider">Jadwal Praktek</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: 'Senin–Jumat', time: '17.00 – selesai' },
                    { day: 'Sabtu', time: '09.00 – selesai' },
                    { day: 'Minggu', time: 'Libur' },
                  ].map(({ day, time }) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-ink">{day}</span>
                      <span className={time === 'Libur' ? 'text-muted/40 italic' : 'text-muted'}>{time}</span>
                    </div>
                  ))}
                </div>
                <Link href="/booking" className="btn-primary w-full mt-6 text-sm">
                  Booking Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
