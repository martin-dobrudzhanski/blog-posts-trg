import path from 'path'
export const renderBookWidget = (req, res) => {
	const restId = req && req.params && req.params.restId
	res.render('bookWidget.ejs', { restId })
}

export const renderLiveres = (req, res) => {
	res.removeHeader('X-Frame-Options');
	res.sendFile(path.resolve('server/static/assets/liveres.html'));
}

export const renderLiveresComplete = (req, res) => {
	res.removeHeader('X-Frame-Options');
	res.sendFile(path.resolve('server/static/assets/liveres-complete.html'));
}
