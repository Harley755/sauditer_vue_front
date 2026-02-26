export interface Question {
  id: string;
  category: string;
  question: string;
  description?: string;
  weight: number;
}

export interface Referential {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questions: Question[];
}

export const referentials: Referential[] = [
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'Norme internationale pour la gestion de la sécurité de l\'information',
    icon: '🔒',
    color: 'from-cyan-500 to-blue-600',
    questions: [
      {
        id: 'iso-1',
        category: 'Politique de sécurité',
        question: 'Votre organisation dispose-t-elle d\'une politique de sécurité de l\'information documentée et approuvée ?',
        description: 'La politique doit définir les objectifs et les principes de sécurité',
        weight: 10
      },
      {
        id: 'iso-2',
        category: 'Organisation de la sécurité',
        question: 'Existe-t-il un comité de sécurité de l\'information ou un responsable désigné ?',
        description: 'Responsabilités clairement définies pour la sécurité',
        weight: 8
      },
      {
        id: 'iso-3',
        category: 'Gestion des actifs',
        question: 'Disposez-vous d\'un inventaire complet des actifs informationnels ?',
        description: 'Matériel, logiciels, données et leurs propriétaires',
        weight: 9
      },
      {
        id: 'iso-4',
        category: 'Contrôle d\'accès',
        question: 'Les accès aux systèmes sont-ils basés sur le principe du moindre privilège ?',
        description: 'Chaque utilisateur a uniquement les droits nécessaires',
        weight: 10
      },
      {
        id: 'iso-5',
        category: 'Cryptographie',
        question: 'Les données sensibles sont-elles chiffrées au repos et en transit ?',
        description: 'Utilisation de protocoles de chiffrement reconnus',
        weight: 9
      },
      {
        id: 'iso-6',
        category: 'Sécurité physique',
        question: 'Les zones contenant des équipements sensibles sont-elles sécurisées physiquement ?',
        description: 'Contrôle d\'accès, surveillance, alarmes',
        weight: 7
      },
      {
        id: 'iso-7',
        category: 'Sécurité des opérations',
        question: 'Effectuez-vous des sauvegardes régulières et testez-vous leur restauration ?',
        description: 'Politique de sauvegarde documentée et testée',
        weight: 10
      },
      {
        id: 'iso-8',
        category: 'Sécurité des communications',
        question: 'Les transferts de données sont-ils sécurisés et contrôlés ?',
        description: 'Protocoles sécurisés, chiffrement, authentification',
        weight: 8
      },
      {
        id: 'iso-9',
        category: 'Gestion des incidents',
        question: 'Disposez-vous d\'une procédure de gestion des incidents de sécurité ?',
        description: 'Détection, signalement, analyse et réponse',
        weight: 10
      },
      {
        id: 'iso-10',
        category: 'Continuité d\'activité',
        question: 'Avez-vous un plan de continuité d\'activité (PCA) testé régulièrement ?',
        description: 'Plan documenté avec tests annuels minimum',
        weight: 9
      },
      {
        id: 'iso-11',
        category: 'Conformité',
        question: 'Réalisez-vous des audits réguliers de conformité ?',
        description: 'Audits internes et/ou externes périodiques',
        weight: 8
      },
      {
        id: 'iso-12',
        category: 'Sensibilisation',
        question: 'Les employés reçoivent-ils une formation régulière à la sécurité ?',
        description: 'Programme de sensibilisation annuel minimum',
        weight: 7
      }
    ]
  },
  {
    id: 'rgpd',
    name: 'RGPD',
    description: 'Règlement Général sur la Protection des Données',
    icon: '🛡️',
    color: 'from-blue-500 to-indigo-600',
    questions: [
      {
        id: 'rgpd-1',
        category: 'Base légale',
        question: 'Avez-vous identifié la base légale pour chaque traitement de données personnelles ?',
        description: 'Consentement, contrat, obligation légale, intérêt légitime, etc.',
        weight: 10
      },
      {
        id: 'rgpd-2',
        category: 'Registre des traitements',
        question: 'Tenez-vous à jour un registre des activités de traitement ?',
        description: 'Document obligatoire listant tous les traitements',
        weight: 10
      },
      {
        id: 'rgpd-3',
        category: 'DPO',
        question: 'Avez-vous désigné un Délégué à la Protection des Données (DPO) ?',
        description: 'Obligatoire pour certaines organisations',
        weight: 8
      },
      {
        id: 'rgpd-4',
        category: 'Droits des personnes',
        question: 'Avez-vous mis en place des procédures pour répondre aux demandes d\'exercice des droits ?',
        description: 'Accès, rectification, effacement, portabilité, opposition',
        weight: 9
      },
      {
        id: 'rgpd-5',
        category: 'Sécurité',
        question: 'Les mesures de sécurité sont-elles proportionnées aux risques ?',
        description: 'Chiffrement, pseudonymisation, contrôle d\'accès',
        weight: 10
      },
      {
        id: 'rgpd-6',
        category: 'Violations de données',
        question: 'Disposez-vous d\'une procédure de notification des violations de données ?',
        description: 'Notification à la CNIL sous 72h',
        weight: 10
      },
      {
        id: 'rgpd-7',
        category: 'Analyse d\'impact',
        question: 'Réalisez-vous des analyses d\'impact (AIPD) pour les traitements à risque élevé ?',
        description: 'Évaluation des risques pour les droits et libertés',
        weight: 9
      },
      {
        id: 'rgpd-8',
        category: 'Sous-traitance',
        question: 'Vos contrats avec les sous-traitants incluent-ils les clauses RGPD ?',
        description: 'Obligations de sécurité et de confidentialité',
        weight: 8
      },
      {
        id: 'rgpd-9',
        category: 'Transferts internationaux',
        question: 'Les transferts de données hors UE sont-ils encadrés juridiquement ?',
        description: 'Clauses contractuelles types, BCR, décision d\'adéquation',
        weight: 9
      },
      {
        id: 'rgpd-10',
        category: 'Minimisation',
        question: 'Ne collectez-vous que les données strictement nécessaires ?',
        description: 'Principe de minimisation des données',
        weight: 7
      }
    ]
  },
  {
    id: 'nis2',
    name: 'Directive NIS 2',
    description: 'Directive européenne sur la sécurité des réseaux et des systèmes d\'information',
    icon: '🌐',
    color: 'from-indigo-500 to-purple-600',
    questions: [
      {
        id: 'nis2-1',
        category: 'Gouvernance',
        question: 'La direction approuve-t-elle formellement les mesures de cybersécurité ?',
        description: 'Implication de la direction dans la stratégie de sécurité',
        weight: 10
      },
      {
        id: 'nis2-2',
        category: 'Gestion des risques',
        question: 'Effectuez-vous une analyse de risques cyber régulière ?',
        description: 'Identification, évaluation et traitement des risques',
        weight: 10
      },
      {
        id: 'nis2-3',
        category: 'Gestion des incidents',
        question: 'Disposez-vous d\'un processus de gestion des incidents cyber ?',
        description: 'Détection, réponse, notification aux autorités',
        weight: 10
      },
      {
        id: 'nis2-4',
        category: 'Continuité d\'activité',
        question: 'Avez-vous des plans de continuité et de reprise après incident ?',
        description: 'PCA/PRA testés régulièrement',
        weight: 9
      },
      {
        id: 'nis2-5',
        category: 'Sécurité de la chaîne d\'approvisionnement',
        question: 'Évaluez-vous les risques cyber de vos fournisseurs critiques ?',
        description: 'Due diligence et clauses de sécurité',
        weight: 9
      },
      {
        id: 'nis2-6',
        category: 'Notification',
        question: 'Connaissez-vous vos obligations de notification d\'incidents aux autorités ?',
        description: 'Délais de 24h (alerte précoce) et 72h (rapport)',
        weight: 8
      },
      {
        id: 'nis2-7',
        category: 'Cryptographie',
        question: 'Utilisez-vous le chiffrement pour protéger les données sensibles ?',
        description: 'Chiffrement des données et des communications',
        weight: 8
      },
      {
        id: 'nis2-8',
        category: 'Gestion des vulnérabilités',
        question: 'Avez-vous un processus de gestion des vulnérabilités et des correctifs ?',
        description: 'Veille, évaluation et correction des vulnérabilités',
        weight: 9
      }
    ]
  },
  {
    id: 'soc2',
    name: 'SOC 2',
    description: 'Critères de contrôle pour les fournisseurs de services',
    icon: '✅',
    color: 'from-purple-500 to-pink-600',
    questions: [
      {
        id: 'soc2-1',
        category: 'Sécurité',
        question: 'Disposez-vous de contrôles d\'accès logiques et physiques ?',
        description: 'Protection contre les accès non autorisés',
        weight: 10
      },
      {
        id: 'soc2-2',
        category: 'Disponibilité',
        question: 'Mesurez-vous et garantissez-vous la disponibilité de vos services ?',
        description: 'SLA, monitoring, redondance',
        weight: 9
      },
      {
        id: 'soc2-3',
        category: 'Intégrité du traitement',
        question: 'Les traitements sont-ils complets, valides, précis et autorisés ?',
        description: 'Contrôles sur l\'intégrité des processus',
        weight: 8
      },
      {
        id: 'soc2-4',
        category: 'Confidentialité',
        question: 'Les informations confidentielles sont-elles protégées conformément aux engagements ?',
        description: 'Classification et protection des données sensibles',
        weight: 10
      },
      {
        id: 'soc2-5',
        category: 'Vie privée',
        question: 'Respectez-vous les principes de protection de la vie privée ?',
        description: 'Collecte, utilisation, conservation, divulgation',
        weight: 9
      },
      {
        id: 'soc2-6',
        category: 'Gestion des changements',
        question: 'Les changements système sont-ils contrôlés et testés ?',
        description: 'Processus formel de gestion des changements',
        weight: 8
      },
      {
        id: 'soc2-7',
        category: 'Monitoring',
        question: 'Surveillez-vous en continu vos systèmes et contrôles ?',
        description: 'SIEM, logs, alertes',
        weight: 9
      }
    ]
  },
  {
    id: 'pci-dss',
    name: 'PCI DSS',
    description: 'Norme de sécurité pour le traitement des cartes de paiement',
    icon: '💳',
    color: 'from-pink-500 to-red-600',
    questions: [
      {
        id: 'pci-1',
        category: 'Pare-feu',
        question: 'Installez-vous et maintenez-vous des pare-feu pour protéger les données ?',
        description: 'Configuration et revue des pare-feu',
        weight: 10
      },
      {
        id: 'pci-2',
        category: 'Mots de passe',
        question: 'Modifiez-vous les mots de passe par défaut des systèmes et paramètres de sécurité ?',
        description: 'Élimination des configurations par défaut',
        weight: 9
      },
      {
        id: 'pci-3',
        category: 'Protection des données',
        question: 'Protégez-vous les données de titulaires de cartes stockées ?',
        description: 'Chiffrement, minimisation du stockage',
        weight: 10
      },
      {
        id: 'pci-4',
        category: 'Transmission chiffrée',
        question: 'Chiffrez-vous la transmission des données sur les réseaux publics ?',
        description: 'TLS, VPN pour les données sensibles',
        weight: 10
      },
      {
        id: 'pci-5',
        category: 'Antivirus',
        question: 'Utilisez-vous et maintenez-vous des logiciels antivirus à jour ?',
        description: 'Protection contre les malwares',
        weight: 8
      },
      {
        id: 'pci-6',
        category: 'Sécurité des systèmes',
        question: 'Développez-vous et maintenez-vous des systèmes et applications sécurisés ?',
        description: 'Correctifs de sécurité, développement sécurisé',
        weight: 9
      },
      {
        id: 'pci-7',
        category: 'Accès aux données',
        question: 'Restreignez-vous l\'accès aux données selon le besoin d\'en connaître ?',
        description: 'Principe du moindre privilège',
        weight: 10
      },
      {
        id: 'pci-8',
        category: 'Identification',
        question: 'Identifiez-vous et authentifiez-vous les accès aux composants système ?',
        description: 'Identifiants uniques, authentification forte',
        weight: 9
      }
    ]
  }
];

export function getScoreLevel(score: number): {
  level: 'critical' | 'low' | 'medium' | 'high' | 'excellent';
  label: string;
  color: string;
  bgColor: string;
} {
  if (score >= 90) {
    return {
      level: 'excellent',
      label: 'Excellent',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    };
  } else if (score >= 70) {
    return {
      level: 'high',
      label: 'Bon',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    };
  } else if (score >= 50) {
    return {
      level: 'medium',
      label: 'Moyen',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    };
  } else if (score >= 30) {
    return {
      level: 'low',
      label: 'Faible',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    };
  } else {
    return {
      level: 'critical',
      label: 'Critique',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    };
  }
}
