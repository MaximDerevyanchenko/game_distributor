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
    <div class="position-relative container p-2">
        <div class="w-100 h-100 position-absolute top-50 start-50 translate-middle" id="backgroundImg"></div>
        <div class="d-flex mt-2 justify-content-center">
            <div class="d-flex flex-column p-1 p-sm-3 mt-2 bg-primary border rounded">
                <div class="card bg-transparent text-white">
                    <div class="row g-0">
                        <div class="col-12 col-lg-3">
                            <img id="avatarImg" class="card-img-top rounded p-0 img-thumbnail" :src="account.avatarImg === '' ? '../static/img/no-profile-image.png' : '../static/img/' + account.username + '/' + account.avatarImg" alt="" >
                            <div v-if="isEditOn" class="mt-2">
                                <div class="row">
                                    <label class="input-group-text bg-transparent text-white border-0" for="avatar">Choose your avatar</label>
                                </div>
                                <div class="row ms-1">
                                    <input class="form-control bg-transparent text-white" id="avatar" @change="changeAvatarPreview" type="file" accept="image/*"/>
                                </div>
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column justify-content-between ms-3 col-5">
                            <div v-if="!isEditOn" class="card-title row row-cols-1 row-cols-lg-2 align-items-center">
                                <h2>{{ account.nickname }} <span class="badge rounded-pill fs-6" :class="account.state === 'offline' ? 'bg-dark' : 'bg-success'">{{ account.state }}</span></h2>
                                <div class="d-flex justify-content-end">
                                    <router-link v-if="Vue.$cookies.get('username') === username" class="btn btn-outline-info " to="/dev">I'm a Developer</router-link>
                                </div>
                            </div>
                            <div v-else class="form-floating col-6 col-lg-3">
                                <input class="form-control bg-transparent text-white" placeholder="nickname" id="nickname" :value="account.nickname" v-model="account.nickname" required type="text" />
                                <label for="nickname">Nickname</label>
                            </div>
                            <p class="card-text">{{ account.name }}</p>
                            <div v-if="!isEditOn" class="row row-cols-1 row-cols-lg-2 gy-2 align-items-center">
                                <p class="w-auto mb-0" v-if="!isEditOn && account.countryName">Country: {{ account.countryName }}</p>
                                <img class="w-auto" :src="'https://www.countryflags.io/' + account.countryCode + '/shiny/48.png'" />
                            </div>
                            <div v-else class="row row-cols-1 row-cols-lg-2 align-items-center">
                                <div class="form-floating col-lg-6">
                                    <select class="form-select pb-1 bg-transparent text-white" id="country" v-model="accountChanges.countryCode">
                                        <option class="bg-secondary text-white" v-for="country in countries" :selected="country.code === accountChanges.countryCode" :value="country.code">{{ country.name }}</option>
                                    </select>
                                    <label class="ms-3" for="country">Country</label>
                                </div>
                                <div class="col">
                                    <div class="row">
                                        <img class="w-auto" :src="'https://www.countryflags.io/' + accountChanges.countryCode + '/shiny/48.png'" />
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
                             <div class="row justify-content-end gy-2 me-2">
                                <button v-if="logged && username === Vue.$cookies.get('username') && !isEditOn" class="w-auto btn btn-outline-light" @click="isEditOn = true">Edit profile</button>
                                <button v-if="isEditOn" class="w-auto btn btn-outline-danger" @click="discardChanges">Discard changes</button>
                                <button v-if="isEditOn" class="w-auto btn btn-outline-success ms-3" @click="saveChanges">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ul v-if="!isEditOn" class="nav nav-pills mt-3 mb-3 p-2 justify-content-center" role="tablist">
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
                <div v-if="!isEditOn" class="tab-content border rounded bg-secondary p-0 p-sm-3" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="library" role="tabpanel">
                        <library :username="username"></library>
                    </div>
                    <div class="tab-pane fade" id="friends" role="tabpanel">
                        <friends :username="username"></friends>
                    </div>
                    <div class="tab-pane fade" id="wishlist" role="tabpanel">
                        <wishlist :username="username" size="2"></wishlist>
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
            axios.get('http://localhost:3000/api/account/' + this.$props.username)
                .then(res => {
                    this.account = res.data
                    this.oldBio = this.account.bio
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
            this.isEditOn = false
            this.accountChanges.bio = this.account.bio
            this.accountChanges.countryName = this.countries.filter(c => c.code === this.accountChanges.countryCode)[0].name
            axios.post('http://localhost:3000/api/account/' + this.$props.username, this.accountChanges)
                .then(() => this.getAccount())
                .catch(err => console.log(err))
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

