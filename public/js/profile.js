const Profile = {
    props: ['username'],
    data: function() {
        return {
            account: {
                username: "",
                password: "",
                isDeveloper: false
            },
            day: 24*60*60,
            logged: false,
            typePassword: "password",
            game: {
                appid: -1,
                name: "",
                isLocal: true
            }
        }
    },
    template: `
<div>
    <div v-if="logged">
        <p>State: {{ account.state }}</p>
        <div v-if="username == account.username">
            <div v-if="account.isDeveloper">
                <form>
                    <label for="gameId">GameId: </label>
                    <input id="gameId" type="number" v-model="game.appid" />
                    <label for="name">Name:</label>
                    <input id="name" type="text" v-model="game.name">
                    <input type="submit" @click.prevent="createGame"/>
                </form>
            </div>
            <div v-else>
                <button @click="becomeDeveloper">Become developer</button>
            </div>
        </div>
        <div v-else>
            <div>
                <router-link class="nav-button" :to="{ name: 'Wishlist', params: { username: username }}">Wishlist</router-link>
            </div>
        </div>
    </div>
    <div v-else>
        <form> 
            <label for="username">Username:</label>
            <input id="username" v-model="account.username" type="text"/>
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
                    this.$cookies.set("username", response.data.username, 7 * this.day)
                    this.$emit('log-event')
                    this.$parent.$children[0].$emit('log-event')
                    axios.patch('http://localhost:3000/api/account/state', { state: "online"})
                        .then(res => this.account = res.data)
                        .catch(err => console.log(err))
                })
                .catch(err => console.log("l'utente non esiste"))
        },
        showPassword: function () {
            this.typePassword = this.typePassword === "password" ? "text" : "password"
        },
        getMyAccount: function () {
            axios.get('http://localhost:3000/api/account')
                .then(res => this.account = res.data)
                .catch(err => console.log(err))
        },
        becomeDeveloper: function (){
            axios.patch('http://localhost:3000/api/account', { isDeveloper: true })
                .then(() => this.account.isDeveloper = true)
                .catch(err => console.log(err))
        },
        createGame: function (){
            axios.post('http://localhost:3000/api/create_game', this.game)
                .then(() => this.$router.push({ name: 'Game', params: { game_id: this.game.appid }}))
                .catch(err => console.log(err))
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
        if (this.logged)
            this.getMyAccount()
    }
}

