const Login = {
    data() {
        return {
            account: {
                username: "",
                password: ""
            },
            typePassword: "password",
        }
    },
    template: `
    <div>
        <form> 
            <label for="username">Username:</label>
            <input id="username" v-model="account.username" type="text"/>
            <label for="password">Password:</label>
            <input id="password" v-model="account.password" v-bind:type="typePassword"/>
            <label for="showPassword">Show password</label>
            <input id="showPassword" type="checkbox" @change="showPassword"/>
            <button @click.prevent="login" type="submit">Login</button>
        </form>
        <button>
            <router-link class="nav-link" to="/signup">Not yet registered?</router-link>
        </button>
    </div>
    `,
    methods: {
        login: function () {
            axios.post('http://localhost:3000/api/account/login', this.account)
                .then(response => {
                    this.$cookies.set("username", response.data.username, 7 * this.day)
                    this.$emit('log-event')
                    this.$parent.$children[0].$emit('log-event')
                    axios.patch('http://localhost:3000/api/account/state', { state: "online" })
                        .then(res => this.goToProfile())
                        .catch(err => console.log(err))
                })
                .catch(err => console.log("l'utente non esiste"))
        },
        showPassword: function () {
            this.typePassword = this.typePassword === "password" ? "text" : "password"
        },
        goToProfile: function (){
            this.$router.push({ name: 'Profile', params: { username: Vue.$cookies.get('username') }})
        }
    },
    mounted() {
        if (this.$checkLogin())
            this.goToProfile()
    }
}
