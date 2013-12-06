
$.ajaxSetup({async: false});
$('.tip').tooltip({})

var defaults = {
  nodeColor: '#A72F43',
  opacity: 1,
  roadWidth: 1
};

var types = JSON.parse($.get('resources/types.json').responseText);
G = Graph.getGraphFromFile('resources/dataski.txt');

// var f = new FloydWarshall(G);
// F = f.compute();

// var floyd = new FloydWarshallPathReconstruction(G);
// FF = floyd.M;

// console.log(FF);

// console.log(floyd.path(2, 4));


function Controler(graph) {
  this.contentSelection = $('#selection');
  this.contentStartingRoad = $('#content-starting-road');
  this.contentArrivalRoad = $('#content-arrival-road');
  this.contentForbiddenList = $('#forbiddenlist');
  this.contentSelectAllFromTypeList = $('#selectAllFromType');
  this.contentReachablePoints = '.reachablePoints';

  this.contentAlert = $('#alert-content');

  this.buttonAddToForbiddenList = "#addToForbiddenList";
  this.buttonDefineAsStartingPoint = "#defineRoadAsStartingPoint";
  this.buttonDefineAsArrivalPoint = "#defineRoadAsArrivalPoint";
  this.buttonComputeShortestPath = "#buttonComputeShortestPath";
  this.buttonAddTypeToForbiddenList = "#selectAllFromType li a";
  this.buttonClearAllForbiddenRoads = "#clearAllForbiddenRoads";
  this.buttonShowReachablePoints = "#showReachablePoints";

  this.contentLoading = $(".loading");

  this.selectedObject = null;

  /**
   * Array of 2 Points
   * Starting and arrival
   * @type {Array}
   */
  this.selectedPoints = [null, null];

  /**
   * Graph object
   * @type {[Graph]}
   */
  this.graph = graph;

  this.currentGraph;

  /**
   * Array of forbidden roads
   * @type {Array}
   */
  this.forbiddenRoads = [];

  /**
   * Init function
   * @return {[type]} [description]
   */
  this.init = function() {
    config.elements.nodes = [];
    config.elements.edges = [];

    this.graph.points.forEach(function(point){
      config.elements.nodes.push({ data: { 
        id: point.number.toString(), 
        object: point, 
        name: point.name, 
        weight: point.time, 
        faveColor: defaults.nodeColor,
        faveShape: 'ellipse',
        opacity: defaults.opacity
         }
      });
    });
    this.graph.routes.forEach(function(route){
      config.elements.edges.push({ data: { 
        source: route.startingPoint.number.toString(), 
        target: route.arrivalPoint.number.toString(), 
        opacity: 1, 
        object: route, 
        strength: 20, 
        color: route.color.value, 
        line_color: "#FFF", 
        width: defaults.roadWidth,
        label: route.type + " - " + route.name 
        }
      });
    });

    this.createListSelectAllFromTypeList();

    this.initEvents();
    this.initFlyEvents();
  };

  this.setLoading = function(loading) {

    console.log('set Loading : ' + loading);
    if(loading == true)
      this.contentLoading.fadeIn();
    else
      this.contentLoading.fadeOut();
  };

  this.createListSelectAllFromTypeList = function() {
    for(var i in types) {
      this.contentSelectAllFromTypeList.append("<li><a href='' data-type='" + i + "'>" + types[i].legend + "</a></li>");
    };
  };

  this.clearForbiddenRoads = function() {
    this.forbiddenRoads = [];
  };


  this.initFlyEvents = function() {
     /**
     * Click button define as starting point
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $(this.buttonDefineAsStartingPoint).on('click', function(e){
      me.contentStartingRoad.html($("script#template-selected-point").tmpl(me.selectedObject));
      me.selectedPoints[0] = me.selectedObject;
    });

    /**
     * Click button define as arrival point
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $(this.buttonDefineAsArrivalPoint).on('click', function(e){
      me.contentArrivalRoad.html($("script#template-selected-point").tmpl(me.selectedObject));
      me.selectedPoints[1] = me.selectedObject;
    });

    /**
     * Click button show reachable points
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $(this.buttonShowReachablePoints).on('click', function(e){
      console.log("reachables points");

      me.currentGraph = Graph.createGraphWithConstraints(me.graph, me.forbiddenRoads);
      me.currentGraph.resetDFS();

      var dfs = new DFS(me.currentGraph);
      var reachablePoints = dfs.getReachablePoints(me.selectedObject);

      console.log("REACHABLE FROM " + me.selectedObject.name);
      reachablePoints.forEach(function(point){
        console.log(point.name);
      });

      me.restoreDefaultColors();
      me.drawReachablePoints(reachablePoints, me.selectedObject);
      me.populateReachablePoints(reachablePoints, me.selectedObject);
    });

    /**
     * Click button add to forbidden list
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $(this.buttonAddToForbiddenList).on('click', function(e){
      me.addToForbiddenList(me.selectedObject);
      me.drawList();
    });
  };
  this.initEvents = function() {
    var me = this;


    /**
     * Click on button clear all forbidden roads
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    $(this.buttonClearAllForbiddenRoads).on('click', function(e){
      me.clearForbiddenRoads();

      $.each(me.contentSelectAllFromTypeList.find('.active'), function(i, e){
        console.log(e);
        $(e).removeClass("active");
      });
      // .find('.active', function(e){
        // console.log(e);
      // });
      me.drawList();
    });


    $(this.buttonAddTypeToForbiddenList).on('click', function(e){
      e.preventDefault();
      console.log('Event : click item piste toggle');


      var target = $(e.currentTarget);

      target.parent().toggleClass("active");


      var type = target.data('type');
      me.graph.routes.forEach(function(route){
        if(route.type == type) {
          if(target.parent().hasClass("active"))
            me.addToForbiddenList(route);
          else
            me.removeFromForbiddenList(route);
        }
      });

      me.drawList();
    });
  };

  this.addToForbiddenList = function( route ) {
    var inArray = false;
    this.forbiddenRoads.forEach(function(r){
      if(route.number == r.number) {
        inArray = true;
      }
    })
    
    if(inArray == false)
      this.forbiddenRoads.push(route);
  };

  this.removeFromForbiddenList = function( route ) {
    var index = this.forbiddenRoads.indexOf(route);
    if (index > -1) {
      this.forbiddenRoads.splice(index, 1);
    }
  };

  this.drawList = function() {
    var me = this;
    this.contentForbiddenList.html("");
    this.forbiddenRoads.forEach(function(road){
      me.contentForbiddenList.append($("#template-route-list").tmpl(road));
    });
  };

  this.drawPath = function(graph, path) {
    for ( var i = 0; i < cy.nodes().length; i++) {
      if(!arrayContains(path, cy.nodes()[i].data("object").number.toString())) {
        cy.nodes()[i].data("opacity", 0.3);
      } else {
        cy.nodes()[i].data("opacity", 1);
      }
    }

    for ( var i = 0; i < cy.edges().length; i++) {

      cy.edges()[i].data("opacity", 0.3);
      // cy.edges()[i].data("color", cy.edges()[i].data("object").color.value);
      // cy.edges()[i].data("line_color", "#FFF");
      // cy.edges()[i].data("opacity", 1);
      graph.routes.forEach(function(route){
        if(cy.edges()[i].data('object').number == route.number) {
          cy.edges()[i].data("line_color", "#FFF");
          cy.edges()[i].data("opacity", 1);
          cy.edges()[i].data("width", 3);
        }
      }); 
    }

  };

  this.drawSolution = function(graph, path, totalTime) {
    var me = this;

    console.log('total time : ' + totalTime + "min");
    var contentSolution = $('<div id="solution" class="text-center"><a class="close" href="#" aria-hidden="true">&times;</a><ul></ul></div>');
    contentSolution.find('.close').on('click', function(e) { $(e.currentTarget).parent().fadeOut(1000, function() { $(e.currentTarget).parent().remove(); });  });
    contentSolution.find('ul').html("");

    for( var i = 0; i < path.length - 1; i++) {
      var startingPointNumber = parseInt(path[i]);
      var arrivalPointNumber = parseInt(path[i+1]);

      graph.routes.forEach(function(route){
        if(route.startingPoint.number == startingPointNumber && route.arrivalPoint.number == arrivalPointNumber) {
          contentSolution.find('ul').append($('#template-solution-point').tmpl(route.startingPoint));
          contentSolution.find('ul').append($('#template-solution-route').tmpl(route));
        }

      });
    }
    contentSolution.find('ul').append($('#template-solution-point').tmpl(graph.getPoint({ key: 'number', value: parseInt(path[path.length - 1])})));

    contentSolution.find('ul').append('<li class="totalTime">Total time : ' + totalTime + 'min</li>');

    $('body').append(contentSolution);
    contentSolution.fadeIn();
  };

  this.populateReachablePoints = function( reachablePoints, startingPoint ) {
    $(this.contentReachablePoints).html("");
    var me = this;
    reachablePoints.forEach(function(point) {
      $(me.contentReachablePoints).append($("#template-point-list").tmpl(point));
    });
  };

  this.drawReachablePoints = function( reachablePoints, startingPoint ) {
    for ( var i = 0; i < cy.nodes().length; i++) {
      var reachable = false;
      reachablePoints.forEach(function(point) {
        if(cy.nodes()[i].data("object").number == point.number)
          reachable = true;
      });

      if(cy.nodes()[i].data("object").number == startingPoint.number)
        reachable = true;

      if(reachable) {
        cy.nodes()[i].data("opacity", 1);
      } else {
        cy.nodes()[i].data("opacity", 0.1);
      }
    }

    for ( var i = 0; i < cy.edges().length; i++) {
      cy.edges()[i].data("opacity", 0.1);
    };
  }

  this.restoreDefaultColors = function() {
    for ( var i = 0; i < cy.nodes().length; i++) {
      cy.nodes()[i].data("faveColor", defaults.nodeColor);
    }

    for ( var i = 0; i < cy.edges().length; i++) {
      cy.edges()[i].data("color", cy.edges()[i].data("object").color.value);
      cy.edges()[i].data("line_color", "#FFF");
      cy.edges()[i].data("opacity", 1);
      cy.edges()[i].data("width", defaults.roadWidth);
    }
  };

  this.updateColors = function() {
    this.restoreDefaultColors();

    for ( var i = 0; i < cy.edges().length; i++) {
      if(arrayContains(this.forbiddenRoads, cy.edges()[i].data("object"))) {
        cy.edges()[i].data("color", "green");
        // cy.edges()[i].data("line_color", "green");
        cy.edges()[i].data("opacity", 0.1);
      }
    }
  };

  this.init();

  var me = this;
  $(this.buttonComputeShortestPath).on('click', function(e){
    console.log('Event : compute shortest path');
    
    // me.setLoading(true);

    if(me.selectedPoints[0] == null || me.selectedPoints[1] == null) {
      me.contentAlert.html($('#template-alert').tmpl({ title : "Error", message: "You must select a starting point and an arrival point to compute the shortest path algorithm"}));
    } else if(me.selectedPoints[0] == me.selectedPoints[1]) {
      me.contentAlert.html($('#template-alert').tmpl({ title : "Error", message: "You can't select the same starting point and an arrival point to compute the shortest path algorithm"})); 
    } else {

      me.currentGraph = Graph.createGraphWithConstraints(me.graph, me.forbiddenRoads);

      var floyd = new FloydWarshallPathReconstruction(me.currentGraph);

      var path = floyd.path(me.selectedPoints[0].number, me.selectedPoints[1].number);
      if(path == "no path") {
        me.contentAlert.html($('#template-alert').tmpl({ title : "Infos", message: "No path exist between " + me.selectedPoints[0].name + " and " + me.selectedPoints[1].name}));    
        return;
      }
      else {
        path = (me.selectedPoints[0].number + path + me.selectedPoints[1].number).split(' ');
      }
      console.log(path);

      me.restoreDefaultColors();

      var g = Graph.generateGraphPath(me.currentGraph, path);
      me.drawPath(g[0], path);
      me.drawSolution(g[0], path, g[1]);

    } 

    // me.setLoading(false);
  });
}


controler = new Controler(G);
// controler.init();


initEvents = function(){
  cy.nodes().bind("select", function(e){

    controler.contentSelection.html($("script#template-point").tmpl(e.cyTarget.data("object")));

    $('.tip').tooltip({});
    controler.selectedObject = e.cyTarget.data("object");
    controler.initFlyEvents();
  });

  cy.edges().bind("select", function(e){

    controler.contentSelection.html($("script#template-route").tmpl(e.cyTarget.data("object")));

    $('.tip').tooltip({});
    controler.selectedObject = e.cyTarget.data("object");
    controler.initFlyEvents();
  });
};


this.refresh



$(function(){
  // $('#tabs').click(someCallbackFunction1)
  // $('#tabs .tab').click(someCallbackFunction2)
  // $('#tabs .delete click').click(someCallbackFunction3)
});


$('#cy').cytoscape(config);

