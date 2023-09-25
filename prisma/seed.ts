import { PrismaClient } from '@prisma/client';
import countriesData from './countries';
const prisma = new PrismaClient()


async function main() {
  console.log("Countries have been seeding");
  const countries = await prisma.country.createMany(
    {
      data:
        countriesData.map((item, index) => {
          return { id: index + 1, ...item };
        })
    }
  )
  console.log(countriesData.length + " have been added");
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })