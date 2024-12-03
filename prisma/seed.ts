import { PrismaClient } from '@prisma/client'
import {hash} from "bcryptjs";
const prisma = new PrismaClient()

async function main() {
    const adminPassword = await hash("admin123", 10);
    const userPassword = await hash("user123", 10);
    await prisma.user.createMany({
        data: [
            {
                name: "admin",
                email: "admin@gmail.com",
                password: adminPassword,
                role: "ADMIN"
            },
            {
                name: "user",
                email: "user@gmail.com",
                password: userPassword,
                role: "USER"
            }
        ]
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
