import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Trash2 } from "lucide-react";

interface LearningNotesProps {
  topic: string;
}

export function LearningNotes({ topic }: LearningNotesProps) {
  const [notes, setNotes] = useState("");
  const storageKey = `learning-notes-${topic.toLowerCase().replace(/\s+/g, "-")}`;

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [storageKey]);

  // Auto-save notes to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes) {
        localStorage.setItem(storageKey, notes);
      }
    }, 500); // Debounce save by 500ms

    return () => clearTimeout(timer);
  }, [notes, storageKey]);

  const handleDownload = () => {
    const blob = new Blob([notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic.replace(/\s+/g, "-")}-notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your notes? This cannot be undone.")) {
      setNotes("");
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">My Learning Notes</h3>
      </div>

      <p className="text-gray-400 text-sm mb-3">
        Take notes as you learn about {topic}...
      </p>
      <p className="text-gray-500 text-xs mb-4">
        Your notes are automatically saved in your browser!
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Start typing your notes here...

Examples:
• Key concepts and definitions
• Important algorithms or patterns
• Questions to explore later
• Real-world use cases"
        className="w-full h-48 p-4 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleDownload}
          disabled={!notes}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={handleClear}
          disabled={!notes}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>
    </motion.div>
  );
}
