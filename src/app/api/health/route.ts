import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

		// Test backend connectivity
		const response = await fetch(`${apiHost}/api/v1/accounts`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return NextResponse.json({
			status: 'ok',
			backend_url: apiHost,
			backend_status: response.status,
			backend_reachable: response.ok,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return NextResponse.json(
			{
				status: 'error',
				backend_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
				backend_reachable: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
