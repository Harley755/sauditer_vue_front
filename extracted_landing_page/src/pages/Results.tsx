import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { useAudit } from '../contexts/AuditContext';
import { referentials, getScoreLevel } from '../data/referentials';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function Results() {
  const navigate = useNavigate();
  const { currentAudit, completeAudit } = useAudit();

  const referential = referentials.find(r => r.id === currentAudit?.referentialId);

  // Calculate scores
  const results = useMemo(() => {
    if (!currentAudit || !referential) return null;

    const totalWeight = referential.questions.reduce((sum, q) => sum + q.weight, 0);
    let earnedPoints = 0;

    currentAudit.answers.forEach(answer => {
      const question = referential.questions.find(q => q.id === answer.questionId);
      if (!question) return;

      if (answer.answer === 'yes') {
        earnedPoints += question.weight;
      } else if (answer.answer === 'partial') {
        earnedPoints += question.weight * 0.5;
      }
      // 'no' and 'na' don't add points
    });

    const score = Math.round((earnedPoints / totalWeight) * 100);
    const scoreLevel = getScoreLevel(score);

    // Calculate by category
    const categoryScores: Record<string, { score: number; total: number; questions: number }> = {};
    
    referential.questions.forEach(question => {
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { score: 0, total: 0, questions: 0 };
      }
      
      const answer = currentAudit.answers.find(a => a.questionId === question.id);
      categoryScores[question.category].total += question.weight;
      categoryScores[question.category].questions += 1;
      
      if (answer) {
        if (answer.answer === 'yes') {
          categoryScores[question.category].score += question.weight;
        } else if (answer.answer === 'partial') {
          categoryScores[question.category].score += question.weight * 0.5;
        }
      }
    });

    // Answer distribution
    const answerCounts = {
      yes: currentAudit.answers.filter(a => a.answer === 'yes').length,
      partial: currentAudit.answers.filter(a => a.answer === 'partial').length,
      no: currentAudit.answers.filter(a => a.answer === 'no').length,
      na: currentAudit.answers.filter(a => a.answer === 'na').length
    };

    return {
      score,
      scoreLevel,
      categoryScores,
      answerCounts,
      totalQuestions: referential.questions.length,
      answeredQuestions: currentAudit.answers.length
    };
  }, [currentAudit, referential]);

  // Complete audit on mount
  useMemo(() => {
    if (currentAudit && !currentAudit.completedAt) {
      completeAudit();
    }
  }, [currentAudit, completeAudit]);

  if (!currentAudit || !referential || !results) {
    navigate('/dashboard');
    return null;
  }

  // Prepare chart data
  const categoryChartData = Object.entries(results.categoryScores).map(([category, data]) => ({
    name: category,
    score: Math.round((data.score / data.total) * 100),
    questions: data.questions
  }));

  const answerDistributionData = [
    { name: 'Conforme', value: results.answerCounts.yes, color: '#10b981' },
    { name: 'Partiel', value: results.answerCounts.partial, color: '#f59e0b' },
    { name: 'Non conforme', value: results.answerCounts.no, color: '#ef4444' },
    { name: 'N/A', value: results.answerCounts.na, color: '#64748b' }
  ];

  // Get recommendations
  const weakCategories = Object.entries(results.categoryScores)
    .map(([category, data]) => ({
      category,
      score: Math.round((data.score / data.total) * 100)
    }))
    .filter(c => c.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au tableau de bord
          </button>

          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter le rapport
          </button>
        </div>

        {/* Score Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Score Circle */}
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-slate-800"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(results.score / 100) * 553} 553`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-5xl mb-1">{results.score}</div>
                    <div className="text-slate-400 text-sm">/ 100</div>
                  </div>
                </div>
              </div>

              {/* Score Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <span className="text-3xl">{referential.icon}</span>
                  <h1 className="text-white text-3xl">{referential.name}</h1>
                </div>
                
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${results.scoreLevel.bgColor}`}>
                  <Target className={`w-5 h-5 ${results.scoreLevel.color}`} />
                  <span className={`text-lg ${results.scoreLevel.color}`}>
                    Niveau : {results.scoreLevel.label}
                  </span>
                </div>

                <p className="text-slate-400 text-lg mb-6">
                  {results.score >= 90 && 'Excellent ! Votre organisation démontre une maturité exemplaire en cybersécurité.'}
                  {results.score >= 70 && results.score < 90 && 'Bon niveau de conformité. Quelques améliorations ciblées renforceront votre posture.'}
                  {results.score >= 50 && results.score < 70 && 'Conformité moyenne. Des efforts significatifs sont nécessaires pour atteindre les standards.'}
                  {results.score >= 30 && results.score < 50 && 'Conformité faible. Des mesures urgentes doivent être prises.'}
                  {results.score < 30 && 'Situation critique. Une action immédiate est requise pour sécuriser votre organisation.'}
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {results.answeredQuestions} / {results.totalQuestions} questions
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    {results.answerCounts.yes} conformes
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    {results.answerCounts.no} non conformes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Category Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <h2 className="text-white text-xl">Score par catégorie</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="score" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Answer Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-cyan-400" />
              <h2 className="text-white text-xl">Distribution des réponses</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={answerDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {answerDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recommendations */}
        {weakCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h2 className="text-white text-xl">Priorités d'amélioration</h2>
            </div>

            <div className="space-y-4">
              {weakCategories.map((cat, index) => (
                <div key={cat.category} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${cat.score < 30 ? 'bg-red-500/20' : cat.score < 50 ? 'bg-orange-500/20' : 'bg-yellow-500/20'}
                  `}>
                    {index === 0 ? <TrendingDown className="w-5 h-5 text-red-400" /> : <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{cat.category}</h3>
                    <p className="text-slate-400 text-sm">
                      Score actuel : {cat.score}% - Action prioritaire recommandée
                    </p>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-lg text-sm
                    ${cat.score < 30 ? 'bg-red-500/20 text-red-400' : cat.score < 50 ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}
                  `}>
                    {cat.score}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Success message */}
        {results.score >= 70 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white mb-2">Félicitations !</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Votre organisation démontre un bon niveau de maturité en matière de {referential.name}. 
                  Continuez à maintenir vos efforts et à améliorer les domaines identifiés pour atteindre l'excellence.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center mt-8"
        >
          <button
            onClick={() => navigate('/audit-selection')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Lancer un nouvel audit
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-900/50 transition-all"
          >
            Retour au tableau de bord
          </button>
        </motion.div>
      </div>
    </div>
  );
}
