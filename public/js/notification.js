const Notification = {
    // TODO stile notifiche
    data: function() {
        return {
            myAccount: {},
            user: {},
            game: {},
            text: '',
            friendRequest: 'Sent you a friend request',
            friendAccepted: 'Accepted your friend request',
            online: 'Is now online',
            inGame: 'Is now playing ',
            gifted: 'Gifted you ',
            bought: 'Bought your game '
        }
    },
    template: `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
<!--            <div class="toast fade hide" role="alert" aria-live="assertive" aria-atomic="true">-->
<!--                <div v-if="user.nickname" class="toast-header">-->
<!--                    <img :src="user.avatarImg == '' ? '../static/img/no-profile-image.png' : '../static/img/' + user.username + '/' + user.avatarImg" width="20" height="20" class="rounded me-2" :alt="user.nickname + 'avatar' ">-->
<!--                    <strong class="me-auto">{{ user.nickname }}</strong>-->
<!--                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>-->
<!--                </div>-->
<!--                <div v-if="game.name" class="toast-body">-->
<!--                    {{ text }} {{ game.name }}-->
<!--                </div>-->
<!--                <div v-else class="toast-body">-->
<!--                    {{ text }}-->
<!--                </div>-->
<!--            </div>-->
        </div>
    `,
    methods: {
        getMyAccount: function (){
            axios.get('http://localhost:3000/api/account/' + this.$cookies.get('username'))
                .then(res => this.myAccount = res.data)
                .catch(error => console.log(error))
        },
        getUser: function (username){
            axios.get('http://localhost:3000/api/account/' + username)
                .then(res => {
                    this.user = res.data
                    const nodeList = document.querySelectorAll('.toast-header')
                    let elem = ""
                    elem += '<img src="'

                    if (this.user.avatarImg === "")
                        elem += '../static/img/no-profile-image.png'
                    else
                        elem += '../static/img/' + this.user.username + '/' + this.user.avatarImg

                    elem += '" width="20" height="20" class="rounded me-2" alt="' + this.user.nickname + ' avatar">' +
                        '                    <strong class="me-auto">' + this.user.nickname + '</strong>' +
                        '                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>'
                    nodeList.item(nodeList.length - 1).innerHTML = elem
                })
                .catch(error => console.log(error))
        },
        getGame: function (gameId){
            axios.get("http://localhost:3000/api/game/" + gameId)
                .then(response => {
                    this.game = response.data
                    if (!this.game.isLocal)
                        axios.get("http://localhost:3000/api/steam_game/" + gameId)
                            .then(response => {
                                this.game = response.data
                                const nodeList = document.querySelectorAll('.toast-body')
                                nodeList.item(nodeList.length - 1).innerHTML += ' ' + this.game.name
                            })
                            .catch(error => console.log(error))
                    else{
                        const nodeList = document.querySelectorAll('.toast-body')
                        nodeList.item(nodeList.length - 1).innerHTML += ' ' + this.game.name
                    }
                })
                .catch(error => console.log(error))
        },
        addToast: function () {
            document.querySelector('.toast-container').insertAdjacentHTML('beforeend', this.buildToast())

            const html = document.querySelector('.toast-container').lastChild
            html.addEventListener('hidden.bs.toast', () => {
                html.remove()
            })
            new bootstrap.Toast(html).show()
        },
        buildToast: function () {
            let toast = '<div class="toast fade hide" role="alert" aria-live="assertive" aria-atomic="true">\n'

            if (this.user.username !== undefined) {
                toast += '<div class="toast-header">' +
                    '<img src="'

                if (this.user.avatarImg === "")
                    toast += '../static/img/no-profile-image.png'
                else
                    toast += '../static/img/' + this.user.username + '/' + this.user.avatarImg

                toast += '" width="20" height="20" class="rounded me-2" alt="' + this.user.nickname + ' avatar">' +
                    '                    <strong class="me-auto">' + this.user.nickname + '</strong>' +
                    '                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
                    '                </div>'
            } else
                toast += '<div class="toast-header">' +
                    '                </div>'

            toast += '<div class="toast-body">' +
                '                    ' + this.text

            if (this.game.gameId !== undefined)
                toast += ' ' + this.game.name

            toast += '' +
                '</div>' +
                '</div>'

            return toast
        }
    },
    sockets: {
        friendStateChanged: function (change) {
            const user = change[0]
            const body = change[1]
            if (this.$cookies.isKey('username') && user.username !== this.$cookies.get('username') && this.myAccount.friends.includes(user.username) && body.state !== 'offline' && user.state !== 'in game' && body.state !== user.state) {
                this.game = {}
                this.user = user

                if (body.state === 'in game') {
                    this.getGame(body.inGame)
                    this.text = this.inGame
                } else if (body.state === 'online')
                    this.text = this.online

                this.addToast()
            }
        },
        friendAdded: function (requestDetails) {
            const sender = requestDetails[0]
            const friend = requestDetails[1]
            if (this.$cookies.get('username') === friend.username) {
                this.game = {}
                this.user = {}
                this.getUser(sender)
                this.text = this.friendRequest

                this.addToast()
            }
        },
        friendAccept: function (acceptDetails) {
            const acceptedBy = acceptDetails[0]
            const friend = acceptDetails[1]
            if (this.$cookies.get('username') === friend.username) {
                this.game = {}
                this.user = {}
                this.getUser(acceptedBy)
                this.text = this.friendAccepted

                this.addToast()
            }
        },
        gameGifted: function (giftDetails) {
            const giftedBy = giftDetails[0]
            const game = giftDetails[1]
            if (this.$cookies.get('username') === game.username) {
                this.game = {}
                this.user = {}
                this.getGame(game.gameId)
                this.getUser(giftedBy)
                this.text = this.gifted

                this.addToast()
            }
        },
        gameBought: function (purchaseData) {
            const user = purchaseData[0]
            const game = purchaseData[1]
            if (this.$cookies.get('username') === game.developer){
                this.game = game
                this.user = {}
                this.getUser(user)
                this.text = this.bought

                this.addToast()
            }
        }
    },
    mounted() {
        this.getMyAccount()
    }
    <!-- Friend request V -->
    <!-- Gift V -->
    <!-- Went Online V -->
    <!-- Started playing V -->
    <!-- Developed game was bought -->
}
