const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', name: 'Home', component: Home, redirect: '/store' },
        { path: '/store', name: 'Store', component: Games },
        { path: '/library', name: 'Library', component: Library },
        { path: '/profile/:username', name: 'Profile', component: Profile, props: true },
        { path: '/signup', name: 'SignUp', component: SignUp },
        { path: '/cart', name: 'Cart', component: Cart },
        { path: '/wishlist/:username', name: 'Wishlist', component: Wishlist, props: true },
        { path: '/friends', name: 'Friends', component: Friends },
        { path: '/dev', name: 'Dev', component: Dev },
        { path: '/game/:gameId', name: 'Game', component: Game, props: true },
        { path: '/search', name: 'Search', component: Search, props: true },
        { path: '/404', component: NotFound },
        { path: '*', redirect: '/404' }
    ]
  })
