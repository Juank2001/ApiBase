const { PrismaClient } = require("@prisma/client")
const Prisma = new PrismaClient()

Prisma.$connect().then(() => {
    console.log("Cliente prisma conectado")
})

exports.module = Prisma