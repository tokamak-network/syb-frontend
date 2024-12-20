import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth'; // Ensure this points to your NextAuth configuration
import prisma from '@/lib/prisma'; // Ensure this points to your Prisma client

export async function GET() {
	try {
		// Get the current session
		const session = await getServerSession(authOptions);

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
				image: true, // Include the profile image
			},
		});

		// If the user is not found, return a 404 response
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Return the user data
		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		console.error('Error fetching user data:', error);

		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
