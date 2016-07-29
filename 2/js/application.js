function draw(root) {
  var margin = 20,
    diameter = 960;

var saturationDepthPink = d3.scale.linear()
    .domain([1, depth])
    .range([60, 85]);

var saturationDepthBlue = d3.scale.linear()
    .domain([1, depth])
    .range([50, 80]);

var saturationDepthGray = d3.scale.linear()
    .domain([1, depth])
    .range([72, 100]);

var pack = d3.layout.pack()
    .padding(2)
    .size([diameter - margin, diameter - margin])
    .value(function(d) { return d.size; })

var svg = d3.select("body").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .append("g")
  .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

d3.select("body")
  .style("background", '#FFF')
  .on("click", function() { zoom(root); });

  // pending
  var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip');

  var focus = root,
      nodes = pack.nodes(root),
      view;

  function genderColor(d) {
    if (d.object.funcionario.genero == 'F') {
      // hsla(343, 100%, 58%, 1)
      return 'hsl(343, 100%,' + saturationDepthPink(d.depth) + '%)';
    } else if (d.object.funcionario.genero == 'M') {
      // hsla(199, 85%, 65%, 1)
      return 'hsl(199, 85%,' + saturationDepthBlue(d.depth) + '%)';
    } else {
      // hsla(0, 0%, 87%, 1)
      return 'hsl(0, 0%, '+ saturationDepthGray(d.depth) + '%)';
    }
  }
 
  var circle = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
    .style("fill", function(d) { return d.children ? genderColor(d) : null; })
    .attr('id', function (d) { return 'circle-' + d.object.id; })
    .on('mouseover', circleMouseOver)
    .on('mouseout', circleMouseOut)
    .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  var text = svg.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr('id', function (d) { return 'text-' + d.object.id; })
    .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
    .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
    .text(function(d) { return d.name; });var defs= svg.append('defs')


  // defs.append('pattern')
  //   .attr('id', 'pic-1')
  //   .attr('patternUnits', 'userSpaceOnUse')
  //   .attr('width', 115.5)
  //   .attr('height', 100)
  //   .append('svg:image')
  //   .attr('xlink:href', 'http://cammac7.github.io/img/portfolio/BLM.png')
  //   .attr("width", 115.5)
  //   .attr("height", 100)
  //   .attr("x", 0)
  //   .attr("y", 0);

var defs = circle
    .append('defs')
    .append('pattern')
    .attr('id', function(d) { return 'pic-' + d.object.id; })
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 115.5)
    .attr('height', 100)
    .append('svg:image')
    //.attr('xlink:href', function(d) { console.log(d.object.funcionario.foto.thumbnail); return d.object.funcionario.foto.thumbnail; })
    .attr('xlink:href','http://cammac7.github.io/img/portfolio/BLM.png')
    .attr("width", 115.5)
    .attr("height", 100)
    .attr("x", 0)
    .attr("y", 0);

  var node = svg.selectAll("circle,text");

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }

  function circleMouseOver (d) {
    d3.select(this)
      .style("fill", "url(#pic-"+ d.object.id +")");
    // d3.select(this)
    //   .style("fill", "url(#pic-1)");
    d3.select('#text-' + d.object.id)
      .text(function(d){
          return d.object.cargo.categoria.nombre;
      })
  }

  function circleMouseOut (d) {
    // d3.select(this)
    //   .style("fill", "url(" +  d.funcionario.foto.thumbnail + ")");
    d3.select('#text-' + d.object.id)
      .text(function(d){
          return d.name;
      })
  }
  d3.select(self.frameElement).style("height", diameter + "px");
}