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
  { id: '1', slug: 'tanda-kehamilan-sehat', title: 'Tanda-Tanda Kehamilan Sehat yang Perlu Ibu Ketahui', excerpt: 'Mengenali tanda kehamilan sehat sejak dini membantu ibu memantau perkembangan janin dengan lebih baik.', category: 'Kehamilan', readTime: '5 menit', date: '10 Juni 2025', image: '' },
  { id: '2', slug: 'tips-program-hamil', title: '7 Tips Program Hamil yang Terbukti Efektif', excerpt: 'Mempersiapkan kehamilan membutuhkan perencanaan matang. Berikut tips berbasis medis untuk memaksimalkan peluang hamil.', category: 'Program Hamil', readTime: '7 menit', date: '5 Juni 2025', image: '' },
  { id: '3', slug: 'manfaat-usg-4d', title: 'Kenapa USG 4D Penting di Trimester Kedua?', excerpt: 'USG 4D bukan sekadar momen emosional — ada manfaat medis penting yang perlu ibu pahami.', category: 'USG', readTime: '4 menit', date: '1 Juni 2025', image: '' },
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
