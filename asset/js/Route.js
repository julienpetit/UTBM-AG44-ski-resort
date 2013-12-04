
/** 
 * Route class
 */
function Route() {
  var self = this;

  this.number = 0;
  this.name = "";
  this.type = "";
  this.startingPoint = null;
  this.arrivalPoint = null;
  this.distance = 0;
  this.time = 0;
  this.color = { "value" : "#000", "legend" : "Unknow legend" };
  this.explored = false;

  this.computeDistance = function() {
    this.distance = Math.abs(this.arrivalPoint.altitude - this.startingPoint.altitude);
  };

  this.computeTime = function() {
    if(this.type == "BUS") {
      if((this.startingPoint.name == "arc2000" && this.arrivalPoint.name == "arc1600") || (this.startingPoint.name == "arc1600" && this.arrivalPoint.name == "arc2000")) {
        this.time = 40;
        this.color.value = "#000";
        this.color.legend = "bus 40mn";
      } else if((this.startingPoint.name == "arc1600" && this.arrivalPoint.name == "arc1800") || (this.startingPoint.name == "arc1800" && this.arrivalPoint.name == "arc1600")) {
        this.time = 30;
        this.color.value = "#000";
        this.color.legend = "bus 30mn";
      }
    } else {
      // console.log(types);
      this.time = types[this.type].static + (types[this.type].variable * this.distance / 100);
      this.color.value = types[this.type].color;
      this.color.legend = types[this.type].legend;
    }
  };
}