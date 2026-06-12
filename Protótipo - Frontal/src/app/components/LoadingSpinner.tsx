import { Blocks } from "lucide-react";
import { motion } from "motion/react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      >
        <Blocks className="h-12 w-12 text-[#0d9488]" />
      </motion.div>
    </div>
  );
}
