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
                    <router-link class="nav-link" :to="{ name: 'Game', params: { game_id: game.appid }}">{{ game.name }}</router-link>
                </div>
            </div>
        </div>
        <nav aria-label="Search results pages">
            <ul class="pagination">
                <li class="page-item"><a class="page-link" @click="setPage(1)">First</a></li>
                <li class="page-item"><a class="page-link" @click="setPage(page-1)">Previous</a></li>
                <li class="page-item"><a class="page-link" @click="setPage(page-2)">{{page-2}}</a></li>
                <li class="page-item"><a class="page-link" @click="setPage(page-1)">{{page-1}}</a></li>
                <li class="page-item"><a class="page-link" @click="setPage(page)">{{page}}</a></li>
                <li class="page-item"><a class="page-link" @click="setPage(page+1)">{{page+1}}</a></li>
                <li class="page-item"><a class="page-link" @click="setPage(page+2)">{{page+2}}</a></li>
                <li class="page-item"><a class="page-link" @click="setPage(page+1)">Next</a></li>
                <li class="page-item"><a class="page-link" @click="setPage(pageCount)">Last</a></li>
            </ul>
        </nav>
    </div>
    `,
    methods: {
        countPages: function (){
            axios.get("http://localhost:3000/api/game/" + this.name + "/count")
                .then(response => this.pageCount = response.data)
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
        this.countPages()
        this.searchGame()
        this.$on('query-event', name => {
            this.name = name
            this.countPages()
            this.searchGame()
        })
    }
}
