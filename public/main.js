const restuarants = [
  {
    name: `Joe's`,
    id: 1,
    menu: [
      { itemName: 'Cheese Pizza', price: '$2.99' },
      { itemName: 'Pepperoni Pizza', price: '$3.99' },
      { itemName: 'Garlic Knots', price: '$1.99' }
    ],
    reviews: [
      { stars: 5, review: 'Great Pizza!' },
      { stars: 1, review: 'Overrated tourist trap!' },
      { stars: 2, review: 'So overhyped' }
    ],
    barcodeId: 11,
    imageUrl:
      'https://marketplace.canva.com/EADaocwR0b0/1/0/618w/canva-rectangle-patterned-breakfast-menu-nGrl8ktrSjs.jpg',
    url: 'https://www.google.com/',
    yelpId: 'WavvLdfdP6g8aZTtbBQHTw'
  },
  {
    name: `Big Nick's`,
    id: 2,
    menu: [
      { itemName: 'Cheese Pizza', price: '$2.99' },
      { itemName: 'Pepperoni Pizza', price: '$3.99' },
      { itemName: 'Garlic Knots', price: '$1.99' }
    ],
    reviews: [
      { stars: 5, review: 'Great Pizza!' },
      { stars: 1, review: 'Overrated tourist trap!' },
      { stars: 2, review: 'So overhyped' }
    ],
    barcodeId: 12,
    imageUrl:
      'https://marketplace.canva.com/EADaocwR0b0/1/0/618w/canva-rectangle-patterned-breakfast-menu-nGrl8ktrSjs.jpg',
    url: 'https://www.google.com/',
    yelpId: 'WavvLdfdP6g8aZTtbBQHTw'
  },
  {
    name: `Uncle Luigi's`,
    id: 3,
    menu: [
      { itemName: 'Spumoni', price: '$4.99' },
      { itemName: 'Gelato', price: '$5.99' },
      { itemName: 'Tooty Fruity', price: '$3.99' }
    ],
    reviews: [
      { stars: 5, review: 'Great Pizza!' },
      { stars: 1, review: 'Overrated tourist trap!' },
      { stars: 2, review: 'So overhyped' }
    ],
    barcodeId: 13,
    imageUrl:
      'https://marketplace.canva.com/EADaocwR0b0/1/0/618w/canva-rectangle-patterned-breakfast-menu-nGrl8ktrSjs.jpg',
    url: 'https://www.google.com/',
    yelpId: 'WavvLdfdP6g8aZTtbBQHTw'
  }
];

const { AFRAME } = window;

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
  marker.setAttribute('add-content', restaurant.id);
  marker.setAttribute('smooth', 'true');
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

const getYelpData = async restaurant => {
  const data = window.fetch(`https://api.yelp.com/v3/businesses/${id}`);
  console.log('DATA FROM YELP = ', data);
  return data;
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
    restaurantId: { type: 'number', default: null }
  },
  init: function() {
    const restaurant = restuarants.filter(r => r.id === this.data)[0];
    const menu = createMenuImage(restaurant);
    const link = createLink(restaurant);
    getYelpData(restaurant)
      .then(data => {
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
