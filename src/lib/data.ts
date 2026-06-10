export type DayName = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu'

export interface TimeSlot {
  id: string
  time: string
  label: string
  quota: number
  taken: number
}

export interface Session {
  id: string
  label: string // 'Siang' | 'Sore' | 'Pagi'
  startTime: string
  endTime: string
  slots: TimeSlot[]
}

export interface DaySchedule {
  day: DayName
  sessions: Session[]
}

export interface Doctor {
  id: string
  name: string
  title: string
  specialization: string
  photo: string
  bio: string
  education: string[]
  schedule: DaySchedule[]
  whatsapp: string
}

export interface Service {
  id: string
  slug: string
  name: string
  nameEn: string
  description: string
  duration: string
  price: string
  icon: string
  category: string
  highlight?: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  date: string
  avatar: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  image: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

// ─── Slot generator ──────────────────────────────────────────────────────────
function generateSlots(
  start: string,
  end: string,
  sessionId: string,
  fillPattern: number[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let cur = sh * 60 + sm
  const endMin = eh * 60 + em
  let idx = 0
  while (cur < endMin) {
    const h = Math.floor(cur / 60)
      .toString()
      .padStart(2, '0')
    const m = (cur % 60).toString().padStart(2, '0')
    const quota = 5
    const taken = fillPattern[idx] ?? Math.floor(Math.random() * 4)
    slots.push({
      id: `${sessionId}-${h}${m}`,
      time: `${h}:${m}`,
      label: `${h}:${m}`,
      quota,
      taken: Math.min(taken, quota),
    })
    cur += 30
    idx++
  }
  return slots
}

// ─── Doctors ──────────────────────────────────────────────────────────────────
export const doctors: Doctor[] = [
  {
    id: 'dr-wildan',
    name: 'dr. Wildan A. Sutrisno',
    title: 'SpOG',
    specialization: 'Dokter Spesialis Obstetri & Ginekologi',
    photo: '/dr-wildan.png',
    bio: 'dr. Wildan A. Sutrisno, SpOG adalah dokter spesialis kandungan dan kebidanan yang berdedikasi memberikan pelayanan terbaik bagi kesehatan ibu dan keluarga di Cirebon. Dengan pengalaman bertahun-tahun, beliau dikenal hangat, teliti, dan penuh empati dalam mendampingi perjalanan kehamilan pasiennya.',
    education: [
      'Dokter Umum — Universitas Negeri terkemuka',
      'Spesialis Obstetri & Ginekologi (SpOG)',
      'Anggota POGI (Perkumpulan Obstetri dan Ginekologi Indonesia)',
    ],
    whatsapp: '085220024400',
    schedule: [
      {
        day: 'Senin',
        sessions: [
          {
            id: 'wildan-sen-sore',
            label: 'Sore',
            startTime: '17:00',
            endTime: '19:00',
            slots: generateSlots('17:00', '19:00', 'wildan-sen-sore', [5, 4, 2, 1]),
          },
        ],
      },
      {
        day: 'Selasa',
        sessions: [
          {
            id: 'wildan-sel-sore',
            label: 'Sore',
            startTime: '15:00',
            endTime: '18:00',
            slots: generateSlots('15:00', '18:00', 'wildan-sel-sore', [5, 5, 3, 2, 1, 0]),
          },
        ],
      },
      {
        day: 'Rabu',
        sessions: [
          {
            id: 'wildan-rab-siang',
            label: 'Siang',
            startTime: '11:00',
            endTime: '12:00',
            slots: generateSlots('11:00', '12:00', 'wildan-rab-siang', [5, 3]),
          },
          {
            id: 'wildan-rab-sore',
            label: 'Sore',
            startTime: '15:00',
            endTime: '18:00',
            slots: generateSlots('15:00', '18:00', 'wildan-rab-sore', [4, 5, 3, 1, 0, 0]),
          },
        ],
      },
      {
        day: 'Kamis',
        sessions: [
          {
            id: 'wildan-kam-siang',
            label: 'Siang',
            startTime: '11:00',
            endTime: '12:00',
            slots: generateSlots('11:00', '12:00', 'wildan-kam-siang', [5, 2]),
          },
          {
            id: 'wildan-kam-sore',
            label: 'Sore',
            startTime: '15:00',
            endTime: '18:00',
            slots: generateSlots('15:00', '18:00', 'wildan-kam-sore', [3, 2, 5, 4, 1, 0]),
          },
        ],
      },
      {
        day: 'Jumat',
        sessions: [
          {
            id: 'wildan-jum-sore',
            label: 'Sore',
            startTime: '17:00',
            endTime: '19:00',
            slots: generateSlots('17:00', '19:00', 'wildan-jum-sore', [5, 3, 1, 0]),
          },
        ],
      },
      {
        day: 'Sabtu',
        sessions: [
          {
            id: 'wildan-sab-siang',
            label: 'Siang',
            startTime: '11:00',
            endTime: '15:00',
            slots: generateSlots('11:00', '15:00', 'wildan-sab-siang', [5, 5, 4, 3, 2, 1, 0, 0]),
          },
        ],
      },
    ],
  },
  {
    id: 'dr-febryanti',
    name: 'dr. Febryanti Purnamasari',
    title: 'Sp.THT-KL',
    specialization: 'Dokter Spesialis THT-Bedah Kepala Leher',
    photo: '/dr-febryanti.png',
    bio: 'dr. Febryanti Purnamasari, Sp.THT-KL adalah dokter spesialis Telinga, Hidung, Tenggorokan dan Bedah Kepala Leher yang telah bergabung dengan Apotek Keluarga. Beliau memberikan layanan komprehensif untuk gangguan THT pada seluruh anggota keluarga.',
    education: [
      'Dokter Umum',
      'Spesialis THT-KL (Sp.THT-KL)',
      'Anggota PERHATI-KL',
    ],
    whatsapp: '08112421983',
    schedule: [
      {
        day: 'Senin',
        sessions: [
          {
            id: 'feb-sen-sore',
            label: 'Sore',
            startTime: '17:00',
            endTime: '20:00',
            slots: generateSlots('17:00', '20:00', 'feb-sen-sore', [4, 3, 2, 1, 0, 0]),
          },
        ],
      },
      {
        day: 'Selasa',
        sessions: [
          {
            id: 'feb-sel-sore',
            label: 'Sore',
            startTime: '17:00',
            endTime: '20:00',
            slots: generateSlots('17:00', '20:00', 'feb-sel-sore', [5, 3, 1, 0, 0, 0]),
          },
        ],
      },
      {
        day: 'Rabu',
        sessions: [
          {
            id: 'feb-rab-sore',
            label: 'Sore',
            startTime: '17:00',
            endTime: '20:00',
            slots: generateSlots('17:00', '20:00', 'feb-rab-sore', [4, 2, 1, 0, 0, 0]),
          },
        ],
      },
      {
        day: 'Kamis',
        sessions: [
          {
            id: 'feb-kam-sore',
            label: 'Sore',
            startTime: '17:00',
            endTime: '20:00',
            slots: generateSlots('17:00', '20:00', 'feb-kam-sore', [5, 4, 2, 1, 0, 0]),
          },
        ],
      },
      {
        day: 'Jumat',
        sessions: [
          {
            id: 'feb-jum-sore',
            label: 'Sore',
            startTime: '17:00',
            endTime: '20:00',
            slots: generateSlots('17:00', '20:00', 'feb-jum-sore', [3, 2, 1, 0, 0, 0]),
          },
        ],
      },
      {
        day: 'Sabtu',
        sessions: [
          {
            id: 'feb-sab-pagi',
            label: 'Pagi',
            startTime: '09:00',
            endTime: '12:00',
            slots: generateSlots('09:00', '12:00', 'feb-sab-pagi', [5, 4, 3, 2, 1, 0]),
          },
        ],
      },
    ],
  },
]

// ─── Services ─────────────────────────────────────────────────────────────────
export const services: Service[] = [
  {
    id: 'konsultasi-kandungan',
    slug: 'konsultasi-kandungan',
    name: 'Konsultasi Kandungan',
    nameEn: 'Pregnancy Consultation',
    description:
      'Pemeriksaan lengkap kondisi kehamilan dan kesehatan reproduksi bersama dokter spesialis SpOG.',
    duration: '30–45 menit',
    price: 'Hubungi kami',
    icon: '🤰',
    category: 'Kandungan',
    highlight: true,
  },
  {
    id: 'usg-2d',
    slug: 'usg-2d',
    name: 'USG 2D',
    nameEn: '2D Ultrasound',
    description:
      'Pemantauan perkembangan janin secara real-time dengan teknologi ultrasonografi 2 dimensi.',
    duration: '20–30 menit',
    price: 'Hubungi kami',
    icon: '📡',
    category: 'USG',
    highlight: false,
  },
  {
    id: 'usg-3d',
    slug: 'usg-3d',
    name: 'USG 3D',
    nameEn: '3D Ultrasound',
    description:
      'Lihat wajah dan bentuk tubuh si kecil secara tiga dimensi — momen pertama yang tak terlupakan.',
    duration: '30–40 menit',
    price: 'Hubungi kami',
    icon: '✨',
    category: 'USG',
    highlight: true,
  },
  {
    id: 'usg-4d',
    slug: 'usg-4d',
    name: 'USG 4D',
    nameEn: '4D Ultrasound',
    description:
      'Rekaman video real-time gerakan janin dalam empat dimensi. Rasakan keajaiban kehidupan.',
    duration: '30–40 menit',
    price: 'Hubungi kami',
    icon: '🎥',
    category: 'USG',
    highlight: true,
  },
  {
    id: 'pemantauan-kehamilan',
    slug: 'pemantauan-kehamilan',
    name: 'Pemantauan Kehamilan',
    nameEn: 'Pregnancy Monitoring',
    description:
      'Pendampingan rutin tumbuh kembang janin dan kesehatan ibu dari trimester pertama hingga persalinan.',
    duration: '30 menit',
    price: 'Hubungi kami',
    icon: '💗',
    category: 'Kandungan',
    highlight: false,
  },
  {
    id: 'program-hamil',
    slug: 'program-hamil',
    name: 'Program Hamil',
    nameEn: 'Fertility Program',
    description:
      'Panduan dan pendampingan medis terstruktur untuk pasangan yang sedang merencanakan kehamilan.',
    duration: '45–60 menit',
    price: 'Hubungi kami',
    icon: '🌸',
    category: 'Kandungan',
    highlight: true,
  },
  {
    id: 'kb-keluarga-berencana',
    slug: 'kb-keluarga-berencana',
    name: 'KB / Keluarga Berencana',
    nameEn: 'Family Planning',
    description:
      'Konsultasi dan pemasangan alat kontrasepsi oleh dokter spesialis yang berpengalaman.',
    duration: '20–30 menit',
    price: 'Hubungi kami',
    icon: '👨‍👩‍👧',
    category: 'Keluarga',
    highlight: false,
  },
  {
    id: 'konsultasi-menyusui',
    slug: 'konsultasi-menyusui',
    name: 'Konsultasi Menyusui',
    nameEn: 'Breastfeeding Consultation',
    description:
      'Solusi dan pendampingan bagi ibu yang menghadapi tantangan menyusui agar bayi mendapat ASI terbaik.',
    duration: '30 menit',
    price: 'Hubungi kami',
    icon: '🍼',
    category: 'Pasca Melahirkan',
    highlight: false,
  },
  {
    id: 'perawatan-nifas',
    slug: 'perawatan-nifas',
    name: 'Perawatan Nifas',
    nameEn: 'Postpartum Care',
    description:
      'Pemantauan pemulihan ibu pasca persalinan dan konsultasi kesehatan masa nifas.',
    duration: '30 menit',
    price: 'Hubungi kami',
    icon: '🌺',
    category: 'Pasca Melahirkan',
    highlight: false,
  },
  {
    id: 'kesehatan-reproduksi',
    slug: 'kesehatan-reproduksi',
    name: 'Kesehatan Reproduksi Wanita',
    nameEn: "Women's Reproductive Health",
    description:
      'Pemeriksaan dan penanganan gangguan kesehatan reproduksi wanita oleh dokter SpOG berpengalaman.',
    duration: '30–45 menit',
    price: 'Hubungi kami',
    icon: '🏥',
    category: 'Reproduksi',
    highlight: false,
  },
  {
    id: 'tht',
    slug: 'tht',
    name: 'Konsultasi THT',
    nameEn: 'ENT Consultation',
    description:
      'Pemeriksaan dan penanganan gangguan telinga, hidung, tenggorokan oleh dr. Febryanti Purnamasari, Sp.THT-KL.',
    duration: '20–30 menit',
    price: 'Hubungi kami',
    icon: '👂',
    category: 'THT',
    highlight: false,
  },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ibu Sari Rahayu',
    role: 'Pasien Kehamilan Anak Ke-2',
    content:
      'dr. Wildan sangat sabar menjelaskan kondisi kehamilan saya. Setiap pertanyaan dijawab dengan tuntas, tidak pernah terburu-buru. Saya merasa benar-benar didampingi dari awal sampai lahiran.',
    rating: 5,
    date: 'Mei 2025',
    avatar: 'SR',
  },
  {
    id: '2',
    name: 'Ibu Dewi Kartika',
    role: 'Program Hamil',
    content:
      'Sudah 2 tahun menjalani program hamil di tempat lain tanpa hasil. Setelah konsultasi dan program dengan dr. Wildan di Apotek Keluarga, Alhamdulillah sekarang sudah 14 minggu. Terima kasih dok!',
    rating: 5,
    date: 'April 2025',
    avatar: 'DK',
  },
  {
    id: '3',
    name: 'Ibu Nurul Fadila',
    role: 'USG 4D',
    content:
      'Pertama kali lihat wajah bayi lewat USG 4D di sini, langsung nangis terharu. Fasilitasnya bersih dan nyaman, stafnya juga ramah banget. Pasti balik lagi untuk kontrol berikutnya.',
    rating: 5,
    date: 'Juni 2025',
    avatar: 'NF',
  },
  {
    id: '4',
    name: 'Ibu Rina Septiani',
    role: 'Pasien Rutin',
    content:
      'Booking online-nya mudah banget! Pilih jadwal, dapat nomor antrian, tinggal datang sesuai waktu. Tidak perlu antre lama lagi. Kliniknya juga bersih dan dokternya sangat profesional.',
    rating: 5,
    date: 'Maret 2025',
    avatar: 'RS',
  },
  {
    id: '5',
    name: 'Ibu Fitri Handayani',
    role: 'Perawatan Nifas',
    content:
      'Pelayanan nifasnya sangat komprehensif. dr. Wildan memastikan pemulihan saya berjalan baik dan memberikan tips menyusui yang sangat membantu. Apotek Keluarga memang berbeda dari klinik biasa.',
    rating: 5,
    date: 'Februari 2025',
    avatar: 'FH',
  },
]

// ─── Articles ─────────────────────────────────────────────────────────────────
export const articles: Article[] = [
  {
    id: '1',
    slug: 'tanda-kehamilan-sehat',
    title: 'Tanda-Tanda Kehamilan Sehat yang Perlu Ibu Ketahui',
    excerpt:
      'Mengenali tanda kehamilan sehat sejak dini membantu ibu memantau perkembangan janin dengan lebih baik.',
    category: 'Kehamilan',
    readTime: '5 menit',
    date: '10 Juni 2025',
    image: '/articles/kehamilan-sehat.jpg',
  },
  {
    id: '2',
    slug: 'tips-program-hamil',
    title: '7 Tips Program Hamil yang Terbukti Efektif',
    excerpt:
      'Mempersiapkan kehamilan membutuhkan perencanaan matang. Berikut tips berbasis medis untuk memaksimalkan peluang hamil.',
    category: 'Program Hamil',
    readTime: '7 menit',
    date: '5 Juni 2025',
    image: '/articles/program-hamil.jpg',
  },
  {
    id: '3',
    slug: 'manfaat-usg-4d',
    title: 'Kenapa USG 4D Penting di Trimester Kedua?',
    excerpt:
      'USG 4D bukan sekadar momen emosional — ada manfaat medis penting yang perlu ibu pahami.',
    category: 'USG',
    readTime: '4 menit',
    date: '1 Juni 2025',
    image: '/articles/usg-4d.jpg',
  },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'Bagaimana cara booking jadwal praktek?',
    answer:
      'Pilih menu "Buat Janji" di website, pilih layanan dan dokter, pilih tanggal & waktu yang tersedia, isi data diri, dan konfirmasi. Nomor antrian akan otomatis dikirim ke WhatsApp Anda.',
  },
  {
    id: '2',
    question: 'Apakah tersedia parkir?',
    answer:
      'Ya, tersedia area parkir yang luas di depan klinik. Kami beralamat di Jl. Gerilyawan No.5, Simaja Selatan, Kesambi, Kota Cirebon.',
  },
  {
    id: '3',
    question: 'Apakah bisa menggunakan BPJS?',
    answer:
      'Untuk informasi lengkap mengenai asuransi dan BPJS, silakan hubungi kami langsung melalui WhatsApp di 085220024400 agar kami dapat memberikan informasi terkini.',
  },
  {
    id: '4',
    question: 'Berapa lama waktu tunggu setelah booking?',
    answer:
      'Dengan sistem antrian digital kami, estimasi waktu tunggu ditampilkan secara real-time. Rata-rata waktu tunggu 15–30 menit sesuai slot yang dipilih.',
  },
  {
    id: '5',
    question: 'Apakah USG bisa dilakukan kapan saja?',
    answer:
      'USG dapat dilakukan sesuai rekomendasi dokter. Biasanya dilakukan pada usia kehamilan 11–13 minggu, 18–22 minggu, dan 28–32 minggu. Konsultasikan kebutuhan Anda saat booking.',
  },
  {
    id: '6',
    question: 'Bagaimana sistem antrian digitalnya bekerja?',
    answer:
      'Setelah booking dikonfirmasi, Anda mendapat nomor antrian (misal: AK-007). Pantau posisi antrian secara real-time di halaman "Antrian" kami, sehingga Anda bisa datang tepat waktu tanpa menunggu lama.',
  },
]

// ─── Queue simulation data ────────────────────────────────────────────────────
export interface QueueItem {
  number: string
  name: string
  service: string
  status: 'waiting' | 'in-progress' | 'done'
  estimatedTime?: string
}

export const mockQueue: QueueItem[] = [
  { number: 'AK-001', name: 'Ibu Rahayu', service: 'Konsultasi Kandungan', status: 'done' },
  { number: 'AK-002', name: 'Ibu Marlina', service: 'USG 4D', status: 'done' },
  { number: 'AK-003', name: 'Ibu Siti', service: 'Pemantauan Kehamilan', status: 'in-progress' },
  { number: 'AK-004', name: 'Ibu Dewi', service: 'Program Hamil', status: 'waiting', estimatedTime: '15 menit' },
  { number: 'AK-005', name: 'Ibu Nurul', service: 'USG 3D', status: 'waiting', estimatedTime: '30 menit' },
  { number: 'AK-006', name: 'Ibu Rina', service: 'Konsultasi Kandungan', status: 'waiting', estimatedTime: '45 menit' },
]

// ─── Why Choose Us ────────────────────────────────────────────────────────────
export const whyItems = [
  {
    icon: '🩺',
    title: 'Dokter Spesialis Berpengalaman',
    desc: 'dr. Wildan, SpOG & dr. Febryanti, Sp.THT-KL siap memberikan layanan medis terbaik dengan penuh empati.',
  },
  {
    icon: '📱',
    title: 'Booking & Antrian Online',
    desc: 'Reservasi jadwal dari genggaman tangan. Tidak perlu antre lama — pantau antrian real-time dari mana saja.',
  },
  {
    icon: '🏠',
    title: 'Ruangan Nyaman & Bersih',
    desc: 'Lingkungan klinik hangat seperti di rumah — bukan dingin seperti rumah sakit. Anda akan merasa disambut.',
  },
  {
    icon: '💬',
    title: 'WhatsApp Responsif',
    desc: 'Tim kami siap menjawab pertanyaan dan mengkonfirmasi booking melalui WhatsApp dengan cepat dan ramah.',
  },
  {
    icon: '🎯',
    title: 'Layanan Terfokus & Personal',
    desc: 'Setiap pasien mendapat perhatian penuh. Tidak ada terburu-buru — kami prioritaskan kualitas, bukan kuantitas.',
  },
  {
    icon: '🌿',
    title: 'Teman Sepanjang Perjalanan',
    desc: 'Dari program hamil, kehamilan, hingga pasca melahirkan — kami menemani setiap langkah perjalanan keluarga Anda.',
  },
]
