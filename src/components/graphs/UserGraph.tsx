'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	ReactFlow,
	Background,
	Controls,
	Node,
	useNodesState,
	useEdgesState,
	MarkerType,
	addEdge,
	EdgeTypes,
	ReactFlowProvider,
} from '@xyflow/react';

import { useWallet } from '@/context/WalletContext';

import '@xyflow/react/dist/style.css';

import { useUserStore } from '@/store/userStore';
import { Button, Modal } from '@/components/common';
import { calculateNodePositions } from '@/utils';
import { UserEdge, UserNode } from '@/types';

import { NodeContextMenu } from '../contextmenu';

import { FloatingEdge } from './FloatingEdge';

export const UserGraph: React.FC = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<UserNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<UserEdge>([]);
	const { account } = useWallet();
	const [menu, setMenu] = useState<{
		id: string;
		top: number | null;
		left: number | null;
	} | null>(null);
	const ref = useRef<HTMLDivElement | null>(null);
	const [showVouchModal, setShowVouchModal] = useState<boolean>(false);
	const [showExplodeModal, setShowExplodeModal] = useState<boolean>(false);
	const [vouchTarget, setVoucheTarget] = useState<string | null>(null);
	const updateUserBalanceAndScore = useUserStore(
		(state) => state.updateUserBalanceAndScore,
	);
	const explodeAllConnections = useUserStore(
		(state) => state.explodeAllConnections,
	);
	const users = useUserStore((state) => state.users);

	const handleVouchConfirm = () => {
		if (account && vouchTarget) {
			updateUserBalanceAndScore(account, vouchTarget);
			setShowVouchModal(false);
			setVoucheTarget(null);
			setMenu(null);
		}
	};

	const handleExplodeConfirm = () => {
		if (menu?.id && account) {
			explodeAllConnections(menu.id);
			setShowExplodeModal(false);
			setMenu(null);
		}
	};

	const handleModalCancel = () => {
		setShowVouchModal(false);
		setShowExplodeModal(false);
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
		[users],
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
			setShowVouchModal(true);
		}
	};

	const handleExplode = () => {
		if (menu) {
			setShowExplodeModal(true);
		}
	};

	const handleUserInfo = () => {
		// console.log('User info action');
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

	const onPaneClick = useCallback(() => {
		setMenu(null);
	}, []);

	const edgeTypes: EdgeTypes = {
		floating: FloatingEdge,
	};

	return (
		<ReactFlowProvider>
			<div
				ref={ref}
				className="h-[600px] w-full rounded-lg bg-gray-300 bg-opacity-25 p-4 shadow-lg"
			>
				<ReactFlow
					fitView
					edgeTypes={edgeTypes}
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

				{account &&
					menu &&
					showExplodeModal === false &&
					showVouchModal === false && (
						<NodeContextMenu
							id={menu.id}
							isConnectedToCurrentUser={isConnectedToCurrentUser(menu.id)}
							left={menu.left}
							top={menu.top}
							onExplode={handleExplode}
							onUserInfo={handleUserInfo}
							onVouch={handleVouch}
						/>
					)}

				<Modal
					content={`Are you sure you want to vouch for ${vouchTarget}?`}
					isOpen={showVouchModal}
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
						onClick={handleVouchConfirm}
					>
						Yes
					</Button>
				</Modal>

				<Modal
					content={`Are you sure you want to explode connections for ${menu ? menu.id : ''}?`}
					isOpen={showExplodeModal}
					title="Explode Confirmation"
					onClose={handleModalCancel}
				>
					<Button
						className="rounded bg-gray-300 px-4 py-2"
						onClick={handleModalCancel}
					>
						Cancel
					</Button>
					<Button
						className="rounded bg-red-500 px-4 py-2 text-white"
						onClick={handleExplodeConfirm}
					>
						Yes
					</Button>
				</Modal>
			</div>
		</ReactFlowProvider>
	);
};

export default UserGraph;
