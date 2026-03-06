import React from 'react';
import { LayoutDashboard, Calendar, FileText, Play, GraduationCap } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-20 bg-slate-900 min-h-screen flex flex-col items-center py-6 gap-8 text-slate-400">
      {/* Logo ou ícone principal */}
      <div className="p-3 bg-yellow-500 rounded-xl text-slate-900 mb-4">
        <GraduationCap size={28} />
      </div>
      
      {/* Ícones de navegação - O 'group' serve para fazer efeitos de hover legais */}
      <nav className="flex flex-col gap-6">
        <LayoutDashboard className="cursor-pointer hover:text-white transition-colors" size={24} />
        <Calendar className="cursor-pointer hover:text-white transition-colors" size={24} />
        <FileText className="cursor-pointer hover:text-white transition-colors" size={24} />
        <Play className="cursor-pointer hover:text-white transition-colors" size={24} />
      </nav>
    </aside>
  );
};