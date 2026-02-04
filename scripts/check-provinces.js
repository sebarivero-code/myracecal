const { PrismaClient } = require('@prisma/client')
require('dotenv/config')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.DIRECT_URL
    }
  }
})

async function main() {
  try {
    await prisma.$disconnect()
    await new Promise(resolve => setTimeout(resolve, 100))
    await prisma.$connect()
    
    const provinces = await prisma.province.findMany({
      include: {
        country: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log(`\n📊 Total de provincias en la BD: ${provinces.length}\n`)
    console.log('Provincias por país:\n')
    
    const byCountry = {}
    provinces.forEach(p => {
      const countryName = p.country.name
      if (!byCountry[countryName]) {
        byCountry[countryName] = []
      }
      byCountry[countryName].push(p.name)
    })
    
    for (const [country, provList] of Object.entries(byCountry)) {
      console.log(`${country}:`)
      provList.forEach(p => console.log(`  - ${p}`))
      console.log()
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
