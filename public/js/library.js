const Library = {
    data() {
        return {
           games: []
        }
    },
    template: `
        <div>
            <p>Library</p>
            <div v-for="game in games">
                <h1>{{ game.gameId }}</h1>
            </div>
        </div>
        `,
    methods: {
        handleLogin: function () {
            if (!this.$checkLogin())
                this.$router.push({name: 'Profile'})
        },
        getLibrary: function () {
            axios.get("http://localhost:3000/api/account/library")
                .then(response => this.games = response.data)
                .catch(err => console.log(err))
        }
    },
    mounted() {
        this.handleLogin()
        this.getLibrary()
        this.$on('log-event', () => {
            this.handleLogin()
        })
    }
}
