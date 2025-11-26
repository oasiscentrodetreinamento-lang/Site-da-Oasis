import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';

interface EditableProps {
  id: string;
  defaultContent: string;
  type?: 'text' | 'textarea' | 'image' | 'price';
  className?: string;
  children?: React.ReactNode; // For image wrapping
}

const Editable: React.FC<EditableProps> = ({ id, defaultContent, type = 'text', className = '', children }) => {
  const { isAdmin, content, updateContent } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content[id] || defaultContent);

  useEffect(() => {
    // Ensure content matches global state if updated elsewhere or initialized
    if (content[id] !== value && content[id] !== undefined) {
      setValue(content[id]);
    } else if (content[id] === undefined) {
       // Initialize if key is missing
       updateContent(id, defaultContent);
    }
  }, [content, id, defaultContent]);

  const handleSave = () => {
    updateContent(id, value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setValue(content[id] || defaultContent);
      setIsEditing(false);
    }
  };

  if (!isAdmin) {
    if (type === 'image') {
      return <img src={value} className={className} alt="Editable content" />;
    }
    if (type === 'price') {
       return <>{value}</>;
    }
    return <span className={`${className} whitespace-pre-wrap`}>{value}</span>;
  }

  // Admin View
  if (type === 'image') {
    return (
      <div className="relative group">
        <img src={value} className={`${className} group-hover:opacity-50 transition-opacity`} alt="Editable content" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             onClick={() => setIsEditing(true)}
             className="bg-brand text-slate-900 px-4 py-2 rounded font-bold shadow-lg"
           >
             Alterar Imagem
           </button>
        </div>
        {isEditing && (
          <div className="absolute inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center p-4">
             <h4 className="text-white mb-2">URL da Imagem:</h4>
             <input 
               type="text" 
               value={value} 
               onChange={(e) => setValue(e.target.value)}
               className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600 mb-2"
             />
             <div className="flex gap-2">
               <button onClick={handleSave} className="bg-brand px-3 py-1 rounded font-bold text-sm">Salvar</button>
               <button onClick={() => { setIsEditing(false); setValue(content[id] || defaultContent); }} className="bg-red-500 text-white px-3 py-1 rounded font-bold text-sm">Cancelar</button>
             </div>
          </div>
        )}
      </div>
    );
  }

  if (isEditing) {
    if (type === 'textarea') {
        return (
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className={`bg-slate-800 text-white border border-brand p-2 rounded outline-none w-full ${className}`}
                rows={4}
            />
        )
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className={`bg-slate-800 text-white border border-brand p-1 rounded outline-none min-w-[50px] ${className}`}
      />
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)} 
      className={`cursor-pointer border-2 border-transparent hover:border-brand hover:bg-slate-800/50 rounded px-1 -mx-1 transition-all whitespace-pre-wrap relative group ${className}`}
      title="Clique para editar"
    >
      {value}
      <span className="absolute -top-3 -right-3 bg-brand text-slate-900 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">EDITAR</span>
    </span>
  );
};

export default Editable;