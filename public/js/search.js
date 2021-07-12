const Search = {
    props: ['name'],
    data() {
        return {
            games: [],
            page: 1,
            pageCount: 1
        }
    },
    template: `
    <div class="d-flex flex-column align-items-center">
        <h3 class="mt-3">Search results for "{{ name }}"</h3>
        <div class="bg-gradient mb-3 p-1 p-md-5 col-12 col-md-9">
            <div v-for="game in games" class="bg-transparent">
                <router-link class="nav-link text-light h5 mb-3 text-break" style="background-color: transparent !important;" :to="{ name: 'Game', params: { gameId: game.gameId }}">{{ game.name }}</router-link>
            </div>
            <div v-if="games.length === 0">
                <h5 class="text-center">No games found.</h5>
            </div>
        </div>
        <nav :aria-label="'Search results for ' + name">
            <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="page !== 1 ? '': 'disabled'"><a class="page-link" role="button" :tabindex="page === 1 ? -1 : ''" :aria-disabled="page === 1" @click="setPage(1)">First</a></li>
                <li class="page-item" :class="page !== 1 ? '': 'disabled'"><a class="page-link" role="button" :tabindex="page === 1 ? -1 : ''" :aria-disabled="page === 1" v-if="" @click="setPage(page-1)">Previous</a></li>
                
                <li class="page-item"><a class="page-link" v-if="page === pageCount && page !== 1" role="button" @click="setPage(page-2)">{{page-2}}</a></li>
                <li class="page-item"><a class="page-link" v-if="page !== 1" @click="setPage(page-1)" role="button">{{page-1}}</a></li>
                <li class="page-item active"><a class="page-link" aria-current="page" @click="setPage(page)" role="button">{{page}}</a></li>
                <li class="page-item"><a class="page-link" v-if="page !== pageCount" @click="setPage(page+1)" role="button">{{page+1}}</a></li>
                <li class="page-item"><a class="page-link" v-if="page === 1 && pageCount >= page + 2" @click="setPage(page+2)" role="button">{{page+2}}</a></li>
                
                <li class="page-item" :class="page !== pageCount ? '': 'disabled'"><a class="page-link" role="button" :tabindex="page === pageCount ? -1 : ''" :aria-disabled="page === pageCount" @click="setPage(page+1)">Next</a></li>
                <li class="page-item" :class="page !== pageCount ? '': 'disabled'"><a class="page-link" role="button" :tabindex="page === pageCount ? -1 : ''" :aria-disabled="page === pageCount" @click="setPage(pageCount)">Last</a></li>
            </ul>
        </nav>
    </div>
    `,
    methods: {
        countPages: function (){
            if (this.name === "")
                axios.get("http://localhost:3000/api/games/count")
                    .then(response => this.pageCount = Math.floor(response.data / 10) + 1)
                    .catch(error => console.log(error))
            else
                axios.get("http://localhost:3000/api/games/" + this.name + "/count")
                    .then(response => this.pageCount = Math.floor(response.data / 10) + 1)
                    .catch(error => console.log(error))
        },
        searchGame: function () {
            axios.post("http://localhost:3000/api/games", { name: this.name, page: this.page })
                .then(response => this.games = response.data)
                .catch(error => console.log(error))
        },
        setPage: function (page){
            this.page = page
            this.searchGame()
        }
    },
    mounted(){
        this.name = this.name == null ? "" : this.name
        this.countPages()
        this.searchGame()
        this.$on('query-event', name => {
            this.page = 1
            this.name = name
            this.countPages()
            this.searchGame()
        })
    }
}
