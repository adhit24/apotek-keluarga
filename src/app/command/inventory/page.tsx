'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Package, AlertTriangle, Plus, Search, Filter, TrendingDown, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

type InventoryStatus = 'ok' | 'low' | 'critical'
type Category = 'Vitamin' | 'Suplemen' | 'Alkes' | 'Lab'

interface InventoryItem {
  id: string; name: string; category: Category; stock: number; min: number
  unit: string; price: number; lastOrder: string; expiry: string; status: InventoryStatus
}

const INVENTORY: InventoryItem[] = [
  { id:'i01', name:'Folavit 400mcg',      category:'Vitamin',   stock:145, min:50,  unit:'strip', price:45000,  lastOrder:'1 Jun 2026',  expiry:'Des 2026', status:'ok' },
  { id:'i02', name:'Kalk 500mg',           category:'Suplemen',  stock:8,   min:30,  unit:'strip', price:35000,  lastOrder:'15 Mei 2026', expiry:'Nov 2026', status:'low' },
  { id:'i03', name:'Vitamin B Complex',    category:'Vitamin',   stock:6,   min:20,  unit:'strip', price:28000,  lastOrder:'10 Mei 2026', expiry:'Okt 2026', status:'critical' },
  { id:'i04', name:'Fe (Zat Besi)',        category:'Suplemen',  stock:92,  min:40,  unit:'strip', price:40000,  lastOrder:'5 Jun 2026',  expiry:'Jan 2027', status:'ok' },
  { id:'i05', name:'Vitamin D3 1000IU',   category:'Vitamin',   stock:34,  min:30,  unit:'botol', price:55000,  lastOrder:'20 Mei 2026', expiry:'Feb 2027', status:'ok' },
  { id:'i06', name:'Omega-3 30 caps',      category:'Suplemen',  stock:12,  min:20,  unit:'botol', price:75000,  lastOrder:'12 Mei 2026', expiry:'Des 2026', status:'low' },
  { id:'i07', name:'Masker Medis 3ply',    category:'Alkes',     stock:500, min:100, unit:'pcs',   price:2000,   lastOrder:'1 Jun 2026',  expiry:'Des 2027', status:'ok' },
  { id:'i08', name:'Sarung Tangan Latex',  category:'Alkes',     stock:3,   min:10,  unit:'kotak', price:65000,  lastOrder:'20 Apr 2026', expiry:'Des 2026', status:'critical' },
  { id:'i09', name:'Gel USG',              category:'Alkes',     stock:28,  min:10,  unit:'botol', price:35000,  lastOrder:'8 Jun 2026',  expiry:'Jun 2027', status:'ok' },
  { id:'i10', name:'Kertas Thermal CTG',   category:'Alkes',     stock:4,   min:5,   unit:'roll',  price:45000,  lastOrder:'1 Mei 2026',  expiry:'—',        status:'critical' },
  { id:'i11', name:'Needle Injection',     category:'Alkes',     stock:200, min:50,  unit:'pcs',   price:1500,   lastOrder:'5 Jun 2026',  expiry:'Jun 2028', status:'ok' },
  { id:'i12', name:'Urine Test Strip',     category:'Lab',       stock:45,  min:20,  unit:'strip', price:8000,   lastOrder:'10 Jun 2026', expiry:'Agu 2026', status:'ok' },
]

const ALL_CATEGORIES = ['Semua', 'Vitamin', 'Suplemen', 'Alkes', 'Lab'] as const

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

function StatusBadge({ status }: { status: InventoryStatus }) {
  const map = {
    ok:       { label: 'Aman',    cls: 'bg-emerald-50 text-emerald-700' },
    low:      { label: 'Rendah',  cls: 'bg-amber-50 text-amber-700' },
    critical: { label: 'Kritis',  cls: 'bg-rose/10 text-rose' },
  }
  const { label, cls } = map[status]
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
}

function StockBar({ stock, min, status }: { stock: number; min: number; status: InventoryStatus }) {
  const pct = Math.min((stock / (min * 3)) * 100, 100)
  const color = status === 'critical' ? 'bg-rose' : status === 'low' ? 'bg-amber-400' : 'bg-emerald-400'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-cream rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs text-ink font-medium tabular-nums">{stock}</span>
    </div>
  )
}

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua')
  const [search, setSearch] = useState('')

  const criticalCount = INVENTORY.filter(i => i.status === 'critical').length
  const lowCount = INVENTORY.filter(i => i.status === 'low').length
  const totalValue = INVENTORY.reduce((sum, i) => sum + i.stock * i.price, 0)

  const filtered = INVENTORY.filter(item => {
    const matchCat = activeCategory === 'Semua' || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <main className="p-4 md:p-6">
      {/* Header */}
      <FadeUp className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Inventory</h1>
          <p className="text-sm text-muted mt-0.5">Stok obat & perlengkapan klinik</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          <Plus size={16} /> Tambah Stok
        </motion.button>
      </FadeUp>

      {/* Alert banner */}
      <AnimatePresence>
        {(criticalCount > 0 || lowCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5"
          >
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              {criticalCount} item stok kritis, {lowCount} item stok rendah — perlu reorder segera
            </p>
            <button className="ml-auto text-xs text-amber-700 font-semibold underline underline-offset-2">
              Lihat Semua
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Item', value: INVENTORY.length.toString(), icon: Package, color: 'text-ink' },
          { label: 'Stok Kritis', value: criticalCount.toString(), icon: XCircle, color: 'text-rose' },
          { label: 'Stok Rendah', value: lowCount.toString(), icon: TrendingDown, color: 'text-amber-600' },
          { label: 'Nilai Inventaris', value: `Rp ${(totalValue/1000000).toFixed(1)}Jt`, icon: CheckCircle, color: 'text-sage-dark' },
        ].map((stat, i) => (
          <FadeUp key={stat.label} delay={i * 0.05}>
            <div className="bg-white rounded-2xl p-4 shadow-float">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Filters */}
      <FadeUp delay={0.1} className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-float flex-1 min-w-48">
          <Search size={14} className="text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari item..."
            className="bg-transparent text-sm text-ink outline-none w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                activeCategory === cat ? 'bg-ink text-white' : 'bg-white text-muted shadow-float hover:text-ink'
              }`}
            >{cat}</motion.button>
          ))}
        </div>
      </FadeUp>

      {/* Table */}
      <FadeUp delay={0.15}>
        <div className="bg-white rounded-2xl shadow-float overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream">
                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase tracking-wide">Nama Item</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase tracking-wide hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase tracking-wide">Stok</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase tracking-wide hidden lg:table-cell">Min</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase tracking-wide hidden lg:table-cell">Expiry</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs text-muted font-semibold uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.015)' }}
                  className="border-b border-cream/60 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{item.name}</div>
                    <div className="text-xs text-muted">{item.unit}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-0.5 bg-cream rounded-full text-xs text-muted font-medium">{item.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StockBar stock={item.stock} min={item.min} status={item.status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted text-xs">{item.min} {item.unit}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted">{item.expiry}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 ml-auto text-xs font-semibold text-ink bg-cream px-2.5 py-1.5 rounded-lg hover:bg-blush/20 transition-colors"
                    >
                      <Plus size={12} /> Tambah
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeUp>

      {/* Reorder suggestion */}
      <FadeUp delay={0.2} className="mt-5">
        <div className="bg-ink rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={16} className="text-blush" />
            <h3 className="text-sm font-bold text-white">Saran Reorder Segera</h3>
          </div>
          <div className="grid gap-2">
            {INVENTORY.filter(i => i.status === 'critical').map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                <div>
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <span className="ml-2 text-xs text-white/40">Sisa {item.stock} {item.unit}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="text-xs bg-blush/20 text-blush px-3 py-1.5 rounded-lg font-semibold"
                >
                  Order Sekarang
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </main>
  )
}
