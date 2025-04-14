'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	ChartOptions,
	ScriptableContext,
	ChartData,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

import { fetchTransactions } from '@/utils/fetch';
import { Transaction, TransactionResponse } from '@/types';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	zoomPlugin,
);

export const UserActivityLineChart: React.FC = () => {
	const chartRef = useRef(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getTransactionData = async () => {
			try {
				setIsLoading(true);
				const response: TransactionResponse = await fetchTransactions();

				if (response.transactions && response.transactions.length > 0) {
					setTransactions(response.transactions);
				}
			} catch (err) {
				console.error('Failed to fetch transaction data:', err);
				setError('Failed to load transaction data');
			} finally {
				setIsLoading(false);
			}
		};

		getTransactionData();
	}, []);

	const activityCounts = transactions.reduce(
		(acc, transaction) => {
			const date = new Date(transaction.timestamp);
			const yearMonth = format(date, 'yyyy-MM');

			acc[yearMonth] = (acc[yearMonth] || 0) + 1;

			return acc;
		},
		{} as Record<string, number>,
	);

	// Count unique users per month
	const userCounts = transactions.reduce(
		(acc, transaction) => {
			const date = new Date(transaction.timestamp);
			const yearMonth = format(date, 'yyyy-MM');

			// Track unique addresses for each month
			if (!acc.uniqueUsers[yearMonth]) {
				acc.uniqueUsers[yearMonth] = new Set();
			}

			acc.uniqueUsers[yearMonth].add(transaction.fromTonEthereumAddress);
			if (transaction.toTonEthereumAddress) {
				acc.uniqueUsers[yearMonth].add(transaction.toTonEthereumAddress);
			}

			// Set the count
			acc.counts[yearMonth] = acc.uniqueUsers[yearMonth].size;

			return acc;
		},
		{
			uniqueUsers: {} as Record<string, Set<string>>,
			counts: {} as Record<string, number>,
		},
	).counts;

	const labels = Object.keys(activityCounts)
		.sort()
		.map((yearMonth) => format(new Date(yearMonth + '-01'), 'MMM yyyy'));

	const data: ChartData<'line'> = {
		labels,
		datasets: [
			{
				label: 'Number of Activities',
				data: labels.map((label) => {
					const yearMonth = format(new Date(label), 'yyyy-MM');
					return activityCounts[yearMonth] || 0;
				}),
				borderColor: '#36A2EB',
				backgroundColor: (context: ScriptableContext<'line'>) => {
					const chart = context.chart;
					const { ctx, chartArea } = chart;

					if (!chartArea) {
						return undefined;
					}

					const gradient = ctx.createLinearGradient(
						0,
						chartArea.top,
						0,
						chartArea.bottom,
					);

					gradient.addColorStop(0, 'rgba(54, 162, 235, 0.4)');
					gradient.addColorStop(1, 'rgba(54, 162, 235, 0)');

					return gradient;
				},
				tension: 0.4,
				fill: true,
			},
			{
				label: 'Number of Users',
				data: labels.map((label) => {
					const yearMonth = format(new Date(label), 'yyyy-MM');
					return userCounts[yearMonth] || 0;
				}),
				borderColor: '#FF6384',
				backgroundColor: '#FF6384',
				tension: 0.1,
				fill: false,
			},
		],
	};

	const options: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'User Activities and User Counts Over Months',
			},
			tooltip: {
				callbacks: {
					label: (tooltipItem) => {
						const datasetLabel = tooltipItem.dataset.label || '';
						const currentValue = tooltipItem.raw as number;
						let percentageChange = '';

						if (tooltipItem.datasetIndex === 0) {
							// Activity dataset
							const previousValue =
								tooltipItem.dataIndex > 0
									? (data.datasets[0].data[tooltipItem.dataIndex - 1] as number)
									: 0;

							percentageChange = previousValue
								? ` (${(
										((currentValue - previousValue) / previousValue) *
										100
									).toFixed(2)}%)`
								: '';
						}

						return `${datasetLabel}: ${currentValue}${percentageChange}`;
					},
				},
			},
			zoom: {
				zoom: {
					wheel: {
						enabled: true,
					},
					pinch: {
						enabled: true,
					},
					mode: 'xy',
				},
				pan: {
					enabled: true,
					mode: 'xy',
				},
				limits: {
					y: { min: 0 },
				},
			},
		},
		scales: {
			x: {
				type: 'category',
				title: {
					display: true,
					text: 'Month',
				},
			},
			y: {
				title: {
					display: true,
					text: 'Count',
				},
				beginAtZero: true,
				ticks: {
					stepSize: 1,
					callback: (value) => value as string,
				},
			},
		},
	};

	const handleResetZoom = () => {
		if (chartRef && chartRef.current) {
			// @ts-ignore - Chart.js zoom plugin types are not fully available
			chartRef.current.resetZoom();
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-[350px] w-full items-center justify-center">
				<p className="text-xl">Loading chart data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-[350px] w-full items-center justify-center">
				<p className="text-xl text-red-500">{error}</p>
			</div>
		);
	}

	if (transactions.length === 0) {
		return (
			<div className="flex h-[350px] w-full items-center justify-center">
				<p className="text-xl">No transaction data available</p>
			</div>
		);
	}

	return (
		<div className="h-[350px] w-full">
			<div className="mb-2 flex justify-end">
				<button
					onClick={handleResetZoom}
					className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
				>
					Reset Zoom
				</button>
			</div>
			<div className="relative h-full">
				<Line ref={chartRef} data={data} options={options} />
			</div>
		</div>
	);
};
