const Game = {
    props: ['gameId'],
    data: function () {
        return {
            game: {},
            dlcs: [],
            onlinePlayers: 0,
            isInLibrary: false,
            logged: false
        }
    },
    template: `
        <div class="d-flex flex-column align-items-center" v-if="game">
            <div class="justify-content-around">
                <h3>{{ game.name }}</h3>
            </div>
            <div class="w-75">
                <div class="d-flex">
                    <p class="me-auto w-75">{{ game.short_description }}</p>
                    <div class="card bg-primary border-0 mb-3 ms-2 w-25 align-self-start">
                        <div class="card-body p-0">
                            <p class="card-title">Genres</p>
                            <div class="card-text">
                                <span v-for="genre in game.genres" class="badge bg-secondary">{{ genre.description }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="carousel" ref="carousel" class="carousel slide mb-4" data-bs-ride="carousel">
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <div class="carousel-indicators">
                        <button v-for="screenshot in game.screenshots" ref="indicators" type="button" :class="screenshot.id == 0 ? 'active' : ''" :aria-current="screenshot.id == 0 ? 'true' : ''" data-bs-target="#carousel" :data-bs-slide-to="screenshot.id" :aria-label="screenshot.id"></button>
                    </div>
                    <div class="carousel-inner mx-auto">
                        <div class="carousel-item" data-bs-interval="3000" v-for="screenshot in game.screenshots" ref="items" :class="screenshot.id == 0 ? 'active' : ''">
                            <div class="d-flex justify-content-center">
                                <img :src="screenshot.path_thumbnail" class="w-75" alt="Game screenshot" />
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
                <div v-if="game.type == 'game'">Online players: {{ onlinePlayers }}</div>
                <div class="card bg-secondary">
                    <div v-if="game.release_date && !game.release_date.coming_soon">
                        <div v-if="game.is_free" class="d-flex flex-row justify-content-end card-body">
                            <h4 class="me-auto">{{ game.name }}</h4>
                            <div class="bg-success border border-success border-3 ms-2 mb-0 me-2">Free</div>
                            <button v-if="!isInLibrary" @click="addToLibrary" class="btn btn-outline-light">Add to library</button>
                            <div v-else class="bg-dark border border-light border-3 p-1 ms-2 me-2 align-self-end">Already in Library</div>
                        </div>
                        <div v-else-if="game.price_overview" class="d-flex flex-row justify-content-end card-body">
                            <h4 class="me-auto">{{ game.name }}</h4>
                            <div v-if="game.price_overview.discount_percent != 0" class="bg-success border border-success border-5 align-self-end">-{{ game.price_overview.discount_percent }}%</div>
                            <div v-if="game.price_overview.discount_percent != 0" class="bg-dark border border-dark border-5 ms-2 align-self-end"><del>{{ game.price_overview.initial_formatted }}</del></div>
                            <div class="bg-dark border border-success border-5 ms-2 me-2 align-self-end">{{ game.price_overview.final_formatted }}</div>
                            <div v-if="!isInLibrary">
                                <button @click="addToCart" class="btn btn-outline-light me-2 align-self-end">Add to cart</button>
                                <button @click="addToWishlist" class="btn btn-outline-light align-self-end">Add to wishlist</button>
                            </div>
                            <div v-else class="bg-dark border border-light border-3 p-1 ms-2 me-2 align-self-end">Already in Library</div>
                        </div>
                        <div v-else class="d-flex flex-row justify-content-end card-body">
                            <h4 class="me-auto">{{ game.name }}</h4>
                            <div class="bg-dark border border-danger border-3 p-1 ms-2 me-2 align-self-end">Game not available in store</div>
                        </div>
                    </div>
                    <div v-else class="d-flex flex-row justify-content-end card-body">
                        <h4 class="me-auto">{{ game.name }}</h4>
                        <div class="bg-dark border border-light border-3 p-1 ms-2 me-2 align-self-end">Coming Soon</div>
                        <button @click="addToWishlist" class="btn btn-outline-light align-self-end">Add to wishlist</button>
                    </div>
                    
                    <div v-else class="d-flex flex-row justify-content-end card-body">
                        <h4 class="me-auto">{{ game.name }}</h4>
                        <div class="bg-dark border border-light border-3 p-1 ms-2 me-2 align-self-end">Coming Soon</div>
                        <button @click="addToWishlist" class="btn btn-outline-light align-self-end">Add to wishlist</button>
                    </div>
                </div>
                
                <div v-if="dlcs.length > 0" class="d-flex flex-column bg-secondary mt-4">
                    <div class="bg-primary">Downloadable Content:</div>
                    <router-link v-for="dlc in dlcs" class="p-1 border rounded border-1 text-light" :to="{ name: 'Game', params: { gameId: dlc.steam_appid }}">
                        <div class="d-flex justify-content-between">
                            <div>{{ dlc.name }}</div>
                            <div v-if="dlc.is_free">Free to play</div>
                            <div v-else-if="dlc.price_overview">{{ dlc.price_overview.final_formatted }}</div>
                            <div v-else >N/A</div>
                        </div>
                    </router-link>
                </div>
                
                <div class="row mt-5">
                    <div class="w-75">
                        <h3>About the game</h3>
                        <p v-html="game.about_the_game"></p>
                        <p v-if="game.about_the_game != game.detailed_description" v-html="game.detailed_description"></p>
                        
                        <h4>System Requirements</h4>
                        <ul class="nav nav-tabs" role="tablist">
                            <li v-if="game.platforms && game.platforms.windows" class="nav-item" role="presentation">
                                <button class="nav-link active" id="windows-tab" data-bs-toggle="tab" data-bs-target="#windows" type="button" role="tab" aria-controls="windows" aria-selected="true">Windows</button>
                            </li>
                            <li v-if="game.platforms && game.platforms.mac" class="nav-item" role="presentation">
                                <button class="nav-link" id="mac-tab" data-bs-toggle="tab" data-bs-target="#mac" type="button" role="tab" aria-controls="mac" aria-selected="false">MAC</button>
                            </li>
                            <li v-if="game.platforms && game.platforms.linux" class="nav-item" role="presentation">
                                <button class="nav-link" id="linux-tab" data-bs-toggle="tab" data-bs-target="#linux" type="button" role="tab" aria-controls="linux" aria-selected="false">Linux</button>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div v-if="game.platforms && game.platforms.windows" class="tab-pane fade show active" id="windows" role="tabpanel" aria-labelledby="windows-tab">
                                <div class="d-flex row">
                                    <div class="w-50" v-html="game.pc_requirements.minimum"></div>
                                    <div class="w-50" v-html="game.pc_requirements.recommended"></div>
                                </div>
                            </div>
                            <div v-if="game.platforms && game.platforms.mac" class="tab-pane fade" id="mac" role="tabpanel" aria-labelledby="mac-tab">
                                <div class="d-flex row">
                                    <div class="w-50" v-html="game.mac_requirements.minimum"></div>
                                    <div class="w-50" v-html="game.mac_requirements.recommended"></div>
                                </div>
                            </div>
                            <div v-if="game.platforms && game.platforms.linux" class="tab-pane fade" id="linux" role="tabpanel" aria-labelledby="linux-tab">
                                <div class="d-flex row">
                                    <div class="w-50" v-html="game.linux_requirements.minimum"></div>
                                    <div class="w-50" v-html="game.linux_requirements.recommended"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-3">
                            <h5>Legal notice</h5>
                            <p class="" v-html="game.legal_notice"></p>
                        </div>
                    </div>
                    <div class="border border-end-0 border-top-0 border-bottom-0 w-25 bg-primary">
                        <a v-if="game.website" :href="game.website" style="button" class="btn btn-outline-light w-100">Game site</a>
                        <div class="card bg-primary border-0">
                            <div class="card-body ps-0">
                                <h5 class="card-title">Supported OS</h5>
                                <div v-if="game.platforms" class="col card-text w-75">
                                    <div class="d-flex text-light justify-content-between">Windows<i class="fas" :class="game.platforms.windows ? 'fa-check text-success' : 'fa-times text-danger'"></i></div>
                                    <div class="d-flex text-light justify-content-between">MAC<i class="fas" :class="game.platforms.mac ? 'fa-check text-success' : 'fa-times text-danger'"></i></div>
                                    <div class="d-flex text-light justify-content-between">Linux<i class="fas" :class="game.platforms.linux ? 'fa-check text-success' : 'fa-times text-danger'"></i></div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h5 v-if="game.release_date" class="mb-1">Release Date:</h5>
                            <div v-if="game.release_date" class="mb-3"><p class="mb-0">{{ game.release_date.date }}</p></div>
                            <h5 class="mb-1">Developers:</h5>
                            <div class="mb-3"><p v-for="dev in game.developers" class="mb-0">{{ dev }}</p></div>
                            <h5 class="mb-1">Publishers:</h5>
                            <div class="mb-3"><p v-for="pub in game.publishers" class="mb-0">{{ pub }}</p></div>
                        </div>
                        
                        <div v-if="game.metacritic">
                            <h5>Metacritic:</h5>
                            <a :href="game.metacritic.url" class="text-light">Reviews</a>
                            <p>Score: {{ game.metacritic.score }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    watch: {
        $route: function (to, from){
            this.getGame()
        }
    },
    methods: {
        getGame: function () {
            this.dlcs = []
            axios.get("http://localhost:3000/api/game/" + this.$props.gameId)
                .then(response => {
                    this.game = response.data
                    if (!this.game.isLocal)
                        axios.get("http://localhost:3000/api/steam_game/" + this.game.gameId)
                            .then(response => {
                                if (response.status === 200) {
                                    this.game = response.data
                                    this.getOnlinePlayers()
                                    if (this.game.dlc && this.game.dlc.length > 0)
                                        this.game.dlc.forEach(dlc => axios.get("http://localhost:3000/api/steam_game/" + dlc)
                                            .then(res => this.dlcs.push(res.data))
                                            .catch(error => console.log(error)))

                                    axios.get("http://localhost:3000/api/account/library/" + this.$cookies.get('username'))
                                        .then(res => this.isInLibrary = res.data.map(val => val.gameId).includes(this.game.steam_appid))
                                        .catch(error => console.log(error))
                                } else
                                    console.log("game non trovato")
                            })
                            .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
        },
        getOnlinePlayers: function () {
            axios.get("http://localhost:3000/api/steam_game/" + this.game.steam_appid + "/players")
                .then(response => {
                    if (response.data.hasOwnProperty('player_count'))
                        this.onlinePlayers = response.data.player_count
                })
                .catch(error => console.log(error))
        },
        addToCart: function (){
            axios.post("http://localhost:3000/api/account/cart", this.game)
                .then(() => {
                    this.$router.push({ name: 'Cart' })
                })
                .catch(error => console.log(error))
        },
        addToWishlist: function (){
            axios.post("http://localhost:3000/api/account/wishlist", this.game)
                .then(() => {
                    this.$router.push({ name: 'Wishlist', params: { username: Vue.$cookies.get('username')}})
                })
                .catch(error => console.log(error))
        },
        addToLibrary: function () {
            const gameToAdd = [{
                username: this.$cookies.get('username'),
                gameId: this.game.steam_appid,
                timePlayed: 0
            }]
            axios.post("http://localhost:3000/api/account/library", gameToAdd)
                .then(_ => this.$router.push({ name: 'Library' }))
                .catch(err => console.log(err))
        }
    },
    mounted() {
        this.getGame()
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
    }
}
