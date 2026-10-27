import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl my-6">
      <div className="w-14 h-14 bg-[#C2DFF3]/30 text-[#1352B9] rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#031B4A] mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#000000] text-[#FFFFFF] rounded-xl hover:bg-[#031B4A] transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6FF]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
