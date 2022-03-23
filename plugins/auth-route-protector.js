export default ({ store, app, redirect, isDev }) => {

	if (isDev) {
	  app.router.afterEach((to, from) => {
			console.log('isAuthenticated: ', !!store.state.auth.token)
	  })
	}

}

