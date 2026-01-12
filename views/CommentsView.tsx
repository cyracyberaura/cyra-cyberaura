
import React, { useState } from 'react';
import { moderateComment } from '../services/geminiService';
import { Comment } from '../types';

interface CommentsViewProps {
  anonymousMode: boolean;
  currentUsername: string;
}

const CommentsView: React.FC<CommentsViewProps> = ({ anonymousMode, currentUsername }) => {
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', author: 'User#9821', text: 'Just received a weird SMS from "BankAuth" - Cyra caught the link as malicious! Stay safe everyone.', timestamp: Date.now() - 3600000, isModerated: true },
    { id: '2', author: 'User#1209', text: 'Does anyone know if that new "CryptoWin" app is legit? My scan showed 85% risk.', timestamp: Date.now() - 7200000, isModerated: true },
  ]);

  const handlePost = async () => {
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const modResult = await moderateComment(commentText);
      if (modResult.isAllowed) {
        const newComment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          author: anonymousMode ? `Ghost#${Math.floor(1000 + Math.random() * 9000)}` : currentUsername,
          text: commentText,
          timestamp: Date.now(),
          isModerated: true
        };
        setComments([newComment, ...comments]);
        setCommentText('');
      } else {
        alert(`Comment blocked: ${modResult.reason || 'Safety policy violation'}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-2xl font-black mb-1">Community Feed</h1>
        <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Verified Threat Intel</p>
      </header>

      <div className="mb-8 space-y-4">
        <textarea 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Detected something? Warn the community..."
          className="w-full h-24 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
        />
        <button 
          onClick={handlePost}
          disabled={posting || !commentText.trim()}
          className="w-full py-3 bg-slate-100 hover:bg-white disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {posting ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div> : anonymousMode ? 'POST AS GHOST' : 'POST AS ME'}
        </button>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 relative">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${comment.author.startsWith('Ghost') ? 'text-slate-500' : 'text-cyan-400'}`}>
                {comment.author}
              </span>
              <span className="text-[10px] text-slate-600">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsView;
