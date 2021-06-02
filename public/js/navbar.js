const NavButton = {
    props: ['text'],
    template: `<li class="nav-item">
                    <router-link class="nav-link" :to="{ name: text }">{{ text }}</router-link>
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
                           <navbutton text="Library"></navbutton>
                           <navbutton text="Profile"></navbutton>
                           <navbutton text="Cart"></navbutton>
                           <button v-if="logged" @click.prevent="logout">Logout</button>
                       </ul>
                   </div>
               </nav>`,
    methods: {
        logout: function () {
            this.$cookies.remove('username')
            this.$emit("log-event")
            this.$parent.$children[1].$emit("log-event")
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
    }
}
