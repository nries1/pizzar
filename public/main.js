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
      'https://marketplace.canva.com/EADaocwR0b0/1/0/618w/canva-rectangle-patterned-breakfast-menu-nGrl8ktrSjs.jpg'
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
      'https://marketplace.canva.com/EADaocwR0b0/1/0/618w/canva-rectangle-patterned-breakfast-menu-nGrl8ktrSjs.jpg'
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
      'https://marketplace.canva.com/EADaocwR0b0/1/0/618w/canva-rectangle-patterned-breakfast-menu-nGrl8ktrSjs.jpg'
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
  return marker;
};

const createMenuImage = restaurant => {
  let menu = document.createElement('a-image');
  menu.setAttribute('src', restaurant.imageUrl);
  menu.setAttribute('rotation', { x: 45, y: 90, z: 0 });
  menu.setAttribute('position', { x: 0, y: 1, z: -3 });
  return menu;
};

const createContent = restaurant => {
  let content = document.createElement('a-box');
  content.setAttribute('color', 'blue');
  content.setAttribute('position', { x: 0, y: 0.5, z: 0 });
  content.setAttribute('rotation', { x: 0, y: 45, z: 45 });
  return content;
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
    const menu = createMenuImage(
      restuarants.filter(r => r.id === this.data)[0]
    );
    console.log('Attempting to append ', menu, ' to ', this.el);
    this.el.appendChild(menu);
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
