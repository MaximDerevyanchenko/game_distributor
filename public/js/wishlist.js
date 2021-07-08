const Wishlist = {
    props: ['username', 'size'],
    data() {
        return {
            games: [],
            gameToRemove: { },
            gameToGift: { },
            logged: false
        }
    },
    watch: {
        $route: function (to, from){
            this.getWishlist()
        }
    },
    template: `
    <div class="mt-4 bg-gradient p-1 p-sm-5">
        <div id="spinner" class="d-flex justify-content-center align-items-center">
            <strong>Loading... </strong>
            <div class="spinner-border ms-3" role="status" aria-hidden="true"></div>
        </div>
        <div id="wishlistComp" class="d-none">
            <h4 class="text-center">Wishlist</h4>
            <div v-if="games.length !== 0" class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-2">
                <div class="col p-0" v-for="(game,index) in games">
                    <div class="card h-100 m-4">
                        <img v-if="game.header_image !== ''" :src="game.isLocal ? '../static/img/' + game.gameId + '/' + game.header_image : game.header_image" :alt="game.name" class="card-img-top" @click="goToGame(index)" role="button"/>
                        <div class="card-body bg-secondary text-white text-center" @click="goToGame(index)" role="button">
                            <h5 class="card-title mt-2 mb-4">{{game.name}}</h5>
                            <p class="card-text">{{game.short_description | escape }}</p>
                            <small class="card-text text-muted">{{ game.release_date && game.release_date.coming_soon ? 'Price not available' : 'Price: ' + game.price_overview.final_formatted }}</small>
                        </div>
                         <div class="card-footer bg-secondary text-white p-3 d-flex justify-content-between">
                            <button v-if="logged && username === Vue.$cookies.get('username')" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemove" @click="gameToRemove = game">Remove</button>
                            <button v-if="logged && username === Vue.$cookies.get('username')" class="btn btn-outline-light" @click="addToCart(index)">Add to cart</button>
                            <button v-else-if="logged" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#confirmGift" @click="gameToGift = game">Gift the game</button>
                         </div>
                    </div>
                </div>
            </div>
            <div v-else class="mt-3 text-center">
                <p>The wishlist is empty!</p>
            </div>
        </div>
        
        <div id="confirmRemove" class="modal fade" tabindex="-1" aria-labelledby="confirmRemove" aria-hidden="true">
            <div class="modal-dialog border border-light border-3 rounded rounded-3 modal-sm">
                <div class="modal-content bg-secondary text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm removal</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to remove <em>{{ gameToRemove.name }}</em> from the wishlist?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-light" @click="remove">Yes</button>
                    </div>
                </div>
            </div>
        </div>
        
         <div id="confirmGift" class="modal fade" tabindex="-1" aria-labelledby="confirmGift" aria-hidden="true">
            <div class="modal-dialog border border-light border-3 rounded rounded-3">
                <div class="modal-content bg-secondary text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm gift</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to gift <em>{{gameToGift.name}}</em> to {{ username }}?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-light" @click="giftGame">Yes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        getWishlist: function (){
            axios.get("http://localhost:3000/api/account/" + this.$props.username + "/wishlist")
                .then(response => {
                    this.games = response.data
                    document.querySelector('#spinner').classList.add('d-none')
                    document.querySelector('#wishlistComp').classList.remove('d-none')
                })
                .catch(error => console.log(error))
        },
        remove: function () {
            axios.delete("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/wishlist/" + this.gameToRemove.gameId)
                .then(() => {
                    this.games = this.games.filter(g => g.gameId !== this.gameToRemove.gameId)
                    bootstrap.Modal.getInstance(document.querySelector('#confirmRemove')).hide()
                })
                .catch(error => console.log(error))
        },
        addToCart: function (index) {
            axios.post("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/cart", { gameId: this.games[index].gameId })
                .then(() => this.$router.push({ name: 'Cart' }))
                .catch(error => console.log(error))
        },
        giftGame: function () {
            axios.post("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/library/gift", { username: this.$props.username, gameId: this.gameToGift.gameId, timePlayed: 0, name: this.gameToGift.name, giftedBy: this.$cookies.get('username') })
                .then(() => bootstrap.Modal.getInstance(document.querySelector('#confirmGift')).hide())
                .catch(error => console.log(error))
        },
        goToGame: function (index) {
            this.$router.push({ name: 'Game', params: { gameId: this.games[index].gameId }})
        }
    },
    filters: {
        escape: function (string) {
            return new DOMParser().parseFromString(string, 'text/html').body.textContent
        },
    },
    sockets: {
        gameGifted: function (){
            this.getWishlist()
        }
    },
    mounted(){
        this.logged = this.$checkLogin()
        this.getWishlist()
        if (this.$props.size === undefined)
            this.$props.size = 3
        this.$on('log-event', () => this.logged = this.$checkLogin())
    }
}
