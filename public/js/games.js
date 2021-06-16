const Games = {
    data: function () {
        return {
            games: [],

            currentActive: 0
        }
    },
    template: `
        <div class="homeContainer bg-primary">
            <div id="carousel" class="carousel slide" data-bs-ride="carousel">
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <div class="carousel-indicators">
                    <button v-for="(game, index) in games" ref="indicators" type="button" :class="index == 0 ? 'active' : ''" :aria-current="index == 0 ? 'true' : ''" data-bs-target="#carousel" :data-bs-slide-to="index" :aria-label="game.name"></button>
                </div>
                <div class="carousel-inner bg-dark w-75 mx-auto">
                    <div class="carousel-item" v-for="(game,index) in games" ref="items" :class="index == 0 ? 'active' : ''">
                        <div class="d-flex justify-content-center">
                            <img :src="game.header_image" class="w-75" :alt="game.name" /> 
                            <div class="w-25">
                                <router-link class="text-white" :to="{ name: 'Game', params: { game_id: game.steam_appid }}">{{ game.name }}</router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    `,
    methods: {
        getGames: function () {
            axios.get("http://localhost:3000/api/games")
                .then(response => {
                    let promises = []
                    response.data.forEach(game => {
                        if (game.isLocal)
                            promises.push(axios.get("http://localhost:3000/api/game/" + game.appid)
                                    .then(g => g)
                                    .catch(err => console.log(err)))
                        else
                            promises.push(axios.get("http://localhost:3000/api/steam_game/" + game.appid)
                            .then(g => g)
                            .catch(err => console.log(err)))
                    })
                    Promise.all(promises)
                        .then(res => res.filter(r => r.status === 200).forEach(game => this.games.push(game.data)))
                        .catch(err => console.log(err))
                })
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
