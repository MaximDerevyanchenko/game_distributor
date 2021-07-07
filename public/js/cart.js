const Cart = {
    data: function (){
        return {
            games: [],
            gameToRemove: { },
            gameToBuy: { }
        }
    },
    template: `
    <div class="d-flex flex-column align-items-center mt-4 bg-secondary bg-gradient rounded rounded-3 p-5">
        <div id="spinner" class="d-flex align-items-center">
            <strong>Loading... </strong>
            <div class="spinner-border ms-3" role="status" aria-hidden="true"></div>
        </div>
        <div id="cart" class="d-none">
            <h4 class="text-center">Your shopping cart</h4>
            <div v-if="games.length !== 0" class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mb-2">
                <div class="col" v-for="(game,index) in games">
                    <div class="card h-100 m-4">
                        <img v-if="game.header_image !== ''" :src="game.isLocal ? '../static/img/' + game.gameId + '/' + game.header_image : game.header_image" :alt="game.name" class="card-img-top" @click="goToGame(index)" role="button"/>
                        <div class="card-body bg-secondary text-white text-center" @click="goToGame(index)" role="button">
                            <h5 class="card-title mt-2 mb-4">{{game.name}}</h5>
                            <p class="card-text">{{game.short_description | escape }}</p>
                            <small class="card-text text-muted">Price: {{ game.price_overview.final_formatted }}</small>
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
            <div v-if="games.length !== 0" class="d-flex justify-content-center col-12 mt-5">Total: {{ games | computePrice }}</div>
            <div class="w-100 d-flex justify-content-between mt-1">
                <button v-if="games.length !== 0" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemoveAll">Remove all items</button>
                <button v-if="games.length !== 0" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#confirmPurchaseAll">Purchase all items</button>
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
                        <p>Are you sure to remove <em>{{ gameToRemove.name }}</em> from shopping cart?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-light" @click="remove">Yes</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="confirmRemoveAll" class="modal fade" tabindex="-1" aria-labelledby="confirmRemoveAll" aria-hidden="true">
            <div class="modal-dialog border border-light border-3 rounded rounded-3 modal-sm">
                <div class="modal-content bg-secondary text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm removal all</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to remove all your items from shopping cart?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-light" @click="removeAll">Yes</button>
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
                        <h5 class="modal-title">Confirm purchase all</h5>
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
    methods: {
        getCart: function (){
            axios.get("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/cart")
                .then(response => {
                    this.games = response.data
                    document.querySelector('#spinner').classList.add('d-none')
                    document.querySelector('#cart').classList.remove('d-none')
                })
                .catch(error => console.log(error))
        },
        remove: function (){
            axios.delete("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/cart/" + this.gameToRemove.gameId)
                .then(_ => this.games = this.games.filter(g => g.gameId !== this.gameToRemove.gameId))
                .catch(err => console.log(err))
            bootstrap.Modal.getInstance(document.querySelector('#confirmRemove')).hide()
        },
        removeAll: function (){
            axios.delete("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/cart")
                .then(_ => this.games = [])
                .catch(err => console.log(err))
            bootstrap.Modal.getInstance(document.querySelector('#confirmRemoveAll')).hide()
        },
        buyAll: function (){
            this.games.forEach(game => {
                game.startedAt = 0
                game.timePlayed = 0
                game.username = this.$cookies.get('username')
            })
            axios.post("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/library", this.games)
                .then(() => this.$router.push({ name: 'Library', params: { username: Vue.$cookies.get('username')}}))
                .catch(err => console.log(err))
            bootstrap.Modal.getInstance(document.querySelector('#confirmPurchaseAll')).hide()
        },
        buy: function (){
            axios.post("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/library", {
                username: this.$cookies.get('username'),
                startedAt: 0,
                timePlayed: 0,
                name: this.gameToBuy.name,
                gameId: this.gameToBuy.gameId,
                isLocal: this.gameToBuy.isLocal
            })
                .then(() => this.$router.push({ name: 'Library', params: { username: Vue.$cookies.get('username')}}))
                .catch(err => console.log(err))
            bootstrap.Modal.getInstance(document.querySelector('#confirmPurchase')).hide()
        },
        goToGame: function (index) {
            this.$router.push({ name: 'Game', params: { gameId: this.games[index].gameId }})
        }
    },
    filters: {
        escape: function (string){
            return new DOMParser().parseFromString(string, 'text/html').body.textContent
        },
        computePrice: function (games){
            const price = games.map(g => g.price_overview.final).reduce((acc, curr) => acc + curr)
            return new Intl.NumberFormat('it-IT', {style: 'currency', currency: 'EUR', minimumFractionDigits: 2}).format(price/100)
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
