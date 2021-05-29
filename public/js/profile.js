const Profile = {
    data: function() {
        return {
            account: {
                userId: "",
                password: ""
            },
            day: 24*60*60
        }
    },
    template: `
<div>
    <div v-if="logged">
        <p>Logged</p>
    </div>
    <div v-else>
        <form>
            <input v-model="account.userId" id="username" type="text"/>
            <input v-model="account.password" id="pw" type="text"/>
            <button @click.prevent="login()" type="submit">Login</button>
        </form>
        <button >
        <router-link class="nav-link" to="/signup">Not yet registered?</router-link>
        </button>
    </div>
</div>`,
    methods: {
        login: function () {
            axios.post('http://localhost:3000/api/login', this.account)
                .then(response => {
                    this.$cookies.set("userName", response.data.userId, 7 * this.day)
                    this.checkLogin()
                    this.$root.$emit('log-event', this.logged)
                    this.account = {}
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    mounted() {
        this.checkLogin()
    }
}

