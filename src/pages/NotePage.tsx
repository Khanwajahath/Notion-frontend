import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import NoteEditor from '../components/NoteEditor';
import { Trash2 } from 'lucide-react';

const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { deleteNote, currentNote } = useNotes();
  const navigate = useNavigate();

  const handleDeleteNote = () => {
    if (!id) return;
    
    if (window.confirm('Move this page to trash?')) {
      deleteNote(id);
      navigate('/');
    }
  };

  if (!id) {
    return <div>Invalid note ID</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex justify-end">
        <button
          onClick={handleDeleteNote}
          className="text-gray-500 hover:text-red-600 flex items-center gap-1 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
          title="Delete page"
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>
      
      <div className="flex-1">
        <NoteEditor noteId={id} />
      </div>
    </div>
  );
};

export default NotePage;