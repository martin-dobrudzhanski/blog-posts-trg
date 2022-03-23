import rp      from 'request-promise';
import config  from '../../config/liveres';
import dayjs   from 'dayjs';

const getAlternativeTimes = (time, timeslots) => {
	let timeVariations = [
		-30,
		-15,
		15,
		30
	]

	let alternativeTimes = [];

	for (let variation of timeVariations) {

		let hour = time.substring(0, 2);
		let minute = time.slice(-2);

		let slot = dayjs()
			.set('hour', hour)
			.set('minute', minute)
			.add(variation, 'minute')
			.format('HH:mm');

		const object = {
			slot: slot,
			availability: false
		}

		alternativeTimes.push(object);
	}

	alternativeTimes.forEach(function(alternativeTime) {
		timeslots.forEach(function(timeSlot) {
			if (alternativeTime.slot === timeSlot.time && timeSlot.available) {
				alternativeTime.availability = true;
			}
		})
	});
	return alternativeTimes;
}

export default async function (req, res) {

	const session      = req && req.query && req.query.session;
	const siteRef      = req && req.query && req.query.siteRef;
	const date         = req && req.query && req.query.date;
	const time         = req && req.query && req.query.time;
	const numPeople    = req && req.query && req.query.numPeople;

	if (!session) {
		return res.json({
			status: 'error',
			message: 'Missing session'
		});
	}
	if (!siteRef) {
		return res.json({
			status: 'error',
			message: 'Missing siteRef'
		});
	}
	if (!date) {
		return res.json({
			status: 'error',
			message: 'Missing date'
		});
	}
	if (!time) {
		return res.json({
			status: 'error',
			message: 'Missing time'
		});
	}
	if (!numPeople) {
		return res.json({
			status: 'error',
			message: 'Missing numPeople'
		});
	}

	let uri = `${config.liveres.LIVERES_URL}/detailedtimeslots/${siteRef}/${session}/${date}/${numPeople}`;

	console.log(uri);

	rp({
		method: 'GET',
		uri,
		headers: config.liveres.headers,
		json: true
	}).then((data) => {
		if (data &&
				data.Data &&
				data.Data[0].TimeSlots &&
				!data.Data[0].TimeSlots.length) {
			res.json({ status: 'noTimeslots', message: 'No timeslots' });
			return;
		}
		if (!data ||
				!data.StatusCode ||
				data.StatusCode !== 200 ||
				!data.Data ||
				!data.Data.length ||
				!data.Data[0].TimeSlots ||
				!data.Data[0].TimeSlots.length) {
			res.json({ status: 'error', message: 'Error getting timeslots' });
			return;
		}
		let timeslots = data.Data[0].TimeSlots;
		let timeslot = timeslots.find(item => item.time === time);
		let sessionAvailable = timeslots.find(item => item.available === true);

		if (!timeslot                         ||
				!timeslot.available               ||
				timeslot.minPartySize > numPeople ||
				timeslot.maxPartySize < numPeople) {
			return res.json({
				status: 'notAvailable',
				message: 'Timeslot not available',
				alternativeTimes: getAlternativeTimes(time, timeslots),
				session: session,
				sessionAvailable: sessionAvailable
			})
		} else {
			return res.json({ status: 'success', message: 'Timeslot available' });
		}
	}).catch((error) => {
		console.log(error);
		res.json({ status: 'error', message: 'Error getting timeslots' });
	});

	// TODO: Handle no timeslots?
	// if (!timeslots.length) {
	// 	// TODO: Get alternative times
	// 	res.json({ status: 'notAvailable', message: 'No matching timeslot' });
	// }

}
