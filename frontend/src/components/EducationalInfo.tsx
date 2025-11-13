import { motion } from "framer-motion";
import { Book, Info, TrendingUp } from "lucide-react";
import type { VisualizationData } from "../types/visualization";

interface EducationalInfoProps {
  data: VisualizationData;
  currentStep: number;
}

export function EducationalInfo({ data, currentStep }: EducationalInfoProps) {
  const getTopicDescription = () => {
    const topic = data.topic.toLowerCase();

    // Data structures
    if (topic.includes("binary search tree") || topic.includes("bst")) {
      return {
        title: "What is a Binary Search Tree?",
        description:
          "A Binary Search Tree is a data structure where each node has at most two children (left and right). For every node: all values in its left subtree are smaller, and all values in its right subtree are larger. This property enables fast search, insertion, and deletion operations.",
      };
    }
    if (topic.includes("hash table")) {
      return {
        title: "What is a Hash Table?",
        description:
          "A Hash Table is a data structure that implements an associative array using a hash function to compute an index into an array of buckets. It provides O(1) average time complexity for insert, delete, and search operations.",
      };
    }
    if (topic.includes("linked list")) {
      return {
        title: "What is a Linked List?",
        description:
          "A Linked List is a linear data structure where elements are stored in nodes. Each node contains data and a reference (link) to the next node. Unlike arrays, linked lists don't require contiguous memory allocation.",
      };
    }

    // Algorithms
    if (topic.includes("merge sort")) {
      return {
        title: "What is Merge Sort?",
        description:
          "Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves. It has O(n log n) time complexity in all cases.",
      };
    }
    if (topic.includes("quick sort")) {
      return {
        title: "What is Quick Sort?",
        description:
          "Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it. Elements smaller than the pivot go left, larger go right. It has O(n log n) average time complexity.",
      };
    }
    if (topic.includes("depth-first") || topic.includes("dfs")) {
      return {
        title: "What is Depth-First Search?",
        description:
          "DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (or recursion) and is useful for pathfinding, cycle detection, and topological sorting.",
      };
    }

    // System design
    if (topic.includes("load balancer")) {
      return {
        title: "What is a Load Balancer?",
        description:
          "A Load Balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much load. This improves application availability, scalability, and fault tolerance.",
      };
    }

    // Default
    return {
      title: `About ${data.title}`,
      description: data.description,
    };
  };

  const getComplexityInfo = () => {
    const topic = data.topic.toLowerCase();

    if (topic.includes("binary search tree") || topic.includes("bst")) {
      return {
        title: "Time Complexity",
        operations: [
          { name: "Search", average: "O(log n)", worst: "O(n)" },
          { name: "Insert", average: "O(log n)", worst: "O(n)" },
          { name: "Delete", average: "O(log n)", worst: "O(n)" },
        ],
      };
    }
    if (topic.includes("hash table")) {
      return {
        title: "Time Complexity",
        operations: [
          { name: "Search", average: "O(1)", worst: "O(n)" },
          { name: "Insert", average: "O(1)", worst: "O(n)" },
          { name: "Delete", average: "O(1)", worst: "O(n)" },
        ],
      };
    }
    if (topic.includes("merge sort")) {
      return {
        title: "Time Complexity",
        operations: [
          { name: "Best Case", average: "O(n log n)", worst: "-" },
          { name: "Average Case", average: "O(n log n)", worst: "-" },
          { name: "Worst Case", average: "O(n log n)", worst: "-" },
          { name: "Space", average: "O(n)", worst: "-" },
        ],
      };
    }
    if (topic.includes("quick sort")) {
      return {
        title: "Time Complexity",
        operations: [
          { name: "Best Case", average: "O(n log n)", worst: "-" },
          { name: "Average Case", average: "O(n log n)", worst: "-" },
          { name: "Worst Case", average: "O(n²)", worst: "-" },
          { name: "Space", average: "O(log n)", worst: "-" },
        ],
      };
    }

    return null;
  };

  const info = getTopicDescription();
  const complexity = getComplexityInfo();

  return (
    <div className="space-y-6">
      {/* Main Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Book className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">{info.title}</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          {info.description}
        </p>
      </motion.div>

      {/* Complexity Info */}
      {complexity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">
              {complexity.title}
            </h3>
          </div>
          <div className="space-y-2">
            {complexity.operations.map((op, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-[#0f0f0f] rounded-lg"
              >
                <span className="text-gray-400 text-sm font-medium">
                  {op.name}
                </span>
                <div className="flex gap-3">
                  <span className="text-green-400 font-mono text-sm">
                    {op.average}
                  </span>
                  {op.worst !== "-" && (
                    <span className="text-red-400 font-mono text-sm">
                      {op.worst}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Key Concepts */}
      {data.metadata?.key_concepts &&
        data.metadata.key_concepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Key Concepts</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.metadata.key_concepts.map((concept: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
                >
                  {concept}
                </span>
              ))}
            </div>
          </motion.div>
        )}

      {/* Current Step Info */}
      {data.steps && data.steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-3">
            Current Step: {currentStep + 1} / {data.steps.length}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {data.steps[currentStep].description}
          </p>
        </motion.div>
      )}
    </div>
  );
}
