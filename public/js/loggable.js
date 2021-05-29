const Loggable = new Vue()
Vue.mixin({
    data: function() {
        return {
            loggable: Loggable,
            logged: false
        }
    },
    methods: {
        checkLogin: function () {
            this.logged = this.$cookies.isKey("userName");
        },
        handleLogin: function () {}
    },
    mounted() {
        this.$root.$on('log-event', data => {
            this.checkLogin()
            this.handleLogin()
        })
    }
})
