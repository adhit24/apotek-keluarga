import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, BookOpen, Tag } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { articles } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Artikel Kesehatan Kehamilan & Kandungan | Apotek Keluarga Cirebon',
  description: 'Kumpulan artikel kesehatan seputar kehamilan, USG, program hamil, dan kesehatan ibu dari dr. Wildan A. Sutrisno, SpOG — dokter kandungan Cirebon.',
  keywords: ['artikel kehamilan', 'tips hamil', 'kesehatan ibu', 'USG kehamilan', 'dokter kandungan Cirebon'],
  openGraph: {
    title: 'Artikel Kesehatan | Apotek Keluarga Cirebon',
    description: 'Edukasi kesehatan kehamilan dari dr. Wildan A. Sutrisno, SpOG.',
    type: 'website',
  },
}

const CATEGORIES = ['Semua', 'Kehamilan', 'Program Hamil', 'USG', 'Panduan']

const CATEGORY_COLORS: Record<string, string> = {
  'Kehamilan':    'bg-rose/10 text-rose',
  'Program Hamil': 'bg-sage-light/60 text-sage-dark',
  'USG':           'bg-blush text-burgundy',
  'Panduan':       'bg-cream text-muted border border-blush',
}

function CategoryBadge({ cat }: { cat: string }) {
  const cls = CATEGORY_COLORS[cat] ?? 'bg-cream text-muted'
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>{cat}</span>
}

export default function ArticlesPage({ searchParams }: { searchParams?: { category?: string } }) {
  const activeCategory = searchParams?.category ?? 'Semua'
  const filtered = activeCategory === 'Semua'
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        {/* Header */}
        <section className="max-w-6xl mx-auto px-4 mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blush/50 text-burgundy text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <BookOpen size={12} />
            Edukasi Kesehatan
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">
            Artikel & Tips Kesehatan
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Panduan berbasis medis dari dr. Wildan A. Sutrisno, SpOG — untuk menemani perjalanan kehamilan Anda.
          </p>
        </section>

        {/* Category filter */}
        <section className="max-w-6xl mx-auto px-4 mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === 'Semua' ? '/articles' : `/articles?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-rose text-white shadow-btn'
                    : 'bg-surface text-ink hover:bg-blush border border-blush'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {/* Articles grid */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group bg-surface rounded-2xl shadow-soft overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Thumbnail placeholder */}
                <div className="h-44 bg-gradient-to-br from-blush/40 to-sage-light/30 flex items-center justify-center relative overflow-hidden">
                  <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">
                    {article.category === 'Kehamilan' ? '🤰' :
                     article.category === 'USG' ? '📡' :
                     article.category === 'Program Hamil' ? '🌸' : '📖'}
                  </div>
                  <div className="absolute top-3 left-3">
                    <CategoryBadge cat={article.category} />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-extrabold text-ink text-base leading-snug mb-2 group-hover:text-rose transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-muted text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-blush/60">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {article.readTime}
                      </span>
                      <span>{article.date}</span>
                    </div>
                    <ArrowRight size={15} className="text-rose opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>Belum ada artikel dalam kategori ini.</p>
            </div>
          )}
        </section>

        {/* Tags cloud */}
        <section className="max-w-6xl mx-auto px-4 mt-14">
          <div className="bg-surface rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={15} className="text-rose" />
              <span className="font-bold text-ink text-sm">Topik Populer</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(articles.flatMap((a) => a.tags ?? []))).map((tag) => (
                <span key={tag} className="text-xs bg-cream text-muted px-3 py-1.5 rounded-full border border-blush hover:border-rose hover:text-rose cursor-default transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-4 mt-14 text-center">
          <div className="bg-blush/40 rounded-2xl p-10">
            <h2 className="text-2xl font-extrabold text-ink mb-3">Ada Pertanyaan Medis?</h2>
            <p className="text-muted mb-6">
              Konsultasikan langsung dengan dr. Wildan A. Sutrisno, SpOG. Booking online tersedia 24 jam.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/booking" className="btn-primary">
                Buat Janji Sekarang <ArrowRight size={16} />
              </Link>
              <a href="https://wa.me/6285220024400" target="_blank" rel="noopener noreferrer" className="btn-wa">
                <span>💬</span> Tanya via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
