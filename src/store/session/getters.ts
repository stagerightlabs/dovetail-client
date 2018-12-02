import { GetterTree } from 'vuex';
import { AuthState } from '../types';
import { RootState } from '../types';
import { User, Organization } from '@/types';

export const getters: GetterTree<AuthState, RootState> = {
    isAuthenticated(state): boolean {
        return state.authToken ? true : false;
    },

    profileHasBeenLoaded(state): boolean {
        return state.user !== undefined && state.organization !== undefined;
    },

    authToken(state): string {
        return state.authToken!.access_token || '';
    },

    user(state): User|undefined {
        return state.user;
    },

    organization(state): Organization|undefined {
        return state.organization;
    },

    orgNotebooksLabel(state): string {
        return state.organization
            // @ts-ignore
            ? state.organization.settings.filter((setting) => setting.key === 'label.notebooks')[0].value
            : 'Notebooks';
    },

    isAdministrator(state): boolean {
        return state.administrator;
    },

    userIsReadOnly(state): boolean {
        return state.readonly;
    },
}
