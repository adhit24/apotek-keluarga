export type DayName = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu'

export const DAY_JS_MAP: Record<number, DayName> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
  0: 'Minggu',
}

export interface TimeSlot {
  id: string
  time: string
  quota: number
  taken: number
}

export interface Session {
  id: string
  label: string
  startTime: string
  endTime: string
  slots: TimeSlot[]
}

export interface DaySchedule {
  day: DayName
  sessions: Session[]
}

export interface Location {
  id: string
  name: string
  address: string
  maps: string
  phone: string
}

export interface Doctor {
  id: string
  name: string
  title: string
  specialization: string
  photo: string
  bio: string
  education: string[]
  locationSchedules: { locationId: string; schedule: DaySchedule[] }[]
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

export interface ArticleBlock {
  type: 'heading' | 'paragraph' | 'list' | 'callout'
  text?: string
  items?: string[]
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
  content?: ArticleBlock[]
  tags?: string[]
  author?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

// ─── Appointment ──────────────────────────────────────────────────────────────
export interface Appointment {
  id: string          // AK-202606-014
  queueNumber: string // A-014
  service: string
  location: string
  doctor: string
  date: string        // YYYY-MM-DD
  time: string        // HH:MM
  patientName: string
  patientPhone: string
  patientDob: string
  visitType: string
  notes: string
  status: 'upcoming' | 'waiting' | 'called' | 'in-consultation' | 'completed' | 'cancelled'
  createdAt: string
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
    const h = Math.floor(cur / 60).toString().padStart(2, '0')
    const m = (cur % 60).toString().padStart(2, '0')
    const quota = 5
    const taken = Math.min(fillPattern[idx] ?? Math.floor(Math.random() * 4), quota)
    slots.push({ id: `${sessionId}-${h}${m}`, time: `${h}:${m}`, quota, taken })
    cur += 30
    idx++
  }
  return slots
}

// ─── Locations ────────────────────────────────────────────────────────────────
export const locations: Location[] = [
  {
    id: 'apotek-keluarga',
    name: 'Apotek Keluarga',
    address: 'Jl. Gerilyawan No.5, Simaja Selatan, Kesambi, Kota Cirebon',
    maps: 'https://maps.google.com/?q=Jl.+Gerilyawan+No.5+Cirebon',
    phone: '085220024400',
  },
  {
    id: 'rs-medimas',
    name: 'RS Medimas Cirebon',
    address: 'Jl. Wahidin Sudirohusodo, Kota Cirebon',
    maps: 'https://maps.google.com/?q=RS+Medimas+Cirebon',
    phone: '0231-123456',
  },
]

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
    locationSchedules: [
      {
        locationId: 'apotek-keluarga',
        schedule: [
          { day: 'Senin', sessions: [{ id: 'w-ak-sen-sore', label: 'Sore', startTime: '17:00', endTime: '19:00', slots: generateSlots('17:00', '19:00', 'w-ak-sen', [5, 4, 2, 1]) }] },
          { day: 'Selasa', sessions: [{ id: 'w-ak-sel-sore', label: 'Sore', startTime: '15:00', endTime: '18:00', slots: generateSlots('15:00', '18:00', 'w-ak-sel', [5, 5, 3, 2, 1, 0]) }] },
          { day: 'Rabu', sessions: [
            { id: 'w-ak-rab-siang', label: 'Siang', startTime: '11:00', endTime: '12:00', slots: generateSlots('11:00', '12:00', 'w-ak-rab-s', [5, 3]) },
            { id: 'w-ak-rab-sore', label: 'Sore', startTime: '15:00', endTime: '18:00', slots: generateSlots('15:00', '18:00', 'w-ak-rab-sr', [4, 5, 3, 1, 0, 0]) },
          ]},
          { day: 'Kamis', sessions: [
            { id: 'w-ak-kam-siang', label: 'Siang', startTime: '11:00', endTime: '12:00', slots: generateSlots('11:00', '12:00', 'w-ak-kam-s', [5, 2]) },
            { id: 'w-ak-kam-sore', label: 'Sore', startTime: '15:00', endTime: '18:00', slots: generateSlots('15:00', '18:00', 'w-ak-kam-sr', [3, 2, 5, 4, 1, 0]) },
          ]},
          { day: 'Jumat', sessions: [{ id: 'w-ak-jum-sore', label: 'Sore', startTime: '17:00', endTime: '19:00', slots: generateSlots('17:00', '19:00', 'w-ak-jum', [5, 3, 1, 0]) }] },
          { day: 'Sabtu', sessions: [{ id: 'w-ak-sab-siang', label: 'Siang', startTime: '11:00', endTime: '15:00', slots: generateSlots('11:00', '15:00', 'w-ak-sab', [5, 5, 4, 3, 2, 1, 0, 0]) }] },
        ],
      },
      {
        locationId: 'rs-medimas',
        schedule: [
          { day: 'Selasa', sessions: [{ id: 'w-rs-sel', label: 'Pagi', startTime: '09:00', endTime: '12:00', slots: generateSlots('09:00', '12:00', 'w-rs-sel', [5, 4, 3, 2, 1, 0]) }] },
          { day: 'Kamis', sessions: [{ id: 'w-rs-kam', label: 'Pagi', startTime: '09:00', endTime: '12:00', slots: generateSlots('09:00', '12:00', 'w-rs-kam', [5, 5, 3, 2, 0, 0]) }] },
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
    bio: 'dr. Febryanti Purnamasari, Sp.THT-KL adalah dokter spesialis Telinga, Hidung, Tenggorokan dan Bedah Kepala Leher yang memberikan layanan komprehensif untuk gangguan THT pada seluruh anggota keluarga.',
    education: [
      'Dokter Umum',
      'Spesialis THT-KL (Sp.THT-KL)',
      'Anggota PERHATI-KL',
    ],
    whatsapp: '08112421983',
    locationSchedules: [
      {
        locationId: 'apotek-keluarga',
        schedule: [
          { day: 'Senin', sessions: [{ id: 'f-ak-sen', label: 'Sore', startTime: '17:00', endTime: '20:00', slots: generateSlots('17:00', '20:00', 'f-ak-sen', [4, 3, 2, 1, 0, 0]) }] },
          { day: 'Selasa', sessions: [{ id: 'f-ak-sel', label: 'Sore', startTime: '17:00', endTime: '20:00', slots: generateSlots('17:00', '20:00', 'f-ak-sel', [5, 3, 1, 0, 0, 0]) }] },
          { day: 'Rabu', sessions: [{ id: 'f-ak-rab', label: 'Sore', startTime: '17:00', endTime: '20:00', slots: generateSlots('17:00', '20:00', 'f-ak-rab', [4, 2, 1, 0, 0, 0]) }] },
          { day: 'Kamis', sessions: [{ id: 'f-ak-kam', label: 'Sore', startTime: '17:00', endTime: '20:00', slots: generateSlots('17:00', '20:00', 'f-ak-kam', [5, 4, 2, 1, 0, 0]) }] },
          { day: 'Jumat', sessions: [{ id: 'f-ak-jum', label: 'Sore', startTime: '17:00', endTime: '20:00', slots: generateSlots('17:00', '20:00', 'f-ak-jum', [3, 2, 1, 0, 0, 0]) }] },
          { day: 'Sabtu', sessions: [{ id: 'f-ak-sab', label: 'Pagi', startTime: '09:00', endTime: '12:00', slots: generateSlots('09:00', '12:00', 'f-ak-sab', [5, 4, 3, 2, 1, 0]) }] },
        ],
      },
    ],
  },
]

// ─── Helper: get doctor's schedule for a location ────────────────────────────
export function getDoctorLocationSchedule(doctorId: string, locationId: string): DaySchedule[] {
  const doc = doctors.find((d) => d.id === doctorId)
  if (!doc) return []
  return doc.locationSchedules.find((ls) => ls.locationId === locationId)?.schedule ?? []
}

// ─── Helper: generate appointment ID ────────────────────────────────────────
export function generateAppointmentId(): string {
  if (typeof window === 'undefined') return 'AK-202606-001'
  const now = new Date()
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const key = `ak_appt_counter_${ym}`
  const seq = (parseInt(localStorage.getItem(key) ?? '0') + 1)
  localStorage.setItem(key, String(seq))
  return `AK-${ym}-${String(seq).padStart(3, '0')}`
}

export function generateQueueNumber(): string {
  if (typeof window === 'undefined') return 'A-001'
  const now = new Date()
  const key = `ak_queue_${now.toDateString()}`
  const seq = (parseInt(localStorage.getItem(key) ?? '0') + 1)
  localStorage.setItem(key, String(seq))
  return `A-${String(seq).padStart(3, '0')}`
}

// ─── Services ─────────────────────────────────────────────────────────────────
export const services: Service[] = [
  { id: 'konsultasi-kandungan', slug: 'konsultasi-kandungan', name: 'Konsultasi Kandungan', nameEn: 'Pregnancy Consultation', description: 'Pemeriksaan lengkap kondisi kehamilan bersama dokter SpOG.', duration: '30–45 menit', price: 'Hubungi kami', icon: '🤰', category: 'Kandungan', highlight: true },
  { id: 'anc', slug: 'anc', name: 'Antenatal Care (ANC)', nameEn: 'Antenatal Care', description: 'Pemantauan rutin ibu hamil dari trimester 1 hingga persalinan.', duration: '30 menit', price: 'Hubungi kami', icon: '💗', category: 'Kandungan', highlight: false },
  { id: 'usg-2d', slug: 'usg-2d', name: 'USG 2D', nameEn: '2D Ultrasound', description: 'Pemantauan janin real-time dengan teknologi ultrasonografi 2D.', duration: '20–30 menit', price: 'Hubungi kami', icon: '📡', category: 'USG', highlight: false },
  { id: 'usg-3d', slug: 'usg-3d', name: 'USG 3D', nameEn: '3D Ultrasound', description: 'Lihat wajah dan bentuk tubuh si kecil secara tiga dimensi.', duration: '30–40 menit', price: 'Hubungi kami', icon: '✨', category: 'USG', highlight: true },
  { id: 'usg-4d', slug: 'usg-4d', name: 'USG 4D', nameEn: '4D Ultrasound', description: 'Video real-time gerakan janin — momen ajaib yang tak terlupakan.', duration: '30–40 menit', price: 'Hubungi kami', icon: '🎥', category: 'USG', highlight: true },
  { id: 'program-hamil', slug: 'program-hamil', name: 'Program Hamil', nameEn: 'Fertility Consultation', description: 'Panduan medis terstruktur untuk pasangan yang merencanakan kehamilan.', duration: '45–60 menit', price: 'Hubungi kami', icon: '🌸', category: 'Kandungan', highlight: true },
  { id: 'kb', slug: 'kb', name: 'KB / Keluarga Berencana', nameEn: 'Family Planning', description: 'Konsultasi dan pemasangan alat kontrasepsi oleh dokter spesialis.', duration: '20–30 menit', price: 'Hubungi kami', icon: '👨‍👩‍👧', category: 'Keluarga', highlight: false },
  { id: 'konsultasi-menyusui', slug: 'konsultasi-menyusui', name: 'Konsultasi Menyusui', nameEn: 'Breastfeeding Consultation', description: 'Pendampingan ibu agar bayi mendapat ASI terbaik.', duration: '30 menit', price: 'Hubungi kami', icon: '🍼', category: 'Pasca Melahirkan', highlight: false },
  { id: 'perawatan-nifas', slug: 'perawatan-nifas', name: 'Perawatan Nifas', nameEn: 'Postpartum Care', description: 'Pemantauan pemulihan ibu pasca persalinan.', duration: '30 menit', price: 'Hubungi kami', icon: '🌺', category: 'Pasca Melahirkan', highlight: false },
  { id: 'kesehatan-reproduksi', slug: 'kesehatan-reproduksi', name: 'Kesehatan Reproduksi Wanita', nameEn: "Women's Health Consultation", description: 'Pemeriksaan dan penanganan gangguan reproduksi wanita.', duration: '30–45 menit', price: 'Hubungi kami', icon: '🏥', category: 'Reproduksi', highlight: false },
  { id: 'tht', slug: 'tht', name: 'Konsultasi THT', nameEn: 'ENT Consultation', description: 'Pemeriksaan telinga, hidung, tenggorokan oleh dr. Febryanti Sp.THT-KL.', duration: '20–30 menit', price: 'Hubungi kami', icon: '👂', category: 'THT', highlight: false },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  { id: '1', name: 'Ibu Sari Rahayu', role: 'Pasien Kehamilan Anak Ke-2', content: 'dr. Wildan sangat sabar menjelaskan kondisi kehamilan saya. Setiap pertanyaan dijawab tuntas, tidak pernah terburu-buru. Saya merasa benar-benar didampingi dari awal sampai lahiran.', rating: 5, date: 'Mei 2025', avatar: 'SR' },
  { id: '2', name: 'Ibu Dewi Kartika', role: 'Program Hamil', content: 'Sudah 2 tahun program hamil di tempat lain tanpa hasil. Setelah konsultasi dengan dr. Wildan, Alhamdulillah sekarang sudah 14 minggu. Terima kasih dok!', rating: 5, date: 'April 2025', avatar: 'DK' },
  { id: '3', name: 'Ibu Nurul Fadila', role: 'USG 4D', content: 'Pertama kali lihat wajah bayi lewat USG 4D di sini, langsung nangis terharu. Fasilitasnya bersih, stafnya ramah. Pasti balik lagi!', rating: 5, date: 'Juni 2025', avatar: 'NF' },
  { id: '4', name: 'Ibu Rina Septiani', role: 'Pasien Rutin', content: 'Booking online-nya mudah banget! Pilih jadwal, dapat nomor janji, tinggal datang tepat waktu. Tidak perlu antre lama lagi.', rating: 5, date: 'Maret 2025', avatar: 'RS' },
  { id: '5', name: 'Ibu Fitri Handayani', role: 'Perawatan Nifas', content: 'Pelayanan nifasnya sangat komprehensif. dr. Wildan memastikan pemulihan berjalan baik dan memberikan tips menyusui yang membantu.', rating: 5, date: 'Februari 2025', avatar: 'FH' },
]

// ─── Articles ─────────────────────────────────────────────────────────────────
export const articles: Article[] = [
  {
    id: '1',
    slug: 'tanda-kehamilan-sehat',
    title: 'Tanda-Tanda Kehamilan Sehat yang Perlu Ibu Ketahui',
    excerpt: 'Mengenali tanda kehamilan sehat sejak dini membantu ibu memantau perkembangan janin dengan lebih baik.',
    category: 'Kehamilan',
    readTime: '5 menit',
    date: '10 Juni 2025',
    image: '',
    author: 'dr. Wildan A. Sutrisno, SpOG',
    tags: ['kehamilan sehat', 'tanda kehamilan', 'ibu hamil', 'kandungan'],
    content: [
      { type: 'paragraph', text: 'Kehamilan yang sehat adalah dambaan setiap pasangan. Namun bagaimana cara mengetahui bahwa kehamilan Anda berjalan dengan baik? Mengenali tanda-tanda kehamilan sehat sejak awal adalah langkah penting untuk ketenangan pikiran ibu dan pengawasan medis yang tepat.' },
      { type: 'heading', text: '1. Pertambahan Berat Badan yang Wajar' },
      { type: 'paragraph', text: 'Pertambahan berat badan yang ideal selama kehamilan bervariasi tergantung berat badan awal ibu. Secara umum, kenaikan berat badan yang direkomendasikan adalah 11-16 kg untuk ibu dengan berat badan normal. Kenaikan yang terlalu cepat atau terlalu lambat perlu dievaluasi oleh dokter kandungan.' },
      { type: 'heading', text: '2. Gerakan Janin yang Aktif' },
      { type: 'paragraph', text: 'Merasakan gerakan janin pertama kali (quickening) biasanya terjadi antara minggu 16-25 kehamilan. Setelah itu, ibu seharusnya merasakan minimal 10 gerakan janin dalam 2 jam. Gerakan aktif adalah salah satu indikator terbaik kesehatan janin.' },
      { type: 'heading', text: '3. Tekanan Darah Stabil' },
      { type: 'paragraph', text: 'Tekanan darah normal selama kehamilan adalah di bawah 140/90 mmHg. Tekanan darah tinggi (hipertensi gestasional atau preeklamsia) adalah komplikasi serius yang memerlukan penanganan segera. Itulah mengapa pemeriksaan rutin sangat penting.' },
      { type: 'heading', text: '4. Detak Jantung Janin Normal' },
      { type: 'paragraph', text: 'Detak jantung janin yang normal berkisar antara 120-160 denyut per menit. Detak jantung dapat dipantau melalui USG atau CTG (Cardiotocography). Pemantauan rutin memastikan janin mendapatkan oksigen dan nutrisi yang cukup.' },
      { type: 'heading', text: '5. Hasil Laboratorium dalam Batas Normal' },
      { type: 'list', items: [
        'Hemoglobin ≥ 11 g/dL (mencegah anemia)',
        'Gula darah terkontrol (mencegah diabetes gestasional)',
        'Urin bebas protein (indikator fungsi ginjal sehat)',
        'Golongan darah dan Rhesus teridentifikasi',
      ]},
      { type: 'callout', text: 'Jika Anda belum melakukan pemeriksaan ANC (Antenatal Care) secara rutin, segera konsultasikan dengan dokter kandungan. Pemeriksaan rutin setiap 4 minggu di trimester 1-2, dan setiap 2 minggu di trimester 3 adalah standar medis yang direkomendasikan.' },
      { type: 'heading', text: 'Kapan Harus ke Dokter Segera?' },
      { type: 'list', items: [
        'Perdarahan vagina, meski sedikit',
        'Nyeri perut hebat yang tidak mereda',
        'Demam di atas 38°C',
        'Gerakan janin berkurang drastis',
        'Bengkak mendadak di wajah, tangan, atau kaki',
        'Sakit kepala hebat dan gangguan penglihatan',
      ]},
      { type: 'paragraph', text: 'Kehamilan sehat adalah hasil dari pemantauan yang konsisten dan komunikasi yang baik antara ibu dan dokter kandungan. Jangan ragu untuk berkonsultasi kapanpun Anda merasa ada yang tidak biasa.' },
    ],
  },
  {
    id: '2',
    slug: 'tips-program-hamil',
    title: '7 Tips Program Hamil yang Terbukti Efektif',
    excerpt: 'Mempersiapkan kehamilan membutuhkan perencanaan matang. Berikut tips berbasis medis untuk memaksimalkan peluang hamil.',
    category: 'Program Hamil',
    readTime: '7 menit',
    date: '5 Juni 2025',
    image: '',
    author: 'dr. Wildan A. Sutrisno, SpOG',
    tags: ['program hamil', 'tips hamil', 'kesuburan', 'perencanaan kehamilan'],
    content: [
      { type: 'paragraph', text: 'Program hamil adalah proses terstruktur yang dirancang untuk meningkatkan peluang kehamilan. Berbeda dengan "mencoba hamil" secara spontan, program hamil melibatkan evaluasi medis, penyesuaian gaya hidup, dan pemantauan siklus yang sistematis.' },
      { type: 'heading', text: 'Tip 1: Mulai dengan Konsultasi Dokter Kandungan' },
      { type: 'paragraph', text: 'Langkah pertama yang sering dilewatkan adalah konsultasi awal dengan SpOG. Dokter akan melakukan evaluasi lengkap termasuk pemeriksaan fisik, USG rahim, analisis semen suami, dan panel hormon reproduksi. Memahami kondisi awal membantu menetapkan langkah yang tepat.' },
      { type: 'heading', text: 'Tip 2: Pantau Masa Subur dengan Tepat' },
      { type: 'paragraph', text: 'Masa subur terjadi sekitar hari ke-12 hingga 16 dari siklus 28 hari. Untuk menentukan masa subur yang akurat, gunakan kombinasi: mencatat siklus haid, memantau lendir serviks, dan menggunakan alat prediksi ovulasi (OPK). USG folikel juga bisa dilakukan untuk memantau perkembangan sel telur secara langsung.' },
      { type: 'heading', text: 'Tip 3: Optimalkan Nutrisi Pra-Kehamilan' },
      { type: 'list', items: [
        'Asam folat 400mcg/hari — mulai 3 bulan sebelum program hamil',
        'Zat besi cukup — cegah anemia sebelum hamil',
        'Vitamin D dan kalsium — penting untuk pembentukan tulang janin',
        'Omega-3 (DHA/EPA) — mendukung perkembangan otak janin',
        'Hindari alkohol, rokok, dan kafein berlebih',
      ]},
      { type: 'heading', text: 'Tip 4: Jaga Berat Badan Ideal' },
      { type: 'paragraph', text: 'BMI yang ideal (18.5-24.9) meningkatkan peluang kehamilan secara signifikan. Kelebihan berat badan dapat menyebabkan resistensi insulin yang mengganggu ovulasi. Sebaliknya, berat badan terlalu rendah juga dapat menekan produksi hormon reproduksi.' },
      { type: 'heading', text: 'Tip 5: Kelola Stres' },
      { type: 'paragraph', text: 'Stres kronis meningkatkan kortisol yang mengganggu keseimbangan hormon reproduksi. Teknik relaksasi seperti yoga prenatal, meditasi, atau sekadar berjalan pagi dapat membantu menurunkan kadar stres secara bermakna.' },
      { type: 'heading', text: 'Tip 6: Evaluasi Kondisi Medis yang Ada' },
      { type: 'list', items: [
        'PCOS (Polycystic Ovary Syndrome) — perlu penanganan khusus',
        'Mioma atau endometriosis — evaluasi dampaknya pada kesuburan',
        'Tiroid — hipo/hipertiroid mengganggu siklus haid',
        'Diabetes — perlu kontrol gula darah sebelum hamil',
      ]},
      { type: 'heading', text: 'Tip 7: Beri Waktu yang Realistis' },
      { type: 'paragraph', text: 'Pasangan dengan kesuburan normal memiliki peluang kehamilan 85% dalam 1 tahun. Jika belum hamil setelah 12 bulan mencoba (atau 6 bulan untuk usia di atas 35 tahun), evaluasi lebih lanjut sangat dianjurkan.' },
      { type: 'callout', text: 'Program hamil di Apotek Keluarga meliputi evaluasi lengkap kedua pasangan, pemantauan ovulasi dengan USG folikel, dan panduan medis personal dari dr. Wildan A. Sutrisno, SpOG. Konsultasi pertama bisa diawali dengan booking online.' },
    ],
  },
  {
    id: '3',
    slug: 'manfaat-usg-4d',
    title: 'Kenapa USG 4D Penting di Trimester Kedua?',
    excerpt: 'USG 4D bukan sekadar momen emosional — ada manfaat medis penting yang perlu ibu pahami.',
    category: 'USG',
    readTime: '4 menit',
    date: '1 Juni 2025',
    image: '',
    author: 'dr. Wildan A. Sutrisno, SpOG',
    tags: ['USG 4D', 'USG kehamilan', 'pemeriksaan janin', 'trimester kedua'],
    content: [
      { type: 'paragraph', text: 'Banyak ibu hamil mengenal USG 4D sebagai "momen melihat wajah bayi". Namun di balik momen emosional itu, terdapat nilai diagnostik yang sangat penting — terutama jika dilakukan di trimester kedua kehamilan.' },
      { type: 'heading', text: 'Apa Perbedaan USG 2D, 3D, dan 4D?' },
      { type: 'list', items: [
        'USG 2D — gambar dua dimensi, standar untuk pemantauan rutin',
        'USG 3D — gambar tiga dimensi statis, detail anatomi lebih jelas',
        'USG 4D — video real-time tiga dimensi, menampilkan gerakan janin',
      ]},
      { type: 'heading', text: 'Manfaat Medis USG 4D' },
      { type: 'paragraph', text: 'Selain keindahan visual, USG 4D memberikan informasi medis yang tidak bisa diperoleh dari USG 2D biasa. Dokter dapat mengevaluasi ekspresi wajah, gerakan otot, dan respons janin terhadap stimulus.' },
      { type: 'list', items: [
        'Deteksi kelainan wajah (celah bibir/langit-langit) lebih akurat',
        'Evaluasi posisi dan fungsi plasenta',
        'Penilaian volume cairan ketuban (AFI)',
        'Pemantauan berat estimasi janin (EFW)',
        'Evaluasi aliran darah tali pusat (Doppler)',
        'Deteksi kelainan anatomi mayor pada trimester 2',
      ]},
      { type: 'heading', text: 'Waktu Terbaik USG 4D' },
      { type: 'paragraph', text: 'Trimester kedua — khususnya minggu ke-26 hingga 30 — adalah waktu optimal untuk USG 4D. Pada periode ini, janin sudah memiliki lapisan lemak yang membuat gambar lebih jelas, namun ruang rahim masih cukup untuk melihat seluruh tubuh.' },
      { type: 'callout', text: 'Sebelum minggu ke-26, wajah janin masih terlalu kurus sehingga gambar 4D terlihat kurang jelas. Setelah minggu ke-32, kepala janin sering sudah masuk panggul sehingga sudut pandang terbatas.' },
      { type: 'heading', text: 'Persiapan Sebelum USG 4D' },
      { type: 'list', items: [
        'Minum 2-3 gelas air putih 30 menit sebelum pemeriksaan',
        'Konsumsi makanan manis ringan untuk meningkatkan aktivitas janin',
        'Pilih waktu pagi atau siang saat janin biasanya aktif',
        'Bawa anggota keluarga untuk berbagi momen bersama',
      ]},
      { type: 'paragraph', text: 'USG 4D di Apotek Keluarga menggunakan perangkat ultrasonografi modern dan dilakukan langsung oleh dr. Wildan A. Sutrisno, SpOG. Hasilnya disimpan dalam format video digital yang bisa Anda simpan sebagai kenangan pertama bersama si kecil.' },
    ],
  },
  {
    id: '4',
    slug: 'dokter-kandungan-cirebon',
    title: 'Dokter Kandungan Cirebon — Panduan Memilih SpOG yang Tepat',
    excerpt: 'Memilih dokter kandungan di Cirebon adalah keputusan penting. Panduan ini membantu Anda menemukan SpOG yang sesuai untuk perjalanan kehamilan Anda.',
    category: 'Panduan',
    readTime: '6 menit',
    date: '15 Juni 2025',
    image: '',
    author: 'Tim Apotek Keluarga',
    tags: ['dokter kandungan Cirebon', 'SpOG Cirebon', 'klinik kandungan Cirebon', 'pilih dokter kandungan'],
    content: [
      { type: 'paragraph', text: 'Cirebon memiliki sejumlah dokter spesialis obstetri dan ginekologi (SpOG) yang berpraktik di berbagai klinik dan rumah sakit. Memilih dokter kandungan yang tepat adalah salah satu keputusan terpenting dalam perjalanan kehamilan Anda.' },
      { type: 'heading', text: 'Mengapa Memilih Dokter Kandungan yang Tepat Itu Penting?' },
      { type: 'paragraph', text: 'Hubungan antara ibu hamil dan dokter kandungannya adalah fondasi dari pengalaman kehamilan yang positif. Dokter yang baik tidak hanya kompeten secara medis, tetapi juga mampu berkomunikasi dengan baik, menjawab pertanyaan dengan sabar, dan membuat Anda merasa aman setiap kunjungan.' },
      { type: 'heading', text: 'Kriteria Dokter Kandungan yang Baik' },
      { type: 'list', items: [
        'Memiliki gelar SpOG (Spesialis Obstetri dan Ginekologi) resmi',
        'Terdaftar di POGI (Perkumpulan Obstetri dan Ginekologi Indonesia)',
        'Praktik di fasilitas kesehatan yang bersih dan terakreditasi',
        'Komunikatif dan sabar dalam menjelaskan kondisi kesehatan',
        'Memiliki sistem booking yang teratur (tidak membuat pasien menunggu lama)',
        'Tersedia fasilitas USG di tempat praktik',
      ]},
      { type: 'heading', text: 'Dokter Kandungan di Cirebon: Apa yang Perlu Diketahui' },
      { type: 'paragraph', text: 'Di Cirebon, dokter kandungan tersebar di beberapa lokasi — mulai dari klinik pratama, klinik spesialis, hingga rumah sakit umum dan swasta. Untuk kehamilan dengan risiko rendah, klinik spesialis sering menjadi pilihan terbaik karena waktu tunggu lebih pendek dan suasana lebih personal.' },
      { type: 'heading', text: 'Pertanyaan yang Perlu Ditanyakan saat Pertama Kali Berkonsultasi' },
      { type: 'list', items: [
        'Berapa sering saya perlu kontrol selama kehamilan?',
        'Fasilitas apa saja yang tersedia (USG 2D/3D/4D, CTG, lab)?',
        'Apakah dokter bisa dihubungi di luar jam praktik untuk kedaruratan?',
        'Di rumah sakit mana dokter berpraktik untuk proses persalinan?',
        'Bagaimana prosedur jika terjadi komplikasi?',
      ]},
      { type: 'heading', text: 'dr. Wildan A. Sutrisno, SpOG — Cirebon' },
      { type: 'paragraph', text: 'dr. Wildan A. Sutrisno, SpOG adalah dokter spesialis kandungan yang berpraktik di Apotek Keluarga (Jl. Gerilyawan No.5, Cirebon) dan RS Medimas Cirebon. Dikenal dengan pendekatan yang hangat dan teliti, beliau melayani konsultasi kandungan, program hamil, USG 2D/3D/4D, ANC rutin, serta berbagai layanan kesehatan reproduksi wanita.' },
      { type: 'callout', text: 'Booking online tersedia 24 jam. Pilih tanggal, waktu, dan dokter sesuai kebutuhan Anda — tanpa harus menghubungi admin via WhatsApp.' },
    ],
  },
  {
    id: '5',
    slug: 'usg-4d-cirebon',
    title: 'USG 4D di Cirebon — Kapan Waktu Terbaik dan Apa yang Bisa Dilihat',
    excerpt: 'Ingin tahu pengalaman USG 4D di Cirebon? Simak panduan lengkap tentang waktu terbaik, persiapan, dan apa yang bisa dilihat dari pemeriksaan ini.',
    category: 'USG',
    readTime: '5 menit',
    date: '20 Juni 2025',
    image: '',
    author: 'dr. Wildan A. Sutrisno, SpOG',
    tags: ['USG 4D Cirebon', 'USG kehamilan Cirebon', '4D scan Cirebon', 'klinik USG Cirebon'],
    content: [
      { type: 'paragraph', text: 'USG 4D semakin populer di kalangan ibu hamil di Cirebon. Teknologi ini memungkinkan orang tua untuk "bertemu" dengan bayi mereka bahkan sebelum lahir — melihat ekspresi wajah, gerakan tangan, bahkan saat bayi menguap atau tersenyum.' },
      { type: 'heading', text: 'Apa yang Bisa Dilihat dari USG 4D?' },
      { type: 'paragraph', text: 'USG 4D menampilkan citra tiga dimensi dalam video real-time. Berbeda dengan USG 2D yang menampilkan gambar datar hitam-putih, USG 4D menghasilkan video berwarna keemasan yang memperlihatkan detail wajah dan tubuh bayi secara nyata.' },
      { type: 'list', items: [
        'Wajah bayi: pipi, hidung, bibir, dan ekspresi',
        'Gerakan real-time: menguap, menyedot jempol, menendang',
        'Posisi dan presentasi janin',
        'Pergerakan tangan dan kaki',
        'Aliran darah tali pusat (jika dilengkapi Doppler)',
      ]},
      { type: 'heading', text: 'Waktu Terbaik USG 4D di Cirebon' },
      { type: 'paragraph', text: 'Waktu optimal untuk USG 4D adalah antara minggu ke-26 dan ke-30 kehamilan (trimester ketiga awal). Pada periode ini janin sudah cukup besar untuk terlihat detailnya, namun belum terlalu besar sehingga masih bisa terlihat seluruh tubuhnya dalam satu bidang.' },
      { type: 'callout', text: 'Tips: Makan camilan manis 30 menit sebelum USG untuk membuat bayi lebih aktif. Bayi yang aktif bergerak akan menghasilkan gambar dan video 4D yang lebih dinamis.' },
      { type: 'heading', text: 'Berapa Biaya USG 4D di Cirebon?' },
      { type: 'paragraph', text: 'Biaya USG 4D bervariasi tergantung fasilitas. Di Apotek Keluarga, pemeriksaan dilakukan langsung oleh dr. Wildan A. Sutrisno, SpOG dengan peralatan modern. Hasilnya disimpan dalam format video digital. Untuk informasi biaya terkini, hubungi kami via WhatsApp atau booking online.' },
      { type: 'heading', text: 'Lokasi USG 4D dr. Wildan di Cirebon' },
      { type: 'list', items: [
        'Apotek Keluarga — Jl. Gerilyawan No.5, Cirebon (Sen-Sab)',
        'RS Medimas Cirebon — Selasa dan Kamis pagi',
      ]},
      { type: 'paragraph', text: 'Booking USG 4D bisa dilakukan secara online 24 jam melalui website ini. Pilih layanan USG 4D, pilih lokasi dan tanggal yang sesuai, dan konfirmasi jadwal Anda.' },
    ],
  },
  {
    id: '6',
    slug: 'program-hamil-cirebon',
    title: 'Program Hamil Cirebon — Langkah Medis yang Terbukti Efektif',
    excerpt: 'Sudah lama mencoba hamil tapi belum berhasil? Program hamil terstruktur bersama dokter SpOG di Cirebon bisa menjadi solusi yang Anda butuhkan.',
    category: 'Program Hamil',
    readTime: '8 menit',
    date: '25 Juni 2025',
    image: '',
    author: 'dr. Wildan A. Sutrisno, SpOG',
    tags: ['program hamil Cirebon', 'dokter kesuburan Cirebon', 'susah hamil Cirebon', 'promil Cirebon'],
    content: [
      { type: 'paragraph', text: 'Mendambakan kehadiran buah hati adalah impian setiap pasangan. Namun tidak semua kehamilan terjadi dengan mudah. Jika Anda sudah mencoba selama lebih dari 12 bulan (atau 6 bulan untuk usia di atas 35 tahun) tanpa hasil, program hamil terstruktur bisa menjadi langkah selanjutnya.' },
      { type: 'heading', text: 'Apa itu Program Hamil?' },
      { type: 'paragraph', text: 'Program hamil (promil) adalah serangkaian evaluasi dan intervensi medis yang bertujuan mengidentifikasi dan mengatasi penyebab kesulitan hamil. Ini bukan "obat ajaib" — melainkan pendekatan ilmiah yang sistematis untuk meningkatkan peluang kehamilan.' },
      { type: 'heading', text: 'Langkah-Langkah Program Hamil di Apotek Keluarga' },
      { type: 'list', items: [
        'Konsultasi awal & anamnesis lengkap (riwayat haid, riwayat KB, dll)',
        'Pemeriksaan fisik dan ginekologi',
        'USG rahim dan ovarium untuk evaluasi anatomi',
        'Pemeriksaan hormon reproduksi (FSH, LH, AMH, Prolaktin)',
        'Analisis semen suami (sperma count, motilitas, morfologi)',
        'Pemantauan ovulasi dengan USG folikel',
        'Rencana intervensi sesuai temuan (clomid, inseminasi, dll)',
      ]},
      { type: 'heading', text: 'Penyebab Umum Kesulitan Hamil' },
      { type: 'paragraph', text: 'Berdasarkan data medis, penyebab kesulitan hamil terbagi merata antara faktor perempuan, faktor laki-laki, faktor keduanya, dan faktor yang tidak dapat dijelaskan (unexplained infertility).' },
      { type: 'list', items: [
        'Faktor ovulasi (PCOS, gangguan tiroid, stres berat)',
        'Faktor tuba falopi (tersumbat akibat infeksi atau endometriosis)',
        'Faktor rahim (mioma, polip, septum uteri)',
        'Faktor sperma (oligospermia, asthenospermia, azoospermia)',
        'Faktor gabungan kedua pasangan',
      ]},
      { type: 'heading', text: 'Berapa Lama Program Hamil Berlangsung?' },
      { type: 'paragraph', text: 'Durasi program hamil bervariasi tergantung temuan evaluasi awal. Untuk kasus ringan (gangguan ovulasi saja), perbaikan bisa terlihat dalam 3-6 siklus. Untuk kasus yang memerlukan tindakan lebih lanjut, dokter akan merujuk ke fasilitas yang sesuai.' },
      { type: 'callout', text: 'dr. Wildan A. Sutrisno, SpOG menerima konsultasi program hamil di Apotek Keluarga Cirebon. Pendekatan beliau: hangat, teliti, dan berbasis bukti ilmiah. Banyak pasangan yang sudah berhasil mendapatkan momongan setelah menjalani program hamil bersama beliau.' },
      { type: 'heading', text: 'Mulai dari Mana?' },
      { type: 'paragraph', text: 'Langkah pertama adalah konsultasi awal. Tidak perlu mempersiapkan apa-apa selain histori haid Anda. Dokter akan memandu seluruh proses evaluasi dan memberikan penjelasan lengkap di setiap tahap.' },
      { type: 'paragraph', text: 'Booking konsultasi program hamil dapat dilakukan secara online 24 jam melalui website ini. Pilih layanan "Program Hamil", pilih lokasi dan jadwal yang sesuai, dan mulai perjalanan Anda bersama kami.' },
    ],
  },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const faqs: FAQ[] = [
  { id: '1', question: 'Bagaimana cara booking jadwal?', answer: 'Pilih menu "Buat Janji", pilih layanan, lokasi, tanggal & waktu, isi data diri, lalu konfirmasi. ID janji dan nomor antrian otomatis diterima.' },
  { id: '2', question: 'Di mana saja lokasi praktek dr. Wildan?', answer: 'dr. Wildan praktek di dua lokasi: Apotek Keluarga (Jl. Gerilyawan No.5) dan RS Medimas Cirebon. Jadwal per lokasi tersedia di halaman Jadwal.' },
  { id: '3', question: 'Apakah bisa menggunakan BPJS?', answer: 'Untuk informasi BPJS, silakan hubungi kami via WhatsApp 085220024400 untuk informasi terkini.' },
  { id: '4', question: 'Bagaimana sistem antrian digitalnya?', answer: 'Setelah booking, Anda mendapat ID Janji (mis: AK-202606-014) dan Nomor Antrian (mis: A-014). Pantau posisi antrian real-time di halaman Antrian kami.' },
  { id: '5', question: 'Apakah ada pengingat otomatis?', answer: 'Ya. Sistem mengirim pengingat via WhatsApp 24 jam dan 3 jam sebelum jadwal Anda, lengkap dengan instruksi persiapan.' },
  { id: '6', question: 'Berapa lama waktu konsultasi?', answer: 'Tergantung layanan: konsultasi kandungan 30–45 menit, USG 20–40 menit, program hamil 45–60 menit. Karena jadwal berbasis waktu, pengalaman lebih tertib dan terprediksi.' },
]

// ─── Why Choose Us ────────────────────────────────────────────────────────────
export const whyItems = [
  { icon: '🩺', title: 'Dokter Spesialis Berpengalaman', desc: 'dr. Wildan SpOG & dr. Febryanti Sp.THT-KL — dokter dengan dedikasi tinggi dan pendekatan penuh empati.' },
  { icon: '📅', title: 'Booking Berbasis Waktu', desc: 'Bukan sekadar nomor antrian — Anda memilih jam yang pasti. Datang tepat waktu, tidak perlu menunggu lama.' },
  { icon: '🏠', title: 'Suasana Hangat & Nyaman', desc: 'Klinik yang terasa seperti rumah — bukan ruang tunggu rumah sakit yang dingin dan mengkhawatirkan.' },
  { icon: '📱', title: 'Pengingat Otomatis', desc: 'Reminder WhatsApp 24 jam & 3 jam sebelum jadwal — tidak perlu khawatir lupa dengan janji Anda.' },
  { icon: '🎯', title: '2 Lokasi Praktek', desc: 'Apotek Keluarga & RS Medimas Cirebon — pilih lokasi yang paling nyaman untuk Anda.' },
  { icon: '🌿', title: 'Teman Sepanjang Perjalanan', desc: 'Dari program hamil, kehamilan, hingga pasca melahirkan — kami menemani setiap langkah.' },
]

// ─── Queue (mock, live simulation) ───────────────────────────────────────────
export type QueueStatus = 'waiting' | 'called' | 'in-consultation' | 'completed'

export interface QueueItem {
  number: string
  patientName: string
  service: string
  appointmentTime: string
  status: QueueStatus
  calledAt?: string
}

export const mockQueue: QueueItem[] = [
  { number: 'A-001', patientName: 'Ibu Rahayu', service: 'Konsultasi Kandungan', appointmentTime: '15:00', status: 'completed' },
  { number: 'A-002', patientName: 'Ibu Marlina', service: 'USG 4D', appointmentTime: '15:30', status: 'completed' },
  { number: 'A-003', patientName: 'Ibu Siti', service: 'Program Hamil', appointmentTime: '16:00', status: 'in-consultation', calledAt: '16:05' },
  { number: 'A-004', patientName: 'Ibu Dewi', service: 'Antenatal Care', appointmentTime: '16:30', status: 'called', calledAt: '16:28' },
  { number: 'A-005', patientName: 'Ibu Nurul', service: 'USG 3D', appointmentTime: '17:00', status: 'waiting' },
  { number: 'A-006', patientName: 'Ibu Rina', service: 'Konsultasi Kandungan', appointmentTime: '17:30', status: 'waiting' },
  { number: 'A-007', patientName: 'Ibu Ayu', service: 'KB', appointmentTime: '18:00', status: 'waiting' },
]

// ─── Mock upcoming appointments (patient dashboard) ──────────────────────────
export const mockAppointments: Appointment[] = [
  {
    id: 'AK-202606-007',
    queueNumber: 'A-007',
    service: 'USG 4D',
    location: 'Apotek Keluarga',
    doctor: 'dr. Wildan A. Sutrisno, SpOG',
    date: '2025-06-18',
    time: '15:30',
    patientName: 'Ibu Sari',
    patientPhone: '08123456789',
    patientDob: '1993-05-12',
    visitType: 'Pasien Lama',
    notes: 'Kehamilan 28 minggu',
    status: 'upcoming',
    createdAt: '2025-06-10',
  },
  {
    id: 'AK-202605-014',
    queueNumber: 'A-014',
    service: 'Konsultasi Kandungan',
    location: 'Apotek Keluarga',
    doctor: 'dr. Wildan A. Sutrisno, SpOG',
    date: '2025-05-20',
    time: '17:00',
    patientName: 'Ibu Sari',
    patientPhone: '08123456789',
    patientDob: '1993-05-12',
    visitType: 'Pasien Baru',
    notes: '',
    status: 'completed',
    createdAt: '2025-05-10',
  },
]
