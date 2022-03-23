module.exports = (app) => {

	app.redirect('/restaurant', '/restaurants')
	app.redirect('/menus', '/menu')
	app.redirect('/offer', '/offers')
	app.redirect('/takeaways', '/takeaway')
	app.redirect('/pay', '/at-restaurant')

  app.redirect('/restaurants/:name/menu/dessert', '/restaurants/:name/menu/desserts')

}
