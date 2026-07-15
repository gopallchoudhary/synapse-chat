import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";



export async function onBoardUser() {
    const clerkUser = await currentUser()
    if (!clerkUser) {
        throw new Error("Clerk user not found")
    }

    const email = clerkUser.emailAddresses[0].emailAddress ?? null

    return await prisma.user.upsert({
        where: {
            clerkId: clerkUser.id
        },
        create: {
            email,
            clerkId: clerkUser.id,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl
        },
        update: {
            email,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl
        }
    })
}
