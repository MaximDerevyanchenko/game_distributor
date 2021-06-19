const Profile = {
    props: ['username'],
    data: function() {
        return {
            account: {},
            day: 24*60*60,
            logged: false,
            viewedData: [],
            game: {
                gameId: -1,
                name: "",
                isLocal: true
            }
        }
    },
    template: `
    <div class="d-flex justify-content-center">
        <div class="d-flex border flex-column w-75 p-3">
            <div class="d-flex flex-row align-self-start w-100">
                <h2 class="pe-3">{{ account.nickname }}</h2>
                <span class="badge rounded-pill align-self-center" :class="account.state == 'offline' ? 'bg-dark' : 'bg-success'">{{ account.state }}</span>
                <button v-if="logged && username == Vue.$cookies.get('username')" class="ms-auto align-self-center">Manage profile</button>
            </div>
            <div class="w-100">
                <img class="rounded float-start img-thumbnail col-3" :src="account.avatarImg != '' ? '../static/img/no-profile-image.png' : account.avatarImg" alt=""/>
                <p>{{ account.name }}</p>
                <p>{{ account.country }}</p>
            </div>
            <p>{{ account.bio }}</p>
            <div>
            
            </div>
<!--            <div v-if="logged && username == Vue.$cookies.get('username')">-->
<!--                <div v-if="account.isDeveloper">-->
<!--                    <h2>New Game</h2>-->
<!--                    <form>-->
<!--                        <label for="gameId">GameId: </label>-->
<!--                        <input id="gameId" type="number" v-model="game.gameId" />-->
<!--                        <label for="name">Name:</label>-->
<!--                        <input id="name" type="text" v-model="game.name">-->
<!--                        <input type="submit" @click.prevent="createGame"/>-->
<!--                    </form>-->
<!--                </div>-->
<!--                <div v-else>-->
<!--                    <button @click="becomeDeveloper">Become developer</button>-->
<!--                </div>-->
<!--            </div>-->

            <ul class="nav nav-pills mb-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button ref="library_tab" class="nav-link active" data-bs-toggle="pill" data-bs-target="#library" role="tab" @click="getLibrary">Library</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#friends" role="tab" @click="getFriends">Friends</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#wishlist" role="tab" @click="getWishlist">Wishlist</button>
                </li>
            </ul>
            <div class="tab-content border p-2" id="pills-tabContent">
                <div class="tab-pane fade show active" id="library" role="tabpanel">
                    <div class="d-flex align-items-start">
                        <ul class="nav nav-pills flex-column" role="tablist">
                            <li class="nav-item" role="presentation" v-for="game in viewedData">
                                <button role="tab" class="nav-link" data-bs-toggle="pill" :data-bs-target="'#g' + game.gameId">{{ game.gameId }}</button>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div v-for="game in viewedData" class="tab-pane fade" role="tabpanel" :id="'g' + game.gameId">
                                <h4>{{ game.gameId }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="friends" role="tabpanel">
                    <div v-for="friend in viewedData">
                        <div class="d-flex">
                            <router-link class="nav-link" :to="{ name: 'Profile', params: { username: friend.username }}"">{{ friend.nickname }}</router-link>
                            <span class="badge rounded-pill align-self-center" :class="friend.state == 'offline' ? 'bg-dark' : 'bg-success'">{{ friend.state }} {{ friend.inGame }}</span>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="wishlist" role="tabpanel">
                    <div v-for="(game, index) in viewedData">
                        <p>{{ game.gameId }}</p>
                        <button v-if="username == Vue.$cookies.get('username')" @click="remove(index)">Remove</button>
                        <button v-if="username == Vue.$cookies.get('username')" @click="addToCart(index)">Add to cart</button>
                        <button v-else @click="giveTo(index)">Buy</button>
                    </div>
                </div>
            </div>
<!--            <div>-->
<!--                <div>-->
<!--                    <router-link class="nav-button" :to="{ name: 'Wishlist', params: { username: username }}">Wishlist</router-link>-->
<!--                </div>-->
<!--            </div>-->
        </div>
    </div>`,
    watch: {
        $route: function (to, from){
            this.$refs['library_tab'].click()
            this.getAccount()
        }
    },
    methods: {
        getAccount: function () {
            axios.get('http://localhost:3000/api/account/' + this.username)
                .then(res => {
                    this.account = res.data
                    this.getLibrary()
                })
                .catch(err => console.log(err))
        },
        becomeDeveloper: function (){
            axios.patch('http://localhost:3000/api/account', { isDeveloper: true })
                .then(() => this.account.isDeveloper = true)
                .catch(err => console.log(err))
        },
        createGame: function (){
            axios.post('http://localhost:3000/api/create_game', this.game)
                .then(() => this.$router.push({ name: 'Game', params: { game_id: this.game.gameId }}))
                .catch(err => console.log(err))
        },
        getLibrary: function () {
            axios.get("http://localhost:3000/api/account/library/" + this.account.username)
                .then(res => {
                    this.viewedData = res.data
                })
                .catch(err => console.log(err))
        },
        getFriends: function () {
            axios.get('http://localhost:3000/api/account/friends/' + this.account.username)
                .then(res => this.viewedData = res.data )
                .catch(err => console.log(err))
        },
        getWishlist: function (){
            axios.get("http://localhost:3000/api/account/wishlist/" + this.account.username)
                .then(res => this.viewedData = res.data)
                .catch(error => console.log(error))
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
        this.getAccount()
    },

}

