import NextAuth, { AuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import {z} from "zod"
import { prisma } from "@/lib/prisma"
import { Provider } from '@prisma/client'

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string(),
})


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
    })
  ],
  callbacks: {
    async signIn(params) {
      try {
        const provider = params.account?.provider?.toUpperCase() as Provider;
        await prisma.user.upsert({
          where: { email: params.user.email ?? '' },
          update: {
            name: params.user.name,
            image: params.user.image,
            provider: provider
          },
          create: {
            email: params.user.email ?? '',
            name: params.user.name,
            image: params.user.image,
            provider: provider
          }
        });
      } catch (error) {
        console.log(error)
      }
      return true
    }
   }
}   

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
