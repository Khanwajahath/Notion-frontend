import React, { useState, useEffect, useRef } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useNotes } from '../hooks/useNotes';
import { Image, ImageOff, Smile, Type } from 'lucide-react';
import { Note } from '../types';

interface NoteEditorProps {
  noteId: string;
}

const COVER_IMAGES = [
  'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1261729/pexels-photo-1261729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/33041/antelope-canyon-lower-canyon-arizona.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
];

const ICONS = ['📝', '📚', '🗒️', '✍️', '📌', '🔖', '📋', '🗂️', '📑', '📔'];

const FONTS = [
  { name: 'Mono', class: 'font-mono' },
  { name: 'Serif', class: 'font-serif' },
  { name: 'Sans', class: 'font-sans' },
];


const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
  const { currentNote, getNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getNote(noteId);
  }, [noteId]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  const handleTitleChange = (e: ContentEditableEvent) => {
    setTitle(e.target.value);
    scheduleNoteSave({ title: e.target.value });
  };

  const handleContentChange = (e: ContentEditableEvent) => {
    setContent(e.target.value);
    scheduleNoteSave({ content: e.target.value });
  };

  const scheduleNoteSave = (updates: Partial<Note>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (currentNote) {
        updateNote(currentNote._id, updates);
      }
      saveTimeoutRef.current = null;
    }, 1000);
  };

  const handleSetCoverImage = (imageUrl: string | null) => {
    if (currentNote) {
      updateNote(currentNote._id, { coverImage: imageUrl });
    }
    setShowCoverMenu(false);
  };

  const handleSetIcon = (icon: string | null) => {
    if (currentNote) {
      updateNote(currentNote._id, { icon });
    }
    setShowIconMenu(false);
  };

  const handleFontChange = (font: typeof FONTS[0]) => {
    setSelectedFont(font);
    setShowFontMenu(false);
  };

  if (!currentNote) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 notion-editor">
      {/* Cover Image */}
      {currentNote.coverImage ? (
        <div className="relative">
          <img 
            src={currentNote.coverImage} 
            alt="Cover" 
            className="page-cover"
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button 
              onClick={() => setShowCoverMenu(true)}
              className="bg-white p-1.5 rounded-md shadow-sm hover:bg-gray-100 transition-colors"
              title="Change cover"
            >
              <Image size={16} />
            </button>
            <button 
              onClick={() => handleSetCoverImage(null)}
              className="bg-white p-1.5 rounded-md shadow-sm hover:bg-gray-100 transition-colors"
              title="Remove cover"
            >
              <ImageOff size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end my-4">
          <button 
            onClick={() => setShowCoverMenu(true)}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded text-sm"
          >
            <Image size={16} />
            <span>Add cover</span>
          </button>
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center">
        {currentNote.icon ? (
          <div 
            className="page-icon cursor-pointer"
            onClick={() => setShowIconMenu(true)}
          >
            {currentNote.icon}
          </div>
        ) : (
          <button 
            onClick={() => setShowIconMenu(true)}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded text-sm"
          >
            <Smile size={16} />
            <span>Add icon</span>
          </button>
        )}
        
        <div className="ml-auto flex items-center">
          <div className="relative">
            <button 
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded text-sm"
            >
              <Type size={16} />
              <span>{selectedFont.name}</span>
            </button>
            
            {showFontMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-10 py-1 dropdown-menu min-w-32">
                {FONTS.map((font) => (
                  <button
                    key={font.name}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${font.class}`}
                    onClick={() => handleFontChange(font)}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image Menu */}
      {showCoverMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center" onClick={() => setShowCoverMenu(false)}>
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-medium text-lg mb-3">Choose a cover</h3>
            <div className="grid grid-cols-3 gap-2">
              {COVER_IMAGES.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Cover option ${index + 1}`}
                  className="h-24 w-full object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleSetCoverImage(image)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Icon Menu */}
      {showIconMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center" onClick={() => setShowIconMenu(false)}>
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-medium text-lg mb-3">Choose an icon</h3>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((icon, index) => (
                <button
                  key={index}
                  className="h-12 w-12 flex items-center justify-center text-2xl hover:bg-gray-100 rounded"
                  onClick={() => handleSetIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
            {currentNote.icon && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  className="text-red-500 text-sm"
                  onClick={() => handleSetIcon(null)}
                >
                  Remove icon
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Title */}
      <ContentEditable
        html={title}
        onChange={handleTitleChange}
        className={`notion-title mt-4 ${selectedFont.class}`}
        tagName="h1"
        placeholder="Untitled"
      />

      {/* Content */}
      <ContentEditable
        html={content}
        onChange={handleContentChange}
        className={`notion-content ${selectedFont.class}`}
        placeholder="Start writing..."
      />
    </div>
  );
};

export default NoteEditor;