import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"


export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  callbacks: {
  async jwt({ token, account }) {
    if (account?.access_token) {
      token.accessToken = account.access_token
    }

    if (account?.refresh_token) {
      token.refreshToken = account.refresh_token
    }

    return token
  },

  async session({ session, token }) {
    if (token.accessToken) {
      session.accessToken = token.accessToken as string
    }

    return session
  },
},

  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }