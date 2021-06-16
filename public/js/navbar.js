const NavButton = {
    props: ['text', 'username'],
    template: `<li class="nav-item">
                    <router-link class="nav-link" :to="{ name: text , params: { username: username }}">{{ text }}</router-link>
                </li>`
}

const Navbar = {
    data: function (){
        return {
            logged: false,
            name: ""
        }
    },
    components: {
        'navbutton': NavButton
    },
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-secondary">
        <div class="container-fluid">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <navbutton text="Store"></navbutton>
                <navbutton v-if="logged" text="Library"></navbutton>
                <navbutton v-if="logged" text="Profile" :username="Vue.$cookies.get('username')"></navbutton>
                <navbutton v-if="logged" text="Cart"></navbutton>
                <navbutton v-if="logged" text="Friends"></navbutton>
            </ul>
            <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="name"/>
                <button class="btn btn-outline-light me-2" type="submit" @click.prevent="searchGame">Search</button>
            </form>
            <router-link v-if="!logged" class="btn btn-outline-light navbar-right" to="/login">Login</router-link>
            <button class="btn btn-outline-danger navbar-right" v-if="logged" @click.prevent="logout">Logout</button>
        </div>
    </nav>`,
    methods: {
        logout: function () {
            axios.patch('http://localhost:3000/api/account/state', { state: "offline" })
                .then(() => {
                    this.$cookies.remove('username')
                    this.$emit("log-event")
                    this.$parent.$children[1].$emit("log-event")
                })
                .catch(err => console.log(err))
        },
        searchGame: function () {
            if (this.$router.currentRoute.name !== 'Search')
                this.$router.push({name: 'Search', params: { name: this.name}})
            else
                this.$parent.$children[1].$emit("query-event", this.name)
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
    }
}
