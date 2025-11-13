import { motion } from "framer-motion";
import { Trees, GitBranch, Activity, MessageCircle } from "lucide-react";

interface TreeOptionsPanelProps {
  treeType: string;
  traversalMode: string;
  onTreeTypeChange: (type: string) => void;
  onTraversalModeChange: (mode: string) => void;
  onShowChatbot: () => void;
}

const TREE_TYPES = [
  { id: "bst", name: "Binary Search Tree", description: "Ordered binary tree" },
  { id: "avl", name: "AVL Tree", description: "Self-balancing BST" },
  { id: "redblack", name: "Red-Black Tree", description: "Balanced with color properties" },
  { id: "heap", name: "Heap", description: "Complete binary tree (min/max)" },
  { id: "btree", name: "B-Tree", description: "Multi-way search tree" },
  { id: "trie", name: "Trie", description: "Prefix tree for strings" },
];

const TRAVERSAL_MODES = [
  { id: "inorder", name: "In-Order", description: "Left → Root → Right" },
  { id: "preorder", name: "Pre-Order", description: "Root → Left → Right" },
  { id: "postorder", name: "Post-Order", description: "Left → Right → Root" },
  { id: "levelorder", name: "Level-Order", description: "Breadth-first traversal" },
];

export function TreeOptionsPanel({
  treeType,
  traversalMode,
  onTreeTypeChange,
  onTraversalModeChange,
  onShowChatbot,
}: TreeOptionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/95 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-white/40"
    >
      {/* Info Note */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> To see different tree types or traversals, generate a new visualization from the home page using specific keywords like "AVL Tree with In-Order Traversal"
        </p>
      </div>

      {/* Tree Type Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Trees className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Tree Type</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TREE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onTreeTypeChange(type.id)}
              className={`text-left p-3 rounded-lg border-2 transition-all ${
                treeType === type.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
            >
              <div className="font-semibold text-sm text-gray-900">
                {type.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Traversal Mode Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Traversal Mode</h3>
        </div>
        <div className="space-y-2">
          {TRAVERSAL_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onTraversalModeChange(mode.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                traversalMode === mode.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-gray-900">
                    {mode.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {mode.description}
                  </div>
                </div>
                {traversalMode === mode.id && (
                  <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={onShowChatbot}
        className="w-full btn-secondary py-3 flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        Ask Questions About Trees
      </button>
    </motion.div>
  );
}
