'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, AtSign, Clock, Send, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-cream">
        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 mb-16 text-center">
          <div className="section-tag mb-4 mx-auto w-fit">Kontak</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">
            Kami Siap Membantu Anda
          </h1>
          <p className="text-muted text-lg max-w-lg mx-auto">
            Hubungi kami melalui WhatsApp, telepon, atau kunjungi klinik kami langsung di Cirebon.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6">
            {/* Map placeholder */}
            <div className="bg-blush/30 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
              <a
                href="https://maps.google.com/?q=Jl.+Gerilyawan+No.5+Cirebon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center"
              >
                <MapPin size={40} className="text-rose mx-auto mb-3" />
                <p className="font-semibold text-ink">Buka di Google Maps</p>
                <p className="text-sm text-muted mt-1">Jl. Gerilyawan No.5, Cirebon</p>
              </a>
            </div>

            {/* Contact cards */}
            {[
              {
                icon: <MapPin size={20} className="text-rose" />,
                title: 'Alamat',
                content: 'Jl. Gerilyawan No.5, Simaja Selatan, Kesambi, Kota Cirebon, Jawa Barat 45134',
              },
              {
                icon: <Phone size={20} className="text-rose" />,
                title: 'Telepon / WhatsApp',
                content: '0852-2002-4400\n0811-2421-983',
              },
              {
                icon: <AtSign size={20} className="text-rose" />,
                title: 'Instagram',
                content: '@apotekkeluargacirebon',
              },
              {
                icon: <Clock size={20} className="text-rose" />,
                title: 'Jam Operasional',
                content: 'Senin–Sabtu sesuai jadwal praktek dokter\n(Lihat halaman Jadwal)',
              },
            ].map((item) => (
              <div key={item.title} className="bg-surface rounded-card p-5 shadow-soft flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-ink text-sm mb-1">{item.title}</div>
                  <div className="text-muted text-sm whitespace-pre-line">{item.content}</div>
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/6285220024400"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa w-full"
            >
              <span className="text-xl">💬</span>
              Hubungi via WhatsApp Sekarang
            </a>
          </div>

          {/* Contact form */}
          <div className="bg-surface rounded-2xl shadow-card p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-sage-dark" />
                </div>
                <span className="script-accent text-3xl text-burgundy block mb-2">Terima kasih!</span>
                <h3 className="text-xl font-bold text-ink mb-2">Pesan Terkirim</h3>
                <p className="text-muted text-sm">
                  Tim kami akan menghubungi Anda melalui WhatsApp dalam waktu singkat.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-ink mb-1">Kirim Pesan</h2>
                  <p className="text-muted text-sm">Kami akan membalas dalam 1×24 jam</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 rounded-card border border-blush text-ink text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-card border border-blush text-ink text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
                    Pesan *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda sampaikan..."
                    className="w-full px-4 py-3 rounded-card border border-blush text-ink text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Send size={16} /> Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
