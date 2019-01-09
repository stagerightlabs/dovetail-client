export interface Alert {
  message: string;
  level: string;
  nonce?: string;
}

export interface AuthToken {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token?: string;
  expiration_date?: Date;
}

export interface Model {
  hashid: string;
}

export interface User {
  hashid: string;
  name: string;
  email: string;
  email_verified_at?: string|null;
  phone?: string;
  phone_verified_at?: string|null;
  teams: Team[];
}

export interface Member {
  hashid: string;
  name: string;
  email: string;
  email_verified: boolean;
  phone?: string;
  phone_verified: boolean;
  rank: string;
  title: string;
  teams?: Team[];
  created_at: string;
  created_at_date?: Date;
  deleted_at?: string;
  deleted_at_date?: Date;
}

export interface Organization {
  hashid: string;
  name: string;
  slug: string;
  logo_url?: string|null;
  settings?: OrgSetting[];
}

export interface OrgSetting {
  key: string;
  value: string;
}

export interface Invitation {
  hashid: string;
  email: string;
  revoked_at: string|null;
  revoked_by: number|null;
  completed_at: string|null;
  created_at: string;
  created_at_date?: Date;
  revoked_at_date?: Date|null;
  completed_at_date?: Date|null;
  waitingForPromise?: string;
}

export interface Team {
  hashid: string;
  name: string;
  slug: string;
  members?: Member[];
  members_count?: number;
}

export interface Category {
  hashid: string;
  name: string;
}

export interface Notebook {
  hashid: string;
  name: string;
  slug: string;
  category: string|null;
  category_id: string|null;
  owner_name: string;
  comments_enabled: boolean;
  current_user_is_following: boolean;
  pages?: NotebookPage[];
}

export interface NotebookPage {
  hashid: string;
  notebook_id: string;
  content: string;
  sort_order: number;
  comments?: NotebookPageComment[];
  activity?: ActivityLog[];
}

export interface NotebookPageComment {
  hashid: string;
  content: string;
  commentator: string;
  commentator_id: string;
  edited: boolean;
  created_at: string;
  created_at_date?: Date;
  since_created: string;
}

export interface ActivityLog {
  hashid: string;
  user_id: string;
  user_name: string;
  description: string;
  created_at: string;
  since_created: string;
}
