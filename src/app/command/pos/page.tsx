'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Plus, Minus, Trash2, CheckCircle2,
  User, CreditCard, Smartphone, Banknote, Building2,
  Clock, ChevronRight, X, Search,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SERVICES_CATALOG = [
  { id: 's1', name: 'Konsultasi SpOG',     price: 350000,  category: 'Konsultasi' },
  { id: 's2', name: 'USG 2D',              price: 200000,  category: 'USG' },
  { id: 's3', name: 'USG 4D',              price: 450000,  category: 'USG' },
  { id: 's4', name: 'ANC Paket Lengkap',   price: 600000,  category: 'ANC' },
  { id: 's5', name: 'Fertility Screening', price: 850000,  category: 'Fertility' },
  { id: 's6', name: 'CTG',                 price: 175000,  category: 'Pemeriksaan' },
  { id: 's7', name: 'Lab Darah Lengkap',   price: 280000,  category: 'Lab' },
]

const PRODUCTS_CATALOG = [
  { id: 'p1', name: 'Folavit 400mcg (30 tabs)',  price: 45000, category: 'Vitamin' },
  { id: 'p2', name: 'Kalk 500mg (30 tabs)',       price: 35000, category: 'Suplemen' },
  { id: 'p3', name: 'Fe (Zat Besi) (30 tabs)',    price: 40000, category: 'Suplemen' },
  { id: 'p4', name: 'Vitamin D3 1000IU',           price: 55000, category: 'Vitamin' },
  { id: 'p5', name: 'Omega-3 (30 caps)',            price: 75000, category: 'Suplemen' },
]

const RECENT_TRANSACTIONS = [
  { id: 'TXN-001', time: '08:45', patient: 'Fatimah Zahra',  items: ['ANC Paket Lengkap', 'Folavit 400mcg'],  total: 645000,  method: 'QRIS',     status: 'paid' },
  { id: 'TXN-002', time: '09:15', patient: 'Siti Nurhaliza', items: ['USG 4D', 'Kalk 500mg', 'Fe Zat Besi'],  total: 525000,  method: 'Transfer', status: 'paid' },
  { id: 'TXN-003', time: '10:00', patient: 'Rina Dewi',      items: ['USG 4D'],                                total: 450000,  method: 'Cash',     status: 'paid' },
  { id: 'TXN-004', time: '10:45', patient: 'Dewi Rahayu',    items: ['Konsultasi SpOG', 'Lab Darah Lengkap'], total: 630000,  method: 'Debit',    status: 'pending' },
]

const MOCK_PATIENTS = [
  'Fatimah Zahra', 'Siti Nurhaliza', 'Rina Dewi', 'Dewi Rahayu',
  'Putri Anggraini', 'Ayu Lestari', 'Yuni Astuti', 'Ratna Sari',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

type PayMethod = 'Cash' | 'Transfer' | 'QRIS' | 'Debit' | 'Asuransi'

interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

const PAY_METHODS: { id: PayMethod; label: string; Icon: React.ElementType }[] = [
  { id: 'Cash',     label: 'Cash',     Icon: Banknote   },
  { id: 'Transfer', label: 'Transfer', Icon: Building2  },
  { id: 'QRIS',     label: 'QRIS',     Icon: Smartphone },
  { id: 'Debit',    label: 'Debit',    Icon: CreditCard },
  { id: 'Asuransi', label: 'Asuransi', Icon: ShoppingCart },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function POSPage() {
  const [catalogTab, setCatalogTab] = useState<'Layanan' | 'Produk'>('Layanan')
  const [cart, setCart] = useState<CartItem[]>([])
  const [payMethod, setPayMethod] = useState<PayMethod>('QRIS')
  const [discount, setDiscount] = useState('')
  const [patientQuery, setPatientQuery] = useState('')
  const [patientSelected, setPatientSelected] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [success, setSuccess] = useState(false)

  const suggestions = patientQuery.length > 0
    ? MOCK_PATIENTS.filter((p) => p.toLowerCase().includes(patientQuery.toLowerCase())).slice(0, 3)
    : []

  const catalog = catalogTab === 'Layanan' ? SERVICES_CATALOG : PRODUCTS_CATALOG

  function addToCart(item: { id: string; name: string; price: number }) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => c.id === id ? { ...c, qty: c.qty + delta } : c)
        .filter((c) => c.qty > 0)
    )
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((c) => c.id !== id))
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const discountAmt = Math.min(Number(discount.replace(/\D/g, '')) || 0, subtotal)
  const total = subtotal - discountAmt

  function handleProcess() {
    if (cart.length === 0) return
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setCart([])
      setPatientSelected('')
      setPatientQuery('')
      setDiscount('')
      setPayMethod('QRIS')
    }, 2200)
  }

  const todayRevenue = RECENT_TRANSACTIONS.filter((t) => t.status === 'paid').reduce((s, t) => s + t.total, 0)
  const outstanding = RECENT_TRANSACTIONS.filter((t) => t.status === 'pending').length

  return (
    <main className="p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 h-full">

        {/* ═══ LEFT: CHECKOUT ═══════════════════════════════════════════════ */}
        <div className="flex-[3] min-w-0 flex flex-col gap-4">

          {/* Patient selector */}
          <div className="bg-white rounded-2xl p-4">
            <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">
              Pasien
            </label>
            <div className="relative">
              <div className="flex items-center gap-2 border border-blush/40 rounded-xl px-3 py-2.5 bg-cream/30 focus-within:border-rose/50 transition-colors">
                <User size={15} className="text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Cari nama pasien..."
                  value={patientSelected || patientQuery}
                  onChange={(e) => {
                    setPatientSelected('')
                    setPatientQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
                />
                {(patientSelected || patientQuery) && (
                  <button
                    onClick={() => { setPatientSelected(''); setPatientQuery('') }}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
                <Search size={14} className="text-muted/50 shrink-0" />
              </div>

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && !patientSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-blush/20 overflow-hidden z-20"
                  >
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onMouseDown={() => { setPatientSelected(s); setPatientQuery(''); setShowSuggestions(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-cream transition-colors flex items-center gap-2"
                      >
                        <User size={13} className="text-muted" />
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Catalog */}
          <div className="bg-white rounded-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-blush/20 px-4 pt-4 gap-1">
              {(['Layanan', 'Produk'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCatalogTab(tab)}
                  className={`px-4 py-2 rounded-t-lg text-sm font-bold transition-all duration-200 -mb-px ${
                    catalogTab === tab
                      ? 'bg-rose text-white'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Items grid */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {catalog.map((item) => {
                const inCart = cart.find((c) => c.id === item.id)
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(58,42,44,0.08)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className={`relative text-left p-3 rounded-xl border transition-all duration-200 ${
                      inCart
                        ? 'border-rose/40 bg-rose/4'
                        : 'border-blush/30 bg-cream/20 hover:border-rose/30'
                    }`}
                  >
                    <div className="text-[10px] font-semibold text-muted mb-1 uppercase tracking-wide">
                      {item.category}
                    </div>
                    <div className="text-sm font-bold text-ink leading-snug mb-1">{item.name}</div>
                    <div className="text-xs font-semibold text-rose">{fmt(item.price)}</div>
                    {inCart && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose text-white text-[10px] font-bold flex items-center justify-center">
                        {inCart.qty}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-lg bg-rose/10 flex items-center justify-center">
                      <Plus size={12} className="text-rose" />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-blush/20">
              <ShoppingCart size={15} className="text-rose" />
              <h3 className="font-bold text-ink text-sm">Keranjang</h3>
              {cart.length > 0 && (
                <span className="ml-auto text-xs bg-rose/10 text-rose font-bold px-2 py-0.5 rounded-full">
                  {cart.length} item
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted text-sm">
                Belum ada item dipilih
              </div>
            ) : (
              <div className="divide-y divide-blush/10">
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink truncate">{item.name}</div>
                        <div className="text-xs text-muted">{fmt(item.price)} / item</div>
                      </div>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-cream flex items-center justify-center hover:bg-blush/40 transition-colors"
                        >
                          <Minus size={11} className="text-ink" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-ink">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-cream flex items-center justify-center hover:bg-blush/40 transition-colors"
                        >
                          <Plus size={11} className="text-ink" />
                        </button>
                      </div>
                      <div className="text-sm font-bold text-ink w-24 text-right shrink-0">
                        {fmt(item.price * item.qty)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted/40 hover:text-rose transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Totals */}
            <div className="px-4 py-4 border-t border-blush/20 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-ink">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted shrink-0">Diskon</span>
                <div className="flex-1 border border-blush/30 rounded-lg px-3 py-1.5 flex items-center">
                  <span className="text-sm text-muted mr-1">Rp</span>
                  <input
                    type="text"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-transparent text-sm text-ink outline-none"
                  />
                </div>
                {discountAmt > 0 && (
                  <span className="text-sm font-semibold text-rose shrink-0">-{fmt(discountAmt)}</span>
                )}
              </div>
              <div className="flex justify-between text-base font-extrabold text-ink border-t border-blush/20 pt-2 mt-2">
                <span>Total</span>
                <span className="text-rose">{fmt(total)}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="px-4 pb-2">
              <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Metode Pembayaran
              </div>
              <div className="flex flex-wrap gap-2">
                {PAY_METHODS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPayMethod(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                      payMethod === id
                        ? 'bg-rose text-white border-rose'
                        : 'bg-cream text-muted border-blush/30 hover:border-rose/30 hover:text-ink'
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Process button */}
            <div className="px-4 pb-4 pt-3">
              <motion.button
                onClick={handleProcess}
                whileHover={cart.length > 0 ? { y: -1, boxShadow: '0 8px 24px rgba(194,104,94,0.35)' } : {}}
                whileTap={cart.length > 0 ? { scale: 0.98 } : {}}
                disabled={cart.length === 0}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  cart.length === 0
                    ? 'bg-cream text-muted cursor-not-allowed'
                    : 'bg-rose text-white cursor-pointer'
                }`}
              >
                {success ? (
                  <>
                    <CheckCircle2 size={16} />
                    Pembayaran Berhasil!
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Proses Pembayaran · {fmt(total)}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: TRANSACTIONS ══════════════════════════════════════════ */}
        <div className="flex-[2] min-w-0 flex flex-col gap-4">

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Transaksi',  value: String(RECENT_TRANSACTIONS.length), color: 'text-ink' },
              { label: 'Revenue',    value: 'Rp 4,2Jt',                         color: 'text-rose' },
              { label: 'Outstanding',value: String(outstanding),                 color: 'text-amber-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-3 text-center">
                <div className={`font-extrabold text-lg leading-none ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Transactions list */}
          <div className="bg-white rounded-2xl overflow-hidden flex-1">
            <div className="flex items-center gap-2 px-4 py-4 border-b border-blush/20">
              <Clock size={15} className="text-rose" />
              <h3 className="font-bold text-ink text-sm">Transaksi Hari Ini</h3>
            </div>
            <div className="divide-y divide-blush/10">
              {RECENT_TRANSACTIONS.map((txn, i) => (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ backgroundColor: 'rgba(244,235,218,0.4)' }}
                  className="px-4 py-3.5 cursor-default"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted font-mono">{txn.time}</span>
                      <span className="text-sm font-bold text-ink">{txn.patient}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        txn.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {txn.status === 'paid' ? 'Lunas' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-xs text-muted mb-2 truncate">
                    {txn.items.join(' · ')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${
                        txn.method === 'QRIS'     ? 'bg-indigo-50 text-indigo-600' :
                        txn.method === 'Transfer' ? 'bg-blue-50 text-blue-600' :
                        txn.method === 'Cash'     ? 'bg-emerald-50 text-emerald-600' :
                        'bg-sage/20 text-sage-dark'
                      }`}
                    >
                      {txn.method}
                    </span>
                    <span className="text-sm font-bold text-ink">{fmt(txn.total)}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-blush/20">
              <button className="text-xs text-rose font-semibold hover:underline flex items-center gap-1">
                Lihat semua transaksi <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Today summary */}
          <div className="bg-ink rounded-2xl p-4">
            <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Total Hari Ini</div>
            <div className="font-extrabold text-white text-2xl mb-1">
              {fmt(todayRevenue)}
            </div>
            <div className="text-xs text-white/40">
              {RECENT_TRANSACTIONS.filter((t) => t.status === 'paid').length} transaksi lunas · {outstanding} pending
            </div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/20 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-float"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center"
              >
                <CheckCircle2 size={40} className="text-emerald-500" />
              </motion.div>
              <div className="text-xl font-extrabold text-ink">Pembayaran Berhasil!</div>
              <div className="text-sm text-muted">{fmt(total)} · {payMethod}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-6" />
    </main>
  )
}
