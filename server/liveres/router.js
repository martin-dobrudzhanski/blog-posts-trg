import express     from 'express'
import checkAvailability  from './functions/checkAvailability';
import getSessions        from './functions/getSessions';
import createBooking      from './functions/createBooking';
import getBooking         from './functions/getBooking';
import updateBooking      from './functions/updateBooking';
import cancelBooking      from './functions/cancelBooking';

const router = express.Router()

router
	.route('/availability')
	.get(checkAvailability);

router
	.route('/sessions')
	.get(getSessions);

router
	.route('/booking')
	.post(createBooking)
	.get(getBooking)

router
	.route('/booking/amend')
	.post(updateBooking)

router.route('/booking/cancel')
	.post(cancelBooking);

export default router;
