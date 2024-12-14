import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { HttpStatusCode } from 'axios';

import prisma from '@/lib/prisma';

export async function POST(req: Request) {
	const body = await req.json();
	const { email, password } = body;

	if (!email || !password) {
		return NextResponse.json(
			{ message: 'Email and password are required' },
			{ status: HttpStatusCode.MethodNotAllowed },
		);
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		return NextResponse.json(
			{ message: 'User already exists' },
			{ status: HttpStatusCode.BadRequest },
		);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
		},
	});

	return NextResponse.json(
		{ message: 'User registered successfully', user },
		{ status: HttpStatusCode.Created },
	);
}
