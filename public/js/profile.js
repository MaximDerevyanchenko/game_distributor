const Profile = {
    data: function() {
        return {
            account: {
                userId: "",
                password: ""
            },
            day: 24*60*60,
            logged: false,
            typePassword: "password"
        }
    },
    template: `
<div>
    <div v-if="logged">
        <p>Logged</p>
    </div>
    <div v-else>
        <form> 
            <label for="username">Username:</label>
            <input id="username" v-model="account.userId" type="text"/>
            <label for="password">Password:</label>
            <input id="password" v-model="account.password" v-bind:type="typePassword"/>
            <label for="showPassword">Show password</label>
            <input id="showPassword" type="checkbox" @change="showPassword"/>
            <button @click.prevent="login" type="submit">Login</button>
        </form>
        <button >
        <router-link class="nav-link" to="/signup">Not yet registered?</router-link>
        </button>
    </div>
</div>`,
    methods: {
        login: function () {
            axios.post('http://localhost:3000/api/account/login', this.account)
                .then(response => {
                    this.$cookies.set("username", response.data.userId, 7 * this.day)
                    this.$emit('log-event')
                    this.$parent.$children[0].$emit('log-event')
                    this.account = {}
                })
                .catch(err => {
                    console.log("l'utente non esiste")
                })
        },
        showPassword: function () {
            this.typePassword = this.typePassword === "password" ? "text" : "password"
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
    }
}

