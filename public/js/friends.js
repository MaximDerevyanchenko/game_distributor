const Friends = {
    data: function (){
        return {
            friends: [],
            friendToAdd: "",
            friendRequests: [],
            pendingRequests: []
        }
    },
    template: `
    <div class="mt-4">
        <form class="d-flex justify-content-around">
            <div class="row col-3">
                <div class="col">
                    <div class="form-floating">
                        <input id="friend" class="form-control" placeholder="friend" v-model="friendToAdd" required type="text"/>
                        <label for="friend">Friend username</label>
                    </div>
                </div>
                <div class="w-auto align-self-center">
                    <button class="btn btn-outline-secondary" @click="addFriend">Add Friend<i class="fas fa-user-plus ms-2"></i></button>
                </div>
            </div>
        </form>
        
        <h3>Friends</h3>
        <div class="card bg-dark text-white border-secondary p-3" v-for="friend in friends" role="button">
            <div class="row g-0">
                <div class="col-3">
                    <img class="card-img col-md-2" :src="'static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" />
                </div>
                <div class="card-body col-9">
                    <h5 class="card-title" :to="{ name: 'Profile', params: { username: friend.nickname }}">{{ friend.nickname }}</h5>
                    <p class="card-text">State: {{friend.state}} {{ friend.inGame}}</p>
                    <p class="card-text"><small class="text-muted">Last online ...</small></p>
                    <button class="btn btn-outline-danger" @click="removeFriend(friend.username)">Remove Friend</button>
                </div>
            </div>
        </div>
        <h4>Friend Requests</h4>
        <div v-for="friendRequest in friendRequests">
            <h2>{{ friendRequest.nickname }}</h2>
            <button @click="acceptFriend(friendRequest.username)">Accept Friend</button>
        </div>
        <h4>Pending Requests</h4>
        <div v-for="pendingRequest in pendingRequests">
            <h2>{{ pendingRequest.nickname }}</h2>
        </div>
    </div>
    `,
    methods: {
        getFriends: function () {
            axios.get('http://localhost:3000/api/account/friends')
                .then(res => {
                    this.friends = res.data
                })
                .catch(err => console.log(err))
        },
        getFriendRequests: function (){
            axios.get("http://localhost:3000/api/account/friendRequests")
                .then(res => {
                    this.friendRequests = res.data
                })
                .catch(err => console.log(err))
        },
        getPendingRequests: function (){
            axios.get("http://localhost:3000/api/account/pendingRequests")
                .then(res => {
                    this.pendingRequests = res.data
                })
                .catch(err => console.log(err))
        },
        addFriend: function (){
            if (this.friendToAdd !== this.$cookies.get('username')) {
                if (this.friends.includes({ username: this.friendToAdd }))
                    alert('You already added ' + this.friendToAdd + ' as a friend!')
                else if (this.friendRequests.includes({ username: this.friendToAdd }))
                    alert('You already send a friend request to ' + this.friendToAdd)
                else
                    axios.post("http://localhost:3000/api/account/friends", { username: this.friendToAdd})
                        .then(res => {
                            this.friendToAdd = ""
                            this.pendingRequests.push(res.data)
                        })
                        .catch(err => console.log(err))
            } else
                alert('You cannot add yourself as a friend!')
        },
        removeFriend: function (username) {
            axios.delete('http://localhost:3000/api/account/friends/' + username)
                .then(() => this.friends = this.friends.filter(v => v.username !== username))
                .catch(err => console.log(err))
        },
        acceptFriend: function (username) {
            axios.patch('http://localhost:3000/api/account/friendRequests', { username: username })
                .then(res => {
                    this.friendRequests = this.friendRequests.filter(v => v.username !== username)
                    this.friends.push(res.data)
                })
                .catch(err => console.log(err))
        }
    },
    sockets: {
        // TODO non richiamare i metodi ma aggiungere parametri
        friendAccept: function () {
            this.getFriends()
            this.getPendingRequests()
        },
        friendRemoved: function () {
            this.getFriends()
        },
        friendAdded: function () {
            this.getFriendRequests()
        },
        friendStateChanged: function (friend){
            const index = this.friends.indexOf(this.friends.filter(v => v.username === friend.username)[0])
            Vue.set(this.friends, index, friend)
        }
    },
    mounted(){
        this.getFriends()
        this.getFriendRequests()
        this.getPendingRequests()
        this.$on('log-event', () => {
            if (!this.$checkLogin())
                this.$router.push({name: 'Store'})
        })
    }
}
