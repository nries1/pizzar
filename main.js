const { AFRAME } = window;

AFRAME.registerComponent('log', {
  schema: { type: 'string' },
  init: function() {
    const stringToLog = this.data;
    console.log(this.el.tagName, ' was initialized with message ', stringToLog);
    const element = this.el;
    element.addEventListener('click', function() {
      console.log('You clicked on ', element);
    });
  }
});

AFRAME.registerComponent('scale-on-mouseenter', {
  schema: {
    to: { default: '1.5 1.5 1.5', type: 'vec3' }
  },
  init: function() {
    const data = this.data;
    const el = this.el;
    this.el.addEventListener('mouseenter', function() {
      el.object3D.scale.copy(data.to);
    });
  }
});

AFRAME.registerComponent('scale-on-mouseleave', {
  schema: {
    to: { default: '1 1 1', type: 'vec3' }
  },
  init: function() {
    const data = this.data;
    const el = this.el;
    this.el.addEventListener('mouseleave', function() {
      el.object3D.scale.copy(data.to);
    });
  }
});

AFRAME.registerComponent('cursor-listener', {
  init: function() {
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function(evt) {
      lastIndex = (lastIndex + 1) % COLORS.length;
      this.setAttribute('material', 'color', COLORS[lastIndex]);
      console.log('I was clicked at: ', evt.detail.intersection.point);
    });
  }
});
