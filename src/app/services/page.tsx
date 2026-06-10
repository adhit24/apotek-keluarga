import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { services } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Layanan Klinik — Kandungan, USG, THT & Keluarga',
  description:
    'Layanan lengkap Apotek Keluarga Cirebon: konsultasi kandungan, USG 2D/3D/4D, antenatal care, program hamil, THT, dan kesehatan keluarga bersama dr. Wildan SpOG.',
  keywords: ['layanan kandungan Cirebon', 'USG 4D Cirebon', 'program hamil Cirebon', 'klinik keluarga Cirebon', 'THT Cirebon'],
  openGraph: {
    title: 'Layanan Apotek Keluarga Cirebon | Kandungan & Keluarga',
    description: 'Konsultasi kandungan, USG, program hamil, dan kesehatan keluarga di Cirebon.',
    type: 'website',
  },
}


export default function ServicesPage() {
  const byCategory = services.reduce<Record<string, typeof services>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-cream">
        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 mb-16 text-center">
          <div className="section-tag mb-4 mx-auto w-fit">Layanan Kami</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">
            Lengkap untuk Kesehatan{' '}
            <span className="text-rose">Ibu & Keluarga</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Dari konsultasi kandungan, USG, program hamil, hingga THT — semua tersedia dengan
            dokter spesialis berpengalaman di satu tempat.
          </p>
        </section>

        {/* Services by category */}
        <section className="max-w-6xl mx-auto px-4">
          {Object.entries(byCategory).map(([category, items]) => (
            <div key={category} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-ink">{category}</h2>
                <div className="flex-1 h-px bg-blush" />
                <span className="text-sm text-muted">{items.length} layanan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((service) => (
                  <div
                    key={service.id}
                    id={service.slug}
                    className={`bg-surface rounded-card p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 ${
                      service.highlight ? 'ring-2 ring-rose/20' : ''
                    }`}
                  >
                    {service.highlight && (
                      <span className="inline-block text-xs font-bold text-rose bg-blush px-2.5 py-1 rounded-full mb-3">
                        Unggulan
                      </span>
                    )}
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="font-bold text-ink text-base mb-2">{service.name}</h3>
                    <p className="text-muted text-sm leading-relaxed mb-4">{service.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-blush">
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Clock size={13} />
                        {service.duration}
                      </div>
                      <Link
                        href="/booking"
                        className="text-sm font-semibold text-rose hover:text-rose-dark flex items-center gap-1 transition-colors"
                      >
                        Booking <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-4 mt-8 text-center">
          <div className="bg-blush/40 rounded-2xl p-10">
            <span className="script-accent text-3xl block mb-3 text-burgundy">Masih bingung?</span>
            <h2 className="text-2xl font-extrabold text-ink mb-3">
              Konsultasikan kebutuhan Anda
            </h2>
            <p className="text-muted mb-6">
              Tim kami siap membantu menentukan layanan yang tepat untuk Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/booking" className="btn-primary">
                Buat Janji <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/6285220024400"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
