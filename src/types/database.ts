export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id'>>;
      };
      milestones: {
        Row: Milestone;
        Insert: Omit<Milestone, 'id' | 'created_at'>;
        Update: Partial<Omit<Milestone, 'id'>>;
      };
      badges: {
        Row: Badge;
        Insert: Omit<Badge, 'id'>;
        Update: Partial<Omit<Badge, 'id'>>;
      };
      user_badges: {
        Row: UserBadge;
        Insert: Omit<UserBadge, 'id' | 'earned_at'>;
        Update: Partial<Omit<UserBadge, 'id'>>;
      };
      follow_ups: {
        Row: FollowUp;
        Insert: Omit<FollowUp, 'id' | 'created_at'>;
        Update: Partial<Omit<FollowUp, 'id'>>;
      };
    };
  };
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
  role: 'emprendedor' | 'mentor' | 'admin';
  avatar_url?: string;
  level: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  impact_area: string;
  target_beneficiaries: string;
  estimated_beneficiaries: number;
  location_state: string;
  location_city: string;
  start_date: string;
  end_date?: string;
  budget_estimated?: number;
  team_size: number;
  ods_goals: number[];
  progress_percentage: number;
  level: ProjectLevel;
  created_at: string;
  updated_at: string;
}

export type ProjectCategory =
  | 'educacion'
  | 'salud'
  | 'medio_ambiente'
  | 'tecnologia_social'
  | 'economia_solidaria'
  | 'cultura'
  | 'derechos_humanos'
  | 'desarrollo_comunitario';

export type ProjectStatus =
  | 'borrador'
  | 'en_revision'
  | 'aprobado'
  | 'en_progreso'
  | 'completado'
  | 'pausado';

export type ProjectLevel =
  | 'semilla'
  | 'brote'
  | 'arbol'
  | 'bosque';

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  completed_at?: string;
  points_awarded: number;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'proyecto' | 'comunidad' | 'impacto' | 'constancia';
  points_required: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface FollowUp {
  id: string;
  project_id: string;
  user_id: string;
  type: 'nota' | 'avance' | 'problema' | 'logro';
  content: string;
  attachments?: string[];
  created_at: string;
}

export interface MissionTemplate {
  id: string;
  title: string;
  lesson_content: string;
  suggested_order: number;
  points_awarded: number;
  is_active: boolean;
  created_at: string;
}

export interface LearningMission {
  id: string;
  project_id: string;
  mission_template_id: string;
  reflection: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  mission_template?: MissionTemplate;
}
