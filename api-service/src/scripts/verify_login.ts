import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verifyLogin() {
    const email = 'admin@gmail.com';
    const password = 'admin@123';

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log('User not found!');
            return;
        }

        console.log('User found:', user.email);

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('LOGIN SUCCESS: Password matches!');
        } else {
            console.log('LOGIN FAILED: Password does not match.');
            console.log('Hash in DB:', user.password);
        }

    } catch (error) {
        console.error('Error verifying login:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyLogin();
