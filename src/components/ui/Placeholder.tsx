import { motion, AnimatePresence } from 'motion/react';
import { Construction } from 'lucide-react';

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-3xl border-dashed border-2 border-slate-200">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Construction className="w-16 h-16 text-amber-500 mb-6" />
      </motion.div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 text-center max-w-md">
        This module is currently being architected as per the Alpha-ERP implementation plan. 
        Stay tuned for production planning, inventory tracking, and VAT compliance features.
      </p>
      <button className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
        Read System Manual
      </button>
    </div>
  );
}
