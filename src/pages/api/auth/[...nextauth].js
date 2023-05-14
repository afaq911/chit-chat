import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import Users from "../../../models/Users";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token._id = user._id;
      return token;
    },
    async session({ session, token }) {
      if (session?._id) session.user._id = token._id;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const data = await Users.findOne({ email: credentials.email });
        await db.disconnect();

        if (!data) {
          throw new Error("No user found");
        }

        const isCompared = await bcrypt.compare(
          credentials.password,
          data.password
        );

        if (!isCompared) {
          throw new Error("Wrong Password");
        } else {
          const newData = {
            _id: data._id,
            name: data.username,
            email: data.email,
            image: data.profilepic,
            createdAt: data.createdAt,
          };
          console.log(newData);
          return newData;
        }
      },
    }),
  ],
});
