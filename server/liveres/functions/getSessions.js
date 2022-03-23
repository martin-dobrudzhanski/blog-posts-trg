import rp      from 'request-promise';
import config  from '../../config/liveres';

export default async function (req, res) {

	const siteRef      = req && req.query && req.query.siteRef;
	const date         = req && req.query && req.query.date;

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

	// let timeslots = [];

	let uri = `${config.liveres.LIVERES_URL}/restaurant/sessions/${siteRef}/${date}`;
	console.log(uri)

	rp({
		method: 'GET',
		uri,
		headers: config.liveres.headers,
		json: true
	}).then((data) => {
		if (!data ||
				data.StatusCode !== 200 ||
				!data.Data ||
				!data.Data.sessions ||
				!data.Data.sessions.length) {
			res.json({ status: 'error', message: 'No sessions' });
			return;
		}
		res.json(data.Data.sessions.map((item) => {
			return {
				name:       item.Name,
				startTime:  item.StartTime,
				endTime:    item.EndTime
			}
		}));
	}).catch((error) => {
		console.log(error);
		res.json({ status: 'error', message: 'Error getting sessions' });
	});

}
