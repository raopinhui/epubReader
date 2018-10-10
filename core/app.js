/**
 * @file entry
 * @author rao(dear2r_1120@yeah.net)
 */

import Vue from 'vue';
import Meta from 'vue-meta';
import '@/assets/styles/iconfont.css';
import '@/assets/styles/global.scss';

import {createRouter} from '@/.lavas/router';
import {createStore} from '@/.lavas/store';
import AppComponent from './App.vue';

Vue.use(Meta);

Vue.config.productionTip = false;

export function createApp() {
    let router = createRouter();
    let store = createStore();
    let App = Vue.extend({
        router,
        store,
        ...AppComponent
    });
    return {App, router, store};
}

if (module.hot) {
    module.hot.accept();
}
