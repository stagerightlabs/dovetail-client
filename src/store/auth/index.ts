import { Module } from 'vuex';
import { RootState } from '../types';
import { AuthState } from './types';
import { actions } from './actions';
import { mutations } from './mutations';
import { getters } from './getters';

export const state: AuthState = {
    user: undefined,
    authToken: undefined,
};

const namespaced: boolean = true;

export const auth: Module<AuthState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};
