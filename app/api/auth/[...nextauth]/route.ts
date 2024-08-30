import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import {z} from "zod"
import { prisma } from "@/lib/prisma"

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string(),
})

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
],
 callbacks: {
  async signIn(params) {
    try{
      await prisma.user.create({ 
        data: {
          email: params.user.email ?? '',
          name: params.user.name,
          image: params.user.image,
          provider: "GOOGLE"
        }
      })  
    } catch (error) {
      console.log(error)
    }
    return true
  }
 }
})

export { handler as GET, handler as POST }