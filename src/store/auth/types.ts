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
    phone?: string;
}

export interface AuthState {
    user?: User;
    authToken?: AuthToken;
}
