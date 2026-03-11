export interface APIReferential {
  id: string;
  nom: string;
  description: string;
}

export interface Question {
  id: string;
  domaine: string;
  controle_referentiel: string;
  question: string;
  description?: string;
  type: 'boolean' | 'multi_choice' | 'text';
  poids: number;
  criticite: string;
  options?: string[];
}

export interface Questionnaire {
  id: string;
  referentiel_id: string;
  referentiel?: APIReferential;
  secteur: string;
  taille_organisation: string;
  niveau_cible: string;
  version: string;
  status: string;
  questions: Question[];
}

export interface QuestionnaireRequest {
  referentiel_id: string;
  secteur: string;
  taille: string;
  niveau_estime: string;
}

export interface ReferentialMeta {
  icon: string;
  color: string;
}

export interface EnhancedReferential extends APIReferential {
  meta: ReferentialMeta;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
