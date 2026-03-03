export interface Role {
  id: string;
  title: string;
  code: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}
