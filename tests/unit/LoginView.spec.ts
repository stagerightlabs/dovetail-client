jest.mock('@/repository', () => ({
  httpPostLogin: jest.fn(() => Promise.resolve({
    data: accessToken
  }))
}));

import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Login from '@/views/auth/Login.vue';
import VeeValidate from 'vee-validate';
import repository from '@/repository';
import { AuthToken } from '@/types';
import merge from 'lodash.merge'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VeeValidate, { inject: false, delay: 1 });

function createStore(overrides:string[] = []) {
  const defaultStoreConfig = {
    mutations: {
      storeAuthTokenInLocalStorage: jest.fn(),
      setAuthTokenForSession: jest.fn()
    },
    state: {
      comments: {},
      item: {}
    }
  }
  return new Vuex.Store(
    merge(defaultStoreConfig, overrides)
  )
}

const accessToken : AuthToken = {
  token_type: "Bearer",
  expires_in: 31536000,
  access_token: "eyJ0eXAiOiJKV1QiLCJhbGc...",
  refresh_token: "def50200641f136a0811...",
}

function createWrapper(overrides:any) {

  const defaultMountingOptions = {
    mocks: {
      $route: {
        params: {}
      },
      $validator: {
        errors: []
      },
    },
    stubs: {
      RouterLink: RouterLinkStub
    },
    localVue,
    store: createStore(),
    sync: false
  }
  return shallowMount(Login, merge(defaultMountingOptions, overrides))
}


describe('Login.vue', () => {

  test('valid ', () => {


    const store = createStore()
    jest.spyOn(store, 'commit')
    const wrapper = createWrapper({ store })


    const emailInput = wrapper.find('input[type="email"]')
    emailInput.setValue('email@gmail.com') // #D
    const passwordInput = wrapper.find('input[type="password"]')
    emailInput.setValue('secret')
    wrapper.find('button').trigger('click')

    expect(repository.httpPostLogin).toHaveBeenCalled()

    expect(store.commit).toHaveBeenCalledWith('auth/storeAuthTokenInLocalStorage', accessToken)
  })
});
