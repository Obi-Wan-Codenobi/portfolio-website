"use client"
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Head from 'next/head';

// List of personal projects (simulating Git commits or branches)
const projects = [
  'E-commerce Platform',
  'Task Management App',
  'Social Media Dashboard',
  'Machine Learning Model Visualizer',
  'Portfolio Website',
  'Chat Application',
  'Expense Tracker',
];

// Types for Git tree nodes
interface GitNode {
  id: number;
  text: string;
  x: number;
  y: number;
  parentId?: number;
}

export default function Home() {
  const [gitNodes, setGitNodes] = useState<GitNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const treeHeight = useTransform(scrollYProgress, [0, 1], [200, 800]);

  // Generate Git tree nodes dynamically based on projects
  useEffect(() => {
    const nodes: GitNode[] = [
      { id: 0, text: 'Initial Commit', x: 0, y: 150 }, // Root of Git tree (main branch start)
    ];

    const maxDirectBranches = 5;
    projects.forEach((project, index) => {
      let x, y, parentId;
      if (projects.length <= maxDirectBranches) {
        // Each project gets a direct branch from the initial commit
        x = (index - (projects.length - 1) / 2) * 60; // Spread branches evenly
        y = 250 + index * 80; // Stack vertically
        parentId = 0;
      } else {
        // For more than 5 projects, branch off from existing branches
        if (index < maxDirectBranches) {
          x = (index - (maxDirectBranches - 1) / 2) * 60;
          y = 250 + index * 80;
          parentId = 0;
        } else {
          // Branch from an earlier node (mimicking Git feature branches)
          const parentIndex = Math.floor((index - maxDirectBranches) / 2) + 1;
          const isLeft = (index - maxDirectBranches) % 2 === 0;
          const parentNode = nodes[parentIndex];
          x = parentNode.x + (isLeft ? -40 : 40);
          y = parentNode.y + 80;
          parentId = parentNode.id;
        }
      }
      nodes.push({
        id: index + 1,
        text: project,
        x,
        y,
        parentId,
      });
    });

    setGitNodes(nodes);
  }, []);

  return (

      <main className="pt-20">
        <div className="flex justify-center items-start min-h-screen">
          <motion.div
            className="relative"
            style={{ height: treeHeight }}
          >
            <svg
              className="w-full h-[800px]"
              viewBox="-300 0 600 800"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Git tree head (simulating HEAD) */}
              <motion.text
                x="0"
                y="100"
                textAnchor="middle"
                fill="#f1c40f"
                fontSize="14"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                Obi-Wan-Codenobi -&gt; main
              </motion.text>

              {/* Main branch trunk */}
              <motion.line
                x1="0"
                y1="120"
                x2="0"
                y2="150"
                stroke="#3498db"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />

              {/* Branches and commit nodes */}
              {gitNodes.map((node, index) => {
                if (index === 0) {
                  // Render initial commit node
                  return (
                    <g key={node.id}>
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r="10"
                        fill="#e74c3c"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.text
                        x={node.x + 15}
                        y={node.y + 5}
                        fill="white"
                        fontSize="12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {node.text}
                      </motion.text>
                    </g>
                  );
                }
                const parent = gitNodes.find(n => n.id === node.parentId) || gitNodes[0];
                return (
                  <g key={node.id}>
                    {/* Branch line */}
                    <motion.line
                      x1={parent.x}
                      y1={parent.y}
                      x2={node.x}
                      y2={node.y}
                      stroke="#2ecc71"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                    {/* Commit node */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="10"
                      fill="#2ecc71"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    />
                    {/* Project name */}
                    <motion.text
                      x={node.x + 15}
                      y={node.y + 5}
                      fill="white"
                      fontSize="12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    >
                      {node.text}
                    </motion.text>
                  </g>
                );
              })}
            </svg>
          </motion.div>
        </div>
      </main>
  );
}