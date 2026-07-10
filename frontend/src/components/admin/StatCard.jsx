const StatCard = ({ label, value, icon: Icon, color = 'text-primary-400' }) => (
  <div className="glass-card-hover p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-slate-400 text-xs">{label}</p>
    </div>
  </div>
);

export default StatCard;
