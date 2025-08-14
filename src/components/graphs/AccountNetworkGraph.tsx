'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import {
	ReactFlow,
	Background,
	Controls,
	MarkerType,
	ReactFlowProvider,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { Account } from '@/types';
import { useVouchGraph, VouchEdge } from '@/hooks/useVouchGraph';

type Mode = 'global' | 'ego';

interface AccountNetworkGraphProps {
	mode: Mode;
	accounts: Account[];
	centerAddress?: string;
	maxDepth?: number;
	fromBlock?: bigint;
	height?: number;
	className?: string;
	showLegend?: boolean;
}

const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

interface PositionedNode {
	id: string;
	x: number;
	y: number;
}

const buildUndirectedAdjacency = (
	edges: VouchEdge[],
): Map<string, Set<string>> => {
	const map = new Map<string, Set<string>>();
	const add = (a: string, b: string) => {
		if (!map.has(a)) map.set(a, new Set());
		map.get(a)!.add(b);
	};
	for (const e of edges) {
		add(e.from, e.to);
		add(e.to, e.from);
	}
	return map;
};

const polarLayout = (
	ids: string[],
	cx: number,
	cy: number,
	radius: number,
): PositionedNode[] => {
	const n = Math.max(ids.length, 1);
	return ids.map((id, i) => {
		const angle = (2 * Math.PI * i) / n;
		return {
			id,
			x: cx + radius * Math.cos(angle),
			y: cy + radius * Math.sin(angle),
		};
	});
};

const egoConcentricLayout = (
	center: string,
	edges: VouchEdge[],
	container: { width: number; height: number },
	maxDepth: number,
) => {
	const cx = container.width / 2;
	const cy = container.height / 2;
	const baseRadius = Math.min(container.width, container.height) / 8;

	const adj = buildUndirectedAdjacency(edges);
	const layers: string[][] = Array.from({ length: maxDepth + 1 }, () => []);
	const visited = new Set<string>();
	const queue: Array<{ id: string; depth: number }> = [
		{ id: center, depth: 0 },
	];
	visited.add(center);

	while (queue.length) {
		const { id, depth } = queue.shift()!;
		layers[depth].push(id);
		if (depth === maxDepth) continue;
		const neighbors = adj.get(id) || new Set();
		for (const nb of neighbors) {
			if (!visited.has(nb)) {
				visited.add(nb);
				queue.push({ id: nb, depth: depth + 1 });
			}
		}
	}

	const positions: Record<string, { x: number; y: number }> = {};
	// Center node
	positions[center] = { x: cx, y: cy };
	for (let d = 1; d <= maxDepth; d++) {
		const radius = baseRadius * d + 30;
		const placed = polarLayout(layers[d], cx, cy, radius);
		for (const p of placed) positions[p.id] = { x: p.x, y: p.y };
	}

	return positions;
};

const globalCircleLayout = (
	ids: string[],
	container: { width: number; height: number },
) => {
	const cx = container.width / 2;
	const cy = container.height / 2;
	const radius = Math.min(container.width, container.height) / 2.8;
	const placed = polarLayout(ids, cx, cy, radius);
	const positions: Record<string, { x: number; y: number }> = {};
	for (const p of placed) positions[p.id] = { x: p.x, y: p.y };
	return positions;
};

export const AccountNetworkGraph: React.FC<AccountNetworkGraphProps> = ({
	mode,
	accounts,
	centerAddress,
	maxDepth = 3,
	fromBlock,
	height = 500,
	className = '',
	showLegend = true,
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [{ width, height: innerHeight }, setSize] = React.useState({
		width: 800,
		height: 600,
	});

	useEffect(() => {
		const update = () => {
			const rect = containerRef.current?.getBoundingClientRect();
			if (rect) setSize({ width: rect.width, height: rect.height });
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const { data } = useVouchGraph({ fromBlock });
	const edgesData = data?.edges || [];

	const addressToAccount = useMemo(() => {
		const map = new Map<string, Account>();
		for (const acc of accounts) map.set(acc.eth_addr.toLowerCase(), acc);
		return map;
	}, [accounts]);

	const nodeIds = useMemo(() => {
		// Include all accounts that appear either in accounts list or edges
		const set = new Set<string>();
		for (const acc of accounts) set.add(acc.eth_addr.toLowerCase());
		for (const e of edgesData) {
			set.add(e.from.toLowerCase());
			set.add(e.to.toLowerCase());
		}
		return Array.from(set);
	}, [accounts, edgesData]);

	const positions = useMemo(() => {
		if (mode === 'ego' && centerAddress) {
			const center = centerAddress.toLowerCase();
			return egoConcentricLayout(
				center,
				edgesData,
				{ width, height: innerHeight },
				maxDepth,
			);
		}
		return globalCircleLayout(nodeIds, { width, height: innerHeight });
	}, [mode, centerAddress, edgesData, nodeIds, width, innerHeight, maxDepth]);

	const nodes = useMemo(
		() =>
			nodeIds.map((id) => ({
				id,
				data: { label: shorten(addressToAccount.get(id)?.eth_addr || id) },
				position: positions[id] || { x: 0, y: 0 },
				draggable: false,
				style: {
					width: 60,
					height: 60,
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#334155',
					color: '#fff',
					fontSize: 10,
					border: '1px solid #475569',
				},
			})),
		[nodeIds, positions, addressToAccount],
	);

	const edges = useMemo(
		() =>
			edgesData.map((e, idx) => ({
				id: `e-${idx}-${e.from}-${e.to}`,
				source: e.from.toLowerCase(),
				target: e.to.toLowerCase(),
				type: 'default',
				markerEnd: { type: MarkerType.Arrow },
				style: { stroke: '#64748b', strokeWidth: 1.2 },
			})),
		[edgesData],
	);

	return (
		<ReactFlowProvider>
			<div
				ref={containerRef}
				className={`w-full rounded-lg border border-slate-700/40 bg-slate-800/20 p-2 ${className}`}
				style={{ height }}
			>
				{showLegend && (
					<div className="mb-2 flex items-center gap-3 text-xs text-slate-300">
						<span className="inline-flex items-center gap-1">
							<span className="inline-block h-1 w-5 bg-slate-400" />
							Arrow: voucher ➜ recipient
						</span>
					</div>
				)}
				<ReactFlow
					fitView
					nodes={nodes}
					edges={edges}
					minZoom={0.4}
					maxZoom={2}
				>
					<Controls />
					<Background />
				</ReactFlow>
			</div>
		</ReactFlowProvider>
	);
};

export default AccountNetworkGraph;
