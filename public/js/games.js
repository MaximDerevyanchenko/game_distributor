const Games = {
    data: function () {
        return {
            games: []
        }
    },
    template: `
        <div class="homeContainer">
            <div >
<!--                <button @click.prevent="syncGames">Synch With Steam</button>-->
            </div>
            <div class="last" v-for="game in games">
                <div class="coverText">
                    <div>
                        <router-link class="nav-link" :to="{ name: 'Game', params: { game_id: game.appid }}">{{ game.name }}</router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        getGames: function () {
            axios.get("http://localhost:3000/api/games")
                .then(response => this.games = response.data)
                .catch(error => console.log(error))
        },
        syncGames: function () {
            axios.post("http://localhost:3000/api/games")
                .then(response => this.games = response.data)
                .catch(error => console.log(error))
        }
    },
    mounted() {
        this.getGames()
    }
}
