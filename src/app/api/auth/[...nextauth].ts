import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST!,
				port: process.env.EMAIL_SERVER_PORT!,
				auth: {
					user: process.env.EMAIL_SERVER_USER!,
					pass: process.env.EMAIL_SERVER_PASSWORD!,
				},
			},
			from: process.env.EMAIL_FROM!,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
