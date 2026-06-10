import type { Metadata } from "next";
import { Nunito, Caveat } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apotek Keluarga — dr. Wildan A. Sutrisno, SpOG | Dokter Kandungan Cirebon",
  description:
    "Konsultasi kandungan, USG kehamilan, program hamil, dan layanan kesehatan keluarga bersama dr. Wildan A. Sutrisno, SpOG di Cirebon. Booking online mudah, antrian digital.",
  keywords: [
    "Dokter Kandungan Cirebon",
    "SpOG Cirebon",
    "USG Cirebon",
    "Program Hamil Cirebon",
    "Apotek Keluarga Cirebon",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} ${caveat.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
