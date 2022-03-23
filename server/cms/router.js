import express from 'express'
const router = express.Router()

import * as home from './controllers/home'
import * as pages from './controllers/pages'
import * as error404 from './controllers/404'
import * as restaurants from './controllers/restaurants'
import * as terms from './controllers/terms'
import * as atrestaurant from './controllers/atRestaurant'
import * as book from './controllers/book'
import * as menu from './controllers/menu'
import * as allergy from './controllers/allergy'
import * as pay from './controllers/pay'
import * as nearest from './controllers/nearestMe'
import * as contact from './controllers/contact'
import * as faq from './controllers/faqs'
import * as delivery from './controllers/delivery'
import * as login from './controllers/login'
import * as offers from './controllers/offers'
import * as wallet from './controllers/wallet'
import * as cinema from './controllers/cinema'
import * as matchday from './controllers/matchday'
import * as clickAndCollect from './controllers/clickAndCollect'
import * as orderAtTable from './controllers/orderAtTable'
import * as spin from './controllers/spin'
import * as linksPage from './controllers/linksPage'

router
	.route('/home')
	.get(home.get)

router
	.route('/pages/:slug')
	.get(pages.getOne)

router
	.route('/404')
	.get(error404.get)

router
	.route('/terms-page')
	.get(terms.get)

router
	.route('/login-page')
	.get(login.get)

router
	.route('/offers-page')
	.get(offers.get)

router
	.route('/wallet-pages')
	.get(wallet.get)

router
	.route('/delivery-page')
	.get(delivery.get)

router
	.route('/restaurants')
	.get(restaurants.get)

router
	.route('/restaurants/:slug')
	.get(restaurants.getOne)

router
	.route('/nearest-me')
	.get(nearest.get)

router
	.route('/at-restaurant')
	.get(atrestaurant.get)
  
router
	.route('/book')
	.get(book.get)

router
	.route('/book/:slug')
	.get(book.getOne)

router
	.route('/booking-slug/:siteref')
	.get(book.getSlugForBooking)

router
	.route('/faq-page')
	.get(faq.get)

router
	.route('/menu-page')
	.get(menu.getGeneric)

router
	.route('/menu-page/section/:id')
	.get(menu.getMenuSection)

router
	.route('/menu-page/:id')
	.get(menu.getDynamic)

router
	.route('/allergy-page')
	.get(allergy.getGeneric)

router
	.route('/allergy-page/:slug')
	.get(allergy.getOne)

router
  .route('/pay/:slug')
  .get(pay.getOne)

router
  .route('/paymybill')
  .get(pay.getAll)

router
	.route('/contact-page')
	.get(contact.get)

router
	.route('/cinema-page')
	.get(cinema.get)

router
	.route('/matchday-page')
	.get(matchday.get)

router
	.route('/restaurants-click-and-collect')
	.get(restaurants.getClickAndCollect)

router
	.route('/click-and-collect/site')
	.get(clickAndCollect.getOneBySiteId)

router
	.route('/click-and-collect/:slug')
	.get(clickAndCollect.getOne)

router
	.route('/restaurants-order-at-table')
	.get(restaurants.getOrderAtTable)

router
	.route('/order-at-table/site')
	.get(orderAtTable.getOneBySiteId)

router
	.route('/order-at-table/:slug')
	.get(orderAtTable.getOne)

router
  .route('/spin')
  .get(spin.get)

router
  .route('/links-page/:slug')
  .get(linksPage.getOne)


// Only used for getting menu data - not for page CMS data.
// router
// 	.route('/menu/:menuType')
// 	.get(menu.getByType)

// router
// 	.route('/menu/:menuType/:section')
// 	.get(menu.getBySection)


export default router
