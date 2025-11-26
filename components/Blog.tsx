import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const Blog: React.FC = () => {
  const { isAdmin, blogPosts, addPost, deletePost } = useAdmin();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    addPost(newPostContent, newPostImage);
    setNewPostContent('');
    setNewPostImage('');
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  return (
    <div className="pt-32 pb-24 bg-slate-900 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
            <h2 className="text-brand font-bold uppercase tracking-widest mb-2">Feed de Notícias</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white uppercase">O que está rolando</h3>
        </div>

        {/* Admin Posting Area */}
        {isAdmin && (
            <div className="bg-slate-800/80 backdrop-blur rounded-xl border border-brand/20 p-6 mb-10 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-brand text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Modo Admin</div>
                <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Nova Publicação
                </h4>
                
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-slate-900 font-bold shrink-0 shadow-lg">
                        ADM
                    </div>
                    <div className="flex-1 space-y-3">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="O que há de novo no Oasis CT? Compartilhe com os alunos..."
                            className="w-full bg-slate-900/50 text-white rounded-lg p-4 border border-slate-700 focus:border-brand outline-none resize-none h-32 transition-colors placeholder:text-slate-600"
                        />
                        
                        <div className="flex gap-2">
                             <input
                                type="text"
                                value={newPostImage}
                                onChange={(e) => setNewPostImage(e.target.value)}
                                placeholder="URL da imagem (opcional)"
                                className="flex-1 bg-slate-900/50 text-white rounded-lg p-3 border border-slate-700 focus:border-brand outline-none text-sm transition-colors placeholder:text-slate-600"
                            />
                        </div>

                        {newPostImage && (
                            <div className="relative h-48 rounded-lg overflow-hidden border border-slate-700 group/preview">
                                <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Preview</div>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={handlePost}
                                disabled={!newPostContent.trim()}
                                className="bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold px-8 py-3 rounded-lg uppercase text-sm tracking-widest transition-all transform hover:translate-y-px shadow-lg hover:shadow-brand/20"
                            >
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Feed */}
        <div className="space-y-6">
            {blogPosts.length === 0 && (
                <div className="text-center text-slate-500 py-12 border border-dashed border-slate-800 rounded-xl">
                    <p>Nenhuma novidade por enquanto.</p>
                </div>
            )}

            {blogPosts.map((post) => (
                <div key={post.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-800 hover:bg-slate-800 transition-colors animate-fade-in-up relative group">
                    {isAdmin && (
                        <button 
                            onClick={() => deletePost(post.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/50 p-2 rounded-full hover:bg-slate-900"
                            title="Apagar Post"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    )}
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden shrink-0 border border-slate-600">
                             <img src="https://ui-avatars.com/api/?name=Oasis+CT&background=FACC15&color=0f172a&bold=true" alt="Oasis CT" className="w-full h-full" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-white">Oasis CT</span>
                                <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                <span className="text-slate-500 text-sm">· {formatDate(post.date)}</span>
                            </div>
                            <p className="text-slate-200 whitespace-pre-wrap mb-4 leading-relaxed">
                                {post.content}
                            </p>
                            {post.image && (
                                <div className="rounded-xl overflow-hidden mb-4 border border-slate-700 bg-slate-900">
                                    <img src={post.image} alt="Post attachment" className="w-full h-auto object-cover max-h-96" />
                                </div>
                            )}
                            
                            <div className="flex gap-6 text-slate-500 text-sm">
                                <button className="flex items-center gap-2 hover:text-brand transition-colors group">
                                    <div className="p-2 rounded-full group-hover:bg-brand/10 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                    </div>
                                    <span>{post.likes}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;