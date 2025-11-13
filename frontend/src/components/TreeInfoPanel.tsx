import { motion } from "framer-motion";
import { Info, Clock, TrendingUp, Zap } from "lucide-react";

interface TreeInfoPanelProps {
  treeType: string;
  currentStep: number;
  totalSteps: number;
}

const TREE_INFO: Record<string, {
  description: string;
  timeComplexity: { operation: string; complexity: string }[];
  spaceComplexity: string;
  useCases: string[];
  properties: string[];
}> = {
  bst: {
    description: "A binary tree where left child < parent < right child. Efficient for searching, but can become unbalanced.",
    timeComplexity: [
      { operation: "Search", complexity: "O(log n) avg, O(n) worst" },
      { operation: "Insert", complexity: "O(log n) avg, O(n) worst" },
      { operation: "Delete", complexity: "O(log n) avg, O(n) worst" },
    ],
    spaceComplexity: "O(n)",
    useCases: [
      "Dictionary implementations",
      "Database indexing",
      "Expression parsing",
      "Auto-complete systems",
    ],
    properties: [
      "Binary tree structure",
      "Ordered property (BST property)",
      "Can become skewed (unbalanced)",
      "In-order traversal gives sorted sequence",
    ],
  },
  avl: {
    description: "A self-balancing BST where height difference between left and right subtrees is at most 1. Guarantees O(log n) operations.",
    timeComplexity: [
      { operation: "Search", complexity: "O(log n)" },
      { operation: "Insert", complexity: "O(log n)" },
      { operation: "Delete", complexity: "O(log n)" },
    ],
    spaceComplexity: "O(n)",
    useCases: [
      "Databases with frequent lookups",
      "File systems",
      "Priority scheduling",
      "Memory management",
    ],
    properties: [
      "Self-balancing BST",
      "Height balanced (|height(L) - height(R)| ≤ 1)",
      "Requires rotations on insert/delete",
      "More strictly balanced than Red-Black trees",
    ],
  },
  redblack: {
    description: "A self-balancing BST with color properties (red/black). Less strictly balanced than AVL but faster insertions/deletions.",
    timeComplexity: [
      { operation: "Search", complexity: "O(log n)" },
      { operation: "Insert", complexity: "O(log n)" },
      { operation: "Delete", complexity: "O(log n)" },
    ],
    spaceComplexity: "O(n)",
    useCases: [
      "Java TreeMap/TreeSet",
      "C++ STL map/set",
      "Linux kernel (CFS scheduler)",
      "Database implementations",
    ],
    properties: [
      "Every node is red or black",
      "Root is black",
      "Red nodes can't have red children",
      "All paths have same black height",
    ],
  },
  heap: {
    description: "A complete binary tree where parent is either ≥ (max heap) or ≤ (min heap) all children. Used for priority queues.",
    timeComplexity: [
      { operation: "Find Min/Max", complexity: "O(1)" },
      { operation: "Insert", complexity: "O(log n)" },
      { operation: "Delete Min/Max", complexity: "O(log n)" },
      { operation: "Build Heap", complexity: "O(n)" },
    ],
    spaceComplexity: "O(n)",
    useCases: [
      "Priority queues",
      "Heap sort algorithm",
      "Dijkstra's shortest path",
      "Job scheduling",
    ],
    properties: [
      "Complete binary tree",
      "Heap property (min or max)",
      "Array representation possible",
      "Fast min/max access",
    ],
  },
  btree: {
    description: "A self-balancing multi-way search tree. Each node can have multiple children. Optimized for disk access.",
    timeComplexity: [
      { operation: "Search", complexity: "O(log n)" },
      { operation: "Insert", complexity: "O(log n)" },
      { operation: "Delete", complexity: "O(log n)" },
    ],
    spaceComplexity: "O(n)",
    useCases: [
      "Database indexing",
      "File systems (ext4, NTFS)",
      "Large datasets on disk",
      "Multi-level caching",
    ],
    properties: [
      "Multi-way search tree",
      "All leaves at same level",
      "Minimizes disk I/O",
      "Good for range queries",
    ],
  },
  trie: {
    description: "A tree where each node represents a character. Excellent for string operations and prefix matching.",
    timeComplexity: [
      { operation: "Search", complexity: "O(m) where m = key length" },
      { operation: "Insert", complexity: "O(m)" },
      { operation: "Delete", complexity: "O(m)" },
      { operation: "Prefix Search", complexity: "O(m)" },
    ],
    spaceComplexity: "O(ALPHABET_SIZE * N * M)",
    useCases: [
      "Auto-complete/type-ahead",
      "Spell checkers",
      "IP routing tables",
      "Dictionary implementations",
    ],
    properties: [
      "Tree of characters",
      "Common prefixes share nodes",
      "Fast prefix operations",
      "Space-intensive",
    ],
  },
};

export function TreeInfoPanel({ treeType, currentStep, totalSteps }: TreeInfoPanelProps) {
  const info = TREE_INFO[treeType] || TREE_INFO.bst;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-white/40"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Tree Information</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4">{info.description}</p>

      {/* Time Complexity */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-green-600" />
          <h4 className="font-semibold text-sm text-gray-900">Time Complexity</h4>
        </div>
        <div className="space-y-1">
          {info.timeComplexity.map((item) => (
            <div
              key={item.operation}
              className="flex justify-between text-xs bg-gray-50 p-2 rounded"
            >
              <span className="text-gray-700">{item.operation}:</span>
              <span className="font-mono text-green-700 font-semibold">
                {item.complexity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Space Complexity */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <h4 className="font-semibold text-sm text-gray-900">Space Complexity</h4>
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <span className="font-mono text-sm text-purple-700 font-semibold">
            {info.spaceComplexity}
          </span>
        </div>
      </div>

      {/* Properties */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-2">Key Properties</h4>
        <ul className="space-y-1">
          {info.properties.map((prop, idx) => (
            <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{prop}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Use Cases */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-yellow-600" />
          <h4 className="font-semibold text-sm text-gray-900">Common Use Cases</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {info.useCases.map((useCase, idx) => (
            <span
              key={idx}
              className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded border border-yellow-200"
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Animation Progress</span>
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
