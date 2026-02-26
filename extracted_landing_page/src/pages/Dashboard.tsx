import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Shield, 
  Plus, 
  TrendingUp, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  LogOut,
  User
} from 'lucide-react';
import { useAudit } from '../contexts/AuditContext';
import { referentials } from '../data/referentials';

export function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAudit();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleStartAudit = () => {
    navigate('/audit-selection');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userTypeLabels = {
    citizen: 'Citoyen / Professionnel',
    manager: 'Responsable Sécurité',
    auditor: 'Expert Auditeur'
  };

  // Mock data for demonstration
  const stats = [
    {
      label: 'Audits complétés',
      value: '0',
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-600',
      change: null
    },
    {
      label: 'Score moyen',
      value: '-',
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-600',
      change: null
    },
    {
      label: 'En cours',
      value: '0',
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      change: null
    },
    {
      label: 'Actions requises',
      value: '-',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-600',
      change: null
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xl tracking-tight">CyberGRC</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">
                  {userType ? userTypeLabels[userType] : 'Utilisateur'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-white text-3xl mb-2">
            Tableau de bord
          </h1>
          <p className="text-slate-400">
            Gérez vos audits de conformité et suivez vos scores de sécurité
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <button
            onClick={handleStartAudit}
            className="group bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-8 text-left hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <BarChart3 className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-white text-2xl mb-2">Nouvel audit</h3>
            <p className="text-cyan-100">
              Lancez une nouvelle évaluation de conformité selon un référentiel
            </p>
          </button>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="text-white text-2xl mb-2">Rapports</h3>
            <p className="text-slate-400">
              Consultez et exportez vos rapports d'audit
            </p>
            <button className="mt-4 text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
              Voir les rapports →
            </button>
          </div>
        </motion.div>

        {/* Available Referentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-white text-2xl mb-4">Référentiels disponibles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {referentials.map((ref) => (
              <div
                key={ref.id}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{ref.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{ref.name}</h3>
                    <p className="text-slate-400 text-sm">{ref.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{ref.questions.length} questions</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
