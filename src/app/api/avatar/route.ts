import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import prisma from '@/lib/prisma';

// GET /api/avatar?address=0x...
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const address = searchParams.get('address');

		if (!address) {
			return NextResponse.json(
				{ error: 'Address parameter is required' },
				{ status: HttpStatusCode.BadRequest },
			);
		}

		const avatar = await prisma.avatar.findUnique({
			where: { address: address.toLowerCase() },
		});

		return NextResponse.json({ avatar });
	} catch (error) {
		console.error('Error fetching avatar:', error);

		return NextResponse.json(
			{ error: 'Failed to fetch avatar' },
			{ status: HttpStatusCode.InternalServerError },
		);
	}
}

// POST /api/avatar - Upload avatar
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { address, imageUrl } = body;

		if (!address || !imageUrl) {
			return NextResponse.json(
				{ error: 'Address and imageUrl are required' },
				{ status: HttpStatusCode.BadRequest },
			);
		}

		// Upsert avatar (create or update)
		const avatar = await prisma.avatar.upsert({
			where: { address: address.toLowerCase() },
			update: { imageUrl },
			create: {
				address: address.toLowerCase(),
				imageUrl,
			},
		});

		return NextResponse.json(
			{ message: 'Avatar saved successfully', avatar },
			{ status: HttpStatusCode.Ok },
		);
	} catch (error) {
		console.error('Error saving avatar:', error);

		return NextResponse.json(
			{ error: 'Failed to save avatar' },
			{ status: HttpStatusCode.InternalServerError },
		);
	}
}

// DELETE /api/avatar?address=0x...
export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const address = searchParams.get('address');

		if (!address) {
			return NextResponse.json(
				{ error: 'Address parameter is required' },
				{ status: HttpStatusCode.BadRequest },
			);
		}

		await prisma.avatar.delete({
			where: { address: address.toLowerCase() },
		});

		return NextResponse.json(
			{ message: 'Avatar deleted successfully' },
			{ status: HttpStatusCode.Ok },
		);
	} catch (error) {
		console.error('Error deleting avatar:', error);

		return NextResponse.json(
			{ error: 'Failed to delete avatar' },
			{ status: HttpStatusCode.InternalServerError },
		);
	}
}
