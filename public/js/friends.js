const Friends = {
    data: function (){
        return {
            friends: [],
            onlineFriends: [],
            offlineFriends: [],
            friendToAdd: "",
            friendRequests: [],
            pendingRequests: [],
            friendToRemove: { }
        }
    },
    template: `
    <div class="mt-4">
        <form class="d-flex justify-content-around">
            <div class="row col-3">
                <div class="col">
                    <div class="form-floating">
                        <input id="friend" class="form-control bg-secondary text-white" placeholder="friend" v-model="friendToAdd" required type="text"/>
                        <label for="friend">Friend username</label>
                    </div>
                </div>
                <div class="w-auto align-self-center">
                    <button class="btn btn-outline-light" @click="addFriend">Add Friend<i class="fas fa-user-plus ms-2"></i></button>
                </div>
            </div>
        </form>
        <h3 v-if="friends.length !== 0">Your friends</h3>
        <h4 v-if="onlineFriends.length !== 0">Online</h4>
        <div class="card bg-dark text-white border-secondary p-3" v-for="friend in onlineFriends" role="button">
            <div class="row g-0">
                <div class="col-3">
                    <img v-if="friend.avatarImg" class="card-img col-md-2" :src="'static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" />
                </div>
                <div class="card-body col-9">
                    <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + friend.nickname"><h3 class="w-25">{{ friend.nickname }}</h3></router-link>
                    <p class="card-text">State: {{friend.state}} {{ friend.inGame}}</p>
                    <p class="card-text"><small class="text-muted">Last online {{ friend.lastOnline}}</small></p>
                    <button class="btn btn-outline-danger" @click="removeFriend(friend.username)">Remove Friend</button>
                </div>
            </div>
        </div>
        <h4 v-if="offlineFriends.length !== 0">Offline</h4>
        <div class="card bg-dark text-white border-secondary p-3" v-for="friend in offlineFriends" role="button">
            <div class="row g-0">
                <div class="col-3">
                    <img v-if="friend.avatarImg" class="card-img col-md-2" :src="'static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" />
                </div>
                <div class="card-body col-9">
                    <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + friend.nickname"><h3 class="w-25">{{ friend.nickname }}</h3></router-link>
                    <p class="card-text">State: {{friend.state}} {{ friend.inGame}}</p>
                    <p class="card-text"><small class="text-muted">Last online {{ friend.lastOnline}}</small></p>
                    <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemove" @click="friendToRemove = friend">Remove Friend</button>
                </div>
            </div>
        </div>
        <h4 v-if="friendRequests.length !== 0">Friend Requests</h4>
        <div v-for="friendRequest in friendRequests">
            <h2>{{ friendRequest.nickname }}</h2>
            <button @click="acceptFriend(friendRequest.username)">Accept Friend</button>
        </div>
        <h4 v-if="pendingRequests.length !== 0">Pending Requests</h4>
        <div v-for="pendingRequest in pendingRequests">
            <h2>{{ pendingRequest.nickname }}</h2>
        </div>
        <div id="confirmRemove" class="modal fade" tabindex="-1" aria-labelledby="confirmRemove" aria-hidden="true">
            <div class="modal-dialog border border-light border-3 rounded rounded-3 modal-sm">
                <div class="modal-content bg-secondary text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm removal</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to remove {{ friendToRemove.nickname }}?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-light" @click="removeFriend">Yes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        getFriends: function () {
            axios.get('http://localhost:3000/api/account/friends/' + this.$cookies.get('username'))
                .then(res => {
                    this.friends = res.data
                    this.onlineFriends = this.friends.filter(f => f.state === 'online')
                    this.offlineFriends = this.friends.filter(f => f.state === 'offline')
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
        removeFriend: function () {
            bootstrap.Modal.getInstance(document.querySelector('#confirmRemove')).hide()
            axios.delete('http://localhost:3000/api/account/friends/' + this.friendToRemove.username)
                .then(() => this.friends = this.friends.filter(v => v.username !== this.friendToRemove.username))
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
