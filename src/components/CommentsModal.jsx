import {useEffect, useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client.js';

export default function CommentsModal({ type, id, title, onClose, onCount, onRequestAuth }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    api.comments(type, id).then((r) => setComments(r.comments));
  }, [type, id]);

  async function post() {
    if(!draft.trim()) return;
    const { count } = await api.addComment(type, id, draft.trim());
    setDraft('');
    const r = await api.comments(type, id);
    setComments(r.comments);
    onCount?.(count);
  }

  return (
    <div className="overlay open" onClick={onClose}>
        <div className="cmodal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-x" onClick={onClose}>X</button>
            <div className="cm-title">{title}</div>
            <div className="cm-sub">Everyone can read. Sign up to post comment.</div>
            <div className="cm-list">
                {comments.length === 0 && <div className="cm-empty">No comments yet.</div>}
                {comments.map((c) => (
                    <div className="comment" key={c.id}>
                        <div className="c-av">{(c.display_name || c.username).slice(0, 2).toUpperCase()}</div>
                        <div>
                            <div className="c-name">{c.display_name || c.username}</div>
                            <div className="c-body">{c.body}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cm-foot">
                {user ? (
                    <div className="post-box">
                        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a comment..." />
                        <button onClick={post}>Post</button>
                    </div>
                ) : (
                    <div className="post-prompt">
                        Want to join in?
                        <button className="pp-btn" onClick={onRequestAuth}>Sign up to post</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}