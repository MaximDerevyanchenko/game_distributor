const Profile = {
    props: ['username'],
    data: function() {
        return {
            account: {
                countryCode: "IT"
            },
            logged: false,
            isEditOn: false,
            accountChanges: {
                countryCode: null
            },
            countries: [],
            oldBio: ""
        }
    },
    template: `
    <div class="position-relative m-0 p-2">
        <div class="w-100 h-100 position-absolute top-50 start-50 translate-middle mt-3" id="backgroundImg"></div>
        <div class="d-flex mt-2 container justify-content-center p-0">
            <div class="d-flex flex-column mt-2 bg-primary p-2 rounded rounded-3">
                <div class="card bg-transparent text-white">
                    <div class="row g-0">
                        <div class="col-12 col-md-3 text-center">
                            <img id="avatarImg" class="rounded p-0 img-thumbnail col-6 col-md-12" :src="account.avatarImg === '' ? '../static/img/no-profile-image.png' : '../static/img/' + account.username + '/' + account.avatarImg" alt="" >
                            <div v-if="isEditOn" class="mt-2 me-2 mb-1">
                                <div class="row">
                                    <label class="input-group-text bg-transparent text-white border-0" for="avatar">Choose your avatar</label>
                                </div>
                                <div class="row ms-1">
                                    <input class="form-control bg-transparent text-white" id="avatar" @change="changeAvatarPreview" type="file" accept="image/*"/>
                                </div>
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column justify-content-between col-5 p-2 p-md-3">
                            <div v-if="!isEditOn" class="card-title row row-cols-1 row-cols-lg-2 align-items-center">
                              <h2 class="w-auto mb-0">{{ account.nickname }}</h2>
                              <span class="badge rounded-pill mb-1 fs-6 align-self-end w-auto" :class="account.state === 'offline' ? 'bg-dark' : account.state === 'online' ? 'bg-success' : 'bg-v-gradient border border-light'">{{ account.state }}</span>
                            </div>
                            <div v-else class="form-floating col-6 col-lg-3">
                                <input class="form-control bg-transparent text-white" placeholder="nickname" id="nickname" v-model="accountChanges.nickname" required type="text" />
                                <label for="nickname">Nickname</label>
                                <div class="invalid-tooltip">Nickname can NOT be empty.</div>
                            </div>
                            <p class="card-text mb-0" v-if="!isEditOn">{{ account.name }}</p>
                            <div v-if="!isEditOn" class="row row-cols-1 row-cols-lg-2 gy-2 align-items-center">
                                <p class="w-auto mb-0" v-if="!isEditOn && account.countryName">Country: {{ account.countryName }}</p>
                                <img class="w-auto" :src="'https://www.countryflags.io/' + account.countryCode + '/shiny/48.png'" :alt="account.countryName" />
                            </div>
                            <div v-else class="row row-cols-2 align-items-center mt-2">
                                <div class="form-floating flex-fill flex-md-grow-0 col-lg-4">
                                    <select class="form-select pb-1 bg-transparent text-white" id="country" v-model="accountChanges.countryCode">
                                        <option class="bg-secondary text-white" v-for="country in countries" :selected="country.code === accountChanges.countryCode" :value="country.code">{{ country.name }}</option>
                                    </select>
                                    <label class="ms-3" for="country">Country</label>
                                </div>
                                <div class="w-auto">
                                    <div class="row">
                                        <img class="w-auto" :src="'https://www.countryflags.io/' + accountChanges.countryCode + '/shiny/48.png'" :alt="accountChanges.countryName"/>
                                    </div>
                                </div>
                            </div>
                            <label for="bio" class="card-text mb-0 mt-1">Bio:</label>
                            <p class="text-break" v-if="!isEditOn">{{ account.bio }}</p>
                            <textarea v-else class="bg-transparent text-white mt-1" placeholder="Your bio" id="bio" v-model="account.bio"></textarea>
                            <div v-if="isEditOn" class="row row-cols-1 row-cols-lg-2 my-4 justify-content-center">
                                <div class="col">
                                    <label class="input-group-text bg-transparent text-white border-0" for="background">Choose your background</label>
                                </div>
                                <div class="col">
                                    <input class="form-control bg-transparent text-white" id="background" @change="changeBackgroundPreview" type="file" accept="image/*"/>
                                </div>
                            </div>
                             <div class="row justify-content-end gy-2 gx-2 me-2">
                                <router-link v-if="logged && Vue.$cookies.get('username') === username && !isEditOn" class="w-auto btn btn-outline-info" to="/dev">I'm a Developer</router-link>
                                <button v-if="logged && username === Vue.$cookies.get('username') && !isEditOn" role="button" class="w-auto btn btn-outline-light ms-2" @click="isEditOn = true">Edit profile</button>
                                <button v-if="isEditOn" class="w-auto btn btn-outline-danger" @click="discardChanges" role="button">Discard changes</button>
                                <button v-if="isEditOn" class="w-auto btn btn-outline-success ms-3" @click="saveChanges" role="button">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ul v-if="!isEditOn" class="nav nav-pills mt-3 mb-3 p-2 justify-content-center" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button ref="library_tab" class="nav-link active m-1 px-2 px-sm-3" id="library-tab" aria-selected="true" data-bs-toggle="pill" aria-controls="library" data-bs-target="#library" role="tab" type="button">Library</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link m-1 px-2 px-sm-3" data-bs-toggle="pill" id="friends-tab" aria-selected="false" data-bs-target="#friends" aria-controls="friends" role="tab" type="button">Friends</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link m-1 px-2 px-sm-3" data-bs-toggle="pill" id="wishlist-tab" aria-selected="false" data-bs-target="#wishlist" aria-controls="wishlist" role="tab" type="button">Wishlist</button>
                    </li>
                </ul>
                <div v-if="!isEditOn" class="tab-content border rounded bg-secondary p-0 p-sm-3" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="library" role="tabpanel" aria-labelledby="library-tab">
                        <library :username="username"></library>
                    </div>
                    <div class="tab-pane fade" id="friends" role="tabpanel" aria-labelledby="friends-tab">
                        <friends :username="username"></friends>
                    </div>
                    <div class="tab-pane fade" id="wishlist" role="tabpanel" aria-labelledby="wishlist-tab">
                        <wishlist :username="username" size="2"></wishlist>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    watch: {
        $route: function (){
            this.$refs['library_tab'].click()
            this.getAccount()
        }
    },
    methods: {
        getAccount: function () {
            axios.get('http://localhost:3000/api/account/' + this.$props.username)
                .then(res => {
                    this.account = res.data
                    this.oldBio = this.account.bio
                    this.accountChanges.nickname = this.account.nickname
                    this.accountChanges.countryCode = this.account.countryCode
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
        changeAvatarPreview: function (e){
            this.accountChanges.avatarImg = e.target.files[0]
            const reader = new FileReader()
            reader.onload = ev => document.querySelector('#avatarImg').src = ev.target.result
            reader.readAsDataURL(this.accountChanges.avatarImg)
        },
        changeBackgroundPreview: function (e){
            this.accountChanges.backgroundImg = e.target.files[0]
            const reader = new FileReader()
            reader.onload = ev => {
                document.querySelector('#backgroundImg').style.backgroundImage = 'url(' + ev.target.result + ')'
                let image = new Image();
                image.src =  ev.target.result.toString()
                image.onload = () =>  document.querySelector('.position-relative').style.height = image.naturalHeight + 'px'
            }
            reader.readAsDataURL(this.accountChanges.backgroundImg)
        },
        saveChanges: function (){
            if (this.accountChanges.nickname === ''){
                document.querySelector('#nickname').classList.remove('is-valid')
                document.querySelector('#nickname').classList.add('is-invalid')
            } else {
                this.isEditOn = false
                this.accountChanges.bio = this.account.bio
                this.accountChanges.countryName = this.countries.filter(c => c.code === this.accountChanges.countryCode)[0].name
                axios.post('http://localhost:3000/api/account/' + this.$props.username, this.buildForm())
                    .then(() => this.getAccount())
                    .catch(err => console.log(err))
            }
        },
        discardChanges: function (){
            this.isEditOn = false
            this.account.bio = this.oldBio
            document.querySelector('#avatarImg').src = this.account.avatarImg !== '' ? '../static/img/' + this.account.username + '/' + this.account.avatarImg : '../static/img/no-profile-image.png'
            document.querySelector('#backgroundImg').style.backgroundImage = 'url(../static/img/' + this.account.username + '/' + this.account.backgroundImg + ')'
        },
        getCountries: function () {
            axios.get('http://localhost:3000/api/countries')
                .then(res => this.countries = res.data)
                .catch(err => console.log(err))
        },
        buildForm: function (){
            const form = new FormData()
            form.append('username', this.account.username)
            form.append('nickname', this.accountChanges.nickname)
            form.append('bio', this.accountChanges.bio)
            form.append('countryCode', this.accountChanges.countryCode)
            form.append('countryName', this.accountChanges.countryName)
            if (this.accountChanges.avatarImg !== undefined)
                form.append('avatarImg', this.accountChanges.avatarImg)
            if (this.accountChanges.backgroundImg !== undefined)
                form.append('backgroundImg', this.accountChanges.backgroundImg)
            return form
        }
    },
    mounted() {
        this.logged = this.$checkLogin()
        this.$on('log-event', () => {
            this.logged = this.$checkLogin()
            this.$children.forEach(ch => ch.$emit('log-event'))
            this.getAccount()
        })
        this.getAccount()
        this.getCountries()
    }
}

