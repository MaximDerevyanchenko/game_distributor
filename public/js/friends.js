const Friends = {
    props: ['username'],
    data: function (){
        return {
            friends: [],
            onlineFriends: [],
            offlineFriends: [],
            friendToAdd: "",
            friendRequests: [],
            pendingRequests: [],
            friendToRemove: { },
            logged: false
        }
    },
    template: `
    <div class="mt-4">
        <form v-if="logged && username == Vue.$cookies.get('username')" class="d-flex justify-content-around">
            <div class="row col-5">
                <div class="col">
                    <div class="form-floating">
                        <input id="friend" class="form-control bg-secondary text-white" placeholder="friend" v-model="friendToAdd" required type="text"/>
                        <label for="friend">Friend username</label>
                    </div>
                </div>
                <div class="w-auto align-self-center">
                    <button class="btn btn-outline-light" @click.prevent="addFriend">Add Friend<i class="fas fa-user-plus ms-2"></i></button>
                </div>
            </div>
        </form>
        <h3 class="mt-3" v-if="friends.length !== 0">Your friends</h3>
        <h3 v-else class="text-center mt-3">{{ username }} doesn't have friends yet.</h3>
        <h4 v-if="onlineFriends.length !== 0">Online</h4>
        <div class="card bg-dark text-white border-secondary p-3" v-for="friend in onlineFriends" role="button">
            <div class="row g-0">
                <div class="col-3">
                    <img v-if="friend.avatarImg" class="card-img col-md-2" :src="'../static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" />
                </div>
                <div class="card-body col-9">
                    <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + friend.username"><h3 class="w-25">{{ friend.nickname }}</h3></router-link>
                    <p class="card-text">State: {{friend.state}} {{ friend.inGame}}</p>
                    <p class="card-text"><small class="text-muted">Last online {{ friend.lastOnline}}</small></p>
                    <button v-if="logged && username == Vue.$cookies.get('username')" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemove" @click="friendToRemove = friend">Remove Friend</button>
                </div>
            </div>
        </div>
        <h4 v-if="offlineFriends.length !== 0">Offline</h4>
        <div class="card bg-dark text-white border-secondary p-3" v-for="friend in offlineFriends" role="button">
            <div class="row g-0">
                <div class="col-3">
                    <img v-if="friend.avatarImg" class="card-img col-md-2" :src="'../static/img/' + friend.username + '/' + friend.avatarImg" :alt="friend.nickname" />
                </div>
                <div class="card-body col-9">
                    <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + friend.username"><h3 class="w-25">{{ friend.nickname }}</h3></router-link>
                    <p class="card-text">State: {{friend.state}} {{ friend.inGame}}</p>
                    <p class="card-text"><small class="text-muted">Last online {{ friend.lastOnline}}</small></p>
                    <button v-if="logged && username == Vue.$cookies.get('username')" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemove" @click="friendToRemove = friend">Remove Friend</button>
                </div>
            </div>
        </div>
        <h4 v-if="logged && friendRequests.length !== 0">Friend Requests</h4>
        <div class="card bg-dark text-white border-secondary p-3" v-for="friendRequest in friendRequests" role="button">
            <div class="row g-0">
                <div class="col-3">
                    <img v-if="friendRequest.avatarImg" class="card-img col-md-2" :src="'../static/img/' + friendRequest.username + '/' + friendRequest.avatarImg" :alt="friendRequest.nickname" />
                </div>
                <div class="card-body col-9">
                    <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + friendRequest.username"><h3 class="w-25">{{ friendRequest.nickname }}</h3></router-link>
                    <p class="card-text">State: {{friendRequest.state}} {{ friendRequest.inGame}}</p>
                    <p class="card-text"><small class="text-muted">Last online {{ friendRequest.lastOnline}}</small></p>
                    <button @click="acceptFriend(friendRequest.username)" class="btn btn-outline-success">Accept Friend</button>
                    <button @click="denyFriend(friendRequest.username)" class="btn btn-outline-danger">Deny Friend</button>
                </div>
            </div>
        </div>
        <h4 v-if="logged && pendingRequests.length !== 0">Pending Requests</h4>
         <div class="card bg-dark text-white border-secondary p-3" v-for="pendingRequest in pendingRequests" role="button">
            <div class="row g-0">
                <div class="col-3">
                    <img v-if="pendingRequest.avatarImg" class="card-img col-md-2" :src="'../static/img/' + pendingRequest.username + '/' + pendingRequest.avatarImg" :alt="pendingRequest.nickname" />
                </div>
                <div class="card-body col-9">
                    <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + pendingRequest.username"><h3 class="w-25">{{ pendingRequest.nickname }}</h3></router-link>
                    <p class="card-text">State: {{pendingRequest.state}} {{ pendingRequest.inGame}}</p>
                    <p class="card-text"><small class="text-muted">Last online {{ pendingRequest.lastOnline}}</small></p>
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
                        <p>Are you sure to remove <em>{{ friendToRemove.nickname }}<em>?</p>
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
    watch: {
        $route: function (to, from){
            this.getFriends()
            this.getFriendRequests()
            this.getPendingRequests()
        }
    },
    methods: {
        getFriends: function () {
            axios.get('http://localhost:3000/api/account/' + this.$props.username + '/friends')
                .then(res => {
                    this.friends = res.data
                    this.onlineFriends = this.friends.filter(f => f.state === 'online' || f.state === 'in game')
                    this.offlineFriends = this.friends.filter(f => f.state === 'offline')
                })
                .catch(err => console.log(err))
        },
        getFriendRequests: function (){
            axios.get("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/friends/requests")
                .then(res => {
                    this.friendRequests = res.data
                })
                .catch(err => console.log(err))
        },
        getPendingRequests: function (){
            axios.get("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/pendingRequests")
                .then(res => {
                    this.pendingRequests = res.data
                })
                .catch(err => console.log(err))
        },
        addFriend: function (){
            if (this.friendToAdd !== this.$props.username) {
                if (this.friends.includes({ username: this.friendToAdd }))
                    alert('You already added ' + this.friendToAdd + ' as a friend!')
                else if (this.friendRequests.includes({ username: this.friendToAdd }))
                    alert('You already send a friend request to ' + this.friendToAdd)
                else
                    axios.post("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/friends", { username: this.friendToAdd})
                        .then(res => {
                            this.friendToAdd = ""
                            if (!this.pendingRequests.map(p => p.username).includes(res.data.username))
                                this.pendingRequests.push(res.data)
                        })
                        .catch(err => console.log(err))
            } else
                alert('You cannot add yourself as a friend!')
        },
        removeFriend: function () {
            axios.delete('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/friends/' + this.friendToRemove.username)
                .then(() => {
                    this.friends = this.friends.filter(v => v.username !== this.friendToRemove.username)
                    bootstrap.Modal.getInstance(document.querySelector('#confirmRemove')).hide()
                })
                .catch(err => console.log(err))
        },
        acceptFriend: function (username) {
            axios.patch('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/friends/requests', { username: username })
                .then(res => {
                    this.friendRequests = this.friendRequests.filter(v => v.username !== username)
                    this.friends.push(res.data)
                })
                .catch(err => console.log(err))
        },
        denyFriend: function (username) {
            axios.delete('http://localhost:3000/api/account/' + this.$cookies.get('username') + '/friends/requests/' + username)
                .then(() => this.friendRequests = this.friendRequests.filter(v => v.username !== username))
                .catch(err => console.log(err))
        },
    },
    sockets: {
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
        friendStateChanged: function (change){
            const friend = change[0]
            const body = change[1]
            if (this.$cookies.isKey('username') && this.friends.map(f => f.username).includes(friend.username)) {
                friend.state = body.state
                friend.inGame = body.inGame
                const index = this.friends.indexOf(this.friends.filter(v => v.username === friend.username)[0])
                Vue.set(this.friends, index, friend)
                if (friend.state === 'online') {
                    this.onlineFriends.push(friend)
                    this.offlineFriends = this.offlineFriends.filter(f => f.username !== friend.username)
                } else {
                    this.offlineFriends.push(friend)
                    this.onlineFriends = this.onlineFriends.filter(f => f.username !== friend.username)
                }
            }
        },
        friendDenied: function (friend) {
            if (this.$cookies.isKey('username') && this.pendingRequests.map(f => f.username).includes(friend.username)){
                this.pendingRequests = this.pendingRequests.filter(r => r.username !== friend.username)
            }
        }
    },
    mounted(){
        this.logged = this.$checkLogin()
        this.getFriends()
        this.getFriendRequests()
        this.getPendingRequests()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
            this.getFriends()
            this.getFriendRequests()
            this.getPendingRequests()
        })
    }
}
