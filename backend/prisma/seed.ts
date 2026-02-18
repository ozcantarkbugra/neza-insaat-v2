/// <reference types="node" />
import { PrismaClient, UserRole, ProjectStatus, BlogStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const BASE_URL = process.env['BASE_URL'] || process.env['API_BASE_URL'] || process.env['FRONTEND_URL'] || 'http://localhost:5002'
const uploads = (path: string) => `${BASE_URL.replace(/\/$/, '')}/uploads/${path}`

async function main() {
  console.log('🌱 Seeding database...')
  console.log('BASE_URL:', BASE_URL)
  console.log('DATABASE_URL:', process.env['DATABASE_URL'] ? '✓ set' : '✗ missing')

  const hashedPassword = await bcrypt.hash('Admin123!', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@construction.com' },
    update: {},
    create: {
      email: 'admin@construction.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  })
  console.log('✅ Admin user:', adminUser.email)

  const services = [
    {
      title: 'Konut İnşaatı',
      titleEn: 'Residential Construction',
      slug: 'konut-insaati',
      description: 'Modern ve konforlu konut projeleri geliştiriyoruz. Müşterilerimizin hayallerindeki evleri gerçeğe dönüştürüyoruz.',
      descriptionEn: 'We develop modern and comfortable residential projects. We turn our customers\' dream homes into reality.',
      shortDescription: 'Modern ve konforlu konut projeleri',
      shortDescriptionEn: 'Modern and comfortable residential projects',
      image: uploads('service-konut.jpg'),
      featured: true,
      order: 1,
    },
    {
      title: 'Ticari Yapılar',
      titleEn: 'Commercial Buildings',
      slug: 'ticari-yapilar',
      description: 'İş merkezleri, ofis binaları ve ticari kompleksler için profesyonel çözümler sunuyoruz.',
      descriptionEn: 'We offer professional solutions for business centers, office buildings and commercial complexes.',
      shortDescription: 'İş merkezleri ve ofis binaları',
      shortDescriptionEn: 'Business centers and office buildings',
      image: uploads('service-ticari.jpg'),
      featured: true,
      order: 2,
    },
    {
      title: 'Endüstriyel Yapılar',
      titleEn: 'Industrial Buildings',
      slug: 'endustriyel-yapilar',
      description: 'Fabrikalar, depolama alanları ve endüstriyel tesisler için güvenli ve verimli yapılar inşa ediyoruz.',
      descriptionEn: 'We build safe and efficient structures for factories, storage facilities and industrial plants.',
      shortDescription: 'Fabrikalar ve endüstriyel tesisler',
      shortDescriptionEn: 'Factories and industrial facilities',
      image: uploads('service-endustriyel.jpg'),
      featured: true,
      order: 3,
    },
    {
      title: 'Taahhüt Hizmetleri',
      titleEn: 'Contracting Services',
      slug: 'taahhut-hizmetleri',
      description: 'Anahtar teslim projeler için kapsamlı taahhüt hizmetleri sunuyoruz. Proje yönetiminden inşaata, teslimata kadar tüm süreçleri tek elden yürütüyoruz. Örnek uygulamalar: konut siteleri, ticari yapılar ve altyapı projelerinde anahtar teslimi taahhüt. Zamanında teslimat ve bütçe disiplini ile güvenilir taahhüt hizmeti veriyoruz.',
      descriptionEn: 'We offer comprehensive contracting services for turnkey projects. We manage the entire process from project management to construction and delivery. Example applications: turnkey contracting for housing estates, commercial buildings and infrastructure projects. We provide reliable contracting with on-time delivery and budget discipline.',
      shortDescription: 'Anahtar teslim projeler için kapsamlı taahhüt hizmetleri',
      shortDescriptionEn: 'Comprehensive contracting for turnkey projects',
      image: uploads('service-taahhut.jpg'),
      featured: true,
      order: 4,
    },
    {
      title: 'Kentsel Dönüşüm',
      titleEn: 'Urban Transformation',
      slug: 'kentsel-donusum',
      description: 'Şehirlerimizi yeniden şekillendiren kentsel dönüşüm projeleri gerçekleştiriyoruz.',
      descriptionEn: 'We carry out urban transformation projects that reshape our cities.',
      shortDescription: 'Kentsel dönüşüm projeleri',
      shortDescriptionEn: 'Urban transformation projects',
      image: uploads('service-kentsel.jpg'),
      featured: true,
      order: 5,
    },
  ]

  const createdServices = []
  for (const service of services) {
    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        titleEn: (service as any).titleEn ?? null,
        description: service.description,
        descriptionEn: (service as any).descriptionEn ?? null,
        shortDescription: service.shortDescription,
        shortDescriptionEn: (service as any).shortDescriptionEn ?? null,
        image: service.image,
        featured: service.featured,
        order: service.order,
      },
      create: service as any,
    })
    createdServices.push(created)
  }
  console.log('✅ Services:', createdServices.length)

  const categories = [
    { name: 'Haberler', slug: 'haberler' },
    { name: 'Projeler', slug: 'projeler' },
    { name: 'Teknoloji', slug: 'teknoloji' },
    { name: 'İnşaat', slug: 'insaat' },
  ]

  const createdCategories = []
  for (const cat of categories) {
    const created = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories.push(created)
  }
  console.log('✅ Blog categories:', createdCategories.length)

  const projects = [
    {
      title: 'Modern Konut Kompleksi',
      titleEn: 'Modern Residential Complex',
      slug: 'modern-konut-kompleksi',
      description: 'Şehrin merkezinde, modern mimari anlayışıyla tasarlanmış lüks konut kompleksi. Geniş bahçeler, sosyal alanlar ve yüksek kalite standartlarıyla hayatınıza değer katıyoruz.',
      descriptionEn: 'A luxury residential complex in the heart of the city, designed with a modern architectural approach. We add value to your life with spacious gardens, social areas and high quality standards.',
      shortDescription: 'Modern mimari ile tasarlanmış lüks konut kompleksi',
      shortDescriptionEn: 'Luxury residential complex with modern architecture',
      status: ProjectStatus.IN_PROGRESS,
      area: 15000,
      location: 'İstanbul, Türkiye',
      latitude: 41.0082,
      longitude: 28.9784,
      startDate: new Date('2023-01-15'),
      deliveryDate: new Date('2025-06-30'),
      featured: true,
      featuredImage: uploads('project-modern-konut-1.jpg'),
      imageUrls: [
        uploads('project-modern-konut-1.jpg'),
        uploads('project-modern-konut-2.jpg'),
        uploads('project-modern-konut-4.jpg'),
      ],
      serviceId: createdServices[0].id,
      createdById: adminUser.id,
    },
    {
      title: 'İş Merkezi Projesi',
      titleEn: 'Business Center Project',
      slug: 'is-merkezi-projesi',
      description: 'Modern ofis yaşamı için tasarlanmış, A+ sınıfı iş merkezi. Yüksek teknoloji altyapısı ve sürdürülebilir mimari ile iş dünyasının yeni adresi.',
      descriptionEn: 'An A+ class business center designed for modern office life. The new address for business with state-of-the-art infrastructure and sustainable architecture.',
      shortDescription: 'A+ sınıfı modern iş merkezi',
      shortDescriptionEn: 'A+ class modern business center',
      status: ProjectStatus.COMPLETED,
      area: 25000,
      location: 'Ankara, Türkiye',
      latitude: 39.9334,
      longitude: 32.8597,
      startDate: new Date('2021-03-01'),
      deliveryDate: new Date('2023-12-15'),
      featured: true,
      featuredImage: uploads('project-is-merkezi-1.jpg'),
      imageUrls: [
        uploads('project-is-merkezi-1.jpg'),
        uploads('project-is-merkezi-2.jpg'),
        uploads('project-is-merkezi-3.jpg'),
        uploads('project-is-merkezi-4.jpg'),
      ],
      serviceId: createdServices[1].id,
      createdById: adminUser.id,
    },
    {
      title: 'Endüstriyel Tesis',
      titleEn: 'Industrial Facility',
      slug: 'endustriyel-tesis',
      description: 'Yüksek kapasiteli üretim için tasarlanmış modern endüstriyel tesis. Güvenlik ve verimlilik odaklı mimari.',
      descriptionEn: 'A modern industrial facility designed for high-capacity production. Architecture focused on safety and efficiency.',
      shortDescription: 'Modern endüstriyel üretim tesisi',
      shortDescriptionEn: 'Modern industrial production facility',
      status: ProjectStatus.COMPLETED,
      area: 50000,
      location: 'Bursa, Türkiye',
      latitude: 40.1826,
      longitude: 29.0665,
      startDate: new Date('2020-06-01'),
      deliveryDate: new Date('2022-11-30'),
      featured: false,
      featuredImage: uploads('project-endustriyel-1.jpg'),
      imageUrls: [
        uploads('project-endustriyel-1.jpg'),
        uploads('project-endustriyel-3.jpg'),
      ],
      serviceId: createdServices[2].id,
      createdById: adminUser.id,
    },
    {
      title: 'Lüks Villa Projesi',
      titleEn: 'Luxury Villa Project',
      slug: 'luks-villa-projesi',
      description: 'Deniz manzaralı, özel tasarım lüks villa projesi. Modern mimari ve doğal malzemelerin uyumu ile eşsiz bir yaşam alanı.',
      descriptionEn: 'A luxury villa project with sea view and custom design. A unique living space with the harmony of modern architecture and natural materials.',
      shortDescription: 'Deniz manzaralı özel tasarım lüks villa',
      shortDescriptionEn: 'Sea-view luxury villa with custom design',
      status: ProjectStatus.COMPLETED,
      area: 850,
      location: 'Bodrum, Türkiye',
      latitude: 37.0344,
      longitude: 27.4305,
      startDate: new Date('2022-05-01'),
      deliveryDate: new Date('2024-08-30'),
      featured: true,
      featuredImage: uploads('project-villa-1.jpg'),
      imageUrls: [
        uploads('project-villa-1.jpg'),
        uploads('project-villa-3.jpg'),
      ],
      serviceId: createdServices[0].id,
      createdById: adminUser.id,
    },
    {
      title: 'Alışveriş Merkezi',
      titleEn: 'Shopping Mall',
      slug: 'alisveris-merkezi',
      description: 'Modern alışveriş ve eğlence merkezi. Geniş mağaza alanları, sinema kompleksi ve restoranlar ile şehrin yeni buluşma noktası.',
      descriptionEn: 'A modern shopping and entertainment center. The city\'s new meeting point with spacious retail areas, cinema complex and restaurants.',
      shortDescription: 'Modern alışveriş ve eğlence merkezi',
      shortDescriptionEn: 'Modern shopping and entertainment center',
      status: ProjectStatus.IN_PROGRESS,
      area: 45000,
      location: 'İzmir, Türkiye',
      latitude: 38.4237,
      longitude: 27.1428,
      startDate: new Date('2023-09-01'),
      deliveryDate: new Date('2026-03-31'),
      featured: true,
      featuredImage: uploads('project-is-merkezi-3.jpg'),
      imageUrls: [
        uploads('project-is-merkezi-3.jpg'),
        uploads('project-is-merkezi-4.jpg'),
      ],
      serviceId: createdServices[1].id,
      createdById: adminUser.id,
    },
    {
      title: 'Yenileme Bölgesi Kentsel Dönüşüm Projesi',
      titleEn: 'Renewal Area Urban Transformation Project',
      slug: 'yenileme-bolgesi-kentsel-donusum',
      description: 'Şehir merkezinde riskli alanın kentsel dönüşümü kapsamında gerçekleştirdiğimiz örnek proje. Mevcut yapıların güvenli yıkımı, altyapı yenilemesi ve yeni konut alanlarının inşası ile bölge yeniden canlandırıldı. Deprem yönetmeliğine uygun, yeşil alanları ve sosyal donatılarıyla örnek bir kentsel dönüşüm uygulaması.',
      descriptionEn: 'An exemplary project we carried out within the scope of urban transformation of a risky area in the city center. The area was revitalized with safe demolition of existing structures, infrastructure renewal and construction of new housing. An exemplary urban transformation with green areas and social facilities, compliant with earthquake regulations.',
      shortDescription: 'Riskli alan kentsel dönüşümü ve yenileme projesi',
      shortDescriptionEn: 'Risky area urban transformation and renewal project',
      status: ProjectStatus.IN_PROGRESS,
      area: 22000,
      location: 'Kocaeli, Türkiye',
      latitude: 40.8533,
      longitude: 29.8815,
      startDate: new Date('2024-02-01'),
      deliveryDate: new Date('2027-06-30'),
      featured: true,
      featuredImage: uploads('service-kentsel.jpg'),
      imageUrls: [
        uploads('service-kentsel.jpg'),
      ],
      serviceId: createdServices[4].id,
      createdById: adminUser.id,
    },
  ]

  const createdProjects = []
  for (const project of projects) {
    const { imageUrls, ...projectData } = project as any
    const updateData: any = {
      title: projectData.title,
      titleEn: projectData.titleEn ?? null,
      description: projectData.description,
      descriptionEn: projectData.descriptionEn ?? null,
      shortDescription: projectData.shortDescription ?? null,
      shortDescriptionEn: projectData.shortDescriptionEn ?? null,
      status: projectData.status,
      area: projectData.area,
      location: projectData.location,
      latitude: projectData.latitude,
      longitude: projectData.longitude,
      startDate: projectData.startDate,
      deliveryDate: projectData.deliveryDate,
      featured: projectData.featured,
      featuredImage: projectData.featuredImage,
      serviceId: projectData.serviceId,
    }
    const created = await prisma.project.upsert({
      where: { slug: project.slug },
      update: updateData,
      create: {
        ...projectData,
        images: imageUrls
          ? {
              create: imageUrls.map((url: string, index: number) => ({
                url,
                alt: `${project.title} - Görsel ${index + 1}`,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    })
    createdProjects.push(created)
  }
  console.log('✅ Projects:', createdProjects.length)

  const blogs = [
    {
      title: 'Yeni Projemiz Başladı: Modern Konut Kompleksi',
      slug: 'yeni-projemiz-basladi-modern-konut-kompleksi',
      content: 'Şehrimizin en prestijli konut projelerinden biri olan Modern Konut Kompleksi\'nin temel atma töreni gerçekleştirildi. Proje, modern mimari anlayışı ve sürdürülebilir yapı teknikleriyle dikkat çekiyor. Geniş yeşil alanlar, modern sosyal tesisler ve yüksek kalite standartlarıyla hayatınıza değer katacak bu proje, şehrimizin yeni simgesi olmaya aday.',
      excerpt: 'Modern Konut Kompleksi projesinin temel atma töreni gerçekleştirildi.',
      featuredImage: uploads('blog-konut-kompleksi.jpg'),
      status: BlogStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
      categoryId: createdCategories[0].id,
      createdById: adminUser.id,
    },
    {
      title: 'Sürdürülebilir İnşaat Teknolojileri',
      slug: 'surdurulebilir-insaat-teknolojileri',
      content: 'Sürdürülebilir inşaat teknolojileri, çevresel etkileri minimize ederken yapı kalitesini artırıyor. Yeşil bina sertifikaları ve enerji verimliliği standartlarına uygun projeler geliştiriyoruz. Modern yalıtım sistemleri, güneş enerjisi panelleri ve su geri dönüşüm sistemleri ile çevre dostu yapılar inşa ediyoruz.',
      excerpt: 'Sürdürülebilir inşaat teknolojileri hakkında bilgiler.',
      featuredImage: uploads('blog-surdurulebilir.jpg'),
      status: BlogStatus.PUBLISHED,
      featured: false,
      publishedAt: new Date(),
      categoryId: createdCategories[3].id,
      createdById: adminUser.id,
    },
    {
      title: 'Modern Mimari Trendleri 2024',
      slug: 'modern-mimari-trendleri-2024',
      content: '2024 yılında inşaat sektöründe öne çıkan modern mimari trendleri: Minimalist tasarımlar, doğal malzeme kullanımı, akıllı ev sistemleri ve yeşil mimari yaklaşımları. Bu trendler, hem estetik hem de fonksiyonel açıdan yeni nesil yapıların temelini oluşturuyor.',
      excerpt: '2024 yılında inşaat sektöründe öne çıkan modern mimari trendleri.',
      featuredImage: uploads('blog-mimari-trendleri.jpg'),
      status: BlogStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
      categoryId: createdCategories[3].id,
      createdById: adminUser.id,
    },
    {
      title: 'İş Merkezi Projesi Tamamlandı',
      slug: 'is-merkezi-projesi-tamamlandi',
      content: 'Ankara\'da inşa ettiğimiz modern iş merkezi projesi başarıyla tamamlandı. A+ sınıfı ofis alanları, modern teknoloji altyapısı ve sürdürülebilir mimari ile iş dünyasının yeni adresi oldu. Proje, LEED sertifikası alarak çevre dostu yapılar kategorisinde yerini aldı.',
      excerpt: 'Ankara\'daki modern iş merkezi projesi başarıyla tamamlandı.',
      featuredImage: uploads('blog-is-merkezi.jpg'),
      status: BlogStatus.PUBLISHED,
      featured: false,
      publishedAt: new Date(),
      categoryId: createdCategories[1].id,
      createdById: adminUser.id,
    },
  ]

  const createdBlogs = []
  for (const blog of blogs) {
    const created = await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    })
    createdBlogs.push(created)
  }
  console.log('✅ Blogs:', createdBlogs.length)

  const settings = [
    { key: 'site_name', value: 'Neza', group: 'general' },
    { key: 'site_description', value: 'Güvenilir inşaat çözümleri', group: 'general' },
    { key: 'contact_email', value: 'info@construction.com', group: 'contact' },
    { key: 'contact_phone', value: '+90 (212) 123 45 67', group: 'contact' },
    { key: 'contact_address', value: 'İstanbul, Türkiye', group: 'contact' },
    { key: 'facebook_url', value: 'https://facebook.com', group: 'social' },
    { key: 'twitter_url', value: 'https://twitter.com', group: 'social' },
    { key: 'instagram_url', value: 'https://instagram.com', group: 'social' },
    { key: 'linkedin_url', value: 'https://linkedin.com', group: 'social' },
    { key: 'google_maps_api_key', value: '', group: 'maps' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Site settings:', settings.length)
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
