const Cart = {
    data: function (){
        return {
            games: [],
            gameToRemove: { },
            gameToBuy: { }
        }
    },
    template: `
    <div class="d-flex flex-column align-items-center m-4 bg-secondary bg-gradient rounded rounded-3 p-5">
        <h4>Your shopping cart</h4>
        <div v-if="games.length !== 0" class="row row-cols-3 row-cols-md-3 g-4 mb-2">
            <div class="col" v-for="(game,index) in games">
                <div class="card h-100 m-4">
                    <img :src="game.header_image" :alt="game.name" class="card-img-top" @click="goToGame(index)" role="button"/>
                    <div class="card-body bg-secondary text-white text-center" @click="goToGame(index)" role="button">
                        <h5 class="card-title mt-2 mb-4">{{game.name}}</h5>
                        <p class="card-text">{{game.short_description | escape }}</p>
                    </div>
                     <div class="card-footer bg-secondary text-white p-3 d-flex justify-content-between">
                        <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemove" @click="gameToRemove = game">Remove</button>
                        <button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#confirmPurchase" @click="gameToBuy = game">Purchase</button>
                     </div>
                </div>
            </div>
        </div>
        <div v-else class="m-3">
            <p>Your cart is empty! Go to the <router-link to="/store" class="link-light">Store</router-link> and add something! <i class="fas fa-smile-wink"></i></p>
        </div>
        <button v-if="games.length !== 0" class="btn btn-outline-success mt-5" data-bs-toggle="modal" data-bs-target="#confirmPurchaseAll">Purchase all items</button>
        
        <div id="confirmRemove" class="modal fade" tabindex="-1" aria-labelledby="confirmRemove" aria-hidden="true">
            <div class="modal-dialog border border-light border-3 rounded rounded-3 modal-sm">
                <div class="modal-content bg-secondary text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm removal</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to remove <em>{{ gameToRemove.name }}</em> from shopping cart?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-light" @click="remove">Yes</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="confirmPurchase" class="modal fade" tabindex="-1" aria-labelledby="confirmPurchase" aria-hidden="true">
            <div class="modal-dialog border border-light border-3 rounded rounded-3">
                <div class="modal-content bg-secondary text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm purchase</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to buy <em>{{gameToBuy.name}}</em>?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-light" @click="buy">Yes</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="confirmPurchaseAll" class="modal fade" tabindex="-1" aria-labelledby="confirmPurchaseAll" aria-hidden="true">
            <div class="modal-dialog border border-light border-3 rounded rounded-3">
                <div class="modal-content bg-secondary text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm purchase</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to buy all the items in the shopping cart?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-light" @click="buyAll">Yes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    // TODO aggiungere caricamento + check con un solo elemento nel carrello + removeAll
    methods: {
        getCart: function (){
            axios.get("http://localhost:3000/api/account/cart")
                .then(response => {
                    this.games = response.data
                })
                .catch(error => console.log(error))
        },
        buyAll: function (){
            this.games.forEach(game => game.timePlayed = 0)
            axios.post("http://localhost:3000/api/account/library", this.games)
                .then(response => this.games = response.data)
                .catch(err => console.log(err))
            bootstrap.Modal.getInstance(document.querySelector('#confirmPurchaseAll')).hide()
        },
        remove: function (){
            axios.delete("http://localhost:3000/api/account/cart/" + this.gameToRemove.steam_appid)
                .then(_ => this.games = this.games.filter(g => g.steam_appid !== this.gameToRemove.steam_appid))
                .catch(err => console.log(err))
            bootstrap.Modal.getInstance(document.querySelector('#confirmRemove')).hide()
        },
        goToGame: function (index) {
            this.$router.push({ name: 'Game', params: { gameId: this.games[index].steam_appid}})
        },
        buy: function (){
            axios.post("http://localhost:3000/api/account/library", {
                username: this.$cookies.get('username'),
                timePlayed: 0,
                name: this.gameToBuy.name,
                gameId: this.gameToBuy.steam_appid
            })
                .then(response => this.$router.push({ name: 'Library'}))
                .catch(err => console.log(err))
            bootstrap.Modal.getInstance(document.querySelector('#confirmPurchase')).hide()
        }
    },
    filters: {
        escape: function (string){
            return new DOMParser().parseFromString(string, 'text/html').body.textContent
        }
    },
    mounted(){
        this.getCart()
        this.$on('log-event', () => {
            if (!this.$checkLogin())
                this.$router.push({ name: 'Store'})
        })
    }
}
