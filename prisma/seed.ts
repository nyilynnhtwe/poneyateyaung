import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import countriesData from './countries';
const prisma = new PrismaClient();

async function main() {
  console.log('Countries have been seeding');
  const countries = await prisma.country.createMany({
    data: countriesData.map((item, index) => {
      return { id: index + 1, ...item };
    }),
  });
  console.log(countriesData.length + ' have been added');

  console.log('Super admin has been seeding');

  const superAdmin = await prisma.user.create({
    data: {
      username: 'nyilynnhtwe',
      email: 'nyilynnhtwe@gmail.com',
      password: await hash('nyilynnhtwe'),
      gender: 'MALE',
      role: 'ADMIN',
      Location: {
        create: {
          city: 'Myinmu',
          country: {
            connect: {
              id: 152,
            },
          },
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
