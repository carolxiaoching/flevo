import { createApp } from 'vue';
import { createPinia } from 'pinia';

// bootstrap-icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// vue-axios
import axios from 'axios';
import VueAxios from 'vue-axios';

// vee-validate
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTw from '@vee-validate/i18n/dist/locale/zh_TW.json';

// vue-lazyLoad
import VueLazyLoad from 'vue-lazyload';

import App from './App.vue';
import router from './router';

// vee-validate 定義使用規則
Object.entries(all).forEach(([name, rule]) => {
  defineRule(name, rule);
});

defineRule('password', (value: string, [limit]: [number]) => {
  if (value.length < limit) {
    return `密碼 不能小於 ${limit} 字元`;
  }

  if (!/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i.test(value)) {
    return '密碼 必須為英數混和';
  }
  return true;
});

defineRule('maxTagArrayLength', (value: unknown, [max]: [number]) => {
  if (!Array.isArray(value)) {
    return '標籤格式錯誤';
  }

  if (value.length > max) {
    return `每個食譜最多只能有 ${max} 個標籤`;
  }
  return true;
});

configure({
  generateMessage: localize({
    zh_TW: zhTw, // 載入繁體中文語系
  }),
  validateOnInput: true, // 輸入文字時立即驗證
});
setLocale('zh_TW');

const app = createApp(App);

// 引入套件
app.use(VueLazyLoad);
app.use(VueAxios, axios);
app.use(createPinia());
app.use(router);

// 全局組件
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app');
