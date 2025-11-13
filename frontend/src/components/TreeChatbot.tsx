import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, User, Loader2 } from "lucide-react";
import axios from "axios";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TreeChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  currentTree: string;
  currentTraversal: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function TreeChatbot({
  isOpen,
  onClose,
  currentTree,
  currentTraversal,
}: TreeChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! I'm your tree data structure assistant. You're currently viewing a **${currentTree}** with **${currentTraversal}** traversal. Ask me anything about tree structures, algorithms, or how they work!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call backend chatbot API
      const response = await axios.post(`${API_BASE_URL}/api/chatbot`, {
        message: input,
        context: {
          tree_type: currentTree,
          traversal: currentTraversal,
        },
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback responses if API fails
      const fallbackResponse = getFallbackResponse(input, currentTree);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-bold">Tree Assistant</h3>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about trees..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Fallback responses when API is unavailable
function getFallbackResponse(question: string, treeType: string): string {
  const q = question.toLowerCase();

  if (q.includes("time complexity") || q.includes("big o")) {
    return `For ${treeType}:\n• Search: O(log n) average, O(n) worst\n• Insert: O(log n) average, O(n) worst\n• Delete: O(log n) average, O(n) worst\n\nBalanced trees like AVL guarantee O(log n) for all operations.`;
  }

  if (q.includes("traversal") || q.includes("inorder") || q.includes("preorder")) {
    return `Tree Traversals:\n• **In-Order**: Left → Root → Right (gives sorted order for BST)\n• **Pre-Order**: Root → Left → Right (used for tree copying)\n• **Post-Order**: Left → Right → Root (used for deletion)\n• **Level-Order**: Level by level (uses queue, BFS)`;
  }

  if (q.includes("balance") || q.includes("avl") || q.includes("red-black")) {
    return `Balanced trees maintain height ≈ log(n):\n• **AVL Tree**: Strict balance (height diff ≤ 1)\n• **Red-Black Tree**: Relaxed balance (black height equality)\n• Both guarantee O(log n) operations but Red-Black has faster insertion.`;
  }

  if (q.includes("heap")) {
    return `Heaps are complete binary trees:\n• **Min Heap**: Parent ≤ children\n• **Max Heap**: Parent ≥ children\n• Used in priority queues and heap sort\n• Insert/Delete: O(log n), Find-Min/Max: O(1)`;
  }

  return `Great question about ${treeType}! Here are some key points:\n\n• Trees are hierarchical data structures\n• Each node can have multiple children\n• Efficient for searching, sorting, and hierarchical data\n\nTry asking about:\n• Time complexity\n• Traversal methods\n• Balancing techniques\n• Specific operations`;
}
