'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
	Background,
	Controls,
	Node,
	Edge,
	NodeChange,
	applyNodeChanges,
	Position,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { User } from '@/types';
import { useWallet } from '@/context/WalletContext';
import { randomColor } from '@/utils/color'; // Assuming this utility function is defined

interface UserGraphProps {
	users: User[];
}

export const UserGraph: React.FC<UserGraphProps> = ({ users }) => {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const { account } = useWallet();

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
			const maxLevels = 4; // Limit the depth of levels

			if (level > maxLevels) return;

			const radius = 100 + 100 * level; // Adjusted radius for levels
			const alpha = 1 - level * 0.3;

			node.vouchesReceived.forEach((vouch, index) => {
				if (!nodeMap.has(vouch.address)) {
					const angle = angleStep * index * 2; // Adjusted angle step
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
			// Recalculate positions with the clicked node as the new center
			calculateNodePositions(node.id);
		},
		[users],
	);

	const onNodesChange = useCallback((changes: NodeChange[]) => {
		setNodes((nds) => applyNodeChanges(changes, nds));
	}, []);

	return (
		<div className="h-[600px] w-full rounded-lg bg-gray-300 bg-opacity-25 p-4 shadow-lg">
			<ReactFlow
				fitView
				edges={edges}
				maxZoom={2}
				minZoom={0.5}
				nodes={nodes}
				panOnDrag={true}
				onNodeClick={onNodeClick}
				onNodesChange={onNodesChange}
			>
				<Controls />
				<Background />
			</ReactFlow>
		</div>
	);
};
