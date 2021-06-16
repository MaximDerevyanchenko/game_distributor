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
    <div>
        <form class="needs-validation" ref="form" novalidate>
            <div class="form-floating mb-3 has-validation">
                <input id="username" v-model="account.username" type="text" class="form-control" autocomplete="on" placeholder="Username" required/>
                <label for="username">Username:</label>
                <div class="invalid-feedback">Please choose a username.</div>
                <div class="valid-tooltip">Yeeeee</div>
            </div>
            <div class="form-floating mb-4 has-validation">
                <input id="password" v-model="account.password" v-bind:type="typePassword" class="form-control" autocomplete="current-password" placeholder="Password" required/>
                <label for="password">Password:</label>
                <i ref="checkbox" class="form-check-label far fa-eye" @click="showPassword"></i>
                <div class="invalid-feedback">Please choose a password.</div>
            </div>
            <div class="mb-3 form-check">
                <label for="showPassword" class="form-check-label">Show password</label>
               
            </div>
            <button @click="login" type="submit" class="btn btn-dark">Login</button>
        </form>
        <router-link class="btn btn-dark" to="/signup">Not yet registered?</router-link>
    </div>
    `,
    methods: {
        login: function (e) {
            const form = this.$refs["form"]
            if (!form.checkValidity()) {
                e.preventDefault()
                e.stopPropagation()
            }

            form.classList.add('was-validated')
            axios.post('http://localhost:3000/api/account/login', this.account)
                .then(response => {
                    this.$cookies.set("username", response.data.username, 7 * this.day)
                    this.$emit('log-event')
                    this.$parent.$children[0].$emit('log-event')
                    axios.patch('http://localhost:3000/api/account/state', { state: "online" })
                        .then(res => this.goToProfile())
                        .catch(err => console.log(err))
                })
                .catch(err => console.log("l'utente non esiste"))
        },
        showPassword: function () {
            this.typePassword = this.typePassword === "password" ? "text" : "password"
            this.$refs['checkbox'].classList.toggle('fa-eye-slash')
        },
        goToProfile: function (){
            this.$router.push({ name: 'Profile', params: { username: Vue.$cookies.get('username') }})
        }
    },
    mounted() {
        if (this.$checkLogin())
            this.goToProfile()
    }
}
