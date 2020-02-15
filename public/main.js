const { AFRAME } = window;

window.addEventListener('load', getRestaurants);
window.addEventListener('load', getMarkers);

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
          url: _b.url
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
      Math.abs(businessPosition.longitude) -
      Math.abs(currentPosition.longitude);
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

function appendMarkers(restaurants) {
  const scene = document.querySelector('#scene');
  for (let i = 0; i < restaurants.length; i++) {
    const marker = createMarker(restaurants[i]);
    scene.appendChild(marker);
  }
}

function getMarkers() {
  window
    .fetch(`/restaurants`)
    .then(restaurants => restaurants.json())
    .then(restaurants => {
      appendMarkers(restaurants);
    })
    .catch(e => {
      console.log('ERROR Getting Restaurants ', e);
    });
}

AFRAME.registerComponent('populate', {
  init: function() {
    // get the scene element, which will be the parent for all others
    const scene = this.el.sceneEl;
    for (let i = 0; i < restuarants.length; i++) {
      let marker = createMarker(restuarants[i]);
      scene.appendChild(marker);
    }
  }
});

const createMarker = restaurant => {
  let marker = document.createElement('a-marker');
  marker.setAttribute('type', 'barcode');
  marker.setAttribute('value', restaurant.barcodeId);
  marker.setAttribute('log', 'Marker Created!');
  marker.setAttribute('smooth', 'true');
  marker.setAttribute('emitEvents', 'true');
  marker.addEventListener('markerFound', function(ev) {
    console.log('MARKER FOUD WITH EV ', ev);
    const cameraPos = document
      .getElementById('scene')
      .camera.getWorldDirection();
    const markerPos = marker.getAttribute('position');
    marker.setAttribute('position', {
      x: cameraPos.x,
      y: cameraPos.y,
      z: markerPos.z
    });
  });
  let menu = document.createElement('a-image');
  menu.setAttribute('src', restaurant.imageUrl);
  menu.setAttribute('rotation', { x: -90, y: 0, z: 0 });
  menu.setAttribute('position', { x: 0, y: 0, z: -1.5 });
  marker.appendChild(menu);
  return marker;
};

const createMenuImage = restaurant => {
  let menu = document.createElement('a-image');
  menu.setAttribute('src', restaurant.imageUrl);
  menu.setAttribute('rotation', { x: -90, y: 0, z: 0 });
  menu.setAttribute('position', { x: 0, y: 0, z: -1.5 });
  return menu;
};

const createLink = restuarant => {
  let link = document.createElement('a-link');
  link.setAttribute('href', restuarant.url);
  link.setAttribute('position', { x: 0, y: 0, z: -0.5 });
  link.setAttribute('rotation', { x: -90, y: 0, z: 0 });
  link.setAttribute('scale', { x: 0.25, y: 0.25, z: 0.25 });
  return link;
};

const createContent = restaurant => {
  let content = document.createElement('a-box');
  content.setAttribute('color', 'blue');
  content.setAttribute('position', { x: 0, y: 0.5, z: 0 });
  content.setAttribute('rotation', { x: 0, y: 45, z: 45 });
  return content;
};

const createYelpReviewItem = yelpData => {
  const el = document.createElement('a-text');
  el.setAttribute('value', yelpData.rating);
  el.setAttribute('scale', { x: 1.5, y: 1.5, z: 1.5 });
  el.setAttribute('position', { x: 0, y: 0, z: 0 });
  return el;
};

AFRAME.registerComponent('log', {
  schema: { type: 'string' },
  init: function() {
    const stringToLog = this.data;
    console.log(this.el.tagName, ' was initialized with message ', stringToLog);
  }
});

AFRAME.registerComponent('add-content', {
  schema: {
    restaurantId: { type: 'number', default: 0 }
  },
  init: function() {
    const menu = createMenuImage(restaurant);
    const link = createLink(restaurant);
    getYelpData(restaurant)
      .then(yelpData => {
        this.el.appendChild(createYelpReviewItem(yelpData));
      })
      .catch(e => {
        console.log(e);
      });
    this.el.appendChild(menu);
    this.el.appendChild(link);
  }
});

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
