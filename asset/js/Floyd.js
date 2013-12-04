

function FloydWarshall( graph ) {

  var self = this;

  this.graph = graph;

  this.initialize = function() {
    var M = {};

    for( var i in graph.points ) {
      M[graph.points[i].number] = {};
      for( var j in graph.points ) {
        M[graph.points[i].number][graph.points[j].number] = Number.POSITIVE_INFINITY;
      }
    }

    return M;
  };

  this.compute = function() {
    var M = this.initialize();

    for (var i in this.graph.points) {
      M[this.graph.points[i].number][this.graph.points[i].number] = 0;
    }
    for (var j in this.graph.routes) {
      M[this.graph.routes[j].startingPoint.number][this.graph.routes[j].arrivalPoint.number] = this.graph.routes[j].time;
    }

    for (var p in this.graph.points) {
      for (var q in this.graph.points) {
        for (var r in this.graph.points) {
          if(M[this.graph.points[q].number][this.graph.points[p].number] + M[this.graph.points[p].number][this.graph.points[r].number] < M[this.graph.points[q].number][this.graph.points[r].number])
            M[this.graph.points[q].number][this.graph.points[r].number] = M[this.graph.points[q].number][this.graph.points[p].number] + M[this.graph.points[p].number][this.graph.points[r].number];
        }
      }
    }

    return M;
  };

}


function FloydWarshallPathReconstruction( graph ) {

  var self = this;

  this.graph = graph;
  this.M = null;
  this.next = null;

  this.initialize = function( defaultValue ) {
    var M = {};

    for( var i in graph.points ) {
      M[graph.points[i].number] = {};
      for( var j in graph.points ) {
        M[graph.points[i].number][graph.points[j].number] = defaultValue;
      }
    }

    return M;
  };

  this.compute = function() {
    this.M = this.initialize(Number.POSITIVE_INFINITY);
    this.next = this.initialize(null);

    for (var i in this.graph.points) {
      this.M[this.graph.points[i].number][this.graph.points[i].number] = 0;
    }
    for (var j in this.graph.routes) {
      this.M[this.graph.routes[j].startingPoint.number][this.graph.routes[j].arrivalPoint.number] = this.graph.routes[j].time;
    }

    for (var p in this.graph.points) {
      for (var q in this.graph.points) {
        for (var r in this.graph.points) {
          if(this.M[this.graph.points[q].number][this.graph.points[p].number] + this.M[this.graph.points[p].number][this.graph.points[r].number] < this.M[this.graph.points[q].number][this.graph.points[r].number]) {

            this.M[this.graph.points[q].number][this.graph.points[r].number] = this.M[this.graph.points[q].number][this.graph.points[p].number] + this.M[this.graph.points[p].number][this.graph.points[r].number];
            this.next[this.graph.points[q].number][this.graph.points[r].number] = this.graph.points[p].number;

          }
        }
      }
    }
  };

  this.path = function(i, j) {
    if(this.M[i][j] == Number.POSITIVE_INFINITY)
      return "no path";
    var temp = this.next[i][j];
    if(temp == null)
      return " ";
    else
      return this.path(i, temp) + temp + this.path(temp, j);
  };

  this.compute();

}