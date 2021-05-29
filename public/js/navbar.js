const NavButton = {
    props: ['text'],
    template: `<li class="nav-item">
                    <router-link class="nav-link" :to="{ name: text }">{{ text }}</router-link>
                </li>`
}

const Navbar = {
    data: function (){
        return {
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
                           <button v-if="logged" @click.prevent="logout">Logout</button>
                       </ul>
                   </div>
               </nav>`,
    methods: {
        logout: function () {
            this.$cookies.remove('userName')
            this.checkLogin()
            this.$root.$emit("log-event", this.logged)
        }
    },
    mounted() {
        this.checkLogin()
    }

}
