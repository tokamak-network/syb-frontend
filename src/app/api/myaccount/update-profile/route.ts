import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';
import bcrypt from 'bcrypt';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { newUsername, currentPassword, newPassword } = body;

		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: HttpStatusCode.Unauthorized },
			);
		}

		const userId = session.user.id;

		console.log(newUsername, session.user.id, 'newUsername');

		if (newUsername) {
			await prisma.user.update({
				where: { id: userId },
				data: { name: newUsername },
			});
		}

		if (currentPassword && newPassword) {
			const user = await prisma.user.findUnique({ where: { id: userId } });

			const isPasswordValid = await bcrypt.compare(
				currentPassword,
				user?.password as string,
			);

			if (!isPasswordValid) {
				return NextResponse.json(
					{ error: 'Current password is incorrect' },
					{ status: HttpStatusCode.BadRequest },
				);
			}

			const hashedPassword = await bcrypt.hash(newPassword, 10);

			await prisma.user.update({
				where: { id: userId },
				data: { password: hashedPassword },
			});
		}

		return NextResponse.json(
			{ message: 'Profile updated successfully' },
			{ status: HttpStatusCode.Ok },
		);
	} catch (error) {
		console.error('Error updating profile:', error);

		return NextResponse.json(
			{ error: 'Failed to update profile' },
			{ status: HttpStatusCode.InternalServerError },
		);
	}
}
