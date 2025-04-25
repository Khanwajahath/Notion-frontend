import React from 'react';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import { Trash2 } from 'lucide-react';

const TrashPage: React.FC = () => {
  const { notes, restoreNote, permanentlyDeleteNote } = useNotes();
  const trashNotes = notes.filter(note => note.isDeleted);

  const handleRestore = (id: string) => {
    restoreNote(id);
  };

  const handlePermanentDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
      permanentlyDeleteNote(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
      </div>

      {trashNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trashNotes.map(note => (
            <NoteCard 
              key={note._id} 
              note={note} 
              isTrash={true}
              onRestore={handleRestore}
              onDelete={handlePermanentDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trash2 size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">Trash is empty</h2>
          <p className="text-gray-500 max-w-md">
            Notes in the trash will be automatically deleted after 30 days.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrashPage;