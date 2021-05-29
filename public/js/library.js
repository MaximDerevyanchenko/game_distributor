const Library = {
    template: `
        <div>
            <p>Library</p>
        </div>
        `,
    methods: {
        handleLogin: function () {
            if (!this.logged)
                this.$router.push({name: 'Profile'})
        }
    },
    mounted() {
        this.checkLogin()
        this.handleLogin()
    }
}
