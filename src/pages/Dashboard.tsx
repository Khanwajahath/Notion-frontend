// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useNotes } from '../hooks/useNotes';
// import { useAuth } from '../hooks/useAuth';
// import NoteCard from '../components/NoteCard';
// import { PlusCircle, BookOpen } from 'lucide-react';

// const Dashboard: React.FC = () => {
//   const { notes, createNote } = useNotes();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const activeNotes = notes.filter(note => !note.isDeleted);

//   const handleCreateNote = async () => {
//     try {
//       const newNote = await createNote({
//         title: 'Untitled',
//         content: ''
//       });
//       navigate(`/note/${newNote._id}`);
//     } catch (error) {
//       console.error('Error creating note:', error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">
//           {user?.name}'s Notes
//         </h1>
//         <button
//           onClick={handleCreateNote}
//           className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           <PlusCircle size={18} />
//           <span>New page</span>
//         </button>
//       </div>

//       {activeNotes.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {activeNotes.map(note => (
//             <NoteCard key={note._id} note={note} />
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center py-20 text-center">
//           <BookOpen size={48} className="text-gray-300 mb-4" />
//           <h2 className="text-xl font-medium text-gray-600 mb-2">No notes yet</h2>
//           <p className="text-gray-500 mb-6 max-w-md">
//             Create your first note by clicking the "New page" button above.
//           </p>
//           <button
//             onClick={handleCreateNote}
//             className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             <PlusCircle size={18} />
//             <span>Create your first note</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../hooks/useAuth';
import NoteCard from '../components/NoteCard';
import { PlusCircle, BookOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { notes, createNote } = useNotes();
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeNotes = notes.filter(note => !note.isDeleted);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'Untitled',
        content: ''
      });
      navigate(`/note/${newNote._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Responsive spacing to avoid hamburger menu overlap
  const isMobile = window.innerWidth < 768;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        {/* Add left padding on mobile to avoid overlap with hamburger icon */}
        <h1 className={`text-2xl font-bold text-gray-900 ${isMobile ? 'ml-8' : ''}`}>
          {user?.name}'s Notes
        </h1>
        <button
          onClick={handleCreateNote}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={18} />
          <span>New page</span>
        </button>
      </div>

      {activeNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeNotes.map(note => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">No notes yet</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Create your first note by clicking the "New page" button above.
          </p>
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={18} />
            <span>Create your first note</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;