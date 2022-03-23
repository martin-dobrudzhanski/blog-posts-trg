const rp = require('request-promise');

export const get = (req, res) => {
  const address = req && req.params && req.params.address;
  rp({
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      key: 'AIzaSyBpmb8tTzE16cFd_YIVVx5-2IfDGSDb9fs',
      address: address
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    console.log(err);
  });

}
