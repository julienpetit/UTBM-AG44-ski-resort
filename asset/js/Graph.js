
/**
 * Graph Class
 */
function Graph() {
  var self = this;

  this.points = [];
  this.routes = [];

  this.addPoint = function( point ) {
    point.explored = false;
    this.points.push(point);
  };

  this.getPoint = function( params ) {
    var v = null;
    this.points.forEach(function( point ) {
      if( point[params['key']] == params['value'] )
        v = point;
    });
    return v;
  };

  this.addRoute = function( route ) {
    route.computeDistance();
    route.computeTime();
    route.discovered = false;
    this.routes.push(route);
  };

  this.getDirectDistanceBetweenTwoPoints = function( startingPoint, arrivalPoint ) {
    var distance = Number.POSITIVE_INFINITY;

    if( startingPoint == arrivalPoint )
      distance = 0;
    else {
      this.routes.forEach(function ( route ) {
        if((route.startingPoint == startingPoint && route.arrivalPoint == arrivalPoint) || (route.startingPoint == arrivalPoint && route.arrivalPoint == startingPoint)) {
          distance = route.distance;
        }
      });
    }
    return distance;
  };

  this.getAdjacentRoutesOfPoint = function( point ) {
    var routesListe = [];
    this.routes.forEach( function( route ) {
      if(route.startingPoint == point)
        routesListe.push(route);
    });
    return routesListe;
  };

  this.getAdjacentFrontBackRoutesOfPoint = function( point ) {
    var routesListe = [];
    this.routes.forEach( function( route ) {
      if(route.startingPoint == point || route.arrivalPoint == point )
        routesListe.push(route);
    });
    return routesListe;
  };


  this.getRouteWithPointsAndWeight = function(startingPoint, arrivalPoint, weight) {
    this.routes.forEach( function( route ) {
      if(route.startingPoint.number == startingPoint.number && route.arrivalPoint.number == arrivalPoint.number && route.time == weight) {
        return route;
      }
        
    });
    return null;
  };

  this.resetDFS = function() {
    this.routes.forEach( function( route ) {
      route.explored = false;
    });
    this.points.forEach( function( point ) {
      point.explored = false;
    });

  }
}


Graph.createGraphWithConstraints = function( graph, forbiddenRoads) {
  if(forbiddenRoads.length == 0)
    return graph;
  else {
    var G = new Graph();
    graph.points.forEach(function(point){
      G.addPoint(point);
    });
    graph.routes.forEach(function(route){
      if(!arrayContains(forbiddenRoads, route)) {
        G.addRoute(route);
      }
    }); 

    return G;
  }
}


Graph.generateGraphPath = function( graph, path ) {
  var G = new Graph();
  var totalTime = 0;
  graph.points.forEach(function(point){
    if(path.some(function(e){ return e == point.number.toString(); }))
      G.addPoint(point);
  });


  for( var i = 0; i < path.length - 1; i++) {
    var startingPointNumber = path[i];
    var arrivalPointNumber = path[i+1];

    var routesSameDirection = new Array();

    graph.routes.forEach(function(route) {
      if(route.startingPoint.number.toString() == startingPointNumber && route.arrivalPoint.number.toString() == arrivalPointNumber)
        routesSameDirection.push(route);
    });

    if(routesSameDirection.length > 0) {
      var routeMin = routesSameDirection[0];
      routesSameDirection.forEach(function(r) {
        if(routeMin.time > r.time)
          routeMin = r;
      });

      G.addRoute(routeMin);
      totalTime += routeMin.time;
    }
      
  }



  return [G, totalTime];

}


// Graph.generateGraphPath = function( graph, path ) {
//   var G = new Graph();

//   graph.points.forEach(function(point){
//     if(path.some(function(e){ return e == point.number.toString(); }))
//       G.addPoint(point);
//   });

//   graph.routes.forEach(function(route){
//     for( var i = 0; i < path.length - 1; i++) {
//       var startingPointNumber = path[i];
//       var arrivalPointNumber = path[i+1];

//       if(route.startingPoint.number.toString() == startingPointNumber && route.arrivalPoint.number.toString() == arrivalPointNumber)
//         G.addRoute(route);
//     }
//   }); 

//   return G;

// }
// Graph.createGraphWithConstraints = function( graph, forbiddenRoads, startingPoint, arrivalPoint) {
//   if(forbiddenRoads.length == 0)
//     return graph;
//   else {
//     var G = new Graph();
//     graph.points.forEach(function(point){
//       G.addPoint(point);
//     });
//     graph.routes.forEach(function(route){

//       var routesSameDirection = new Array();

//       graph.routes.forEach(function(anotherRoute){
//         if(anotherRoute.startingPoint.number == route.startingPoint.number && anotherRoute.arrivalPoint.number == route.arrivalPoint.number)
//           routesSameDirection.push(anotherRoute);
//       });

//       if(forbiddenRoads.some(function(e){ return e == route; })) {
//         var routeWithMinWeight = routesSameDirection[0];
//         routesSameDirection.forEach(function(r){
//           if(routeWithMinWeight.time > r.time)
//             routeWithMinWeight = r;
//         });
//         G.addRoute(r);
//       }
        
//     }); 

//     return G;
//   }
// }

Graph.getGraphFromFile = function( filePath ) {

  var graph = new Graph();

  var data = $.get(filePath);

  var lines = data.responseText.split(/\r\n|\n/);

  var nbVertices = parseInt(lines[0], 10);
  var nbRoutes = parseInt(lines[nbVertices + 1], 10);

  var i;
  var line;
  // Parcours des points
  for( i = 1; i <= nbVertices; i++) {
    line = lines[i].split('\t');

    var point = new Point();
    point.number = parseInt(line[0], 10);
    point.name = line[1];
    point.altitude = parseInt(line[2], 10);

    graph.addPoint( point );
  }

  // Parcours des routes
  for( i = nbVertices + 2; i < nbVertices + 2 + nbRoutes; i++) {
    line = lines[i].split('\t');

    var route = new Route();
    route.number = parseInt(line[0], 10);
    route.name = line[1];
    route.type = line[2];
    route.startingPoint = graph.getPoint( { 'key' : 'number', 'value' : parseInt(line[3], 10)});
    route.arrivalPoint = graph.getPoint( { 'key' : 'number', 'value' : parseInt(line[4], 10)});

    graph.addRoute( route );
  }
  return graph;
}
