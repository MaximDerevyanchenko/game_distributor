const LoginPlugin = {
    install(Vue){
        Vue.prototype.$checkLogin = function () {
            return Vue.$cookies.isKey('username')
        }
    }
}
