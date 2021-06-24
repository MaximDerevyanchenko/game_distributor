const Login = {
    data() {
        return {
            account: {
                username: "",
                password: ""
            },
            typePassword: "password",
            error: false,
            day: 24*60*60
        }
    },
    template: `
    <div id="login" class="modal fade">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <form class="modal-content needs-validation border border-light border-2 shadow-lg rounded mt-4 p-4 bg-secondary text-white" ref="form" novalidate>
                <div class="modal-title text-center">
                    <h5>Login</h5>
                </div>
                <div class="modal-body">
                    <div class="form-floating mb-3 has-validation me-4">
                        <input id="username" v-model="account.username" type="text" class="form-control bg-transparent text-white" autocomplete="off" placeholder="Username" required />
                        <label for="username">Username</label>
                        <div class="invalid-feedback">Please choose a username.</div>
                    </div>
                    <div class="row mb-3">
                        <div class="col pe-1">
                            <div class="form-floating has-validation">
                                <input id="password" v-model="account.password" v-bind:type="typePassword" class="form-control bg-transparent text-white" autocomplete="off" placeholder="Password" required />
                                <label for="password">Password</label>
                                <div class="invalid-feedback">Please choose a password.</div>
                            </div>
                        </div>
                        <div class="col-auto d-flex ps-2 pe-1">
                             <i ref="checkbox" class="far fa-eye align-self-center" @click="showPassword"></i>
                        </div>
                    </div>
                    <div v-if="error" class="row text-danger" style="font-size: small">
                        <p>Username and/or password are wrong!</p>
                    </div>
                </div>
                <div class="modal-footer justify-content-around"> 
                    <button @click="login" type="submit" class="btn btn-outline-light">Login</button>
                    <router-link class="btn btn-outline-light" @click.native="closeModal" to="/signup">Not yet signed up?</router-link>
                </div>
            </form>
        </div>
    </div>
    `,
    methods: {
        login: function (e) {
            if (this.isValidated(e))
                axios.post('http://localhost:3000/api/account/login', this.account)
                    .then(response => {
                        this.$cookies.set("username", response.data.username, 7 * this.day)
                        this.$parent.$emit('log-event')
                        axios.patch('http://localhost:3000/api/account/state', { state: "online" })
                            .then(res => {
                                if (this.$router.currentRoute.path !== ('/profile/' + this.account.username))
                                    this.goToProfile()
                                else
                                    this.$parent.$parent.$children[2].$emit('log-event')
                            })
                            .catch(err => console.log(err))
                        this.closeModal()
                    })
                    .catch(err => {
                        this.resetForm()
                        this.error = true
                    })
        },
        isValidated: function (e){
            e.preventDefault()
            let value = true

            const username = document.querySelector('#username')
            if (!username.checkValidity()){
                username.classList.remove('is-valid')
                username.classList.add('is-invalid')
                value = false
            } else {
                username.classList.add('is-valid')
                username.classList.remove('is-invalid')
            }

            const password = document.querySelector('#password')
            if (!password.checkValidity()) {
                password.classList.remove('is-valid')
                password.classList.add('is-invalid')
                value = false
            } else {
                password.classList.add('is-valid')
                password.classList.remove('is-invalid')
            }
            return value
        },
        showPassword: function () {
            this.typePassword = this.typePassword === "password" ? "text" : "password"
            this.$refs['checkbox'].classList.toggle('fa-eye-slash')
        },
        goToProfile: function (){
            this.$router.push({ name: 'Profile', params: { username: Vue.$cookies.get('username') }})
        },
        closeModal: function (){
            bootstrap.Modal.getInstance(document.querySelector('#login')).hide()
        },
        resetForm: function (){
            document.querySelectorAll('.is-invalid').forEach(e => e.classList.remove('is-invalid'))
            document.querySelectorAll('.is-valid').forEach(e => e.classList.remove('is-valid'))
        }
    },
    mounted() {
        const modal = document.querySelector('#login')
        modal.addEventListener('shown.bs.modal', () => document.querySelector('#username').focus())
        modal.addEventListener('hidden.bs.modal', () => {
            this.$refs.form.reset()
            this.resetForm()
        })
    }
}


const Navbar = {
    data: function (){
        return {
            logged: false,
            name: ""
        }
    },
    components: {
        'login': Login
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
