

function distanceBetweenPoints(p1, p2, seperator, name) {  

  const lat1 = p1[name.x]
  const lon1 = p1[name.y]

  const lat2 = p2[seperator][name.x]
  const lon2 = p2[seperator][name.y]

  var R = 6371; 
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return calcMilesFromKilometers(d);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

  function calcMilesFromKilometers(km) {
    return km * 0.621371
  }

function sortByDistance (origin, points, opts) {
  opts = opts || {}
  if (!origin || !points) {
    return new Error('An origin and array points must be provided')
  }

  const names = {
    y: opts.yName || 'y',
    x: opts.xName || 'x'
  }

  const newPoints = JSON.parse(JSON.stringify(points))

  newPoints.sort(function (a, b) {
    a.distance = distanceBetweenPoints(origin, a, opts.seperator, names)
    b.distance = distanceBetweenPoints(origin, b, opts.seperator, names)

    return a.distance - b.distance
  })

  return newPoints
}

export default sortByDistance