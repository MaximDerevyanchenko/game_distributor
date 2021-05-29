const SignUp = {
    data: function() {
        return {
            exists: false,
            existingId: "",
            account: {
                'userId': "",
                'password': "",
                'email': "",
                'nickname': ""
            },
        }
    },
    template: `
<div>
    <form>
        <input v-model="account.userId" type="text" @change="hideExists"/>
        <input v-model="account.password" type="text"/>
        <input v-model="account.email" type="email"/>
        <input v-model="account.nickname" type="text"/>
        <!-- TODO avatar -->
        <button @click.prevent="signUp" type="submit">Sign Up</button>
    </form>
    <p v-if="exists">{{existingId}} already exists!!!</p>
</div>`,
    methods: {
        signUp: function () {
            this.exists = false
            axios.post('http://localhost:3000/api/signup', this.account)
                .then(res => {
                    if (!res.data.hasOwnProperty("password")) {
                        this.existingId = res.data.userId
                        this.exists = true
                    } else {
                        console.log(res)
                    }
                })
        },
        hideExists: function () {
            this.exists = false
        }
    }
}
