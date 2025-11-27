import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../contexts/AdminContext';

interface EditableProps {
  id: string;
  defaultContent: string;
  type?: 'text' | 'textarea' | 'image' | 'price';
  className?: string;
  children?: React.ReactNode; // For image wrapping
  editButtonPosition?: 'center' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Helper to compress images before saving to localStorage
const compressImage = (base64Str: string, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
          resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

const Editable: React.FC<EditableProps> = ({ 
  id, 
  defaultContent, 
  type = 'text', 
  className = '', 
  children,
  editButtonPosition = 'center'
}) => {
  const { isAdmin, content, updateContent } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content[id] || defaultContent);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
    // Check for Google Drive links and convert them
    let finalValue = value;
    if (type === 'image' && value.includes('drive.google.com') && value.includes('/view')) {
        const fileIdMatch = value.match(/\/d\/(.+?)\//);
        if (fileIdMatch && fileIdMatch[1]) {
            finalValue = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
            setValue(finalValue);
        }
    }

    updateContent(id, finalValue);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        try {
            // Compress image to avoid localStorage limits
            const compressedBase64 = await compressImage(rawBase64);
            setValue(compressedBase64);
            setUploading(false);
        } catch (error) {
            console.error("Erro ao comprimir imagem", error);
            setValue(rawBase64); // Fallback to raw if compression fails
            setUploading(false);
        }
    };

    reader.readAsDataURL(file);
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
    let posClasses = "items-center justify-center";
    if (editButtonPosition === 'top-right') posClasses = "items-start justify-end p-8";
    else if (editButtonPosition === 'top-left') posClasses = "items-start justify-start p-8";
    else if (editButtonPosition === 'bottom-right') posClasses = "items-end justify-end p-8";
    else if (editButtonPosition === 'bottom-left') posClasses = "items-end justify-start p-8";

    return (
      <div className="relative group w-full h-full">
        <img src={value} className={`${className} group-hover:opacity-50 transition-opacity`} alt="Editable content" />
        <div className={`absolute inset-0 flex ${posClasses} opacity-0 group-hover:opacity-100 transition-opacity z-20`}>
           <button 
             onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
             className="bg-brand text-slate-900 px-4 py-2 rounded font-bold shadow-lg transform hover:scale-105 transition-transform"
           >
             Alterar Imagem
           </button>
        </div>
        {isEditing && (
          <div 
            className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-4 animate-fade-in cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
             <h4 className="text-white mb-2 font-bold uppercase text-xs tracking-wider">URL ou Upload:</h4>
             
             {/* Text Input for URL */}
             <input 
               type="text" 
               value={value.substring(0, 50) + (value.length > 50 ? '...' : '')} // Truncate long base64 for display
               onChange={(e) => setValue(e.target.value)}
               className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600 mb-2 text-xs focus:border-brand outline-none"
               placeholder="Cole um link https://..."
             />

             <div className="text-slate-500 text-[10px] mb-2 font-bold uppercase">- OU -</div>

             {/* File Upload Button */}
             <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
             />
             <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-slate-700 hover:bg-slate-600 text-white w-full py-2 rounded text-xs font-bold uppercase mb-4 transition-colors flex items-center justify-center gap-2"
             >
                {uploading ? (
                    <span className="animate-pulse">Comprimindo...</span>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Carregar do Dispositivo
                    </>
                )}
             </button>

             <div className="flex gap-2 w-full">
               <button onClick={handleSave} className="flex-1 bg-brand text-slate-900 px-4 py-2 rounded font-bold text-sm hover:bg-white transition-colors">Salvar</button>
               <button onClick={() => { setIsEditing(false); setValue(content[id] || defaultContent); }} className="flex-1 bg-red-500 text-white px-4 py-2 rounded font-bold text-sm hover:bg-red-600 transition-colors">Cancelar</button>
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
      <span className="absolute -top-3 -right-3 bg-brand text-slate-900 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold shadow-sm z-10">EDITAR</span>
    </span>
  );
};

export default Editable;