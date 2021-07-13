const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', name: 'Home', redirect: '/store' },
        { path: '/store', name: 'Store', component: Games },
        { path: '/library/:username', name: 'Library', component: Library, props: true },
        { path: '/profile/:username', name: 'Profile', component: Profile, props: true },
        { path: '/signup', name: 'SignUp', component: SignUp },
        { path: '/cart', name: 'Cart', component: Cart },
        { path: '/wishlist/:username', name: 'Wishlist', component: Wishlist, props: true },
        { path: '/friends/:username', name: 'Friends', component: Friends, props: true },
        { path: '/dev', name: 'Dev', component: Dev },
        { path: '/game/:gameId', name: 'Game', component: Game, props: true },
        { path: '/search', name: 'Search', component: Search, props: true },
        { path: '/404', component: NotFound, name: '404' },
        { path: '*', redirect: '/404' }
    ]
  })
