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
      return { latitude, longitude };
    })
    .then(latLong => {
      new FULLTILT.getDeviceOrientation({ type: 'world' })
        .then(controller => {
          const currentOrientation = controller.getScreenAdjustedEuler();
          const compassHeading = 360 - currentOrientation.alpha;
          appendBusinesses({ ...latLong, compassHeading });
        })
        .catch(message => {
          appendBusinesses(latLong);
          window.alert(
            'Your device does not allow PizzAR to view compass orientation. We cannot guarantee directional accuracy with respect to your current position. ',
            message
          );
          document
            .getElementById('bearing')
            .setAttribute('text-geometry', 'value: Compass N/A');
          return;
        });
    })
    .catch(e => {
      console.error(e);
    });
}

function renderBusinessesByLocation() {
  window.navigator.geolocation.watchPosition(appendBusinesses);
}

function getApproximateBusinessPosition(currentPosition, businessPosition) {
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

function getExactBusinessPosition(currentPosition, businessPosition) {
  let z = 0;
  //The business is south of the user
  if (businessPosition.latitude <= currentPosition.latitude) {
    //the user is facing south
    if (
      currentPosition.compassHeading < 270 &&
      currentPosition.compassHeading > 90
    ) {
      //render the business in front of the user
      z = Math.min(0 - Math.floor(businessPosition.distance / 20), -6);
    } else {
      //render the business behind the user
      z = Math.max(Math.floor(businessPosition.distance / 20), 6);
    }
  } // the business is north of the user
  else {
    //the user is facing north
    if (
      currentPosition.compassHeading > 270 &&
      currentPosition.compassHeading < 90
    ) {
      //rend the business in fron of the user
      z = Math.min(0 - Math.floor(businessPosition.distance / 20), -6);
    } else {
      z = Math.max(Math.floor(businessPosition.distance / 20), 6);
    }
  }
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
  const scene = document.querySelector('#scene');
  const businesses = JSON.parse(window.localStorage.businesses);
  for (let i = 0; i < businesses.length; i++) {
    const business = document.createElement('a-link');
    business.setAttribute('rotation', { x: 0, y: 0, z: 0 });
    business.setAttribute('href', businesses[i].url);
    business.setAttribute('scale', { x: 1, y: 1.25, z: 1 });
    business.setAttribute('title', businesses[i].name);
    const businessPos = userLocation.compassHeading
      ? getExactBusinessPosition(userLocation, {
          latitude: businesses[i].latitude,
          longitude: businesses[i].longitude,
          distance: businesses[i].distance
        })
      : getApproximateBusinessPosition(userLocation, {
          latitude: businesses[i].latitude,
          longitude: businesses[i].longitude,
          distance: businesses[i].distance
        });
    business.setAttribute('position', businessPos);
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

// AFRAME.registerComponent('scale-on-mouseenter', {
//   schema: {
//     to: { default: '1.5 1.5 1.5', type: 'vec3' }
//   },
//   init: function() {
//     const data = this.data;
//     const el = this.el;
//     this.el.addEventListener('mouseenter', function() {
//       el.object3D.scale.copy(data.to);
//     });
//   }
// });

// AFRAME.registerComponent('scale-on-mouseleave', {
//   schema: {
//     to: { default: '1 1 1', type: 'vec3' }
//   },
//   init: function() {
//     const data = this.data;
//     const el = this.el;
//     this.el.addEventListener('mouseleave', function() {
//       el.object3D.scale.copy(data.to);
//     });
//   }
// });

// AFRAME.registerComponent('cursor-listener', {
//   init: function() {
//     var lastIndex = -1;
//     var COLORS = ['red', 'green', 'blue'];
//     this.el.addEventListener('click', function(evt) {
//       lastIndex = (lastIndex + 1) % COLORS.length;
//       this.setAttribute('material', 'color', COLORS[lastIndex]);
//       console.log('I was clicked at: ', evt.detail.intersection.point);
//     });
//   }
// });
