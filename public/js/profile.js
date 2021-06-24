const Profile = {
    props: ['username'],
    data: function() {
        return {
            account: {},
            logged: false,
            game: {
                gameId: -1,
                name: "",
                isLocal: true
            }
        }
    },
    template: `
    <div class="position-relative">
        <div class="w-100 h-100 position-absolute top-50 start-50 translate-middle" id="backgroundImg"></div>
        <div class="d-flex justify-content-center mt-4">
            <div class="d-flex flex-column p-3">
                <div class="card bg-transparent text-white">
                    <div class="row g-0">
                        <div class="col">
                            <img class="card-img-top rounded img-thumbnail" :src="account.avatarImg == '' ? '../static/img/no-profile-image.png' : '../static/img/' + account.username + '/' + account.avatarImg" alt="" >
                        </div>
                        <div class="card-body d-flex flex-column justify-content-between col-5">
                            <h2 class="card-title">{{ account.nickname }} <span class="badge rounded-pill fs-6" :class="account.state == 'offline' ? 'bg-dark' : 'bg-success'">{{ account.state }}</span></h2>
                            <p class="card-text">{{ account.name }}, {{ account.country }}</p>
                            <p class="card-text">Bio: {{ account.bio }}</p>
                            <div class="row justify-content-end me-2">
                                <button v-if="logged && username == Vue.$cookies.get('username')" class="w-auto btn btn-outline-light">Edit profile</button>
                            </div>
                        </div>
                    </div>
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
    
                <ul class="nav nav-pills mt-3 mb-3 p-2 justify-content-center" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button ref="library_tab" class="nav-link active m-1" id="lib" data-bs-toggle="pill" data-bs-target="#library" role="tab">Library</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link m-1" data-bs-toggle="pill" id="fr" data-bs-target="#friends" role="tab">Friends</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link m-1" data-bs-toggle="pill" id="wish" data-bs-target="#wishlist" role="tab">Wishlist</button>
                    </li>
                </ul>
                <div class="tab-content border rounded bg-secondary p-3" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="library" role="tabpanel">
                        <library></library>
                    </div>
                    <div class="tab-pane fade" id="friends" role="tabpanel">
                        <friends></friends>
                    </div>
                    <div class="tab-pane fade" id="wishlist" role="tabpanel">
                        <wishlist></wishlist>
                    </div>
                </div>
            </div>
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
                    const background = document.querySelector('#backgroundImg')
                    if (this.account.backgroundImg !== '') {
                        const url = '../static/img/' + this.account.username + '/' + this.account.backgroundImg
                        background.style.backgroundImage = 'url(' + url + ')'
                        let image = new Image();
                        image.src = url
                        image.onload = () => document.querySelector('.position-relative').style.height = image.naturalHeight + 'px'
                    }
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
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
        })
        this.getAccount()
    }
}

