import React, { useState } from 'react';

export const FormRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-3">{children}</div>
);

export const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1 text-[13px] font-medium text-slate-600">
    {label}
    {children}
  </label>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className={`px-2.5 py-1.5 border border-slate-300 rounded-md text-sm outline-none bg-slate-50 transition-all focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-400 ${props.className || ''}`} 
  />
);

// Expanded props to receive Drag & Drop event handlers from the parent layout loop
interface ComponentCardProps<T> {
  title: string;
  data: T;
  entityType: any;
  componentType: string;
  rules: Record<any, string[]>;
  onRemove: () => void;
  children: React.ReactNode;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export const ComponentCard = <T extends { ComponentType: string }>({
  title,
  entityType,
  componentType,
  rules,
  onRemove,
  children,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging
}: ComponentCardProps<T>) => {
  const isRequired = rules[entityType]?.includes(componentType);
  
  // Local state to manage collapse/expand toggle clicking
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`flex flex-col gap-3 rounded-lg p-4 bg-white shadow-xs mb-5 break-inside-avoid transition-all duration-150 ${
        isDragging ? 'border-2 border-dashed border-sky-500 opacity-40' : 'border border-slate-200 opacity-100'
      }`}
    >
      {/* Header Container */}
      <div className={`flex justify-between items-center pb-1 mb-1 ${isExpanded ? 'border-b border-slate-100' : 'border-none'}`}>
        
        {/* Clickable zone to collapse/expand form content */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 cursor-pointer select-none grow"
        >
          {/* Drag Handle Indicator Icon */}
          <span className="cursor-grab text-slate-400 text-base font-bold pr-0.5" title="Drag to reorder">
            ⋮⋮
          </span>

          {/* Chevron Toggler Indicator */}
          <span className={`text-[11px] text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
            ▼
          </span>

          <span className="font-semibold text-[15px] text-slate-800">{title}</span>
          
          {isRequired && (
            <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
              Required
            </span>
          )}
        </div>

        {/* Action Button Area */}
        {!isRequired && (
          <button 
            type="button" 
            onClick={onRemove}
            className="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded cursor-pointer text-xs font-medium hover:bg-red-100 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {/* Collapsible content wrapper */}
      {isExpanded && (
        <div className="flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
};