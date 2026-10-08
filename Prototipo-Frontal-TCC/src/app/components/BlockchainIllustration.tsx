import { Blocks, FileCheck, Shield, Link2 } from "lucide-react";
import { motion } from "motion/react";

export function BlockchainIllustration() {
  return (
    <div className="hidden lg:block col-span-2 mb-8">
      <div className="relative h-48 bg-gradient-to-br from-[#e9e1d1] via-[#e5e7e8] to-[#eee5d4] rounded-2xl overflow-hidden shadow-lg border border-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-8">
            {/* Documento */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                <FileCheck className="h-12 w-12 text-[#5E1F38]" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </motion.div>

            {/* Conexão animada */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <Link2 className="h-6 w-6 text-[#66727d]" />
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-1 w-16 bg-gradient-to-r from-[#5E1F38] to-[#66727d] rounded-full"
              />
              <Link2 className="h-6 w-6 text-[#66727d]" />
            </motion.div>

            {/* Blockchain */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative"
            >
              <div className="h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                <Blocks className="h-12 w-12 text-[#66727d]" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full bg-[#b28a4a] flex items-center justify-center"
              >
                <div className="h-2 w-2 rounded-full bg-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Texto descritivo */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-sm font-medium text-foreground/80">
            Documentos verificados e protegidos pela tecnologia Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
