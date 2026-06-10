import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, User, Tag, Calendar, BookOpen } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { articles, type ArticleBlock } from '@/lib/data'

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) return { title: 'Artikel Tidak Ditemukan' }
  return {
    title: `${article.title} | Apotek Keluarga Cirebon`,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      authors: article.author ? [article.author] : undefined,
    },
  }
}

function BlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="text-xl font-extrabold text-ink mt-8 mb-3 leading-snug">
          {block.text}
        </h2>
      )
    case 'paragraph':
      return (
        <p className="text-ink/80 leading-relaxed text-base mb-4">
          {block.text}
        </p>
      )
    case 'list':
      return (
        <ul className="mb-4 space-y-2">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-ink/80 text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-rose shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <div className="my-6 bg-blush/30 rounded-card px-5 py-4 flex gap-3">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-ink/80 text-sm leading-relaxed">{block.text}</p>
        </div>
      )
    default:
      return null
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  'Kehamilan':     'bg-rose/10 text-rose',
  'Program Hamil': 'bg-sage-light/60 text-sage-dark',
  'USG':           'bg-blush text-burgundy',
  'Panduan':       'bg-cream text-muted border border-blush',
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 2)
  const catColor = CATEGORY_COLORS[article.category] ?? 'bg-cream text-muted'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">

            {/* Main article */}
            <article>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-muted mb-6">
                <Link href="/" className="hover:text-rose transition-colors">Beranda</Link>
                <span>/</span>
                <Link href="/articles" className="hover:text-rose transition-colors">Artikel</Link>
                <span>/</span>
                <span className="text-ink font-medium line-clamp-1">{article.title}</span>
              </nav>

              {/* Hero */}
              <div className="bg-gradient-to-br from-blush/50 to-sage-light/20 rounded-2xl h-56 md:h-72 flex items-center justify-center mb-8 overflow-hidden relative">
                <div className="text-8xl opacity-20">
                  {article.category === 'Kehamilan' ? '🤰' :
                   article.category === 'USG' ? '📡' :
                   article.category === 'Program Hamil' ? '🌸' : '📖'}
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catColor}`}>
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted mb-4">
                {article.author && (
                  <span className="flex items-center gap-1.5">
                    <User size={12} className="text-rose" />
                    {article.author}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-rose" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-rose" />
                  {article.readTime} baca
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-ink leading-tight mb-4">
                {article.title}
              </h1>

              <p className="text-muted text-lg leading-relaxed mb-8 pb-8 border-b border-blush">
                {article.excerpt}
              </p>

              {/* Content */}
              <div className="prose-custom">
                {article.content?.map((block, i) => (
                  <BlockRenderer key={i} block={block} />
                ))}
              </div>

              {/* Tags */}
              {article.tags && (
                <div className="mt-10 pt-6 border-t border-blush flex flex-wrap gap-2">
                  <Tag size={13} className="text-muted mt-0.5 shrink-0" />
                  {article.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-cream text-muted px-3 py-1 rounded-full border border-blush">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-10 flex items-center justify-between">
                <Link href="/articles" className="flex items-center gap-2 text-sm text-muted hover:text-rose transition-colors font-semibold">
                  <ArrowLeft size={15} /> Semua Artikel
                </Link>
                <Link href="/booking" className="btn-primary text-sm">
                  Buat Janji <ArrowRight size={15} />
                </Link>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-14">
                  <h3 className="font-extrabold text-ink text-lg mb-5">Artikel Terkait</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {related.map((r) => (
                      <Link key={r.id} href={`/articles/${r.slug}`}
                        className="bg-surface rounded-card shadow-soft p-5 hover:shadow-card hover:-translate-y-1 transition-all group flex gap-4">
                        <div className="text-3xl shrink-0 mt-0.5">
                          {r.category === 'Kehamilan' ? '🤰' : r.category === 'USG' ? '📡' : r.category === 'Program Hamil' ? '🌸' : '📖'}
                        </div>
                        <div>
                          <div className="font-bold text-ink text-sm leading-snug group-hover:text-rose transition-colors line-clamp-2">{r.title}</div>
                          <div className="text-xs text-muted mt-1">{r.readTime} baca</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-28 self-start">

              {/* Doctor CTA */}
              <div className="bg-burgundy text-white rounded-2xl p-6 shadow-float">
                <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Konsultasi Langsung</div>
                <p className="font-bold text-base mb-1">dr. Wildan A. Sutrisno</p>
                <p className="text-sm text-white/60 mb-5">SpOG · Dokter Kandungan Cirebon</p>
                <Link href="/booking" className="block w-full text-center bg-white text-burgundy font-bold text-sm py-3 rounded-btn hover:bg-cream transition-colors mb-3">
                  Buat Janji Online
                </Link>
                <a href="https://wa.me/6285220024400" target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center bg-[#25D366] text-white font-bold text-sm py-3 rounded-btn hover:bg-[#20ba5a] transition-colors">
                  💬 WhatsApp
                </a>
              </div>

              {/* Jadwal Singkat */}
              <div className="bg-surface rounded-2xl shadow-soft p-5">
                <div className="font-bold text-ink text-sm mb-4">Jadwal Praktek</div>
                <div className="space-y-2.5 text-sm">
                  {[
                    { loc: 'Apotek Keluarga', hari: 'Senin – Sabtu', jam: 'Siang & Sore' },
                    { loc: 'RS Medimas', hari: 'Selasa & Kamis', jam: 'Pagi' },
                  ].map((s) => (
                    <div key={s.loc} className="pb-2.5 border-b border-blush last:border-0">
                      <div className="font-semibold text-ink">{s.loc}</div>
                      <div className="text-muted text-xs">{s.hari} · {s.jam}</div>
                    </div>
                  ))}
                </div>
                <Link href="/schedule" className="block mt-3 text-xs text-rose font-semibold hover:underline">
                  Lihat jadwal lengkap →
                </Link>
              </div>

              {/* Other articles */}
              <div className="bg-surface rounded-2xl shadow-soft p-5">
                <div className="font-bold text-ink text-sm mb-4 flex items-center gap-2">
                  <BookOpen size={13} className="text-rose" />
                  Artikel Lainnya
                </div>
                <div className="space-y-3">
                  {articles.filter((a) => a.id !== article.id).slice(0, 4).map((a) => (
                    <Link key={a.id} href={`/articles/${a.slug}`}
                      className="flex items-start gap-2.5 group">
                      <span className="text-lg shrink-0">
                        {a.category === 'Kehamilan' ? '🤰' : a.category === 'USG' ? '📡' : a.category === 'Program Hamil' ? '🌸' : '📖'}
                      </span>
                      <span className="text-xs text-ink leading-snug group-hover:text-rose transition-colors line-clamp-2">{a.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
