import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { session } from './session/index';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    session,
  },
};

export default new Vuex.Store<RootState>(store);
