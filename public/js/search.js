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
    <div>
        <div v-for="game in games">
            <div>
                <div>
                    <router-link class="nav-link text-light" :to="{ name: 'Game', params: { gameId: game.gameId }}">{{ game.name }}</router-link>
                </div>
            </div>
        </div>
        <nav aria-label="Search results pages">
            <ul class="pagination">
                <li class="page-item" :class="page != 1 ? '': 'disabled'"><a class="page-link" @click="setPage(1)">First</a></li>
                <li class="page-item" :class="page != 1 ? '': 'disabled'"><a class="page-link" v-if="" @click="setPage(page-1)">Previous</a></li>
                <li class="page-item"><a class="page-link" v-if="page == pageCount" @click="setPage(page-2)">{{page-2}}</a></li>
                <li class="page-item"><a class="page-link" v-if="page != 1" @click="setPage(page-1)">{{page-1}}</a></li>
                <li class="page-item active"><a class="page-link" @click="setPage(page)">{{page}}</a></li>
                <li class="page-item"><a class="page-link" v-if="page != pageCount" @click="setPage(page+1)">{{page+1}}</a></li>
                <li class="page-item"><a class="page-link" v-if="page == 1" @click="setPage(page+2)">{{page+2}}</a></li>
                <li class="page-item" :class="page != pageCount ? '': 'disabled'"><a class="page-link" @click="setPage(page+1)">Next</a></li>
                <li class="page-item" :class="page != pageCount ? '': 'disabled'"><a class="page-link" @click="setPage(pageCount)">Last</a></li>
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
                axios.get("http://localhost:3000/api/game/" + this.name + "/count")
                    .then(response => {this.pageCount = Math.floor(response.data / 10) + 1; console.log(this.pageCount)})
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
            this.name = name
            this.countPages()
            this.searchGame()
        })
    }
}
