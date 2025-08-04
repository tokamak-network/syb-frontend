import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';

import { pinata } from '@/config';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const uuid = crypto.randomUUID();
		const keyData = await pinata.keys.create({
			keyName: uuid.toString(),
			permissions: {
				endpoints: {
					pinning: {
						pinFileToIPFS: true,
					},
				},
			},
			maxUses: 1,
		});

		return NextResponse.json(keyData, { status: HttpStatusCode.Ok });
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ text: 'Error creating API Key:' },
			{ status: HttpStatusCode.InternalServerError },
		);
	}
}

export async function POST(req: Request) {
	try {
		// Parse the request body
		const body = await req.json();
		const { userId, imageUrl } = body;

		if (!userId || !imageUrl) {
			return NextResponse.json(
				{ error: 'User ID and Image URL are required' },
				{ status: HttpStatusCode.BadRequest },
			);
		}

		// Validate the session to ensure the user is authenticated
		const session: Session | null = await getServerSession(authOptions);

		// if (!session || session.id !== userId) {
		// 	return NextResponse.json(
		// 		{ error: 'Unauthorized' },
		// 		{ status: HttpStatusCode.Unauthorized },
		// 	);
		// }

		// Update the user's profile image in the database
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: { image: imageUrl },
		});

		return NextResponse.json(
			{ message: 'Profile image updated successfully', user: updatedUser },
			{ status: HttpStatusCode.Ok },
		);
	} catch (error) {
		console.error('Error updating profile image:', error);

		return NextResponse.json(
			{ error: 'Failed to update profile image' },
			{ status: HttpStatusCode.InternalServerError },
		);
	}
}
