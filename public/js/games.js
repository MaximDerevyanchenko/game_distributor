const Games = {
    data: function () {
        return {
            games: [],
            name: ""
        }
    },
    template: `
        <div class="homeContainer">
            <div>
                <form>
                    <label for="name">Name:</label>
                    <input id="name" type="text" v-model="name" />
                    <input type="submit" @click.prevent="searchGame" />
                </form>
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
        },
        searchGame: function () {
            this.$router.push({name: 'Search', params: { name: this.name }})
        }
    },
    mounted() {
        this.getGames()
    }
}
