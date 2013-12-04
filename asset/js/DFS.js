

function DFS( graph ) {

  var self = this;

  this.graph = graph;

  this.reachableRoads = new Array();


  this.compute = function( point ) {
    var me = this;
    this.graph.getAdjacentRoutesOfPoint(point).forEach(function(route) {
      if(!route.explored) {
        var w = route.arrivalPoint;
        if(!w.explored){
          route.explored = true;
          me.compute(w);
        }
      }
    });
    point.explored = true;
  };

  this.getReachablePoints = function( point ) {
    var me = this;
    if(this.reachableRoads.length == 0)
      this.compute(point);
    // console.log(this.graph.points);
    this.graph.points.forEach(function(p){
      // console.log(p.explored);
      if(p.explored === true)
        me.reachableRoads.push(p);
    });
  
    return this.reachableRoads;
  }

}
