const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', name: 'Home', component: Home, redirect: '/store' },
        { path: '/store', name: 'Store', component: Games },
        { path: '/library', name: 'Library', component: Library },
        { path: '/profile', name: 'Profile', component: Profile},
        { path: '/signup', name: 'SignUp', component: SignUp },
        { path: '/cart', name: 'Cart', component: Cart },
        { path: '/game/:game_id', name: 'Game', component: Game, props: true },
        { path: '/404', component: NotFound },
        { path: '*', redirect: '/404' }
    ]
  })
