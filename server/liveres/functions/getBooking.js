import rp      from 'request-promise';
import config  from '../../config/liveres';

const getMarketingOptOut = (data) => {
	if (!data.consent) {
		return true;
	}
	if (!data.consent.sms) {
		return true;
	}
}

export default function (req, res) {

	const bookingRef = req && req.query && req.query.bookingRef;

	if (!bookingRef) {
		return res.status(400).json({ message: 'Missing bookingRef' });
	}

	const uri = `${config.liveres.LIVERES_URL}/reservation/${bookingRef}`;
	console.log(uri);

	rp({
		method: 'GET',
		uri,
		headers: config.liveres.headers,
		json: true
	}).then((data) => {
		res.json({
			status:           'success',
			siteRef:          data.Data.restaurantCode,
			dateTime:         data.Data.dateTime,
			numPeople:        data.Data.adultCovers,
			specialRequest:   data.Data.specialRequest,
			cancelUrl:        data.Data.cancelUrl,
			amendUrl:         data.Data.amendUrl,
			name:             data.Data.guest.firstName,
			email:            data.Data.guest.email,
			tel:              data.Data.guest.phoneNumber,
			marketingOptOut:  getMarketingOptOut(data.Data)
		});
		return;
	}).catch((error) => {
		console.log(error);
		res.json({
			status: 'error'
		});
	});

}
