import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(req: Request) {
	try {
		// Parse the query parameters from the request URL
		const { searchParams } = new URL(req.url);
		const id = searchParams.get('id');

		if (id) {
			// Fetch a specific user by ID
			const user = await prisma.user.findUnique({
				where: { id },
			});

			if (!user) {
				return NextResponse.json({ error: 'User not found' }, { status: 404 });
			}

			return NextResponse.json(user, { status: 200 });
		} else {
			// Fetch all users
			const users = await prisma.user.findMany();

			return NextResponse.json(users, { status: 200 });
		}
	} catch (error) {
		console.error('Error fetching user(s):', error);

		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
