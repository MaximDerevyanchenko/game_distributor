const Dev = {
    data() {
        return {
            account: { },
            games: [],
            game: {
                short_description: "",
                is_free: false,
                price_overview: {
                    final: 20
                },
            },
            headerPreview: null
        }
    },
    template: `
    <div class="p-2 mt-3 row justify-content-center">
         <div v-if="account.isDeveloper" class="d-flex flex-column border rounded border-light justify-content-center col-12 col-md-10 col-lg-8 pb-3">
            <h2 class="text-center m-3">My Games</h2>
            <div class="text-center">
                <button class="btn btn-outline-light" role="button" data-bs-target="#addGame" data-bs-toggle="modal">Do you want to add your game into Stim?</button>
            </div>
            <div class="d-flex flex-column bg-secondary m-2 mt-3 ms-md-5 me-md-5">
                <router-link v-for="game in games" class="p-1 border rounded border-1 text-light" :to="{ name: 'Game', params: { gameId: game.gameId }}">
                    <div class="d-flex justify-content-between">
                        <div>{{ game.name }}</div>
                        <div v-if="game.is_free">Free to play</div>
                        <div v-else-if="game.price_overview">{{ game.price_overview.final_formatted }}</div>
                        <div v-else>N/A</div>
                    </div>
                </router-link>
            </div>
        </div>
        <div v-else class="d-flex flex-column">
            <p class="text-center">You're not yet a developer. Come on, click below and become a developer to add your games into Stim!</p>
            <div class="text-center">
                <button class="btn btn-outline-light" role="button" @click="becomeDeveloper">Become a developer</button>
            </div>
        </div>
        
        <div id="addGame" class="modal fade">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <form class="modal-content bg-secondary border border-light rounded text-white mt-4 p-4" ref="form">
                    <div class="modal-title text-center">
                        <h5>Add your game</h5>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating m-2">
                            <input id="name" v-model="game.name" class="form-control bg-transparent text-white" type="text" placeholder="Name" autocomplete="off" required />
                            <label for="name">Name</label>
                            <div class="invalid-tooltip">Name MUST be set.</div>
                        </div>
                        <div class="form-floating m-2">
                            <textarea id="shortDescription" v-model="game.short_description" class="form-control bg-transparent text-white" placeholder="Short description"></textarea>
                            <label for="shortDescription">Short description</label>
                        </div>
                        <div class="m-2 mt-4">
                            <div class="row">
                                <div class="d-flex flex-column justify-content-between col-lg">
                                    <div>
                                        <label class="input-group-text bg-transparent text-white border-0" for="header">Add your header image</label>
                                        <div class="row">
                                            <div class="col-10 col-lg">
                                                <input class="form-control bg-transparent text-white" id="header" @change="uploadHeader" ref="headerPreview" type="file" accept="image/*"/>
                                            </div>
                                            <div class="col-1 d-flex align-items-center">
                                                <span class="fas fa-trash" role="button" @click="removeHeader"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-2 mt-4">
                                         <div class="form-check form-switch m-2">
                                            <input type="checkbox" id="isFree" class="form-check-input" :class="game.is_free ? 'bg-info' : ''" v-model="game.is_free"/>
                                            <label class="form-check-label" for="isFree">Check if you your game is <em>free to play</em></label>
                                         </div>
                                         <div class="m-2">
                                            <label for="price" :class="game.is_free ? 'text-muted' : ''">Select your price</label>
                                            <div class="d-flex">
                                                <input type="range" class="form-range flex-grow-0" id="price" min="1" max="100" value="game.price_overview.final" v-model="game.price_overview.final" :disabled="game.is_free"/>
                                                <label class="flex-shrink-0 ms-2" :class="game.is_free ? 'text-muted' : ''">{{game.price_overview.final}} &euro;</label>
                                            </div> 
                                         </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <img v-if="headerPreview" :src="headerPreview" class="img-thumbnail border-0" :alt="game.header_image.name"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-between">
                        <button type="button" role="button" class="btn btn-outline-light" data-bs-dismiss="modal">Close</button>
                        <button type="submit" role="button" @click.prevent="addGame" class="btn btn-outline-light">Add</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `,
    methods: {
        getAccount: function () {
            axios.get('http://localhost:3000/api/account/' + Vue.$cookies.get('username'))
                .then(res => {
                    this.account = res.data
                    if (this.account.isDeveloper)
                        this.getMyGames()
                })
                .catch(err => console.log(err))
        },
        becomeDeveloper: function (){
            axios.patch('http://localhost:3000/api/account/' + this.$cookies.get('username'), { isDeveloper: true })
                .then(() => this.$emit('becameDeveloper'))
                .catch(err => console.log(err))
        },
        getMyGames: function (){
            axios.get('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/developed')
                .then(res => this.games = res.data)
                .catch(err => console.log(err))
        },
        addGame: function (){
            if (this.$refs.form.checkValidity()) {
                axios.post('http://localhost:3000/api/games/create', this.buildForm())
                    .then(res => {
                        bootstrap.Modal.getInstance(document.querySelector('#addGame')).hide()
                        this.$router.push({ name: 'Game', params: { gameId: res.data.gameId }})
                    })
                    .catch(err => console.log(err))
            } else {
                document.querySelector('#name').classList.remove('is-valid')
                document.querySelector('#name').classList.add('is-invalid')
            }
        },
        uploadHeader: function (e){
            this.game.header_image = e.target.files[0]
            const reader = new FileReader()
            reader.onload = ev => this.headerPreview = ev.target.result
            reader.readAsDataURL(this.game.header_image)
        },
        removeHeader: function (){
            this.game.header_image = ""
            this.$refs.headerPreview.value = ""
            this.headerPreview = null
        },
        buildForm: function (){
            const form = new FormData()
            form.append('name', this.game.name)
            form.append('short_description', this.game.short_description)
            form.append('header_image', this.game.header_image)
            form.append('developers', Vue.$cookies.get('username'))
            form.append('publishers', Vue.$cookies.get('username'))
            form.append('isLocal', true.toString())
            form.append('is_free', this.game.is_free)
            if (!this.game.is_free) {
                form.append('price_overview.final', this.game.price_overview.final * 100)
                form.append('price_overview.final_formatted', new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2}).format(this.game.price_overview.final))
                form.append('price_overview.discount_percent', 0)
            }
            form.append('release_date.coming_soon', false.toString())
            form.append('release_date.date', new Date().toLocaleDateString('en-GB', {day: "numeric", month: 'short', year: 'numeric'}))
            return form
        }
    },
    mounted(){
        this.getAccount()
        this.$on('becameDeveloper', () => this.account.isDeveloper = true)
    }
}
