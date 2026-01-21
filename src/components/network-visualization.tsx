'use client';

import { motion } from 'framer-motion';

// Static node positions (percentages) and edges for a LinkedIn-style network graph
const NODES = [
  [20, 15], [35, 25], [55, 20], [75, 30], [25, 45], [50, 50], [70, 55], [30, 70], [60, 75], [45, 35],
  [15, 55], [85, 45], [40, 85], [80, 15], [10, 35], [90, 70], [5, 80], [95, 25], [50, 10], [22, 90],
];
const EDGES = [
  [0, 1], [1, 2], [2, 3], [1, 5], [0, 4], [4, 5], [5, 6], [5, 9], [4, 7], [7, 8], [6, 8],
  [9, 2], [3, 6], [0, 10], [10, 4], [3, 11], [11, 6], [7, 12], [2, 13], [9, 14], [8, 15], [1, 9],
  [5, 7], [9, 18], [16, 10], [17, 11],
];

export function NetworkVisualization() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="nodeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(129, 140, 248)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="edgeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgb(165, 180, 252)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.1" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection Lines */}
        <g stroke="url(#edgeGradient)" strokeWidth="0.2">
          {EDGES.map(([a, b], i) => (
            <motion.line
              key={`e-${i}`}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.05, 
                ease: 'easeInOut' 
              }}
            />
          ))}
        </g>

        {/* Nodes with Glow */}
        {NODES.map(([x, y], i) => (
          <motion.circle
            key={`n-${i}`}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 0.8 : 0.5}
            fill="url(#nodeGlow)"
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
            transition={{ 
              duration: 2,
              delay: 0.5 + i * 0.05,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
          />
        ))}
      </svg>
    </div>
  );
}
