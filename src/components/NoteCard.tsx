import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  isTrash?: boolean;
  onRestore?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, isTrash = false, onRestore, onDelete }) => {
  const truncateContent = (content: string) => {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {note.coverImage && (
        <div className="h-32 overflow-hidden rounded-t-lg">
          <img 
            src={note.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          {note.icon && <span className="text-xl mr-2">{note.icon}</span>}
          <h3 className="font-medium text-gray-900 text-lg truncate">
            {note.title || 'Untitled'}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {truncateContent(note.content) || 'No content'}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{getTimeAgo(note.updatedAt)}</span>
          
          {isTrash ? (
            <div className="flex space-x-2">
              {onRestore && (
                <button 
                  onClick={() => onRestore(note._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Restore
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={() => onDelete(note._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete permanently
                </button>
              )}
            </div>
          ) : (
            <Link 
              to={`/note/${note._id}`}
              className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Open
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;