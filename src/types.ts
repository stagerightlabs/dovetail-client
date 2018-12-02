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

export interface User {
    name: string;
    email: string;
    email_verified_at?: string|null;
    phone?: string;
    phone_verified_at?: string|null;
    teams: Team[];
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

export interface Team {
    hashid: string;
    name: string;
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
