config = {
  layout: {
    name: 'arbor',
    liveUpdate: false, // whether to show the layout as it's running
    stop: function() {
      $('.loading-area').remove();
    }, // callback on layoutready 
    // stop: undefined, // callback on layoutstop
    maxSimulationTime: 1000, // max length in ms to run the layout
    // fit: true, // reset viewport to fit default simulationBounds
    // padding: [ 50, 50, 50, 50 ], // top, right, bottom, left
    // simulationBounds: undefined, // [x1, y1, x2, y2]; [0, 0, width, height] by default
    // ungrabifyWhileSimulating: true, // so you can't drag nodes during layout

    // // forces used by arbor (use arbor default on undefined)
    // repulsion: undefined,
    // stiffness: undefined,
    // friction: undefined,
    // gravity: true,
    // fps: undefined,
    // precision: undefined,

    // // static numbers or functions that dynamically return what these
    // // values should be for each element
    // nodeMass: undefined, 
    // edgeLength: undefined,

    // stepSize: 1, // size of timestep in simulation

    // // function that returns true if the system is stable to indicate
    // // that the layout can be stopped
    // stableEnergy: function( energy ){
    //     var e = energy; 
    //     return (e.max <= 0.5) || (e.mean <= 0.3);
    // }
  },
  
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'shape': 'data(faveShape)',
        // 'width': '70',
        // 'height': '70',
        'content': 'data(object.name)',
        'text-valign': 'center',
        'text-outline-width': 2,
        'text-outline-color': 'data(faveColor)',
        'background-color': 'data(faveColor)',
        'color': '#fff',
        'opacity' : 'data(opacity)',
        'border-width' : '1px',
        'border-color' : "#990000",
        'tooltipText': "<b></b>: ${color}"
      })
    .selector(':selected')
      .css({
        'border-width': 3,
        'border-color': '#333'
      })
    .selector('edge')
      .css({
        'content' : 'data(label)',
        'color' : 'data(color)',
        // 'color' : '#DDD',
        'font-size': '7px',
        'width': 'data(width)',
        'text-outline-color': '#fff',
        'target-arrow-shape': 'triangle',
        // 'line-color': 'data(line_color)',
        'line-color': 'data(line_color)',
        'opacity' : 'data(opacity)',
        'source-arrow-color': '#FFF',
        'target-arrow-color': '#FFF'
      })
    .selector('edge.questionable')
      .css({
        'line-style': 'dotted',
        'target-arrow-shape': 'diamond'
      })
    .selector('.faded')
      .css({
        'opacity': 0.25,
        'text-opacity': 0
      }),
  
  elements: {

  },
  
  ready: function(){
    window.cy = this;
    initEvents();
  },


}

arrayContains = function( array, value ) {
  var contains = false;
  array.forEach(function(e) {
    if(value == e) 
      contains = true;
  });
  return contains ? true : false;;
};