
d3.csv('../data/olympics_2012.csv', loaded);


function loaded(data)
{

      // var gender=d3.nest()
      // .key( function(d) { return d.gender; })
      // .sortKeys(d3.ascending)
      // .entries(data);

      var currentData=data;

      var forTag=d3.nest()
      .key( function(d) { return d.team; })
      .entries(currentData);

      words=[];

      for(var i=0;i<forTag.length;i++)
      {
            var tmp=processData(forTag[i].values);
            var num=1;

            for (var key in tmp) {
                  num+=tmp[key];
            }

            words.push({text: forTag[i].key, size: Math.log(num)*10});
      }

      var colorScale=d3.scale.category20();


      d3.layout.cloud().size([width, height])
      .words(words)
      .padding(1)
      // .rotate(function() { return  ~~(Math.random() * 5) * 30 - 60; })
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();


      function draw(words, bounds) {
            d3.select("#tagSVG")
            .append("g")
            .attr("transform", "translate("+width/2+","+height/2+")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.text; })
            .style("fill", function(d, i) { return colorScale(i%20); })
            .style("opacity", 0)

            .transition()
            .duration(2000)
            .style("opacity", 1)
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; });
            
      }

}





d3.select('#tagSVG').attr('width',width);
d3.select('#tagSVG').attr('height',height);