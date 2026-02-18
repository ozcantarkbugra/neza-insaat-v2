import fs from 'fs'
import path from 'path'

const MINIMAL_JPEG = Buffer.from(
  'ffd8ffe000104a46494600010101004800480000ffdb00430008060606070605060807070709080a0c140d0c0b0b0c1912130f141d1a1f1e1d1a1c1c20242e2720202c231c1c2837292c30313434341f27393d38323c2e333432ffc9000b0800010001011100ffcc00060000101005ffda0008010100003f00d2cf20ffd9',
  'hex'
)

const SEED_IMAGES = [
  'service-konut.jpg',
  'service-ticari.jpg',
  'service-endustriyel.jpg',
  'service-taahhut.jpg',
  'service-kentsel.jpg',
  'project-modern-konut-1.jpg',
  'project-modern-konut-2.jpg',
  'project-modern-konut-4.jpg',
  'project-is-merkezi-1.jpg',
  'project-is-merkezi-2.jpg',
  'project-is-merkezi-3.jpg',
  'project-is-merkezi-4.jpg',
  'project-endustriyel-1.jpg',
  'project-endustriyel-3.jpg',
  'project-villa-1.jpg',
  'project-villa-3.jpg',
  'blog-konut-kompleksi.jpg',
  'blog-surdurulebilir.jpg',
  'blog-mimari-trendleri.jpg',
  'blog-is-merkezi.jpg',
]

export function ensurePlaceholderImages(): void {
  const uploadDir = process.env['UPLOAD_DIR'] || path.join(process.cwd(), 'uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
  let created = 0
  for (const filename of SEED_IMAGES) {
    const filepath = path.join(uploadDir, filename)
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, MINIMAL_JPEG)
      created++
    }
  }
  if (created > 0) {
    console.log(`📁 Created ${created} placeholder images in uploads/`)
  }
}
