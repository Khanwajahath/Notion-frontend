import React, { createContext, useReducer, useEffect } from 'react';
import { Note, NotesState } from '../types';
import { useAuth } from '../hooks/useAuth';

interface NotesContextType extends NotesState {
  getNotes: () => Promise<void>;
  getNote: (id: string) => Promise<void>;
  createNote: (note: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  permanentlyDeleteNote: (id: string) => Promise<void>;
  clearCurrentNote: () => void;
}

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
};

type NotesAction =
  | { type: 'GET_NOTES_START' }
  | { type: 'GET_NOTES_SUCCESS'; payload: Note[] }
  | { type: 'GET_NOTES_FAILURE'; payload: string }
  | { type: 'GET_NOTE_START' }
  | { type: 'GET_NOTE_SUCCESS'; payload: Note }
  | { type: 'GET_NOTE_FAILURE'; payload: string }
  | { type: 'CREATE_NOTE_SUCCESS'; payload: Note }
  | { type: 'UPDATE_NOTE_SUCCESS'; payload: Note }
  | { type: 'DELETE_NOTE_SUCCESS'; payload: string }
  | { type: 'RESTORE_NOTE_SUCCESS'; payload: string }
  | { type: 'PERMANENTLY_DELETE_NOTE_SUCCESS'; payload: string }
  | { type: 'CLEAR_CURRENT_NOTE' };

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'GET_NOTES_START':
    case 'GET_NOTE_START':
      return { ...state, loading: true, error: null };
    case 'GET_NOTES_SUCCESS':
      return { ...state, notes: action.payload, loading: false };
    case 'GET_NOTE_SUCCESS':
      return { ...state, currentNote: action.payload, loading: false };
    case 'GET_NOTES_FAILURE':
    case 'GET_NOTE_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'CREATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        currentNote: action.payload,
      };
    case 'UPDATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        ),
        currentNote: action.payload,
      };
    case 'DELETE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload ? { ...note, isDeleted: true } : note
        ),
      };
    case 'RESTORE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload ? { ...note, isDeleted: false } : note
        ),
      };
    case 'PERMANENTLY_DELETE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
      };
    case 'CLEAR_CURRENT_NOTE':
      return { ...state, currentNote: null };
    default:
      return state;
  }
};

export const NotesContext = createContext<NotesContextType>({
  ...initialState,
  getNotes: async () => {},
  getNote: async () => {},
  createNote: async () => ({ _id: '', title: '', content: '', coverImage: null, icon: null, isDeleted: false, createdAt: '', updatedAt: '', userId: '' }),
  updateNote: async () => {},
  deleteNote: async () => {},
  restoreNote: async () => {},
  permanentlyDeleteNote: async () => {},
  clearCurrentNote: () => {},
});

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { token } = useAuth();

  const getNotes = async () => {
    if (!token) return;
    
    dispatch({ type: 'GET_NOTES_START' });
    try {
      const response = await fetch('https://notes-backend-a1vd.onrender.com/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notes');
      }

      dispatch({ type: 'GET_NOTES_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'GET_NOTES_FAILURE',
        payload: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const getNote = async (id: string) => {
    if (!token) return;
    
    dispatch({ type: 'GET_NOTE_START' });
    try {
      const response = await fetch(`https://notes-backend-a1vd.onrender.com/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch note');
      }

      dispatch({ type: 'GET_NOTE_SUCCESS', payload: data });
    } catch (error) {
      dispatch({
        type: 'GET_NOTE_FAILURE',
        payload: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const createNote = async (note: Partial<Note>): Promise<Note> => {
    if (!token) throw new Error('Authentication required');
    
    try {
      const response = await fetch('https://notes-backend-a1vd.onrender.com/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create note');
      }

      dispatch({ type: 'CREATE_NOTE_SUCCESS', payload: data });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateNote = async (id: string, note: Partial<Note>) => {
    if (!token) return;
    
    try {
      const response = await fetch(`https://notes-backend-a1vd.onrender.com/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update note');
      }

      dispatch({ type: 'UPDATE_NOTE_SUCCESS', payload: data });
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`https://notes-backend-a1vd.onrender.com/api/notes/${id}/trash`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete note');
      }

      dispatch({ type: 'DELETE_NOTE_SUCCESS', payload: id });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const restoreNote = async (id: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`https://notes-backend-a1vd.onrender.com/api/notes/${id}/restore`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to restore note');
      }

      dispatch({ type: 'RESTORE_NOTE_SUCCESS', payload: id });
    } catch (error) {
      console.error('Error restoring note:', error);
    }
  };

  const permanentlyDeleteNote = async (id: string) => {
    if (!token) return;
    
    try {
      const response = await fetch(`https://notes-backend-a1vd.onrender.com/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to permanently delete note');
      }

      dispatch({ type: 'PERMANENTLY_DELETE_NOTE_SUCCESS', payload: id });
    } catch (error) {
      console.error('Error permanently deleting note:', error);
    }
  };

  const clearCurrentNote = () => {
    dispatch({ type: 'CLEAR_CURRENT_NOTE' });
  };

  useEffect(() => {
    if (token) {
      getNotes();
    }
  }, [token]);

  return (
    <NotesContext.Provider
      value={{
        ...state,
        getNotes,
        getNote,
        createNote,
        updateNote,
        deleteNote,
        restoreNote,
        permanentlyDeleteNote,
        clearCurrentNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};