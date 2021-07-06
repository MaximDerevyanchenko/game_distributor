const Navbar = {
    data: function (){
        return {
            logged: false,
            name: ""
        }
    },
    template: `
    <nav class="navbar navbar-expand-md navbar-dark border border-2 border-light bg-secondary p-2 mt-3 col-12">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="nav">
                <ul class="navbar-nav mb-2 mb-md-0 d-flex justify-content-between w-100">
                    <li class="nav-item mt-2">
                        <router-link class="nav-link active text-light" id="store" to="/store">Store</router-link>
                    </li>
                    <li class="nav-item mt-2 mb-2">
                        <form class="d-flex col-6 col-md-auto">
                            <input class="form-control me-2 bg-primary text-white" type="search" placeholder="Type..." aria-label="Search" v-model="name"/>
                            <button class="btn btn-outline-light" type="submit" @click.prevent="searchGame">Search</button>
                        </form>
                    </li>
                    <li class="nav-item mt-2">
                        <button ref="show-login" class="btn btn-outline-light" v-if="!logged" data-bs-toggle="modal" data-bs-target="#login"><i class="fas fa-user-circle me-2"></i>Account</button>
                        <div v-else class="dropdown">
                            <button class="btn btn-outline-light h-100" data-bs-toggle="dropdown"><i class="fas fa-user-circle me-2"></i>{{ logged ? Vue.$cookies.get('username') : 'Account'}}</button>
                            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-start dropdown-menu-md-end bg-secondary">
                                <li><router-link :to="'/profile/' + Vue.$cookies.get('username')" class="dropdown-item"><i class="fas fa-user me-2"></i>Profile</router-link></li>
                                <li><router-link :to="'/library/' + Vue.$cookies.get('username')" class="dropdown-item"><i class="fas fa-book-open me-2"></i>Library</router-link></li>
                                <li><router-link to="/cart" class="dropdown-item"><i class="fas fa-shopping-cart me-2"></i>Cart</router-link></li>
                                <li><router-link :to="'/wishlist/' + Vue.$cookies.get('username')" class="dropdown-item"><i class="fas fa-clipboard-list me-2"></i>Wishlist</router-link></li>
                                <li><router-link :to="'/friends/' + Vue.$cookies.get('username')" class="dropdown-item"><i class="fas fa-user-friends me-2"></i>Friends</router-link></li>
                                <li><button class="dropdown-item text-danger" @click="logout"><i class="fas fa-sign-out-alt me-2"></i>Logout</button></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <login></login>
        <notification></notification>
    </nav>`,
    methods: {
        logout: function () {
            axios.patch('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/state', { state: "offline" })
                .then(() => {
                    this.$cookies.remove('username')
                    this.$emit("log-event")
                    this.$parent.$children[2].$emit("log-event")
                })
                .catch(err => console.log(err))
        },
        searchGame: function () {
            if (this.$router.currentRoute.name !== 'Search')
                this.$router.push({name: 'Search', params: { name: this.name}})
            else
                this.$parent.$children[2].$emit("query-event", this.name)
        },

    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
        this.$on('login-needed', () => {
            this.$refs['show-login'].click()
        })
    }
}
