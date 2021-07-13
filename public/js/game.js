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
        <div class="d-flex flex-column align-items-center mt-3" v-if="game">
            <div class="mb-4">
                <h3>{{ game.name }}</h3>
            </div>
            <div class="col-12 col-xl-9">
                <div class="d-block d-lg-flex">
                    <p class="me-auto col-lg-9">{{ game.short_description }}</p>
                    <div v-if="game.genres" class="card bg-primary border-0 mb-3 ms-0 ms-lg-3 col-lg-3 align-self-start">
                        <div class="card-body p-0">
                            <p class="card-title">Genres</p>
                            <div class="card-text">
                                <span v-for="genre in game.genres" class="badge bg-secondary">{{ genre.description }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="carousel" ref="carousel" class="carousel slide mb-4" data-bs-ride="carousel">
                    <button class="carousel-control-prev" type="button" role="button" data-bs-target="#carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <div class="carousel-indicators">
                        <button v-if="game.isLocal" ref="indicators" type="button" role="button" class="active" aria-current="true" data-bs-target="#carousel" data-bs-slide-to="0" aria-label="0"></button>
                        <button v-for="(_,index) in game.screenshots" ref="indicators" type="button" role="button" :class="index === 0 ? 'active' : ''" :aria-current="index === 0 ? 'true' : ''" data-bs-target="#carousel" :data-bs-slide-to="index" :aria-label="index"></button>
                    </div>
                    <div class="carousel-inner mx-auto">
                        <div class="carousel-item" data-bs-interval="3000" v-if="game.isLocal" ref="items" class="active">
                            <div class="d-flex justify-content-center">
                                <img v-if="game.header_image !== ''" :src="'../../static/img/' + game.gameId + '/' + game.header_image" class="w-75" alt="Game screenshot" />
                                <img v-else :src="'../../static/img/no-image.png'" class="w-75" alt="Game screenshot" />
                            </div>
                        </div>
                        <div class="carousel-item" data-bs-interval="3000" v-for="(screenshot, index) in game.screenshots" ref="items" :class="index === 0 ? 'active' : ''">
                            <div class="d-flex justify-content-center">
                                <img :src="screenshot.path_thumbnail" class="w-75" alt="Game screenshot" />
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-next" type="button" role="button" data-bs-target="#carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
                <div v-if="game.type === 'game'" class="mt-5">Online players: {{ onlinePlayers }}</div>
                <div class="d-flex card bg-secondary mt-2">
                    <div class="d-inline d-md-flex flex-row justify-content-end align-self-center col-auto col-md-12 card-body">
                        <h4 class="me-auto h-100 align-self-center mb-3 mb-md-0 text-center">{{ game.name }}</h4>
                        <div v-if="game.release_date && !game.release_date.coming_soon">
                            <div v-if="game.is_free" class="d-flex">
                                <div class="bg-success border border-success border-3 me-2 align-self-center">Free</div>
                                <button v-if="!isInLibrary" @click="addToLibrary" role="button" class="btn btn-outline-light align-self-center">Add to library</button>
                                <div v-else class="bg-dark border border-light border-3 p-1 align-self-center">Already in Library</div>
                            </div>
                            <div v-else-if="game.price_overview" class="d-inline d-md-flex">
                                <div v-if="game.price_overview.discount_percent !== 0" class="d-flex">
                                    <div class="bg-success border border-success border-5 mb-3 mb-md-0 align-self-center">-{{ game.price_overview.discount_percent }}%</div>
                                    <div class="bg-dark border border-dark border-5 ms-2 mb-3 mb-md-0 align-self-center"><del>{{ game.price_overview.initial_formatted }}</del></div>
                                    <div class="bg-dark border border-success border-5 ms-2 mb-3 mb-md-0 me-2 align-self-center">{{ game.price_overview.final_formatted }}</div>
                                </div>
                                <div class="d-flex flex-row">
                                    <div v-if="game.price_overview.discount_percent === 0" class="bg-dark border border-success border-5 me-2 align-self-center">{{ game.price_overview.final_formatted }}</div>
                                    <div v-if="!logged || !isInLibrary">
                                        <button @click="addToCart" role="button" class="btn btn-outline-light me-2 align-self-center mb-2 mt-2">Add to cart</button>
                                        <button @click="addToWishlist" role="button" class="btn btn-outline-light align-self-center">Add to wishlist</button>
                                    </div>
                                    <div v-else class="bg-dark border border-light border-3 p-1 align-self-center h-100">Already in Library</div>
                                </div>
                            </div>
                            <div v-else class="d-flex">
                                <div class="bg-dark border border-danger border-3 p-1 align-self-center h-100">Game not available in store</div>
                            </div>
                        </div>
                        <div v-else class="d-flex flex-row">
                            <div class="bg-dark border border-light border-3 p-1 me-2 align-self-center h-100">Coming Soon</div>
                            <button @click="addToWishlist" role="button" class="btn btn-outline-light align-self-center h-100">Add to wishlist</button>
                        </div>
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
                
                <div id="game-details" class="row gx-0 mt-5">
                    <div class="col-12 col-md-9 border border-end-0 border-bottom-0 ps-3 pe-3 pt-3">
                        <h3>About the game</h3>
                        <p v-html="game.about_the_game"></p>
                        <p v-if="!game.about_the_game">No description found.</p>
                        <p v-if="game.about_the_game !== game.detailed_description" v-html="game.detailed_description"></p>
                        
                        <h4 v-if="game.platforms">System Requirements</h4>
                        <ul v-if="game.platforms" class="nav nav-pills" role="tablist">
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
                                    <div v-if="game.pc_requirements.minimum" :class="game.pc_requirements.recommended ? 'w-50' : 'w-100'" v-html="game.pc_requirements.minimum"></div>
                                    <div v-if="game.pc_requirements.recommended" :class="game.pc_requirements.minimum ? 'w-50' : 'w-100'" v-html="game.pc_requirements.recommended"></div>
                                </div>
                            </div>
                            <div v-if="game.platforms && game.platforms.mac" class="tab-pane fade" id="mac" role="tabpanel" aria-labelledby="mac-tab">
                                <div class="d-flex row">
                                    <div v-if="game.mac_requirements.minimum" :class="game.mac_requirements.recommended ? 'w-50' : 'w-100'" v-html="game.mac_requirements.minimum"></div>
                                    <div v-if="game.mac_requirements.recommended" :class="game.mac_requirements.minimum ? 'w-50' : 'w-100'" v-html="game.mac_requirements.recommended"></div>
                                </div>
                            </div>
                            <div v-if="game.platforms && game.platforms.linux" class="tab-pane fade" id="linux" role="tabpanel" aria-labelledby="linux-tab">
                                <div class="d-flex row">
                                    <div v-if="game.linux_requirements.minimum" :class="game.linux_requirements.recommended ? 'w-50' : 'w-100'" v-html="game.linux_requirements.minimum"></div>
                                    <div v-if="game.linux_requirements.recommended" :class="game.linux_requirements.minimum ? 'w-50' : 'w-100'" v-html="game.linux_requirements.recommended"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="game.legal_notice" class="mt-3">
                            <h5>Legal notice</h5>
                            <p class="" v-html="game.legal_notice"></p>
                        </div>
                    </div>
                    <div class="d-flex d-md-block border border-start-0 border-end-0 border-bottom-0 p-0 bg-primary col-12 col-md-3">
                        <div class="border border-end-0 border-top-0 border-bottom-0 ps-3 pt-3 col-6 col-md-12">
                            <a v-if="game.website" :href="game.website" class="btn btn-outline-light col-9">Game site</a>
                            <div v-if="game.platforms" class="card bg-primary border-0">
                                <div class="card-body ps-0">
                                    <h5 class="card-title">Supported OS</h5>
                                    <div class="col card-text col-9">
                                        <div class="d-flex text-light justify-content-between">Windows<i class="fas align-self-center" :class="game.platforms.windows ? 'fa-check text-success' : 'fa-times text-danger'"></i></div>
                                        <div class="d-flex text-light justify-content-between">MAC<i class="fas align-self-center" :class="game.platforms.mac ? 'fa-check text-success' : 'fa-times text-danger'"></i></div>
                                        <div class="d-flex text-light justify-content-between">Linux<i class="fas align-self-center" :class="game.platforms.linux ? 'fa-check text-success' : 'fa-times text-danger'"></i></div>
                                    </div>
                                </div>
                            </div>
                            <h5 v-if="game.release_date" class="mb-1">Release Date:</h5>
                            <div v-if="game.release_date"><p class="mb-0">{{ game.release_date.date }}</p></div>
                        </div>
                        <div class="border border-end-0 border-top-0 border-bottom-0 ps-3 pt-3 col-6 col-md-12">
                            <div>
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
        </div>
    `,
    watch: {
        $route: function (){
            this.getGame()
        }
    },
    methods: {
        getGame: function () {
            this.dlcs = []
            axios.get("http://localhost:3000/api/games/" + this.$props.gameId + "/local")
                .then(response => {
                    this.game = response.data

                    if (this.game == null)
                        this.$router.push({ name: '404' })

                    this.getOnlinePlayers()

                    if (!this.game.isLocal)
                        axios.get("http://localhost:3000/api/games/" + this.game.gameId + "/steam")
                            .then(response => {
                                if (response.status === 200) {
                                    this.game = response.data
                                    if (this.game.dlc && this.game.dlc.length > 0)
                                        this.game.dlc.forEach(dlc => axios.get("http://localhost:3000/api/games/" + dlc + "/steam")
                                            .then(res => this.dlcs.push(res.data))
                                            .catch(error => console.log(error)))

                                    this.checkLibrary()
                                } else
                                    this.$router.push({ name: '404' })
                            })
                            .catch(error => console.log(error))
                    else
                        this.checkLibrary()
                })
                .catch(error => console.log(error))
        },
        checkLibrary: function () {
            axios.get("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/library")
                .then(res => {
                    this.isInLibrary = res.data.map(val => val.gameId).includes(this.game.gameId)
                })
                .catch(error => console.log(error))
        },
        getOnlinePlayers: function () {
            this.onlinePlayers = 0

            if (!this.game.isLocal)
                axios.get('http://localhost:3000/api/games/' + this.game.gameId + '/steam_count')
                    .then(response => {
                        if (response.data.hasOwnProperty('player_count'))
                            this.onlinePlayers = this.onlinePlayers + response.data.player_count
                    })
                    .catch(error => console.log(error))

            axios.get('http://localhost:3000/api/games/' + this.game.gameId + '/local_count')
                .then(response => this.onlinePlayers = this.onlinePlayers + response.data)
                .catch(error => console.log(error))
        },
        addToCart: function (){
            if (!this.logged){
                this.loginNeeded()
            } else
                axios.post('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/cart', this.game)
                    .then(() => {
                        this.$router.push({ name: 'Cart' })
                    })
                    .catch(error => console.log(error))
        },
        addToWishlist: function (){
            if (!this.logged){
                this.loginNeeded()
            } else
                axios.post('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/wishlist', this.game)
                    .then(() => {
                        this.$router.push({ name: 'Wishlist', params: { username: Vue.$cookies.get('username')}})
                    })
                    .catch(error => console.log(error))
        },
        addToLibrary: function () {
            if (!this.logged){
                this.loginNeeded()
            } else {
                const gameToAdd = [{
                    username: this.$cookies.get('username'),
                    startedAt: 0,
                    timePlayed: 0,
                    name: this.game.name,
                    gameId: this.game.gameId,
                    isLocal: this.game.isLocal
                }]
                axios.post('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/library', gameToAdd)
                    .then(_ => this.$router.push({name: 'Library', params: {username: Vue.$cookies.get('username')}}))
                    .catch(err => console.log(err))
            }
        },
        loginNeeded: function () {
            this.$parent.$children[1].$emit("login-needed")
        }
    },
    mounted() {
        this.getGame()
        this.logged = this.$checkLogin()
        this.$on('log-event', () => this.logged = this.$checkLogin())
    }
}
