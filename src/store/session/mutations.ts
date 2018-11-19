import { MutationTree } from 'vuex';
import { AuthState } from '../types';
import { AuthToken, User, Organization } from '../../types';

export const mutations: MutationTree<AuthState> = {
    storeAuthTokenInLocalStorage(state, authToken: AuthToken) {
        const now = new Date();
        authToken.expiration_date = new Date(now.getTime() + (authToken.expires_in * 1000));
        localStorage.setItem('access_token', authToken.access_token);
        localStorage.setItem('access_expiration', authToken.expiration_date.toDateString());
        localStorage.setItem('refresh_token', authToken.refresh_token || '');
    },
    removeAuthTokenFromLocalStorage(state, authToken: AuthToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('access_expiration');
        localStorage.removeItem('refresh_token');
    },
    setAuthTokenForSession(state, authToken: AuthToken) {
        const now = new Date();
        authToken.expiration_date = new Date(now.getTime() + (authToken.expires_in * 1000));
        state.authToken = authToken;
    },
    clearSessionAuthToken(state) {
        state.authToken = undefined;
    },
    saveSessionUser(state, user: User) {
        state.user = user;
    },
    saveSessionOrganization(state, organization: Organization) {
        state.organization = organization;
    },
    saveAdministratorStatus(state, status: boolean) {
        state.administrator = status;
    },
    saveReadonlyStatus(state, status: boolean) {
        state.readonly = status;
    },
};
