const Wishlist = {
    props: ['username', 'size'],
    data() {
        return {
            games: [],
            gameToRemove: { }
        }
    },
    template: `
    <div class="m-4 bg-gradient p-5">
        <h4 class="text-center">Wishlist</h4>
        <div v-if="games.length !== 0" :class="'row row-cols-' + size + ' g-4 mb-2'">
            <div class="col" v-for="(game,index) in games">
                <div class="card h-100 m-4">
                    <img :src="game.header_image" :alt="game.name" class="card-img-top" @click="goToGame(index)" role="button"/>
                    <div class="card-body bg-secondary text-white text-center" @click="goToGame(index)" role="button">
                        <h5 class="card-title mt-2 mb-4">{{game.name}}</h5>
                        <p class="card-text">{{game.short_description | escape }}</p>
                        <small class="card-text text-muted">Price: {{ game.price_overview.final_formatted }}</small>
                    </div>
                     <div class="card-footer bg-secondary text-white p-3 d-flex justify-content-between">
                        <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemove" @click="gameToRemove = game">Remove</button>
                        <button class="btn btn-outline-light" @click="addToCart(index)">Add to cart</button>
                     </div>
                </div>
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
    </div>
    `,
    methods: {
        getWishlist: function (){
            axios.get("http://localhost:3000/api/account/wishlist/" + this.$props.username)
                .then(response => {
                    this.games = response.data
                })
                .catch(error => console.log(error))
        },
        remove: function () {
            axios.delete("http://localhost:3000/api/account/wishlist/" + this.gameToRemove.steam_appid)
                .then(() => {
                    this.games = this.games.filter(g => g.steam_appid !== this.gameToRemove.steam_appid)
                    bootstrap.Modal.getInstance(document.querySelector('#confirmRemove')).hide()
                })
                .catch(error => console.log(error))
        },
        addToCart: function (index) {
            axios.post("http://localhost:3000/api/account/cart", { steam_appid: this.games[index].steam_appid })
                .then(() => this.$router.push({ name: 'Cart' }))
                .catch(error => console.log(error))
        },
        giveTo: function (index) {
            axios.post("http://localhost:3000/api/account/library/gift", { username: this.$props.username, gameId: this.games[index].gameId })
                .catch(error => console.log(error))
        },
        goToGame: function (index) {
            this.$router.push({ name: 'Game', params: { gameId: this.games[index].steam_appid}})
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
        this.getWishlist()
        if (this.$props.size === undefined)
            this.$props.size = 3
    }
}
