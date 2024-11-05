'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
	Background,
	Controls,
	Node,
	Edge,
	Position,
	useNodesState,
	useEdgesState,
	EdgeTypes,
} from 'reactflow';

import { useWallet } from '@/context/WalletContext';

import 'reactflow/dist/style.css';

import { randomColor } from '@/utils/color';
import { User } from '@/types';

import { NodeContextMenu } from '../contextmenu';

import { FloatingEdge } from './FloatingEdge';
import { FloatingConnectionLine } from './FloatingConnectionLine';

interface UserGraphProps {
	users: User[];
}

export const UserGraph: React.FC<UserGraphProps> = ({ users }) => {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
	const { account } = useWallet();
	const [menu, setMenu] = useState<{
		id: string;
		top: number | null;
		left: number | null;
	} | null>(null);
	const ref = useRef<HTMLDivElement | null>(null);

	const calculateNodePositions = (centerNodeAddress: string) => {
		const centerNode: Node = {
			id: centerNodeAddress,
			data: { label: `${centerNodeAddress}` },
			draggable: true,
			position: { x: 300, y: 300 },
			sourcePosition: Position.Top,
			targetPosition: Position.Bottom,
			style: {
				width: 150,
				height: 150,
				fontSize: 16,
				backgroundColor: '#3498db',
				color: '#fff',
				borderRadius: '50%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center' as const,
			},
		};

		const nodeMap = new Map<string, Node>();

		nodeMap.set(centerNodeAddress, centerNode);

		const edgesList: Edge[] = [];

		const processNode = (
			node: User,
			level: number,
			angleStep: number,
			centerX: number,
			centerY: number,
		) => {
			const maxLevels = 4;

			if (level > maxLevels) return;

			const radius = 100 + 100 * level;
			const alpha = 1 - level * 0.3;

			node.vouchesReceived.forEach((vouch, index) => {
				if (!nodeMap.has(vouch.address)) {
					const angle = angleStep * index * 2;
					let x = centerX + radius * Math.cos(angle);
					let y = centerY + radius * Math.sin(angle);

					// Collision detection and resolution
					for (const otherNode of nodeMap.values()) {
						if (otherNode.id !== node.address) {
							const distance = Math.sqrt(
								Math.pow(x - otherNode.position.x, 2) +
									Math.pow(y - otherNode.position.y, 2),
							);
							const minDistance = 50;

							if (distance < minDistance) {
								const adjustX =
									((x - otherNode.position.x) / distance) * minDistance;
								const adjustY =
									((y - otherNode.position.y) / distance) * minDistance;

								x += adjustX;
								y += adjustY;
							}
						}
					}

					const newNode: Node = {
						id: vouch.address,
						data: { label: `${vouch.address}` },
						draggable: true,
						position: { x, y },
						sourcePosition: Position.Right,
						targetPosition: Position.Left,
						style: {
							width: 100 - 10 * level,
							height: 100 - 10 * level,
							fontSize: 12,
							backgroundColor: `rgba(${parseInt(
								randomColor().slice(1, 3),
								16,
							)}, ${parseInt(randomColor().slice(3, 5), 16)}, ${parseInt(
								randomColor().slice(5, 7),
								16,
							)}, ${alpha})`,
							color: '#fff',
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center' as const,
						},
					};

					nodeMap.set(vouch.address, newNode);
					edgesList.push({
						id: `${node.address}-${vouch.address}`,
						source: node.address,
						target: vouch.address,
						type: 'straight',
						style: { stroke: `#34495e`, strokeWidth: 1 },
					});

					// Recursively process the next level of nodes, up to maxLevels
					const nextNode = users.find((u) => u.address === vouch.address);

					if (nextNode) {
						processNode(nextNode, level + 1, angleStep / 2, x, y);
					}
				}
			});
		};

		const startingNode = users.find((u) => u.address === centerNodeAddress);

		if (startingNode) {
			processNode(startingNode, 1, Math.PI / 6, 300, 300); // Initial angle step
		}

		setNodes(Array.from(nodeMap.values()));
		setEdges(edgesList);
	};

	useEffect(() => {
		const initialCenterNodeAddress =
			account || users[Math.floor(Math.random() * users.length)].address;

		calculateNodePositions(initialCenterNodeAddress);
	}, [users, account]);

	const onNodeClick = useCallback(
		(event: React.MouseEvent, node: Node) => {
			event.stopPropagation();
			setMenu(null);
			calculateNodePositions(node.id);
		},
		[calculateNodePositions],
	);

	const onNodeContextMenu = useCallback(
		(event: React.MouseEvent, node: Node) => {
			event.preventDefault();
			event.stopPropagation();
			const container = ref.current?.getBoundingClientRect();

			if (container) {
				setMenu({
					id: node.id,
					top: event.clientY,
					left: event.clientX,
				});
			}
		},
		[],
	);

	const handleVouch = () => {
		// console.log('Vouch action');
	};

	const handleUserInfo = () => {
		// console.log('User info action');
	};

	const handleExplode = () => {
		// console.log('Explode action');
	};

	const isConnectedToCurrentUser = useCallback(
		(nodeId: string) => {
			return edges.some(
				(edge) =>
					(edge.source === account && edge.target === nodeId) ||
					(edge.target === account && edge.source === nodeId),
			);
		},
		[edges, account],
	);

	const onPaneClick = useCallback(() => setMenu(null), []);

	const edgeTypes: EdgeTypes = {
		floating: FloatingEdge,
	};

	return (
		<div
			ref={ref}
			className="h-[600px] w-full rounded-lg bg-gray-300 bg-opacity-25 p-4 shadow-lg"
		>
			<ReactFlow
				fitView
				connectionLineComponent={FloatingConnectionLine}
				edgeTypes={edgeTypes}
				edges={edges}
				maxZoom={2}
				minZoom={0.5}
				nodes={nodes}
				panOnDrag={true}
				onEdgesChange={onEdgesChange}
				onNodeClick={onNodeClick}
				onNodeContextMenu={onNodeContextMenu}
				onNodesChange={onNodesChange}
				onPaneClick={onPaneClick}
			>
				<Controls />
				<Background />
			</ReactFlow>

			{menu && (
				<NodeContextMenu
					id={menu.id}
					isConnectedToCurrentUser={isConnectedToCurrentUser(menu.id)}
					left={menu.left}
					top={menu.top}
					onClose={() => setMenu(null)}
					onExplode={handleExplode}
					onUserInfo={handleUserInfo}
					onVouch={handleVouch}
				/>
			)}
		</div>
	);
};
