const NavButton = {
    props: ['text', 'username'],
    template: `<li class="nav-item">
                    <router-link class="nav-link" :to="{ name: text , params: { username: username }}">{{ text }}</router-link>
                </li>`
}

const Login = {
    data() {
        return {
            account: {
                username: "",
                password: ""
            },
            typePassword: "password",
            isValid: false
        }
    },
    template: `
    <div id="login" class="modal fade">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <form class="modal-content needs-validation border border-dark border-2 shadow-lg rounded mt-4 p-4" ref="form" novalidate>
                <div class="form-floating mb-3 has-validation me-4">
                    <input id="username" v-model="account.username" type="text" class="form-control" autocomplete="on" placeholder="Username" required />
                    <label for="username">Username</label>
                    <div class="invalid-feedback">Please choose a username.</div>
                </div>
                <div class="row mb-3">
                    <div class="col pe-1">
                        <div class="form-floating has-validation">
                            <input id="password" v-model="account.password" v-bind:type="typePassword" class="form-control" autocomplete="current-password" placeholder="Password" required />
                            <label for="password">Password</label>
                            <div class="invalid-feedback">Please choose a password.</div>
                        </div>
                    </div>
                    <div class="col-auto d-flex ps-2 pe-1">
                         <i ref="checkbox" class="far fa-eye align-self-center" @click="showPassword"></i>
                    </div>
                </div>
                <div class="d-flex justify-content-around">
                    <router-link class="btn btn-outline-primary" @click.native="closeModal" to="/signup">Not yet registered?</router-link>
                    <button @click="login" type="submit" class="btn btn-outline-secondary">Login</button>
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
                                    this.$parent.$parent.$children[1].$emit('log-event')
                            })
                            .catch(err => console.log(err))
                        this.closeModal()
                    })
                    .catch(err => console.log("l'utente non esiste"))
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
        }
    },
    mounted() {
        const modal = document.querySelector('#login')
        modal.addEventListener('shown.bs.modal', () => document.querySelector('#username').focus())
        modal.addEventListener('hidden.bs.modal', () => {
            this.$refs.form.reset()
            document.querySelectorAll('.is-invalid').forEach(e => e.classList.remove('is-invalid'))
            document.querySelectorAll('.is-valid').forEach(e => e.classList.remove('is-valid'))
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
        'navbutton': NavButton,
        'login': Login
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
                <button class="btn btn-outline-light me-5" type="submit" @click.prevent="searchGame">Search</button>
            </form>
            <router-link v-if="!logged" class="btn btn-outline-light navbar-right me-2" to="/signup">Sign up</router-link>
            <button v-if="!logged" class="btn btn-outline-light navbar-right" data-bs-toggle="modal" data-bs-target="#login"><i class="fas fa-sign-in-alt me-1"></i>Login</button>
            <button class="btn btn-outline-danger navbar-right" v-if="logged" @click.prevent="logout"><i class="fas fa-sign-out-alt">Logout</button>
        </div>
        <login></login>
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
