import { questionnaireAPI } from '@/api/questionnaires';
import type { APIReferential, Questionnaire, QuestionnaireRequest, EnhancedReferential, ReferentialMeta } from '@/types/questionnaire';

export const referentialMeta: Record<string, ReferentialMeta> = {
  "ISO 27001": {
    icon: "🔒",
    color: "from-cyan-500 to-blue-600"
  },
  "RGPD": {
    icon: "🛡️",
    color: "from-blue-500 to-indigo-600"
  },
  "SOC 2": {
    icon: "✅",
    color: "from-purple-500 to-pink-600"
  },
  "NIST CSF": {
    icon: "🌐",
    color: "from-indigo-500 to-purple-600"
  },
  "Directive NIS 2": {
    icon: "🌐",
    color: "from-indigo-500 to-purple-600"
  },
  "PCI DSS": {
    icon: "💳",
    color: "from-pink-500 to-red-600"
  }
};

export class QuestionnaireService {
  async fetchReferentials(): Promise<EnhancedReferential[]> {
    const response = await questionnaireAPI.getReferentials();
    
    if (response.error || !response.data) {
      throw new Error(response.error || 'Impossible de récupérer les référentiels');
    }

    return response.data.referentiels.map(referential => ({
      ...referential,
      meta: referentialMeta[referential.nom] || {
        icon: "📋",
        color: "from-slate-500 to-slate-600"
      }
    }));
  }

  async generateQuestionnaire(request: QuestionnaireRequest): Promise<Questionnaire> {
    console.log("SERVICE GENERATE QUESTIONNAIRE", request)
    
    const response = await questionnaireAPI.generateQuestionnaire(request);
    
    if (response.error || !response.data) {
      console.log("SERVICE ERROR:", response.error)
      throw new Error(response.error || 'Impossible de générer le questionnaire');
    }

    console.log("QUESTIONNAIIIRES : ", response);
    
    return response.data;
  }

  getReferentialIcon(referentialName: string): string {
    return referentialMeta[referentialName]?.icon || "📋";
  }

  getReferentialColor(referentialName: string): string {
    return referentialMeta[referentialName]?.color || "from-slate-500 to-slate-600";
  }
}

export const questionnaireService = new QuestionnaireService();
