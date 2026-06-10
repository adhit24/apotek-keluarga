import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontak & Lokasi — Apotek Keluarga Cirebon',
  description:
    'Hubungi Apotek Keluarga Cirebon. Jl. Gerilyawan No.5, Cirebon. WhatsApp: 0852-2002-4400. Praktik dr. Wildan A. Sutrisno, SpOG.',
  keywords: ['kontak klinik Cirebon', 'alamat dokter kandungan Cirebon', 'telepon Apotek Keluarga'],
  openGraph: {
    title: 'Kontak Apotek Keluarga Cirebon',
    description: 'Alamat, nomor telepon, dan jam buka Apotek Keluarga Cirebon.',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
