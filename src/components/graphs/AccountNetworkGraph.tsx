'use client';

import React, { useCallback, useMemo } from 'react';
import {
	ReactFlow,
	Node,
	Edge,
	addEdge,
	Connection,
	useNodesState,
	useEdgesState,
	Controls,
	Background,
	BackgroundVariant,
	MiniMap,
	ReactFlowProvider,
	MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Account } from '@/types';
import { useVouchGraph } from '@/hooks/useVouchGraph';

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

// Helper function to shorten Ethereum addresses
const shortenAddress = (addr: string) =>
	`${addr.slice(0, 6)}...${addr.slice(-4)}`;

// Helper function to get node color based on account properties
const getNodeColor = (account: Account, isCenter: boolean) => {
	if (isCenter) {
		return {
			bg: '#3b82f6',
			border: '#1d4ed8',
			text: '#ffffff',
		};
	}

	// Color based on account activity or properties
	if (account.user_op_hash) {
		return {
			bg: '#10b981',
			border: '#059669',
			text: '#ffffff',
		};
	}

	return {
		bg: '#6b7280',
		border: '#4b5563',
		text: '#ffffff',
	};
};

const AccountNetworkGraph: React.FC<AccountNetworkGraphProps> = ({
	mode,
	accounts,
	centerAddress,
	maxDepth = 3,
	fromBlock,
	height = 500,
	className = '',
	showLegend = true,
}) => {
	// Fetch vouch data from blockchain
	const { data: vouchData, isLoading: isLoadingVouches } = useVouchGraph({
		fromBlock,
	});

	// Create nodes from accounts and vouch data
	const initialNodes: Node[] = useMemo(() => {
		const centerX = 300;
		const centerY = 250;
		const radius = 180;

		// Get all unique addresses from both accounts and vouch data
		const allAddresses = new Set<string>();
		const accountMap = new Map<string, any>();

		// Add account addresses
		if (accounts && accounts.length > 0) {
			accounts.forEach((account) => {
				if (account && account.eth_addr) {
					const addr = account.eth_addr.toLowerCase();
					allAddresses.add(addr);
					accountMap.set(addr, account);
				}
			});
		}

		// Add addresses from vouch data that might not be in accounts
		if (vouchData?.edges) {
			vouchData.edges.forEach((edge) => {
				if (edge) {
					if (edge.from) allAddresses.add(edge.from.toLowerCase());
					if (edge.to) allAddresses.add(edge.to.toLowerCase());
				}
			});
		}

		const addressArray = Array.from(allAddresses);
		console.log('All unique addresses for nodes:', addressArray);

		return addressArray.map((address, index) => {
			const account = accountMap.get(address);
			const isCenter = centerAddress?.toLowerCase() === address;
			const isFromAccounts = !!account;

			// Use different colors for accounts vs vouch-only addresses
			const colors = account
				? getNodeColor(account, isCenter)
				: {
						bg: '#6366f1', // Indigo for vouch-only addresses
						border: '#4338ca',
						text: '#ffffff',
					};

			// Better positioning algorithm
			let position;
			if (isCenter) {
				position = { x: centerX, y: centerY };
			} else if (addressArray.length <= 8) {
				// Small networks: simple circle
				const angle = (2 * Math.PI * index) / addressArray.length;
				position = {
					x: centerX + radius * Math.cos(angle),
					y: centerY + radius * Math.sin(angle),
				};
			} else {
				// Larger networks: multiple rings
				const ring = Math.floor(index / 8);
				const posInRing = index % 8;
				const ringRadius = radius + ring * 120;
				const angle =
					(2 * Math.PI * posInRing) /
					Math.min(8, addressArray.length - ring * 8);
				position = {
					x: centerX + ringRadius * Math.cos(angle),
					y: centerY + ringRadius * Math.sin(angle),
				};
			}

			return {
				id: address,
				type: 'default',
				position,
				data: {
					label: shortenAddress(address),
					account: account,
					isFromAccounts,
				},
				style: {
					backgroundColor: colors.bg,
					color: colors.text,
					border: `3px solid ${colors.border}`,
					borderRadius: '12px',
					width: isCenter ? 140 : 120,
					height: isCenter ? 70 : 60,
					fontSize: isCenter ? '13px' : '11px',
					fontWeight: isCenter ? 'bold' : '600',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
					transition: 'all 0.2s ease',
					// Add opacity for vouch-only addresses
					opacity: isFromAccounts ? 1 : 0.8,
				},
				className: 'hover:shadow-xl hover:scale-105',
			};
		});
	}, [accounts, centerAddress, vouchData]);

	// Create edges from vouch data
	const initialEdges: Edge[] = useMemo(() => {
		if (!vouchData?.edges || !accounts) {
			console.log('No vouch data or accounts available');
			return [];
		}

		console.log('=== Edge Processing Debug ===');
		console.log(
			'Raw vouch data edges:',
			vouchData.edges.length,
			vouchData.edges,
		);
		console.log(
			'Available accounts:',
			accounts.length,
			accounts.map((acc) => acc.eth_addr),
		);

		const accountAddresses = new Set(
			accounts.map((acc) => acc.eth_addr.toLowerCase()),
		);

		console.log('Account addresses set:', Array.from(accountAddresses));

		// Process all edges and show detailed debugging
		const processedEdges: Edge[] = vouchData.edges
			.map((edge, index) => {
				if (!edge) {
					console.log('Null edge at index:', index);
					return null;
				}

				console.log(`Processing edge ${index}:`, edge);

				// Handle different possible edge formats
				let fromAddr = '';
				let toAddr = '';

				if (edge.from && edge.to) {
					fromAddr = edge.from.toLowerCase();
					toAddr = edge.to.toLowerCase();
				} else {
					console.log('Unknown edge format:', edge);
					return null;
				}

				const fromExists = accountAddresses.has(fromAddr);
				const toExists = accountAddresses.has(toAddr);

				console.log(`Edge ${fromAddr} -> ${toAddr}:`);
				console.log(`  From exists: ${fromExists}`);
				console.log(`  To exists: ${toExists}`);

				// Create edges regardless of address matching for debugging
				const edgeObj: Edge = {
					id: `vouch-${fromAddr}-${toAddr}-${index}`,
					source: fromAddr,
					target: toAddr,
					type: 'default',
					animated: false,
					style: {
						strokeWidth: 3,
						// Use different colors based on whether addresses match
						stroke: fromExists && toExists ? '#8b5cf6' : '#ef4444',
						strokeOpacity: 0.8,
					},
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: 20,
						height: 20,
						color: fromExists && toExists ? '#8b5cf6' : '#ef4444',
					},
					data: {
						fromExists,
						toExists,
						originalEdge: edge,
					},
				};

				console.log('Created edge object:', edgeObj);
				return edgeObj;
			})
			.filter((edge): edge is Edge => edge !== null);

		console.log(
			'Final processed edges:',
			processedEdges.length,
			processedEdges,
		);
		return processedEdges;
	}, [vouchData, accounts]);

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	// Update edges when initialEdges changes
	React.useEffect(() => {
		console.log('Updating edges state with initialEdges:', initialEdges.length);
		setEdges(initialEdges);
	}, [initialEdges, setEdges]);

	// Update nodes when initialNodes changes
	React.useEffect(() => {
		console.log('Updating nodes state with initialNodes:', initialNodes.length);
		setNodes(initialNodes);
	}, [initialNodes, setNodes]);

	// Debug the final state
	console.log('=== Final State Debug ===');
	console.log('Initial edges count:', initialEdges.length);
	console.log('Final nodes count:', nodes.length);
	console.log('Final edges count:', edges.length);
	console.log('Final edges:', edges);

	const onConnect = useCallback(
		(params: Connection) => {
			const newEdge: Edge = {
				...params,
				id: `${params.source}-${params.target}-${Date.now()}`,
				type: 'smoothstep',
				animated: true,
				style: {
					strokeWidth: 2,
					stroke: '#6b7280',
				},
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color: '#6b7280',
				},
				className: 'stroke-2 stroke-gray-400',
			};
			setEdges((eds) => addEdge(newEdge, eds));
		},
		[setEdges],
	);

	if (isLoadingVouches) {
		return (
			<div
				className={`flex items-center justify-center ${className}`}
				style={{ height }}
			>
				<div className="text-center">
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-purple-500"></div>
					<p className="mt-4 text-slate-400">Loading vouch network...</p>
				</div>
			</div>
		);
	}

	if (!accounts || accounts.length === 0) {
		return (
			<div
				className={`flex items-center justify-center ${className}`}
				style={{ height }}
			>
				<div className="text-center text-slate-400">
					<p>No accounts available to display</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`relative w-full ${className}`} style={{ height }}>
			<ReactFlowProvider>
				{showLegend && (
					<div className="bg-tableBackground/95 absolute left-4 top-4 z-50 rounded-lg border border-tableBorder p-3 text-xs text-tableTextSecondary shadow-lg backdrop-blur-sm">
						<div className="mb-2 font-semibold text-tableTextPrimary">
							Vouch Network
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded bg-blue-500"></div>
								<span>Center Account</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded bg-emerald-500"></div>
								<span>Active Account</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded bg-gray-500"></div>
								<span>Other Account</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="h-0.5 w-4 bg-purple-400"></div>
								<span>Vouch Connection</span>
							</div>
							<div className="mt-2 border-t border-tableBorder pt-2 text-xs">
								<div className="text-purple-400">
									{nodes.length} accounts, {edges.length} vouches
								</div>
							</div>
						</div>
					</div>
				)}

				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					fitView
					fitViewOptions={{
						padding: 0.2,
						includeHiddenNodes: false,
						minZoom: 0.5,
						maxZoom: 1.5,
					}}
					nodesDraggable={true}
					nodesConnectable={false}
					elementsSelectable={true}
					minZoom={0.2}
					maxZoom={3}
					defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
					style={{
						backgroundColor: 'var(--table-background)',
						width: '100%',
						height: '100%',
					}}
				>
					<Background
						variant={BackgroundVariant.Dots}
						gap={24}
						size={2}
						color="var(--table-border)"
						style={{ opacity: 0.3 }}
					/>
					<Controls className="rounded-lg border border-tableBorder bg-tableBackground shadow-lg" />
					<MiniMap
						className="rounded-lg border border-tableBorder bg-tableBackground shadow-lg"
						maskColor="var(--table-background)"
						nodeColor={(node) => {
							if (node.style?.backgroundColor) {
								return node.style.backgroundColor as string;
							}
							return 'var(--table-text-secondary)';
						}}
						style={{
							backgroundColor: 'var(--table-background)',
						}}
					/>
				</ReactFlow>
			</ReactFlowProvider>
		</div>
	);
};

export { AccountNetworkGraph };
export default AccountNetworkGraph;
