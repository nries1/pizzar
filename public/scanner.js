const { AFRAME } = window;

window.addEventListener('load', getMarkers);

function appendMarkers(restaurants) {
  const camera = document.querySelector('#camera');
  for (let i = 0; i < restaurants.length; i++) {
    const marker = createMarker(restaurants[i]);
    camera.appendChild(marker);
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

const createMarker = restaurant => {
  let marker = document.createElement('a-marker');
  marker.setAttribute('type', 'barcode');
  marker.setAttribute('value', restaurant.barcodeId);
  marker.setAttribute('log', 'Marker Created!');
  marker.setAttribute('smooth', 'true');
  marker.setAttribute('emitEvents', 'true');
  let menu = document.createElement('a-image');
  menu.setAttribute('src', restaurant.imageUrl);
  menu.setAttribute('crossorigin', 'anonymous');
  menu.setAttribute('rotation', { x: -90, y: 0, z: 0 });
  menu.setAttribute('position', { x: 0, y: -2, z: 0 });
  menu.setAttribute('scale', { x: 1.25, y: 1.25, z: 1.25 });
  marker.appendChild(menu);
  return marker;
};

const createMenuImage = restaurant => {
  let menu = document.createElement('a-image');
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
