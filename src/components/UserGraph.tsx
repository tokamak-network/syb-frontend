// components/UserGraph.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  NodeChange,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { User } from "@/utils/types";
import { useWallet } from "@/context/WalletContext";
import { randomColor, circularLayout } from "@/utils";

interface UserGraphProps {
  users: User[];
}

const UserGraph: React.FC<UserGraphProps> = ({ users }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { account } = useWallet();

  useEffect(() => {
    const initialNodes: Node[] = users.map((user) => ({
      id: user.address,
      data: { label: `${user.address} (${user.balance} ETH)` },
      position: { x: Math.random() * 600, y: Math.random() * 400 },
      draggable: true,
      style: {
        width: account === user.address ? 150 : 100,
        height: account === user.address ? 150 : 100,
        fontSize: account === user.address ? 16 : 12,
        backgroundColor: account === user.address ? "#3498db" : randomColor(),
        color: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      },
    }));

    // Apply circular layout with a specified radius and center
    const radius = 200;
    const centerX = 300;
    const centerY = 200;
    const positionedNodes = circularLayout(
      initialNodes,
      radius,
      centerX,
      centerY
    );

    const initialEdges: Edge[] = users.flatMap((user) =>
      user.vouchesReceived.map((vouch) => ({
        id: `${vouch.address}-${user.address}`,
        source: vouch.address,
        target: user.address,
        animated: true,
        style: { stroke: "#34495e", strokeWidth: 2 },
        type: "default",
      }))
    );

    setNodes(positionedNodes);
    setEdges(initialEdges);
  }, [users, account]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();

      const centerX = 300;
      const centerY = 200;
      const dx = centerX - node.position.x;
      const dy = centerY - node.position.y;

      const updateNodes = nodes.map((n) => ({
        ...n,
        position: { x: n.position.x + dx, y: n.position.y + dy },
        style: {
          ...n.style,
          backgroundColor: n.id === node.id ? "#3498db" : randomColor(),
          width: n.id === node.id ? 150 : 100,
          height: n.id === node.id ? 150 : 100,
          fontSize: n.id === node.id ? 16 : 12,
        },
      }));

      setNodes(updateNodes);
    },
    [nodes]
  );

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  return (
    <div className="w-full h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default UserGraph;
