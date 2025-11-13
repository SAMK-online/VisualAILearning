import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Shuffle, Trash2, Play } from "lucide-react";

type NodeState = "normal" | "visiting" | "visited";

interface TreeNode {
  id: string;
  value: number;
  x: number;
  y: number;
  left: string | null;
  right: string | null;
  state: NodeState;
}

interface InteractiveTreeViewerProps {
  onBack: () => void;
}

export function InteractiveTreeViewer({ onBack }: InteractiveTreeViewerProps) {
  const [nodes, setNodes] = useState<Record<string, TreeNode>>({});
  const [rootId, setRootId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  const [selectedTraversal, setSelectedTraversal] = useState<string>("inorder");
  const [isTraversing, setIsTraversing] = useState(false);

  // Insert a new node into the BST
  const insertNode = (value: number) => {
    const newId = `node-${Date.now()}`;

    if (!rootId) {
      // Create root node
      const newNode: TreeNode = {
        id: newId,
        value,
        x: 500,
        y: 100,
        left: null,
        right: null,
        state: "normal",
      };
      setNodes({ [newId]: newNode });
      setRootId(newId);
    } else {
      // Insert into existing tree
      const newNodes = { ...nodes };
      let currentId = rootId;
      let depth = 1;

      while (true) {
        const current = newNodes[currentId];

        if (value < current.value) {
          if (!current.left) {
            const newNode: TreeNode = {
              id: newId,
              value,
              x: current.x - 150 / depth,
              y: current.y + 100,
              left: null,
              right: null,
              state: "normal",
            };
            current.left = newId;
            newNodes[newId] = newNode;
            break;
          } else {
            currentId = current.left;
            depth++;
          }
        } else {
          if (!current.right) {
            const newNode: TreeNode = {
              id: newId,
              value,
              x: current.x + 150 / depth,
              y: current.y + 100,
              left: null,
              right: null,
              state: "normal",
            };
            current.right = newId;
            newNodes[newId] = newNode;
            break;
          } else {
            currentId = current.right;
            depth++;
          }
        }
      }

      setNodes(newNodes);
    }

    setInputValue("");
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      insertNode(value);
    }
  };

  const loadExample1 = () => {
    clearTree();
    [45, 25, 65, 15, 35, 55, 75, 10, 30].forEach(val => insertNode(val));
  };

  const loadExample2 = () => {
    clearTree();
    [50, 30, 70, 20, 40, 60, 80].forEach(val => insertNode(val));
  };

  const loadRandom = () => {
    clearTree();
    const count = 7 + Math.floor(Math.random() * 6);
    const values = Array.from({ length: count }, () => Math.floor(Math.random() * 100));
    values.forEach(val => insertNode(val));
  };

  const clearTree = () => {
    setNodes({});
    setRootId(null);
    setTraversalOrder([]);
  };

  // Helper to sleep
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Reset all node states
  const resetNodeStates = () => {
    const updatedNodes = { ...nodes };
    Object.keys(updatedNodes).forEach(key => {
      updatedNodes[key].state = "normal";
    });
    setNodes(updatedNodes);
  };

  // Update node state
  const updateNodeState = (nodeId: string, state: NodeState) => {
    setNodes(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], state }
    }));
  };

  // Animated traversal algorithms
  const inorderTraversal = async (nodeId: string | null, result: number[] = []): Promise<number[]> => {
    if (!nodeId) return result;
    const node = nodes[nodeId];

    if (node.left) await inorderTraversal(node.left, result);

    updateNodeState(nodeId, "visiting");
    await sleep(600);
    result.push(node.value);
    setTraversalOrder([...result]);
    updateNodeState(nodeId, "visited");
    await sleep(400);

    if (node.right) await inorderTraversal(node.right, result);
    return result;
  };

  const preorderTraversal = async (nodeId: string | null, result: number[] = []): Promise<number[]> => {
    if (!nodeId) return result;
    const node = nodes[nodeId];

    updateNodeState(nodeId, "visiting");
    await sleep(600);
    result.push(node.value);
    setTraversalOrder([...result]);
    updateNodeState(nodeId, "visited");
    await sleep(400);

    if (node.left) await preorderTraversal(node.left, result);
    if (node.right) await preorderTraversal(node.right, result);
    return result;
  };

  const postorderTraversal = async (nodeId: string | null, result: number[] = []): Promise<number[]> => {
    if (!nodeId) return result;
    const node = nodes[nodeId];

    if (node.left) await postorderTraversal(node.left, result);
    if (node.right) await postorderTraversal(node.right, result);

    updateNodeState(nodeId, "visiting");
    await sleep(600);
    result.push(node.value);
    setTraversalOrder([...result]);
    updateNodeState(nodeId, "visited");
    await sleep(400);

    return result;
  };

  const levelorderTraversal = async (): Promise<number[]> => {
    if (!rootId) return [];
    const result: number[] = [];
    const queue = [rootId];

    updateNodeState(rootId, "visiting");

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = nodes[currentId];

      await sleep(600);
      result.push(node.value);
      setTraversalOrder([...result]);
      updateNodeState(currentId, "visited");
      await sleep(400);

      if (node.left) {
        updateNodeState(node.left, "visiting");
        queue.push(node.left);
      }
      if (node.right) {
        updateNodeState(node.right, "visiting");
        queue.push(node.right);
      }
    }

    return result;
  };

  const performTraversal = async (type: string) => {
    if (isTraversing || !rootId) return;

    setIsTraversing(true);
    setSelectedTraversal(type);
    setTraversalOrder([]);
    resetNodeStates();

    try {
      switch (type) {
        case "inorder":
          await inorderTraversal(rootId, []);
          break;
        case "preorder":
          await preorderTraversal(rootId, []);
          break;
        case "postorder":
          await postorderTraversal(rootId, []);
          break;
        case "levelorder":
          await levelorderTraversal();
          break;
      }
    } finally {
      setIsTraversing(false);
    }
  };

  const calculateHeight = (nodeId: string | null): number => {
    if (!nodeId) return 0;
    const node = nodes[nodeId];
    return 1 + Math.max(calculateHeight(node.left), calculateHeight(node.right));
  };

  const treeHeight = rootId ? calculateHeight(rootId) : 0;
  const totalNodes = Object.keys(nodes).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-white hover:text-gray-200">
              ← Back to Home
            </button>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              🌳 Binary Search Tree Visualizer with Traversals
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Canvas */}
          <div className="lg:col-span-3 bg-white/95 rounded-lg p-6">
            <svg width="100%" height="600" className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              {/* Draw edges */}
              {Object.values(nodes).map(node => (
                <g key={`edges-${node.id}`}>
                  {node.left && (
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={nodes[node.left].x}
                      y2={nodes[node.left].y}
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                  )}
                  {node.right && (
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={nodes[node.right].x}
                      y2={nodes[node.right].y}
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                  )}
                </g>
              ))}

              {/* Draw nodes */}
              {Object.values(nodes).map(node => {
                const getNodeColor = (state: NodeState) => {
                  switch (state) {
                    case "visiting":
                      return "#ffd700"; // Gold for currently visiting
                    case "visited":
                      return "#51cf66"; // Green for visited
                    default:
                      return "#667eea"; // Purple for normal
                  }
                };

                return (
                  <motion.g
                    key={node.id}
                    animate={{
                      scale: node.state === "visiting" ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="30"
                      fill={getNodeColor(node.state)}
                      stroke="#333"
                      strokeWidth="3"
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="18"
                      fontWeight="bold"
                    >
                      {node.value}
                    </text>
                  </motion.g>
                );
              })}
            </svg>

            {/* Traversal Order Display */}
            {traversalOrder.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <div className="flex items-center gap-2 text-gray-900">
                  <span className="font-semibold">Traversal Order:</span>
                  {traversalOrder.map((val, idx) => (
                    <span key={idx} className="flex items-center">
                      <span className="px-3 py-1 bg-indigo-600 text-white rounded font-mono">
                        {val}
                      </span>
                      {idx < traversalOrder.length - 1 && (
                        <span className="mx-2 text-indigo-400">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            {/* Insert Node */}
            <div className="bg-white/95 rounded-lg p-4">
              <h3 className="text-lg font-bold text-indigo-700 mb-3">Insert Node</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleInsert()}
                  placeholder="Enter value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-gray-900"
                />
                <button
                  onClick={handleInsert}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Insert
                </button>
              </div>
            </div>

            {/* Quick Examples */}
            <div className="bg-white/95 rounded-lg p-4">
              <h3 className="text-lg font-bold text-indigo-700 mb-3">Quick Examples</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={loadExample1}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Example 1
                </button>
                <button
                  onClick={loadExample2}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Example 2
                </button>
              </div>
              <button
                onClick={loadRandom}
                className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Random
              </button>
            </div>

            {/* Traversals */}
            <div className="bg-white/95 rounded-lg p-4">
              <h3 className="text-lg font-bold text-indigo-700 mb-3">Traversals</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "inorder", name: "In-Order" },
                  { id: "preorder", name: "Pre-Order" },
                  { id: "postorder", name: "Post-Order" },
                  { id: "levelorder", name: "Level-Order" },
                ].map((trav) => (
                  <button
                    key={trav.id}
                    onClick={() => performTraversal(trav.id)}
                    disabled={isTraversing || !rootId}
                    className={`px-4 py-2 rounded flex items-center justify-center gap-2 transition-all ${
                      isTraversing || !rootId
                        ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                        : selectedTraversal === trav.id
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {selectedTraversal === trav.id && !isTraversing && <Play className="w-3 h-3" />}
                    {isTraversing && selectedTraversal === trav.id ? "Running..." : trav.name}
                  </button>
                ))}
              </div>

              {selectedTraversal && (
                <div className="mt-3 p-3 bg-indigo-50 rounded text-sm text-gray-700">
                  {selectedTraversal === "levelorder" ? (
                    <p><strong>Level-Order:</strong> Top to bottom, left to right (Breadth-first)</p>
                  ) : selectedTraversal === "inorder" ? (
                    <p><strong>In-Order:</strong> Left → Node → Right (sorted order)</p>
                  ) : selectedTraversal === "preorder" ? (
                    <p><strong>Pre-Order:</strong> Node → Left → Right (parent first)</p>
                  ) : (
                    <p><strong>Post-Order:</strong> Left → Right → Node (parent last)</p>
                  )}
                </div>
              )}
            </div>

            {/* Operations */}
            <div className="bg-white/95 rounded-lg p-4">
              <h3 className="text-lg font-bold text-indigo-700 mb-3">Operations</h3>
              <button
                onClick={clearTree}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Tree
              </button>
            </div>

            {/* Tree Stats */}
            <div className="bg-white/95 rounded-lg p-4">
              <h3 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
                📊 Current Tree Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 p-3 rounded">
                  <div className="text-xs text-gray-600 uppercase">Total Nodes</div>
                  <div className="text-2xl font-bold text-indigo-700">{totalNodes}</div>
                </div>
                <div className="bg-indigo-50 p-3 rounded">
                  <div className="text-xs text-gray-600 uppercase">Tree Height</div>
                  <div className="text-2xl font-bold text-indigo-700">{treeHeight}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-gray-700">Normal</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-700">Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">Visited</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/95 rounded-lg p-4">
            <h3 className="text-lg font-bold text-indigo-700 mb-2 flex items-center gap-2">
              🌳 What is a BST?
            </h3>
            <p className="text-sm text-gray-700">
              A Binary Search Tree is a data structure where each node has at most two children (left and right).
              For every node: all values in its left subtree are smaller, and all values in its right subtree are larger.
              This property enables fast search, insertion, and deletion operations.
            </p>
          </div>

          <div className="bg-white/95 rounded-lg p-4">
            <h3 className="text-lg font-bold text-indigo-700 mb-2 flex items-center gap-2">
              🔄 Traversals Explained
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>In-Order:</strong> Left → Node → Right (sorted order)</p>
              <p><strong>Pre-Order:</strong> Node → Left → Right (parent first)</p>
              <p><strong>Post-Order:</strong> Left → Right → Node (parent last)</p>
              <p><strong>Level-Order:</strong> Top to bottom, left to right</p>
            </div>
          </div>

          <div className="bg-white/95 rounded-lg p-4">
            <h3 className="text-lg font-bold text-indigo-700 mb-2 flex items-center gap-2">
              ⚡ Time Complexity
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Search:</strong> O(log n) average, O(n) worst</p>
              <p><strong>Insert:</strong> O(log n) average, O(n) worst</p>
              <p><strong>Delete:</strong> O(log n) average, O(n) worst</p>
              <p><strong>Space:</strong> O(n)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
