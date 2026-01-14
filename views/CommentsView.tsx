
import React, { useState } from 'react';
import { moderateComment } from '../services/geminiService';
import { Comment } from '../types';

interface CommentsViewProps {
  currentUsername: string;
}

const CommentsView: React.FC<CommentsViewProps> = ({ currentUsername }) => {
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', author: 'User#9821', text: 'Cyra found a bad link in my SMS! Safe now.', timestamp: Date.now() - 3600000, isModerated: true },
    { id: '2', author: 'User#1209', text: 'This app is really good at checking games.', timestamp: Date.now() - 7200000, isModerated: true }
  ]);

  const handlePost = async () => {
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const moderation = await moderateComment(commentText);
      if (moderation.isAllowed) {
        const newComment: Comment = {
          id: Date.now().toString(),
          author: currentUsername,
          text: commentText,
          timestamp: Date.now(),
          isModerated: true
        };
        setComments([newComment, ...comments]);
        setCommentText('');
      } else {
        alert("Sorry, your post was blocked: " + moderation.reason);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <h1 className="text-2xl font-black mb-2 uppercase">Safety Feed</h1>
      <p className="text-sm text-slate-400 mb-8 font-medium">Talk to others and share safety tips.</p>

      <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 mb-8">
        <textarea 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type something nice..."
          className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-cyan-500/50 min-h-[100px] mb-4"
        />
        <div className="flex justify-end">
          <button 
            onClick={handlePost}
            disabled={posting || !commentText.trim()}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 font-black rounded-xl text-xs uppercase transition-all shadow-lg"
          >
            {posting ? 'Sending...' : 'Post Message'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="p-5 bg-slate-800/20 border border-slate-700/50 rounded-2xl flex gap-4 animate-in slide-in-from-bottom-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
               👤
            </div>
            <div className="flex-1">
               <div className="flex items-center justify-between mb-1">
                 <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{c.author}</span>
                 <span className="text-[8px] text-slate-500 font-bold uppercase">{new Date(c.timestamp).toLocaleTimeString()}</span>
               </div>
               <p className="text-sm text-slate-300 font-medium leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsView;
