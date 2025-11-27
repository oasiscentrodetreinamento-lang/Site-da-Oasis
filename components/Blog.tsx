import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const CATEGORIES = ['Todos', 'Treino', 'Nutrição', 'Bem-estar', 'Novidades', 'Dicas'];

const Blog: React.FC = () => {
  const { currentUser, isAdmin, blogPosts, addPost, deletePost, toggleLike, addComment, openAuthModal } = useAdmin();
  
  // Create Post State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Treino');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Filter State
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  // State to track which comments sections are open
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handlePost = () => {
    if (!newPostContent.trim() || !newPostTitle.trim()) return;
    addPost(newPostTitle, newPostCategory, newPostContent, newPostImage);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage('');
    setIsCreating(false);
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
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredPosts = activeCategory === 'Todos' 
    ? blogPosts 
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <div className="pt-24 pb-24 bg-slate-900 min-h-screen">
        
      {/* Blog Header / Categories */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 overflow-x-auto custom-scrollbar gap-8">
                <div className="flex gap-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`uppercase text-xs font-bold tracking-widest whitespace-nowrap transition-colors ${
                                activeCategory === cat 
                                ? 'text-brand border-b-2 border-brand pb-1' 
                                : 'text-slate-400 hover:text-white pb-1'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                {currentUser && (
                    <button 
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-brand text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors shrink-0"
                    >
                        {isCreating ? 'Cancelar' : 'Escrever Artigo'}
                    </button>
                )}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Editor Area */}
                {isCreating && currentUser && (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 animate-fade-in">
                        <h3 className="text-white font-display font-bold text-xl uppercase mb-6">Novo Artigo</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Título</label>
                                <input
                                    type="text"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-brand outline-none"
                                    placeholder="Um título chamativo..."
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Categoria</label>
                                    <select
                                        value={newPostCategory}
                                        onChange={(e) => setNewPostCategory(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-brand outline-none"
                                    >
                                        {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Imagem de Capa (URL)</label>
                                    <input
                                        type="text"
                                        value={newPostImage}
                                        onChange={(e) => setNewPostImage(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-brand outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Conteúdo</label>
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-brand outline-none min-h-[200px]"
                                    placeholder="Escreva seu artigo aqui..."
                                />
                            </div>

                            <button 
                                onClick={handlePost}
                                className="w-full bg-brand hover:bg-brand-dark text-slate-900 font-bold py-3 rounded uppercase tracking-widest transition-colors"
                            >
                                Publicar Artigo
                            </button>
                        </div>
                    </div>
                )}

                {/* Posts Feed */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                        <p className="text-slate-400">Nenhum artigo encontrado nesta categoria.</p>
                    </div>
                ) : (
                    filteredPosts.map(post => {
                        const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
                        const commentsOpen = openComments.has(post.id);
                        const canDelete = isAdmin || (currentUser?.id === post.author.id);

                        return (
                            <article key={post.id} className="bg-slate-900 border-b border-slate-800 pb-12 mb-8 last:border-0 relative group">
                                {canDelete && (
                                    <button 
                                        onClick={() => deletePost(post.id)}
                                        className="absolute top-0 right-0 z-10 text-slate-500 hover:text-red-500 bg-black/50 p-2 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                )}

                                {/* Category & Date */}
                                <div className="flex items-center gap-3 mb-4 text-xs font-bold tracking-widest uppercase">
                                    <span className="text-brand">{post.category || 'Geral'}</span>
                                    <span className="text-slate-600">|</span>
                                    <span className="text-slate-500">{formatDate(post.date)}</span>
                                </div>

                                {/* Hero Image */}
                                {post.image && (
                                    <div className="w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl mb-6 shadow-2xl">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
                                    </div>
                                )}

                                {/* Title */}
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase mb-6 leading-tight hover:text-brand-accent transition-colors cursor-pointer">
                                    {post.title}
                                </h2>

                                {/* Author Info */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700">
                                        {getInitials(post.author.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Por {post.author.name}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">{post.author.isAdmin ? 'Equipe Oasis' : 'Membro da Comunidade'}</p>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="prose prose-invert prose-lg max-w-none text-slate-300 mb-8 whitespace-pre-wrap leading-relaxed">
                                    {post.content}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t border-slate-800 pt-6">
                                    <div className="flex gap-6">
                                        <button 
                                            onClick={() => currentUser ? toggleLike(post.id) : openAuthModal()}
                                            className={`flex items-center gap-2 text-sm uppercase font-bold tracking-wider transition-colors ${isLiked ? 'text-brand' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {post.likedBy.length} <span className="hidden sm:inline">Curtidas</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => toggleComments(post.id)}
                                            className="flex items-center gap-2 text-sm uppercase font-bold tracking-wider text-slate-500 hover:text-white transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            {post.comments.length} <span className="hidden sm:inline">Comentários</span>
                                        </button>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button className="text-slate-500 hover:text-brand transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></button>
                                        <button className="text-slate-500 hover:text-brand transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></button>
                                    </div>
                                </div>

                                {/* Comments Dropdown */}
                                {commentsOpen && (
                                    <div className="bg-slate-800/30 rounded-xl p-6 mt-6 animate-fade-in border border-slate-800">
                                        <h4 className="text-white font-bold uppercase text-sm mb-4">Discussão ({post.comments.length})</h4>
                                        <div className="space-y-4 mb-6">
                                            {post.comments.map(comment => (
                                                <div key={comment.id} className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                                                        {getInitials(comment.author.name)}
                                                    </div>
                                                    <div className="bg-slate-900 rounded-lg p-3 flex-1 border border-slate-700">
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

                                        {currentUser ? (
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={commentInputs[post.id] || ''}
                                                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                                                    placeholder="Deixe seu comentário..."
                                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:border-brand focus:outline-none"
                                                />
                                                <button 
                                                    onClick={() => handleCommentSubmit(post.id)}
                                                    className="bg-brand text-slate-900 rounded-lg px-4 font-bold uppercase text-xs"
                                                >
                                                    Enviar
                                                </button>
                                            </div>
                                        ) : (
                                            <div onClick={openAuthModal} className="text-center text-slate-500 text-sm py-2 cursor-pointer hover:text-brand">
                                                Faça login para comentar.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </div>

            {/* Sidebar Column */}
            <div className="hidden lg:block space-y-8">
                {/* Profile Card */}
                <div className="bg-[#fcf8f2] text-slate-900 p-8 text-center border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(250,204,21,1)]">
                    <div className="w-24 h-24 rounded-full bg-slate-900 mx-auto mb-4 overflow-hidden border-2 border-brand">
                        <div className="w-full h-full flex items-center justify-center text-brand text-2xl font-bold font-display">
                            OASIS
                        </div>
                    </div>
                    <h3 className="font-display font-bold text-2xl uppercase mb-2">Oasis Lifestyle</h3>
                    <div className="w-10 h-1 bg-brand mx-auto mb-4"></div>
                    <p className="text-sm text-slate-700 mb-6 leading-relaxed font-medium">
                        Um espaço dedicado para promover o bem-estar, a performance e a transformação positiva. Aqui compartilhamos dicas, novidades e histórias da nossa comunidade.
                    </p>
                    <button onClick={() => document.getElementById('membership')?.scrollIntoView({behavior: 'smooth'})} className="text-xs font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-brand hover:border-brand transition-colors">
                        Conheça o CT
                    </button>
                </div>

                {/* Newsletter Box */}
                <div className="bg-slate-800 p-8 text-center border border-slate-700 rounded-xl">
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Inscreva-se</h4>
                    <p className="text-slate-400 text-xs mb-4">Receba dicas de treino e nutrição direto no seu e-mail.</p>
                    <input type="email" placeholder="Seu melhor e-mail" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm mb-2" />
                    <button className="w-full bg-brand text-slate-900 font-bold uppercase text-xs py-2 rounded hover:bg-white transition-colors">Cadastrar</button>
                </div>

                 {/* Tags Cloud */}
                 <div className="bg-slate-900 p-6 border border-slate-800 rounded-xl">
                    <h4 className="text-brand font-bold uppercase tracking-widest text-xs mb-4 border-b border-slate-800 pb-2">Assuntos Populares</h4>
                    <div className="flex flex-wrap gap-2">
                        {['Hipertrofia', 'Emagrecimento', 'Receitas', 'Yoga', 'Eventos', 'Saúde Mental'].map(tag => (
                            <span key={tag} className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded hover:text-white hover:bg-slate-700 cursor-pointer transition-colors">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Blog;