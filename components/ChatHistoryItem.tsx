import React from 'react';
import { MessageSquare, Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryItemProps {
  title: string;
  timestamp: Date;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  title,
  timestamp,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-2 hover:bg-gray-800/50 transition-colors duration-300 ${isActive ? 'bg-gray-800/50' : ''
      }`}
  >
    <div className="flex items-center gap-3">
      <MessageSquare className="w-5 h-5 text-gray-400" />
      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-medium text-gray-200 truncate group-hover:whitespace-normal transition-all duration-300">
          {title}
        </h3>
        <p className="text-xs text-gray-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 transform transition-transform duration-300 group-hover:rotate-90" />
    </div>
  </button>
);