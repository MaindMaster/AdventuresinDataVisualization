///////////////////////////////////
// Basic resizing of the window. //
///////////////////////////////////

// Redraw everything when resizing the window.
d3.select(window).on("resize",throttle);

// Set timer.
var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function(){redraw();},200);
}

// Redraw the whole scene.
function redraw() {
  width = document.getElementById("screen").offsetWidth;
  height = width / 2;
  d3.selectAll("svg").remove();
  d3.select("#head").append("svg").attr("id","header");
  d3.select("#main").append("svg").attr("id","container");
  setup(width,height);
  draw(topo);
}

//--------------------------------------------------------------->

///////////////////////////
// Zooming into the map. //
///////////////////////////

// Zoom is the empty function.
var zoom = d3.behavior.zoom()
            .scaleExtent([1,9])
            .on("zoom",move);

// Move into the map.
function move() {
  var t = d3.event.translate;
  var s = d3.event.scale; 
  zscale = s;
  var h = height / 4;

  t[0] = Math.min(
    (width / height) * (s - 1), 
    Math.max(width * (1 - s),t[0])
  );

  t[1] = Math.min(
    h * (s - 1) + h * s, 
    Math.max(height * (1 - s) - h * s,t[1])
  );

  zoom.translate(t);
  g.attr("transform","translate(" + t + ")scale(" + s + ")");

  // Adjust the country hover stroke width based on zoom level.
  d3.selectAll(".country").style("stroke-width",1 / s);
  d3.select("#UK").style("stroke-width",1 / s);
}

// Geo translation on mouse click in the map.
function click() {
  var latlon = projection.invert(d3.mouse(this));
  console.log(latlon);
}
   
//--------------------------------------------------------------->

///////////////////
// Basic set up. //
///////////////////

var width = document.getElementById('screen').offsetWidth;

var height = width / 2;

var topo, projection, path, svg, g;

var graticule = d3.geo.graticule();

var tooltip = d3.select("#main").append("div").attr("class", "tooltip hidden");
    
setup(width,height);

function setup(width,height){
    
  // Convert from spherical coordinates to planar coordinates.
  // Projection is empty the function.
  projection = d3.geo.mercator()
                .translate([(width / 2),(height / 2)])
                .scale(width / 2 / Math.PI);

  // The path generator. We need to use the projection defined before.
  // Path is the empty function.
  path = d3.geo.path()
            .projection(projection);

  // Set up our main svg container.
  svg = d3.select("#container")
        .attr("width",width)
        .attr("height",height)
        .call(zoom)
        .on("click",click);

  // Append the geometry container to our svg.
  g = svg.append("g");
    
  // Append an image with olympic rings to the header.
  var header = d3.select("#header")
	           .append("svg:image")
	           .attr("x",0)
	           .attr("y",0)
	           .attr("width",300)
	           .attr("height",150)
	           .attr('xlink:href','data/olympic_rings.png');
}

// Load and draw data with world map topology. 
d3.json("data/world-topo-min.json", function(error, world) {
  var countries = topojson.feature(world,world.objects.countries).features;   
  topo = countries;
  draw(topo);
});
  
/////////////////////////////
// Main drawing functions. //
/////////////////////////////

function draw(topo) {
    
  // Add graticule to data.
  svg.append("path")
     .datum(graticule)
     .attr("class","graticule")
     .attr("d",path);

  // Add equator to data.
  g.append("path")
   .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
   .attr("class","equator")
   .attr("d",path);

  // Select all the countries.
  var country = g.selectAll(".country").data(topo);
    
  var uk_index = -1;

  // Append all the countries.
  country.enter().insert("path")
      .attr("class",function(d,i){
          if(d.properties.name == "United Kingdom") {uk_index = i; return "UK_default";}
          else return "country";       
      })
      .attr("d",path)
      .attr("id",function(d,i){return d.id;})
      .attr("title",function(d,i){return d.properties.name;});   
   
  // Append UK on top of the map.
  g.append("path")
      .datum(topo[uk_index].geometry)
      .attr("id","UK")
      .attr("d",path)
      .on("mousemove",function(d){
        var mouse = d3.mouse(svg.node()).map(function(d){return parseInt(d);});
        tooltip.classed("hidden",false)
             .attr("style", "left:"+(mouse[0]+offsetL)+"px; top:"+(mouse[1]+offsetT)+"px")
             .html("United Kingdom");
        })
      .on("mouseout",function(d){
          tooltip.classed("hidden",true);
        })
      .transition()
      .each(function(){
        var uk_paese = d3.select(this);
        (function repeat(){
            uk_paese.transition()
                .style("fill","#C0C0C0")
                .transition()
                .delay(1000)
                .style("fill","#A0522D")
                .each("end",repeat);
        })();
      });
    
  // Offsets for tooltips.
  var offsetL = document.getElementById('container').offsetLeft + 20;
  var offsetT = document.getElementById('container').offsetTop + 10;
    
  var inside = 0;
    
  // Tooltips for all the countries apart from United Kingdom.
  country.on("mousemove",function(d,i){
      var mouse = d3.mouse(svg.node()).map(function(d){return parseInt(d);});
      tooltip.classed("hidden",false)
             .attr("style", "left:"+(mouse[0]+offsetL)+"px; top:"+(mouse[1]+offsetT)+"px")
             .html(d.properties.name);
      })
      .on("click", function(d,i){
            if(inside % 2 == 0) {
                country_participants(d.properties.name,i);
                inside = inside + 1;
            } else {
                d3.selectAll(".gline").remove();
                inside = inside - 1;
            }
      })
      .on("mouseout",function(d,i){
        tooltip.classed("hidden",true);
      });

  // Adding some capitals from external CSV file.
  d3.csv("data/country-capitals.csv",function(capitals){  
    capitals.forEach(function(i){
        addpoint(i.CapitalLongitude,i.CapitalLatitude,i.CapitalName);
    });  
  });  
}

////////////////////////////////////////////////////////////
// Some additional functions used in the drawing routine. //
////////////////////////////////////////////////////////////

// Function to add points and text to the map (used in plotting capitals).
function addpoint(lat,lon,text) {
  var gpoint = g.append("g").attr("class","gpoint");
  var x = projection([lat,lon])[0];
  var y = projection([lat,lon])[1];

  // Append circle for the capital.
  gpoint.append("svg:circle")
        .attr("cx",x)
        .attr("cy",y)
        .attr("class","point")
        .attr("r",1.5);

  // Conditional in case a point has no associated text.
  if(text.length > 0){
    gpoint.append("text")
          .attr("x",x+2)
          .attr("y",y+2)
          .attr("class","text")
          .text(text);
  }
}

// Statistics on participants from different countries.
function country_participants(team_name,i) {
var stat = d3.csv("data/olympics_2012.csv", function(data){
    data.forEach(function(d,i){
        if(d.team == team_name) {
                var latlon = d.born_lat_lon.split(',');
                var bornloc = d.born_location.split(', ');
                if(bornloc[bornloc.length - 1] == team_name) {
                    if(!isNaN(latlon[1]) && !isNaN(latlon[0])) { addLine(latlon[1],latlon[0],"#7CFC00",i); }
                } else { 
                    if(!isNaN(latlon[1]) && !isNaN(latlon[0])) { addLine(latlon[1],latlon[0],"FF0000",i); }
                }
        }
    });
});
}

// Function to add line for one olympic participant.
function addLine(lat,lon,color,i) {
    var uk_x = projection([0.739,51.3026])[0];
    var uk_y = projection([0.739,51.3026])[1];
    
    var x = projection([lat,lon])[0];
    var y = projection([lat,lon])[1];
    
    var gline = g.append("g").attr("class", "gline");
    
    gline.append("svg:line")
        .attr("x1",uk_x)
        .attr("y1",uk_y)
        .attr("x2",uk_x)
        .attr("y2",uk_y)
        .style("stroke",color)
        .style("stroke-width","1px")
        .transition()
        .delay(i*0.5)
        .attr("x1",uk_x)
        .attr("y1",uk_y)
        .attr("x2",x)
        .attr("y2",y);
}