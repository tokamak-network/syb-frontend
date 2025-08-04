import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { HttpStatusCode } from 'axios';
import { Session } from 'next-auth';

import { authOptions } from '@/lib/auth'; // Ensure this points to your NextAuth configuration
import prisma from '@/lib/prisma'; // Ensure this points to your Prisma client

export async function GET() {
	try {
		// Get the current session
		const session: Session | null = await getServerSession(authOptions);

		// If the user is not authenticated, return an unauthorized response
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Fetch the user from the database using Prisma
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				email: true,
				name: true,
				image: true,
			},
		});

		// If the user is not found, return a 404 response
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: HttpStatusCode.NotFound },
			);
		}

		return NextResponse.json(user, { status: HttpStatusCode.Ok });
	} catch (error) {
		return NextResponse.json(
			{ message: error },
			{ status: HttpStatusCode.InternalServerError },
		);
	}
}
