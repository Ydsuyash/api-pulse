import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const seedAdmin = async () => {
    const email = 'admin@gmail.com';
    const password = 'admin@123';
    const name = 'Admin';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            console.log('Admin user exists. Updating password...');
            await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    name: existingUser.name === 'Admin User' ? name : existingUser.name // Update name if it's the old default
                }
            });
            console.log('Admin user updated.');
        } else {
            console.log('Creating admin user...');
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                }
            });
            console.log('Admin user created.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seedAdmin();
