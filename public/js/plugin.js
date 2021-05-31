const Myplugin = {
    install(Vue, options){
        Vue.prototype.$logged = false
        Vue.prototype.$checkLogin = function () {
            Vue.prototype.$logged = Vue.$cookies.isKey('userName')
        }
    }
}
