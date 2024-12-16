import type { NextAuthOptions } from 'next-auth';

import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Email and password are required');
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user) {
					throw new Error('No user found with this email');
				}

				const isPasswordValid = await bcrypt.compare(
					credentials!.password,
					user.password,
				);

				if (!isPasswordValid) {
					throw new Error('Invalid password');
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image,
				};
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	debug: true,
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.image = user.image;

				token.accessToken = jwt.sign(
					{ id: user.id, email: user.email },
					process.env.NEXTAUTH_SECRET as string,
					{ expiresIn: '1h' },
				);
			}

			return token;
		},

		async session({ session, token }) {
			session.user.accessToken = token.accessToken as string;

			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
