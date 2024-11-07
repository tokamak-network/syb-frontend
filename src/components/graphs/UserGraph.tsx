'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	ReactFlow,
	Background,
	Controls,
	Node,
	Edge,
	useNodesState,
	useEdgesState,
	MarkerType,
	addEdge,
} from '@xyflow/react';

import { useWallet } from '@/context/WalletContext';

import '@xyflow/react/dist/style.css';

import { useUserStore } from '@/store/userStore';
import { Button, Modal } from '@/components/common';
import { calculateNodePositions } from '@/utils';

import { NodeContextMenu } from '../contextmenu';

export const UserGraph: React.FC = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const { account } = useWallet();
	const [menu, setMenu] = useState<{
		id: string;
		top: number | null;
		left: number | null;
	} | null>(null);
	const ref = useRef<HTMLDivElement | null>(null);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [vouchTarget, setVoucheTarget] = useState<string | null>(null);
	const updateUserBalanceAndScore = useUserStore(
		(state) => state.updateUserBalanceAndScore,
	);
	const users = useUserStore((state) => state.users);

	const handleModalConfirm = () => {
		if (account && vouchTarget) {
			updateUserBalanceAndScore(account, vouchTarget);
			setShowModal(false);
			setVoucheTarget(null);
		}
	};

	const handleModalCancel = () => {
		setShowModal(false);
		setVoucheTarget(null);
	};

	useEffect(() => {
		const initialCenterNodeAddress =
			account || users[Math.floor(Math.random() * users.length)].address;

		const { nodes, edges } = calculateNodePositions(
			initialCenterNodeAddress,
			users,
		);

		setNodes(nodes);
		setEdges(edges);
	}, [users, account]);

	const onNodeClick = useCallback(
		(event: React.MouseEvent, node: Node) => {
			event.stopPropagation();
			setMenu(null);
			const { nodes, edges } = calculateNodePositions(node.id, users);

			setNodes(nodes);
			setEdges(edges);
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

	const onConnect = useCallback(
		(params: any) =>
			setEdges((eds) =>
				addEdge(
					{
						...params,
						type: 'floating',
						markerEnd: { type: MarkerType.Arrow },
					},
					eds,
				),
			),
		[setEdges],
	);

	const handleVouch = () => {
		if (menu) {
			setVoucheTarget(menu.id);
			setShowModal(true);
		}
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

	// const edgeTypes: EdgeTypes = {
	// 	floating: FloatingEdge,
	// };

	return (
		<div
			ref={ref}
			className="h-[600px] w-full rounded-lg bg-gray-300 bg-opacity-25 p-4 shadow-lg"
		>
			<ReactFlow
				fitView
				// connectionLineComponent={FloatingConnectionLine}
				// edgeTypes={edgeTypes}
				edges={edges}
				maxZoom={2}
				minZoom={0.5}
				nodes={nodes}
				panOnDrag={true}
				onConnect={onConnect}
				onEdgesChange={onEdgesChange}
				onNodeClick={onNodeClick}
				onNodeContextMenu={onNodeContextMenu}
				onNodesChange={onNodesChange}
				onPaneClick={onPaneClick}
			>
				<Controls />
				<Background />
			</ReactFlow>

			{account && menu && (
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

			<Modal
				content={`Are you sure you want to vouch for ${vouchTarget}?`}
				isOpen={showModal}
				title="Vouch Confirmation"
				onClose={handleModalCancel}
			>
				<Button
					className="rounded bg-gray-300 px-4 py-2"
					onClick={handleModalCancel}
				>
					Cancel
				</Button>
				<Button
					className="rounded bg-blue-500 px-4 py-2 text-white"
					onClick={handleModalConfirm}
				>
					Yes
				</Button>
			</Modal>
		</div>
	);
};
