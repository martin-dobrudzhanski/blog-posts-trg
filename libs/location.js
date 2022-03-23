export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    function success (position) {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      resolve(coords)
    }
    function error (err) {
      console.log(err)
      reject(err)
    }
    if (navigator && navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
      navigator.geolocation.getCurrentPosition(success, error, options)
    } else {
      reject()
    }
  })
}
