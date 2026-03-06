import React from 'react';

// Modelo de como uma aula deve ser
export interface ScheduleItem {
  time: string;
  subject: string;
  teacher: string;
  status?: 'online' | 'offline';
}

interface ScheduleTableProps {
  title: string;
  data: ScheduleItem[];
  buttonText?: string;
}

export const ScheduleRow = ({ time, subject, teacher, status }: ScheduleItem) => (
  <div className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors">
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{time}</span>
      <span className={`font-semibold ${status === 'online' ? 'text-emerald-600' : 'text-slate-700'}`}>
        {subject}
      </span>
    </div>
    <span className="text-xs text-slate-500 font-medium">{teacher}</span>
  </div>
);

export const ScheduleTable = ({ title, data, buttonText }: ScheduleTableProps) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
    <div className="bg-slate-50 px-4 py-3 border-b border-gray-200">
      <h4 className="text-sm font-bold text-slate-700 text-center uppercase tracking-wide">{title}</h4>
    </div>
    <div className="p-2">
      {buttonText && (
        <button className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-blue-100">
          {buttonText}
        </button>
      )}
      {data.map((item, index) => (
        <ScheduleRow key={index} {...item} />
      ))}
    </div>
  </div>
);