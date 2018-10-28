import { ActionTree } from 'vuex';
import axios from '@/axios';
import { AuthState, User, AuthToken } from './types';
import { RootState } from '../types';

export const actions: ActionTree<AuthState, RootState> = {
  // fetchData({ commit }): any {
  //   axios.get('/user')
  //     .then((response) => {
  //       const payload: User = response && response.data
  //       commit('profileLoaded', payload)
  //     })
  //     .catch((error) => {
  //       console.log('error')
  //       commit('profileError')
  //     })
  // },
  login({ commit, dispatch}, credentials) {
    console.log(credentials)
    axios.post('/login', credentials)
      .then((response) => {
        const authToken: AuthToken = response && response.data;
        commit('storeAuthTokenInLocalStorage', authToken);
        commit('setAuthTokenForSession', authToken);
      })
      .catch((error) => {
        console.log('error', error);
      });
  },
  tryAutoLogin({ commit }) {
    const jwt = localStorage.getItem('access_token');
    if (!jwt) {
      return;
    }
    const expirationDate = localStorage.getItem('access_expiration')
      ? new Date(localStorage.getItem('access_expiration') || '')
      : undefined;
    const now = new Date();
    if (! expirationDate || now >= expirationDate) {
      commit('removeAuthTokenFromLocalStorage');
      commit('clearSessionAuthToken');
      return;
    }
    const authToken: AuthToken = {
      access_token: jwt,
      token_type: 'Bearer',
      expiration_date: expirationDate,
      expires_in: (expirationDate.getTime() - now.getTime()) / 1000,
    }
    commit('setAuthTokenForSession', authToken);
  },
  logout({ commit }) {
    commit('clearSessionAuthToken');
    commit('removeAuthTokenFromLocalStorage');
    // router.push({ name: 'Login' });
  },
}
