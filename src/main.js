import "normalize.css"
import App from "./App.vue"

Vue.use(iview);
Vue.config.devtools = process.env.NODE_ENV !== 'production';

new Vue({
    render: h => h(App)
}).$mount("#app");