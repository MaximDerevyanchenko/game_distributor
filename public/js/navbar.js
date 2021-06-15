const NavButton = {
    props: ['text', 'username'],
    template: `<li class="nav-item">
                    <router-link class="nav-link" :to="{ name: text , params: { username: username }}">{{ text }}</router-link>
                </li>`
}

const Navbar = {
    data: function (){
        return {
            logged: false
        }
    },
    components: {
        'navbutton': NavButton
    },
    template: `<nav class="navbar navbar-expand-lg navbar-light bg-light">
                   <div id="navbarNav">
                       <ul class="navbar-nav">
                           <navbutton text="Store"></navbutton>
                           <navbutton v-if="logged" text="Library"></navbutton>
                           <navbutton v-if="logged" text="Profile" :username="Vue.$cookies.get('username')"></navbutton>
                           <navbutton v-else text="Login"></navbutton>
                           <navbutton v-if="logged" text="Cart"></navbutton>
                           <navbutton v-if="logged" text="Friends"></navbutton>
                           <button v-if="logged" @click.prevent="logout">Logout</button>
                       </ul>
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
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
    }
}
