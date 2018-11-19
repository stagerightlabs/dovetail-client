import { User, AuthToken, Organization } from '../types'

export interface RootState {
    version: string;
}

export interface AuthState {
    user?: User;
    authToken?: AuthToken;
    organization?: Organization;
    readonly: boolean;
    administrator: boolean;
}
