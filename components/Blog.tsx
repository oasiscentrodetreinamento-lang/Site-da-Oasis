import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const Blog: React.FC = () => {
  const { currentUser, isAdmin, blogPosts, addPost, deletePost, toggleLike, addComment, openAuthModal } = useAdmin();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  
  // State to track which comments sections are open
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    addPost(newPostContent, newPostImage);
    setNewPostContent('');
    setNewPostImage('');
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    
    addComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const toggleComments = (postId: string) => {
    const newOpen = new Set(openComments);
    if (newOpen.has(postId)) {
      newOpen.delete(postId);
    } else {
      newOpen.add(postId);
    }
    setOpenComments(newOpen);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="pt-32 pb-24 bg-slate-900 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
            <h2 className="text-brand font-bold uppercase tracking-widest mb-2">Feed de Notícias</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white uppercase">O que está rolando</h3>
        </div>

        {/* Posting Area */}
        <div className="bg-slate-800/80 backdrop-blur rounded-xl border border-brand/20 p-6 mb-10 shadow-lg relative overflow-hidden group">
            {currentUser ? (
               <>
                 <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    {isAdmin ? 'Publicação Oficial' : 'Compartilhe com a galera'}
                 </h4>
                
                 <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-slate-900 font-bold shrink-0 shadow-lg ${isAdmin ? 'bg-gradient-to-br from-brand to-brand-dark' : 'bg-slate-600 text-white'}`}>
                        {getInitials(currentUser.name)}
                    </div>
                    <div className="flex-1 space-y-3">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder={`O que você está pensando, ${currentUser.name.split(' ')[0]}?`}
                            className="w-full bg-slate-900/50 text-white rounded-lg p-4 border border-slate-700 focus:border-brand outline-none resize-none h-24 transition-colors placeholder:text-slate-600"
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
               </>
            ) : (
                <div className="text-center py-6">
                    <p className="text-slate-400 mb-4">Faça login para publicar e interagir com a comunidade Oasis.</p>
                    <button 
                       onClick={openAuthModal}
                       className="bg-slate-700 hover:bg-brand hover:text-slate-900 text-white px-6 py-2 rounded-full font-bold uppercase text-sm transition-colors"
                    >
                        Entrar ou Cadastrar
                    </button>
                </div>
            )}
        </div>

        {/* Feed */}
        <div className="space-y-6">
            {blogPosts.length === 0 && (
                <div className="text-center text-slate-500 py-12 border border-dashed border-slate-800 rounded-xl">
                    <p>Nenhuma novidade por enquanto.</p>
                </div>
            )}

            {blogPosts.map((post) => {
                const isAuthor = currentUser?.id === post.author.id;
                const canDelete = isAdmin || isAuthor;
                const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
                const commentsOpen = openComments.has(post.id);

                return (
                <div key={post.id} className={`rounded-xl p-6 border transition-colors animate-fade-in-up relative group ${post.author.isAdmin ? 'bg-slate-800/50 border-brand/20 shadow-[0_0_15px_rgba(250,204,21,0.05)]' : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800/50'}`}>
                    {canDelete && (
                        <button 
                            onClick={() => deletePost(post.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/50 p-2 rounded-full hover:bg-slate-900"
                            title="Apagar Post"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    )}
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border flex items-center justify-center font-bold ${post.author.isAdmin ? 'bg-brand text-slate-900 border-brand' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                             {post.author.isAdmin ? (
                                <span className="text-xs">ADM</span>
                             ) : (
                                getInitials(post.author.name)
                             )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`font-bold ${post.author.isAdmin ? 'text-brand' : 'text-white'}`}>{post.author.name}</span>
                                {post.author.isAdmin && (
                                   <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                )}
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
                            
                            {/* Actions Bar */}
                            <div className="flex gap-6 text-slate-500 text-sm border-t border-slate-700/50 pt-3 mt-4">
                                <button 
                                    onClick={() => currentUser ? toggleLike(post.id) : openAuthModal()}
                                    className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-brand' : 'hover:text-brand'}`}
                                >
                                    <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-brand/10' : 'group-hover:bg-brand/10'}`}>
                                        <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <span>{post.likedBy.length} <span className="hidden sm:inline">Curtidas</span></span>
                                </button>
                                
                                <button 
                                    onClick={() => toggleComments(post.id)}
                                    className={`flex items-center gap-2 transition-colors group hover:text-white ${commentsOpen ? 'text-white' : ''}`}
                                >
                                    <div className="p-2 rounded-full group-hover:bg-slate-700 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    </div>
                                    <span>{post.comments.length} <span className="hidden sm:inline">Respostas</span></span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {commentsOpen && (
                                <div className="mt-4 pt-4 border-t border-slate-700/30 animate-fade-in">
                                    {/* Existing Comments */}
                                    <div className="space-y-4 mb-4">
                                        {post.comments.map(comment => (
                                            <div key={comment.id} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                                                    {getInitials(comment.author.name)}
                                                </div>
                                                <div className="bg-slate-900/50 rounded-2xl rounded-tl-none p-3 px-4 flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-bold ${comment.author.isAdmin ? 'text-brand' : 'text-white'}`}>
                                                            {comment.author.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500">{formatDate(comment.date)}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-300">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Comment Input */}
                                    {currentUser ? (
                                        <div className="flex gap-3 items-start">
                                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                {getInitials(currentUser.name)}
                                            </div>
                                            <div className="flex-1 flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={commentInputs[post.id] || ''}
                                                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                                                    placeholder="Escreva uma resposta..."
                                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:border-brand focus:outline-none placeholder:text-slate-600"
                                                />
                                                <button 
                                                    onClick={() => handleCommentSubmit(post.id)}
                                                    disabled={!commentInputs[post.id]?.trim()}
                                                    className="bg-brand text-slate-900 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-center text-xs text-slate-500 py-2">Entre para participar da conversa.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )})}
        </div>
      </div>
    </div>
  );
};

export default Blog;