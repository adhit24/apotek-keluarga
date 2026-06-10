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
  title: {
    default: "Apotek Keluarga — dr. Wildan A. Sutrisno, SpOG | Dokter Kandungan Cirebon",
    template: "%s | Apotek Keluarga Cirebon",
  },
  description:
    "Konsultasi kandungan, USG 4D, program hamil, dan layanan kesehatan keluarga bersama dr. Wildan A. Sutrisno, SpOG di Cirebon. Booking online mudah, antrian digital.",
  keywords: [
    "Dokter Kandungan Cirebon",
    "SpOG Cirebon",
    "USG Cirebon",
    "USG 4D Cirebon",
    "Program Hamil Cirebon",
    "Apotek Keluarga Cirebon",
    "Klinik Kandungan Cirebon",
    "dokter kehamilan Cirebon",
  ],
  authors: [{ name: "dr. Wildan A. Sutrisno, SpOG" }],
  creator: "Apotek Keluarga",
  publisher: "Apotek Keluarga",
  metadataBase: new URL("https://apotekkeluarga.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://apotekkeluarga.com",
    siteName: "Apotek Keluarga Cirebon",
    title: "Apotek Keluarga — Dokter Kandungan & Klinik Keluarga Cirebon",
    description:
      "Konsultasi kandungan, USG 4D, program hamil bersama dr. Wildan SpOG di Cirebon. Booking online 24 jam.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Apotek Keluarga",
  description:
    "Klinik kandungan dan kesehatan keluarga di Cirebon. Layanan USG, konsultasi kehamilan, program hamil, dan THT.",
  url: "https://apotekkeluarga.com",
  telephone: "+6285220024400",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Gerilyawan No.5",
    addressLocality: "Cirebon",
    addressRegion: "Jawa Barat",
    postalCode: "45134",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -6.7063,
    longitude: 108.5571,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "11:00",
      closes: "20:00",
    },
  ],
  medicalSpecialty: "Obstetrics and Gynecology",
  availableService: [
    { "@type": "MedicalProcedure", name: "Konsultasi Kandungan" },
    { "@type": "MedicalProcedure", name: "USG 2D / 3D / 4D" },
    { "@type": "MedicalProcedure", name: "Antenatal Care (ANC)" },
    { "@type": "MedicalProcedure", name: "Program Hamil" },
  ],
  employee: {
    "@type": "Physician",
    name: "dr. Wildan A. Sutrisno",
    jobTitle: "Dokter Spesialis Obstetri dan Ginekologi (SpOG)",
    medicalSpecialty: "Obstetrics and Gynecology",
    worksFor: { "@type": "MedicalClinic", name: "Apotek Keluarga" },
  },
  sameAs: [
    "https://instagram.com/apotekkeluargacirebon",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} ${caveat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
