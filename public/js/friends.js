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
    <div>
        <label for="friend">Friend username:</label>
        <input id="friend" v-model="friendToAdd" type="text"/>
        <button @click="addFriend">Add Friend</button>
        <h3>Friends</h3>
        <div v-for="friend in friends">
            <div>
                 <router-link class="nav-link" :to="{ name: 'Profile', params: { username: friend.nickname }}">{{ friend.nickname }}</router-link>
            </div>
            <p>State: {{friend.state}} {{ friend.inGame}}</p>
            <button @click="removeFriend(friend.username)">Remove Friend</button>
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
