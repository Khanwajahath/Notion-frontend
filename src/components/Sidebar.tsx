// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useNotes } from '../hooks/useNotes';
// import { useAuth } from '../hooks/useAuth';
// import { 
//   PlusCircle, 
//   Trash2, 
//   LogOut, 
//   ChevronDown, 
//   ChevronRight,
//   FileText
// } from 'lucide-react';

// const Sidebar: React.FC = () => {
//   const [expanded, setExpanded] = useState(true);
//   const { notes, createNote } = useNotes();
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

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

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="w-60 h-screen border-r border-gray-200 bg-[var(--sidebar-bg)] flex flex-col">
//       <div className="p-4 flex items-center justify-between">
//         <div className="font-semibold text-sm truncate">
//           {user?.name}'s Workspace
//         </div>
//         <button 
//           onClick={handleCreateNote}
//           className="text-gray-500 hover:text-gray-700"
//           title="New page"
//         >
//           <PlusCircle size={18} />
//         </button>
//       </div>
      
//       <div className="flex-1 overflow-y-auto px-2">
//         <div className="mb-2">
//           <div 
//             className="flex items-center px-2 py-1 text-sm text-gray-500 cursor-pointer"
//             onClick={() => setExpanded(!expanded)}
//           >
//             {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             <span className="ml-1">Pages</span>
//           </div>
          
//           {expanded && (
//             <div className="ml-2 mt-1 space-y-1">
//               {activeNotes.map(note => (
//                 <Link 
//                   key={note._id}
//                   to={`/note/${note._id}`}
//                   className={`sidebar-item ${location.pathname === `/note/${note._id}` ? 'active' : ''}`}
//                 >
//                   <FileText size={16} />
//                   <span className="truncate">{note.title || 'Untitled'}</span>
//                 </Link>
//               ))}
              
//               {activeNotes.length === 0 && (
//                 <div className="text-gray-400 text-xs px-2 py-1">
//                   No pages yet
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="p-2 border-t border-gray-200">
//         <Link 
//           to="/trash" 
//           className={`sidebar-item ${location.pathname === '/trash' ? 'active' : ''}`}
//         >
//           <Trash2 size={16} />
//           <span>Trash</span>
//         </Link>
        
//         <button 
//           onClick={handleLogout} 
//           className="sidebar-item w-full text-left"
//         >
//           <LogOut size={16} />
//           <span>Sign out</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../hooks/useAuth';
import {
  PlusCircle,
  Trash2,
  LogOut,
  ChevronDown,
  ChevronRight,
  FileText,
  Menu
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { notes, createNote } = useNotes();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeNotes = notes.filter(note => !note.isDeleted);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger menu for mobile - positioned to avoid name overlap */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md flex items-center justify-center top-16"
          aria-label="Toggle sidebar"
          style={{ transform: 'translateY(-50%)' }}
        >
          <Menu size={15} />
        </button>
      )}
      
      {/* Sidebar with conditional classes for responsive behavior */}
      <div className={`
        ${isMobile ? 'fixed z-20 left-0 top-0 h-screen' : 'h-screen'} 
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        w-60 border-r border-gray-200 bg-[var(--sidebar-bg)] flex flex-col
        transition-transform duration-300 ease-in-out
      `}>
        <div className="p-4 flex items-center justify-between top-10">
          <div className="font-semibold text-sm truncate top-5">
            {user?.name}'s Workspace
          </div>
          <button
            onClick={handleCreateNote}
            className="text-gray-500 hover:text-gray-700"
            title="New page"
          >
            <PlusCircle size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2  ">
          <div className={`${isMobile ? 'mb-2 absolute left-10' : 'mb-2'}`}>
            <div
              className="flex items-center px-2 py-1 text-sm text-gray-500 cursor-pointer "
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-1">Pages</span>
            </div>
            
            {expanded && (
              <div className="ml-2 mt-1 space-y-1">
                {activeNotes.map(note => (
                  <Link
                    key={note._id}
                    to={`/note/${note._id}`}
                    className={`sidebar-item ${location.pathname === `/note/${note._id}` ? 'active' : ''}`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <FileText size={16} />
                    <span className="truncate">{note.title || 'Untitled'}</span>
                  </Link>
                ))}
                
                {activeNotes.length === 0 && (
                  <div className="text-gray-400 text-xs px-2 py-1">
                    No pages yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-2 border-t border-gray-200">
          <Link
            to="/trash"
            className={`sidebar-item ${location.pathname === '/trash' ? 'active' : ''}`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <Trash2 size={16} />
            <span>Trash</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-left"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile view when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;