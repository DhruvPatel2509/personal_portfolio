import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiMail } from 'react-icons/fi';
import { HiOutlineMailOpen } from 'react-icons/hi';
import PageHeader from '../../components/admin/PageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormModal from '../../components/admin/FormModal';
import Skeleton from '../../components/ui/Skeleton';
import { messagesAPI } from '../../api/services';
import { useDebounce } from '../../hooks/useDebounce';

const MessagesManage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const load = () => {
    setLoading(true);
    messagesAPI
      .getAll({ search: debouncedSearch || undefined })
      .then(({ data }) => setMessages(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [debouncedSearch]);

  const openMessage = async (msg) => {
    setViewing(msg);
    if (!msg.isRead) {
      try {
        await messagesAPI.toggleRead(msg._id, true);
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m)));
      } catch {
        /* non-critical */
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await messagesAPI.delete(deleteTarget._id);
      toast.success('Message deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle="Messages submitted through your contact form" />

      <div className="relative max-w-sm mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field !pl-11"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`glass-card-hover p-4 flex items-center gap-4 cursor-pointer ${
                !msg.isRead ? 'border-primary/30' : ''
              }`}
              onClick={() => openMessage(msg)}
            >
              <span className={`shrink-0 ${msg.isRead ? 'text-slate-500' : 'text-primary-400'}`}>
                {msg.isRead ? <HiOutlineMailOpen size={16} /> : <FiMail size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm truncate ${!msg.isRead ? 'font-semibold' : 'font-medium'}`}>{msg.subject}</p>
                <p className="text-slate-500 text-xs truncate">
                  {msg.name} · {msg.email}
                </p>
              </div>
              <p className="text-slate-500 text-xs shrink-0 hidden sm:block">
                {new Date(msg.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(msg);
                }}
                className="text-slate-400 hover:text-red-400 shrink-0"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
          {messages.length === 0 && <p className="text-slate-500 text-sm">No messages found.</p>}
        </div>
      )}

      <FormModal open={!!viewing} title={viewing?.subject} onClose={() => setViewing(null)}>
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{viewing.name}</p>
                <p className="text-slate-500">{viewing.email}</p>
              </div>
              <p className="text-slate-500 text-xs">{new Date(viewing.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
            <a
              href={`mailto:${viewing.email}`}
              className="btn-primary w-full justify-center !py-2.5"
            >
              Reply via Email
            </a>
          </div>
        )}
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        message="Delete this message? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default MessagesManage;
