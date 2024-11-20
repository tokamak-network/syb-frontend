import { User } from '@/types';

export const users: User[] = [
	{
		address: '0xBC48B3C191D1296f7749fC0bc931Fb2bD29a8D16',
		balance: 2.5,
		vouchesReceived: [
			{ address: '0xF48242C4C352C778e98Cfc365752e9229C9eF737', amount: 1.0 },
			{ address: '0xUser3', amount: 1.5 },
			{ address: '0xUser6', amount: 0.1 },
			{ address: '0xUser10', amount: 1.2 },
		],
		score: 85,
	},
	{
		address: '0xF48242C4C352C778e98Cfc365752e9229C9eF737',
		balance: 3.0,
		vouchesReceived: [
			{ address: '0xUser1', amount: 1.0 },
			{ address: '0xUser4', amount: 1.2 },
			{ address: '0xUser7', amount: 0.3 },
		],
		score: 78,
	},
	{
		address: '0xUser3',
		balance: 1.0,
		vouchesReceived: [
			{ address: '0xUser5', amount: 0.5 },
			{ address: '0xUser6', amount: 0.8 },
			{ address: '0xUser9', amount: 0.2 },
			{ address: '0xUser11', amount: 0.4 },
			{ address: '0xUser14', amount: 0.5 },
		],
		score: 90,
	},
	{
		address: '0xUser4',
		balance: 4.0,
		vouchesReceived: [
			{ address: '0xF48242C4C352C778e98Cfc365752e9229C9eF737', amount: 1.3 },
			{ address: '0xUser7', amount: 1.1 },
		],
		score: 72,
	},
	{
		address: '0xUser5',
		balance: 5.5,
		vouchesReceived: [
			{ address: '0xUser6', amount: 2.0 },
			{ address: '0xUser8', amount: 1.5 },
		],
		score: 88,
	},
	{
		address: '0xUser6',
		balance: 2.0,
		vouchesReceived: [
			{ address: '0xUser3', amount: 0.8 },
			{ address: '0xUser9', amount: 1.0 },
		],
		score: 80,
	},
	{
		address: '0xUser7',
		balance: 3.5,
		vouchesReceived: [
			{ address: '0xUser10', amount: 1.5 },
			{ address: '0xUser11', amount: 1.2 },
		],
		score: 76,
	},
	{
		address: '0xUser8',
		balance: 4.5,
		vouchesReceived: [
			{ address: '0xUser5', amount: 1.5 },
			{ address: '0xUser12', amount: 1.7 },
		],
		score: 95,
	},
	{
		address: '0xUser9',
		balance: 3.0,
		vouchesReceived: [
			{ address: '0xUser6', amount: 1.0 },
			{ address: '0xUser13', amount: 0.5 },
		],
		score: 65,
	},
	{
		address: '0xUser10',
		balance: 2.5,
		vouchesReceived: [
			{ address: '0xUser14', amount: 1.0 },
			{ address: '0xUser15', amount: 1.2 },
		],
		score: 82,
	},
	{
		address: '0xUser11',
		balance: 1.5,
		vouchesReceived: [
			{ address: '0xUser16', amount: 0.7 },
			{ address: '0xUser17', amount: 1.0 },
		],
		score: 74,
	},
	{
		address: '0xUser12',
		balance: 6.0,
		vouchesReceived: [
			{ address: '0xUser8', amount: 1.7 },
			{ address: '0xUser18', amount: 1.3 },
		],
		score: 91,
	},
	{
		address: '0xUser13',
		balance: 4.0,
		vouchesReceived: [
			{ address: '0xUser19', amount: 1.1 },
			{ address: '0xUser9', amount: 0.5 },
		],
		score: 68,
	},
	{
		address: '0xUser14',
		balance: 3.0,
		vouchesReceived: [
			{ address: '0xUser10', amount: 1.0 },
			{ address: '0xUser20', amount: 1.5 },
		],
		score: 77,
	},
	{
		address: '0xUser15',
		balance: 5.0,
		vouchesReceived: [
			{ address: '0xUser11', amount: 1.2 },
			{ address: '0xUser1', amount: 1.0 },
		],
		score: 83,
	},
	{
		address: '0xUser16',
		balance: 2.0,
		vouchesReceived: [
			{ address: '0xUser11', amount: 0.7 },
			{ address: '0xUser3', amount: 0.8 },
		],
		score: 69,
	},
	{
		address: '0xUser17',
		balance: 4.5,
		vouchesReceived: [
			{ address: '0xUser18', amount: 1.5 },
			{ address: '0xF48242C4C352C778e98Cfc365752e9229C9eF737', amount: 1.0 },
		],
		score: 86,
	},
	{
		address: '0xUser18',
		balance: 3.5,
		vouchesReceived: [
			{ address: '0xUser19', amount: 1.1 },
			{ address: '0xUser12', amount: 1.3 },
		],
		score: 79,
	},
	{
		address: '0xUser19',
		balance: 4.0,
		vouchesReceived: [
			{ address: '0xUser13', amount: 1.1 },
			{ address: '0xUser17', amount: 1.0 },
		],
		score: 64,
	},
	{
		address: '0xUser20',
		balance: 2.5,
		vouchesReceived: [
			{ address: '0xUser14', amount: 1.5 },
			{ address: '0xUser6', amount: 0.8 },
		],
		score: 81,
	},
];
