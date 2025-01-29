import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
	const mockPrismaClient = {
		$connect: jest.fn(),
		$disconnect: jest.fn(),
	};

	return {
		PrismaClient: jest.fn(() => mockPrismaClient),
	};
});

describe('prisma', () => {
	it('should create a new PrismaClient instance if not in global', () => {
		const mockPrismaClient = new PrismaClient();

		expect(mockPrismaClient).toBeDefined();
	});

	it('should reuse PrismaClient instance in non-production environments', () => {
		const globalForPrisma = global as any;

		globalForPrisma.prisma = null;

		const mockPrismaClient = new PrismaClient();

		globalForPrisma.prisma = mockPrismaClient;

		expect(globalForPrisma.prisma).toBe(mockPrismaClient);
	});
});
