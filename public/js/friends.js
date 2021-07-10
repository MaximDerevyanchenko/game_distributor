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
            logged: false,
            errorText: ""
        }
    },
    template: `
    <div class="d-flex flex-column align-items-center mt-4">
        <form v-if="logged && username === Vue.$cookies.get('username')" class="col-11 col-md-9 col-xl-6 d-flex justify-content-center row gx-0 row-cols-1 row-cols-md-2 mb-2">
            <div class="col col-md-6">
                <div class="form-floating has-validation">
                    <input id="friend" class="form-control bg-secondary text-white mb-2" placeholder="friend" v-model="friendToAdd" required type="text"/>
                    <label for="friend">Friend username</label>
                    <div class="invalid-feedback">{{ errorText }}</div>
                </div>
            </div>
            <div class="w-auto mt-2 ms-3">
                <button class="btn btn-outline-light" @click.prevent="addFriend">Add Friend<i class="fas fa-user-plus ms-2"></i></button>
            </div>
        </form>
        <h3 class="mt-3" v-if="friends.length !== 0">{{ username === Vue.$cookies.get('username') ? 'Your friends' : 'Friends' }}</h3>
        <h3 v-else class="text-center mt-3">{{ username === Vue.$cookies.get('username') ? "You don't" : username + " doesn't"}} have friends yet.</h3>
        <h4 class="m-3" v-if="onlineFriends.length !== 0">Online</h4>
        <div class="card bg-dark text-white border col-12 col-md-9 col-xl-7 p-3" v-for="friend in onlineFriends" role="button">
            <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + friend.username">
                <div class="d-lg-flex g-0">
                    <div>
                        <img class="card-img" :src="friend.avatarImg ? '../static/img/' + friend.username + '/' + friend.avatarImg : '../static/img/no-profile-image.png'" :alt="friend.nickname" />
                    </div>
                    <div class="card-body">
                        <div class="row row-cols-2 align-items-center">
                            <h3 class="w-auto mb-0">{{ friend.nickname }}</h3>
                            <span class="badge rounded-pill fs-6 align-self-end w-auto" :class="friend.state === 'in game' ? 'bg-v-gradient' : 'bg-success'">{{ friend.state }}</span>
                        </div>
                        <p class="card-text mt-2" v-if="friend.state === 'in game'">is playing <em>{{ friend.inGame }}</em></p>
                        <p class="card-text"><small class="text-muted">Last online {{ friend.lastOnline}}</small></p>
                        <button v-if="logged && username === Vue.$cookies.get('username')" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemove" @click.prevent="friendToRemove = friend">Remove Friend</button>
                    </div>
                </div>
            </router-link>
        </div>
        <h4 class="m-3" v-if="offlineFriends.length !== 0">Offline</h4>
        <div class="card bg-dark text-white border p-3 col-12 col-md-9 col-xl-7" v-for="friend in offlineFriends" role="button">
            <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + friend.username">
                <div class="d-lg-flex g-0">
                    <div>
                        <img class="card-img" :src="friend.avatarImg ? '../static/img/' + friend.username + '/' + friend.avatarImg : '../static/img/no-profile-image.png'" :alt="friend.nickname" />
                    </div>
                    <div class="card-body">
                        <div class="row row-cols-2 align-items-center">
                            <h3 class="w-auto mb-0">{{ friend.nickname }}</h3>
                            <span class="badge rounded-pill fs-6 align-self-end w-auto bg-dark">{{ friend.state }}</span>
                        </div>
                        <p class="card-text"><small class="text-muted">Last online {{ friend.lastOnline}}</small></p>
                        <button v-if="logged && username === Vue.$cookies.get('username')" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#confirmRemove" @click.prevent="friendToRemove = friend">Remove Friend</button>
                    </div>
                </div>
            </router-link>
        </div>
        <h4 class="m-3" v-if="logged && friendRequests.length !== 0">Friend Requests</h4>
        <div class="card bg-dark text-white border p-3 col-12 col-md-9 col-xl-7" v-for="friendRequest in friendRequests" role="button">
            <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + friendRequest.username">
                <div class="d-lg-flex g-0">
                    <div>
                        <img class="card-img" :src="friendRequest.avatarImg ? '../static/img/' + friendRequest.username + '/' + friendRequest.avatarImg : '../static/img/no-profile-image.png'" :alt="friendRequest.nickname" />
                    </div>
                    <div class="card-body">
                        <div class="row row-cols-2 align-items-center">
                            <h3 class="w-auto mb-0">{{ friendRequest.nickname }}</h3>
                            <span class="badge rounded-pill fs-6 align-self-end w-auto" :class="friendRequest.state === 'offline' ? 'bg-dark' : 'bg-success'">{{ friendRequest.state === 'in game' ? 'online' : friendRequest.state }}</span>
                        </div>
                        <p class="card-text"><small class="text-muted">Last online {{ friendRequest.lastOnline}}</small></p>
                        <button @click.prevent="acceptFriend(friendRequest.username)" class="btn btn-outline-success mb-2 mb-md-0">Accept friendship</button>
                        <button @click.prevent="denyFriend(friendRequest.username)" class="btn btn-outline-danger">Deny friendship</button>
                    </div>
                </div>
            </router-link>
        </div>
        <h4 class="m-3" v-if="logged && pendingRequests.length !== 0">Pending Requests</h4>
         <div class="card bg-dark text-white border p-3 col-12 col-md-9 col-xl-7" v-for="pendingRequest in pendingRequests" role="button">
            <router-link class="card-title text-white text-decoration-none" :to="'/profile/' + pendingRequest.username">
                <div class="d-lg-flex g-0">
                    <div>
                        <img class="card-img" :src="pendingRequest.avatarImg ? '../static/img/' + pendingRequest.username + '/' + pendingRequest.avatarImg : '../static/img/no-profile-image.png'" :alt="pendingRequest.nickname" />
                    </div>
                    <div class="card-body">
                        <div class="row row-cols-2 align-items-center">
                            <h3 class="w-auto mb-0">{{ pendingRequest.nickname }}</h3>
                            <span class="badge rounded-pill fs-6 align-self-end w-auto" :class="pendingRequest.state === 'offline' ? 'bg-dark' : 'bg-success'">{{ pendingRequest.state === 'in game' ? 'online' : pendingRequest.state }}</span>
                        </div>
                        <p class="card-text"><small class="text-muted">Last online {{ pendingRequest.lastOnline}}</small></p>
                    </div>
                </div>
            </router-link>
        </div>
        
        <div id="confirmRemove" class="modal fade" tabindex="-1" aria-labelledby="confirmRemove" aria-hidden="true">
            <div class="modal-dialog border border-light border-3 rounded rounded-3 modal-sm">
                <div class="modal-content bg-secondary text-white">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm removal</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure to remove <em>{{ friendToRemove.nickname }}</em>?</p>
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
            this.friendRequests = []
            this.pendingRequests = []
            if (this.$props.username === this.$cookies.get('username')){
                this.getFriendRequests()
                this.getPendingRequests()
            }
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
                .then(res => this.friendRequests = res.data)
                .catch(err => console.log(err))
        },
        getPendingRequests: function (){
            axios.get("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/friends/pending")
                .then(res => this.pendingRequests = res.data)
                .catch(err => console.log(err))
        },
        addFriend: function (){
            document.querySelector('#friend').classList.add('is-invalid')
            if (this.friendToAdd !== this.$props.username) {
                if (this.friends.map(f => f.username).includes(this.friendToAdd))
                    this.errorText = 'You already added ' + this.friendToAdd + ' as a friend!'
                else if (this.pendingRequests.map(r => r.username).includes(this.friendToAdd))
                    this.errorText = 'You already sent a friend request to ' + this.friendToAdd
                else if (this.friendRequests.map(r => r.username).includes(this.friendToAdd))
                    this.errorText = 'This user already sent you a friend request.'
                else
                    axios.post("http://localhost:3000/api/account/" + this.$cookies.get('username') + "/friends", { username: this.friendToAdd})
                        .then(res => {
                            if (res.status === 200) {
                                this.friendToAdd = ""
                                this.pendingRequests.push(res.data)
                                document.querySelector('#friend').classList.remove('is-invalid')
                            } else {
                                this.errorText = "This user doesn't exist."
                            }
                        })
                        .catch(err => console.log(err))
            } else
                this.errorText = 'You cannot add yourself as a friend!'
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
            if (this.$cookies.isKey('username') && this.friends.map(f => f.username).includes(friend.username)) {
                this.getFriends()
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
        if (this.$props.username === this.$cookies.get('username')){
            this.getFriendRequests()
            this.getPendingRequests()
        }
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
            this.getFriends()
            this.friendRequests = []
            this.pendingRequests = []
            if (this.$props.username === this.$cookies.get('username')){
                this.getFriendRequests()
                this.getPendingRequests()
            }
        })
    }
}
