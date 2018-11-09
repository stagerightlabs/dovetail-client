import { User, AuthToken } from '../types'

export interface RootState {
    version: string;
}

export interface AuthState {
    user?: User;
    authToken?: AuthToken;
}
