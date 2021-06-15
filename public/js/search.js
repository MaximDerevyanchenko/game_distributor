const Search = {
    props: ['name'],
    data() {
        return {
            games: []
        }
    },
    template: `
    <div>
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
        searchGame: function () {
            axios.post("http://localhost:3000/api/games", { name: this.name })
                .then(response => this.games = response.data)
                .catch(error => console.log(error))
        }
    },
    mounted(){
        this.searchGame()
    }
}
