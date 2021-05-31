const Library = {
    template: `
        <div>
            <p>Library</p>
        </div>
        `,
    methods: {
        handleLogin: function () {
            if (!this.$logged)
                this.$router.push({name: 'Profile'})
        }
    },
    mounted() {
        this.$checkLogin()
        this.handleLogin()
        this.$on('log-event', data => {
            this.$checkLogin()
        })
        this.$on('library-logout', data => {
            this.handleLogin()
        })
    }
}
