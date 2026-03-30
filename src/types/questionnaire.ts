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
  user_responses?: Record<string, string>;  // question_id -> valeur
  user_comments?: Record<string, string | null>;  // question_id -> commentaire
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

// Types pour les listes d'audits
export interface AuditListItem {
  id: string;
  referentiel_id: string;
  referentiel_nom?: string;
  secteur: string;
  taille_organisation: string;
  niveau_cible: string;
  status: 'draft' | 'active' | 'archived' | 'processing' | 'completed' | 'analyse_pending' | 'failed';
  created_at: string;
  updated_at: string;
  score_global?: number;
  niveau_maturite?: string;
}

export interface AuditListResponse {
  audits: AuditListItem[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// Types pour la sauvegarde progressive
export interface PartialAnswerSubmission {
  questionnaire_id: string;
  reponses: AnswerItem[];
  is_final_submission: boolean;
}

export interface AnswerItem {
  question_id: string;
  valeur: string;
  commentaire?: string;
}

export interface PartialSaveResponse {
  message: string;
  questionnaire_id: string;
  saved_responses_count: number;
  total_responses_count: number;
  is_final_submission: boolean;
  timestamp: string;
}

export interface SyncResult {
  success: boolean;
  synced_answers: number;
  failed_answers: number;
  error_message?: string;
}
