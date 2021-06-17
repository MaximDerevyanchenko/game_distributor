const SignUp = {
    data: function() {
        return {
            exists: false,
            existingId: "",
            account: {
                'username': "",
                'password': "",
                'email': "",
                'nickname': "",
                'state': "offline"
            },
            typePassword: "password",
            typeConfirmPassword: "password",
            confirmPassword: "",
            countries: []
        }
    },
    template: `
<div class="d-flex justify-content-center">
    <form ref="form" class="needs-validation border border-dark border-2 shadow-lg rounded w-50 mt-4 p-4" novalidate>
        <div class="row mb-4">
            <div class="col">
                <div class="form-floating">
                    <input class="form-control" placeholder="username" id="username" v-model="account.username" type="text" @change="hideExists" required autocomplete="on"/>
                    <label for="username">Username</label>
                </div>
            </div>
             <div class="col">
                <div class="form-floating">
                    <input class="form-control" placeholder="email@gmail.com" id="email" v-model="account.email" type="email" required/>
                    <label for="email">Email</label>
                </div>
             </div>
        </div>
        <div class="row mb-4">
            <div class="col">
                <div class="d-block">
                    <div class="form-floating d-flex">
                        <input class="form-control flex-fill" id="password" placeholder="password" v-model="account.password" v-bind:type="typePassword" autocomplete="on"/>
                        <label for="password">Password</label>
                        <span ref="checkbox" class="far fa-eye input-group-text" @click="showPassword"></span>
                    </div>
                </div>
            </div>
             <div class="col">
                <div class="d-block">
                    <div class="form-floating d-flex">
                        <input class="form-control flex-fill" id="confirmPassword" placeholder="confirmPassword" v-model="confirmPassword" v-bind:type="typeConfirmPassword" autocomplete="current-password"/>
                        <label for="confirmPassword">Confirm Password</label>
                        <span ref="checkboxConfirm" class="input-group-text far fa-eye" @click="showConfirmPassword"></span>
                        
                    </div>
                </div>
             </div>
        </div>
        <div class="row mb-4">
            <div class="col-4">
                <div class="invalid-feedback d-none">Passwords are NOT the same.</div>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col">
                <div class="form-floating">
                    <input class="form-control" placeholder="name" id="name" v-model="account.name" type="text" autocomplete="on"/>
                    <label for="name">Your name</label>
                </div>
            </div>
             <div class="col">
                <div class="form-floating">
                    <input class="form-control" placeholder="nickname" id="nickname" v-model="account.nickname" required type="text" />
                    <label for="nickname">Nickname</label>
                </div>
             </div>
        </div>
        <div class="row mb-4">
            <div class="col">
                <div class="form-floating">
                    <textarea class="form-control" placeholder="Your bio" id="bio" v-model="account.bio" type="text"></textarea>
                    <label for="bio">Your bio</label>
                </div>
            </div>
        </div>
         <div class="row mb-4">
            <div class="col">
                <div>
                    <label for="avatar">Your avatar</label>
                    <input class="form-control" id="avatar" v-model="account.avatarImg" type="file" accept="image/*"/>
                </div>
            </div>
             <div class="col">
                <div>
                    <label for="background">Your background</label>
                    <input class="form-control" id="background" v-model="account.backgroundImg" type="file" accept="image/*" />
                </div>
             </div>
              <div class="col">
                <div class="form-floating">
                    <select class="form-select" id="country" v-model="account.country">
                        <option v-for="country in countries" :value="country.name">{{ country.name }}</option>
                    </select>
                    <label for="country">Your country</label>
                </div>
             </div>
        </div>
        <div class="d-flex justify-content-end">
            <button @click.prevent="signUp" class="btn btn-outline-primary" type="submit">Sign Up</button>
        </div>
    </form>
</div>`,
    methods: {
        signUp: function (e) {
            if (this.isValidated(e)){
                this.exists = false
                axios.post('http://localhost:3000/api/account/signup', this.account)
                    .then(res => {
                        if (!res.data.hasOwnProperty("password")) {
                            this.existingId = res.data.username
                            this.exists = true
                        } else
                            this.login()
                    })
                    .catch(err => console.log(err))
            }
        },
        // TODO check email + check username vuoto
        isValidated: function (e){
            e.preventDefault()
            let value = true

            if (this.account.username === ''){
                document.querySelector('#username').classList.remove('is-valid')
                document.querySelector('#username').classList.add('is-invalid')
                value = false
            } else {
                document.querySelector('#username').classList.add('is-valid')
                document.querySelector('#username').classList.remove('is-invalid')
                value = true
            }

            if (this.account.email === ''){
                document.querySelector('#email').classList.remove('is-valid')
                document.querySelector('#email').classList.add('is-invalid')
                value = false
            } else {
                document.querySelector('#email').classList.add('is-valid')
                document.querySelector('#email').classList.remove('is-invalid')
                value = true
            }

            if (this.account.nickname === ''){
                document.querySelector('#nickname').classList.remove('is-valid')
                document.querySelector('#nickname').classList.add('is-invalid')
                value = false
            } else {
                document.querySelector('#nickname').classList.add('is-valid')
                document.querySelector('#nickname').classList.remove('is-invalid')
                value = true
            }

            if (this.account.password === ''){
                document.querySelector('#password').classList.remove('is-valid')
                document.querySelector('#password').classList.add('is-invalid')
                value = false
            } else {
                document.querySelector('#password').classList.add('is-valid')
                document.querySelector('#password').classList.remove('is-invalid')
                value = true
            }

            if (this.confirmPassword === '' || this.account.password !== this.confirmPassword){
                document.querySelector('#confirmPassword').classList.remove('is-valid')
                document.querySelector('#confirmPassword').classList.add('is-invalid')
                document.querySelector('.invalid-feedback').classList.remove('d-none')
                document.querySelector('.invalid-feedback').classList.add('d-block')
                value = false
            } else {
                document.querySelector('#confirmPassword').classList.add('is-valid')
                document.querySelector('#confirmPassword').classList.remove('is-invalid')
                document.querySelector('.invalid-feedback').classList.add('d-none')
                document.querySelector('.invalid-feedback').classList.remove('d-block')
                value = true
            }

            return value
        },
        login: function (){
            axios.post('http://localhost:3000/api/account/login', this.account)
                .then(response => {
                    this.$cookies.set("username", response.data.username, 7 * this.day)
                    this.$emit('log-event')
                    this.$parent.$children[0].$emit('log-event')
                    axios.patch('http://localhost:3000/api/account/state', { state: "online" })
                        .then(res => this.$router.push({ name: 'Profile', params: { username: this.account.username }}))
                        .catch(err => console.log(err))
                })
                .catch(err => console.log("l'utente non esiste"))
        },
        hideExists: function () {
            this.exists = false
        },
        showPassword: function (){
            this.typePassword = this.typePassword === "password" ? "text" : "password"
            this.$refs['checkbox'].classList.toggle('fa-eye-slash')
        },
        showConfirmPassword: function (){
            this.typeConfirmPassword = this.typeConfirmPassword === "password" ? "text" : "password"
            this.$refs['checkboxConfirm'].classList.toggle('fa-eye-slash')
        },
        formIsValid: function () {
            return this.account.username !== "" && this.account.password !== "" && this.account.email !== "" && this.account.nickname !== "";
        },
        getCountries: function () {
            axios.get('http://localhost:3000/api/countries')
                .then(res => this.countries = res.data)
                .catch(err => console.log(err))
        }
    },
    filters: {
        uppercase: function (){

        }
    },
    mounted() {
        this.getCountries()
    }
}
