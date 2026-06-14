'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Calendar, FileText, Baby,
  Bell, DollarSign, ShoppingCart, Package, Megaphone,
  BarChart3, Sparkles, Settings, Menu, X, ArrowRight,
  Stethoscope, CircleDot,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'command',   label: 'Command Center',   Icon: LayoutDashboard, href: '/command' },
  { id: 'patients',  label: 'Patients',          Icon: Users,           href: '/command/patients' },
  { id: 'appts',     label: 'Appointments',      Icon: Calendar,        href: '/command/appointments' },
  { id: 'records',   label: 'Medical Records',   Icon: FileText,        href: '/command/records' },
  { id: 'pregnancy', label: 'Pregnancy Journey', Icon: Baby,            href: '/command/pregnancy' },
  { id: 'followup',  label: 'Follow Up',         Icon: Bell,            href: '/command/followup',  badge: '7' },
  { id: 'revenue',   label: 'Revenue',           Icon: DollarSign,      href: '/command/revenue' },
  { id: 'pos',       label: 'POS',               Icon: ShoppingCart,    href: '/command/pos' },
  { id: 'inventory', label: 'Inventory',         Icon: Package,         href: '/command/inventory', badge: '!' },
  { id: 'marketing', label: 'Marketing',         Icon: Megaphone,       href: '/command/marketing' },
  { id: 'reports',   label: 'Reports',           Icon: BarChart3,       href: '/command/reports' },
  { id: 'ai',        label: 'AI Advisor',        Icon: Sparkles,        href: '/command/ai' },
  { id: 'settings',  label: 'Settings',          Icon: Settings,        href: '/command/settings' },
]

// ─── Page title map ───────────────────────────────────────────────────────────

function getPageTitle(pathname: string): string {
  const match = NAV_ITEMS.find((item) => item.href === pathname)
  if (match) return match.label
  // fallback for nested paths
  const segment = pathname.split('/').filter(Boolean).pop() ?? 'command'
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

// ─── Sidebar panel (shared) ───────────────────────────────────────────────────

function SidebarPanel({
  onClose,
  showClose,
  pathname,
}: {
  onClose: () => void
  showClose: boolean
  pathname: string
}) {
  return (
    <aside className="w-64 bg-ink h-full flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8 shrink-0">
        <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white/10 shrink-0">
          <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
        </div>
        <div>
          <div className="font-extrabold text-white text-xs tracking-widest leading-none">APOTEK</div>
          <div className="font-extrabold text-blush text-xs tracking-widest leading-none">KELUARGA</div>
          <div className="text-white/30 text-[10px] mt-0.5">Clinic OS</div>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            className="ml-auto text-white/40 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" style={{ scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map(({ id, label, Icon, href, badge }) => {
          // exact match for /command, prefix match for sub-pages
          const isActive =
            href === '/command'
              ? pathname === '/command'
              : pathname.startsWith(href)

          return (
            <Link
              key={id}
              href={href}
              onClick={showClose ? onClose : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 group transition-all duration-150 ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/45 hover:text-white hover:bg-white/6'
              }`}
            >
              <Icon
                size={16}
                className={
                  isActive
                    ? 'text-blush'
                    : 'group-hover:text-blush/70 transition-colors'
                }
              />
              <span className="text-sm font-medium flex-1">{label}</span>
              {badge === '!' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
              {badge && badge !== '!' && (
                <span className="text-xs bg-rose/80 text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Doctor status */}
      <div className="px-4 py-4 border-t border-white/8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose/20 flex items-center justify-center shrink-0">
            <Stethoscope size={14} className="text-rose" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              dr. Wildan A. Sutrisno
            </div>
            <div className="text-[10px] text-white/40">SpOG</div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">Aktif</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function CommandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-cream">

      {/* ── Desktop sidebar (static, always visible ≥ lg) ── */}
      <div className="hidden lg:flex shrink-0">
        <SidebarPanel onClose={() => {}} showClose={false} pathname={pathname} />
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar (slide-in) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed top-0 left-0 h-screen z-40 lg:hidden"
          >
            <SidebarPanel
              onClose={() => setMobileOpen(false)}
              showClose
              pathname={pathname}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header className="bg-white border-b border-blush/30 px-5 py-3.5 flex items-center gap-4 shrink-0">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-ink/50 hover:text-ink transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div>
            <h1 className="font-extrabold text-ink text-base leading-none">
              {pageTitle}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CircleDot size={11} className="text-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Live</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-ink/50 hover:text-ink transition-colors">
                <Bell size={17} />
              </button>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose" />
            </div>

            {/* Back to website */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
            >
              <span>Ke Website</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </header>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto bg-cream">
          {children}
        </div>

      </div>
    </div>
  )
}
