import { useEffect, useState } from 'react';
import { FiFolder, FiCode, FiAward, FiMail } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import StatCard from '../../components/admin/StatCard';
import Skeleton from '../../components/ui/Skeleton';
import { dashboardAPI } from '../../api/services';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI
      .getStats()
      .then(({ data }) => setStats(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your portfolio content" />

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Projects" value={stats?.totalProjects ?? 0} icon={FiFolder} />
          <StatCard label="Skills" value={stats?.totalSkills ?? 0} icon={FiCode} color="text-accent-400" />
          <StatCard label="Certificates" value={stats?.totalCertificates ?? 0} icon={FiAward} color="text-amber-400" />
          <StatCard label="Unread Messages" value={stats?.unreadMessages ?? 0} icon={FiMail} color="text-rose-400" />
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="font-semibold mb-5">Recent Messages</h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : stats?.recentMessages?.length ? (
          <div className="space-y-3">
            {stats.recentMessages.map((msg) => (
              <div
                key={msg._id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{msg.subject}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {msg.name} · {msg.email}
                  </p>
                </div>
                {!msg.isRead && <span className="badge !bg-primary/20 !text-primary-400 !border-0 shrink-0">New</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
