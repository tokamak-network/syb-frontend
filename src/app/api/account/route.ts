import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
	try {
		// Get query parameters using Next.js searchParams helper
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (id) {
			// Fetch a specific user by ID
			const user = await prisma.user.findUnique({
				where: { id },
				select: {
					id: true,
					email: true,
					name: true,
					image: true,
				},
			});

			if (!user) {
				return NextResponse.json(
					{ error: 'User not found' },
					{ status: HttpStatusCode.NotFound },
				);
			}

			return NextResponse.json(user, { status: HttpStatusCode.Ok });
		} else {
			// Fetch all users
			const users = await prisma.user.findMany();

			return NextResponse.json(users, { status: 200 });
		}
	} catch (error) {
		console.error('Error fetching user(s):', error);

		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: HttpStatusCode.InternalServerError },
		);
	}
}
