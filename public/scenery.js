const { AFRAME } = window;

window.addEventListener('load', getRestaurants);

function getRestaurants() {
  window.navigator.geolocation.getCurrentPosition(queryYelp);
}

function queryYelp(loc) {
  const {
    coords: { latitude, longitude }
  } = loc;
  window
    .fetch(`/yelp/search/lat/${latitude}/lng/${longitude}`)
    .then(data => data.json())
    .then(data => {
      window.localStorage.businesses = JSON.stringify(
        data.jsonBody.businesses.map(_b => ({
          name: _b.name,
          distance: _b.distance,
          latitude: _b.coordinates.latitude,
          longitude: _b.coordinates.longitude,
          url: _b.url,
          imageUrl: _b.imageUrl
        }))
      );
      appendBusinesses({ latitude, longitude });
    })
    .catch(e => {
      console.error(e);
    });
}

function renderBusinessesByLocation() {
  window.navigator.geolocation.watchPosition(appendBusinesses);
}

function getBusinessPosition(currentPosition, businessPosition) {
  let z = 0;
  if (businessPosition.latitude <= currentPosition.latitude) {
    z = Math.max(Math.floor(businessPosition.distance / 20), 6);
  } else {
    z = Math.min(0 - Math.floor(businessPosition.distance / 20), -6);
  }
  if (z > 0 && z < 6) z = 6;
  let x = 0;
  if (businessPosition.longitude <= currentPosition.longitude) {
    x =
      0 -
      (Math.abs(businessPosition.longitude) -
        Math.abs(currentPosition.longitude));
  } else {
    x =
      Math.abs(businessPosition.longitude) -
      Math.abs(currentPosition.longitude);
  }
  return { x, y: 1.25, z };
}

function appendBusinesses(userLocation) {
  console.log('NEW USER LOCATION READ');
  const scene = document.querySelector('#scene');
  const businesses = JSON.parse(window.localStorage.businesses);
  for (let i = 0; i < businesses.length; i++) {
    const business = document.createElement('a-link');
    business.setAttribute('rotation', { x: 0, y: 0, z: 0 });
    business.setAttribute('href', businesses[i].url);
    business.setAttribute('scale', { x: 1, y: 1.25, z: 1 });
    business.setAttribute('title', businesses[i].name);
    business.setAttribute(
      'position',
      getBusinessPosition(userLocation, {
        latitude: businesses[i].latitude,
        longitude: businesses[i].longitude,
        distance: businesses[i].distance
      })
    );
    scene.appendChild(business);
  }
  document.querySelector('#loading').setAttribute('visible', 'false');
}

const createLink = restuarant => {
  let link = document.createElement('a-link');
  link.setAttribute('href', restuarant.url);
  link.setAttribute('position', { x: 0, y: 0, z: -0.5 });
  link.setAttribute('rotation', { x: -90, y: 0, z: 0 });
  link.setAttribute('scale', { x: 0.25, y: 0.25, z: 0.25 });
  return link;
};
