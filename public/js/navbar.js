const Navbar = {
    data: function (){
        return {
            logged: false,
            name: ""
        }
    },
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark border border-2 rounded-pill border-light bg-secondary p-2 mt-3">
        <div class="container-fluid">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <router-link class="nav-link active" to="/store">Store</router-link>
                </li>
            </ul>
            <form class="d-flex">
                <input class="form-control me-2 bg-primary text-white" type="search" placeholder="Type..." aria-label="Search" v-model="name"/>
                <button class="btn btn-outline-light me-5" type="submit" @click.prevent="searchGame">Search</button>
            </form>
            <button class="btn btn-outline-light" v-if="!logged" data-bs-toggle="modal" data-bs-target="#login"><i class="fas fa-user-circle me-2"></i>Account</button>
            <div v-else class="btn-group">
                <button class="btn btn-outline-light" data-bs-toggle="dropdown"><i class="fas fa-user-circle me-2"></i>Account</button>
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end bg-secondary">
                    <li><router-link :to="'/profile/' + Vue.$cookies.get('username')" class="dropdown-item"><i class="fas fa-user me-2"></i>Profile</router-link></li>
                    <li><router-link to="/library" class="dropdown-item"><i class="fas fa-book-open me-2"></i>Library</router-link></li>
                    <li><router-link to="/cart" class="dropdown-item"><i class="fas fa-shopping-cart me-2"></i>Cart</router-link></li>
                    <li><router-link to="/friends" class="dropdown-item"><i class="fas fa-user-friends me-2"></i>Friends</router-link></li>
                    <li><button class="dropdown-item text-danger" @click="logout"><i class="fas fa-sign-out-alt me-2"></i>Logout</button></li>
                </ul>
            </div>
        </div>
        <login></login>
    </nav>`,
    methods: {
        logout: function () {
            axios.patch('http://localhost:3000/api/account/state', { state: "offline" })
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
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
    }
}
