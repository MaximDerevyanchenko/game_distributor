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
            typePassword: "password"
        }
    },
    template: `
<div>
    <form>
        <label for="userId">Username:</label>
        <input id="userId" v-model="account.username" type="text" @change="hideExists" required />
        <label for="password">Password:</label>
        <input id="password" v-model="account.password" v-bind:type="typePassword" required/>
        <label for="showPassword">Show password</label>
        <input id="showPassword" @change="showPassword" type="checkbox" />
        <label for="email">Email:</label>
        <input id="email" v-model="account.email" type="email" required/>
        <label for="nickname">Nickname:</label>
        <input id="nickname" v-model="account.nickname" type="text" required/>
        <!-- TODO avatar -->
        <button @click.prevent="signUp" type="submit">Sign Up</button>
    </form>
    <p v-if="exists">{{existingId}} already exists!!!</p>
</div>`,
    methods: {
        signUp: function () {
            if (this.formIsValid()) {
                this.exists = false
                axios.post('http://localhost:3000/api/account/signup', this.account)
                    .then(res => {
                        if (!res.data.hasOwnProperty("password")) {
                            this.existingId = res.data.username
                            this.exists = true
                        } else
                            this.$router.push({ name: 'Profile'})
                    })
                    .catch(err => console.log(err))
            }
        },
        hideExists: function () {
            this.exists = false
        },
        showPassword: function (){
            this.typePassword = this.typePassword === "password" ? "text" : "password"
        },
        formIsValid: function () {
            return this.account.username !== "" && this.account.password !== "" && this.account.email !== "" && this.account.nickname !== "";
        }
    }
}
