
import { ActionTree } from 'vuex';
import { RootState } from '../types';
import { AuthState } from '../types';
import { AuthToken } from '../../types';

export const actions: ActionTree<AuthState, RootState> = {

  tryAutoLogin({ commit }) {

    // Read the tokens from local storage
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    // If no value was found in local storage, abort
    if (!accessToken) {
      return;
    }
    // Convert the expiration date into a Date object
    const expirationDate = localStorage.getItem('access_expiration')
      ? new Date(localStorage.getItem('access_expiration') || '')
      : undefined;

    // Check to see if the access token has expired
    const now = new Date();
    if (! expirationDate || now >= expirationDate) {
      commit('removeAuthTokenFromLocalStorage');
      commit('clearSessionAuthToken');
      return;
    }

    // Create a new AuthToken from our local data
    const authToken: AuthToken = {
      access_token: accessToken,
      refresh_token: refreshToken || '',
      token_type: 'Bearer',
      expiration_date: expirationDate,
      expires_in: Math.floor((expirationDate.getTime() - now.getTime()) / 1000),
    };

    // Store the new auth token in state
    commit('setAuthTokenForSession', authToken);
  },

  logout({ commit }) {
    // Remove auth token from state
    commit('clearSessionAuthToken');
    // Remove auth token from local storage
    commit('removeAuthTokenFromLocalStorage');
    // Redirect the user to the login page
    // router.push({ name: 'Login' });
  },
};
