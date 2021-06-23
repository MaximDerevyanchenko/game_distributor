const Games = {
    data: function () {
        return {
            games: [],
            progress: 0,
            currentActive: 0
        }
    },
    template: `
        <div class="homeContainer bg-primary">
            <div class="progress ms-4 me-4" ref="progress">
                <div class="bg-primary progress-bar progress-bar-animated progress-bar-striped" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="progress" :style="'width: ' + progress + '%'"></div>
            </div>
            <div v-if="progress === 100" id="carousel" ref="carousel" class="carousel slide" data-bs-ride="carousel">
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <div class="carousel-indicators">
                    <button v-for="(game, index) in games" ref="indicators" type="button" :class="index == 0 ? 'active' : ''" :aria-current="index == 0 ? 'true' : ''" data-bs-target="#carousel" :data-bs-slide-to="index" :aria-label="game.name"></button>
                </div>
                <div class="carousel-inner bg-dark w-75 mx-auto">
                    <div class="carousel-item" data-bs-interval="3000" v-for="(game,index) in games" ref="items" :class="index == 0 ? 'active' : ''">
                        <div class="d-flex justify-content-center">
                            <img :src="game.header_image" class="w-75" :alt="game.name" /> 
                            <div class="w-25">
                                <router-link class="text-white" :to="{ name: 'Game', params: { gameId: game.steam_appid }}">{{ game.name }}</router-link>
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
                            promises.push(axios.get("http://localhost:3000/api/game/" + game.gameId, {
                                    onDownloadProgress: progressEvent => this.progress = ((this.progress / promises.length) + 1) * 100 / promises.length
                                })
                                    .then(g => g)
                                    .catch(err => console.log(err)))
                        else
                            promises.push(axios.get("http://localhost:3000/api/steam_game/" + game.gameId, {
                                    onDownloadProgress: progressEvent => this.progress = ((this.progress / promises.length) + 1) * 100 / promises.length
                                })
                                .then(g => g)
                                .catch(err => console.log(err)))
                    })
                    Promise.all(promises)
                        .then(res => {
                            res.filter(r => r.status === 200).forEach(game => this.games.push(game.data))
                            this.progress = 100
                            setTimeout(() => {
                                if (document.querySelector('.progress') != null)
                                    document.querySelector('.progress').classList.add('d-none')
                            }, 1200)
                        })
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
