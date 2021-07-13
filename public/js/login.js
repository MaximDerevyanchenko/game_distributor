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
    <div id="login" class="modal fade" tabindex="-1" aria-labelledby="Login" aria-hidden="true">
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
                    <button @click="login" role="button" type="submit" class="btn btn-outline-light">Login</button>
                    <router-link class="btn btn-outline-light" @click.native="closeModal" to="/signup">Not yet signed up?</router-link>
                </div>
            </form>
        </div>
    </div>
    `,
    methods: {
        login: function (e) {
            if (this.isValidated(e))
                axios.post('http://localhost:3000/api/account', this.account)
                    .then(response => {
                        if (!response.data){
                            this.resetForm()
                            this.error = true
                        } else {
                            this.$cookies.set("username", response.data.username, 7 * this.day)
                            this.$parent.$emit('log-event')
                            axios.patch('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/state', {state: "online"})
                                .then(() => {
                                    if (this.$router.currentRoute.path !== ('/profile/' + this.account.username) && this.$router.currentRoute.name !== 'Game')
                                        this.goToProfile()
                                    else
                                        this.$parent.$parent.$children[2].$emit('log-event')
                                })
                                .catch(err => console.log(err))
                            this.closeModal()
                        }
                    })
                    .catch(() => {
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
            this.account = {}
        })
    }
}
