import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'admin@gmail.com' }
        });
        console.log('Admin user found:', user);
    } catch (error) {
        console.error('Error finding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
