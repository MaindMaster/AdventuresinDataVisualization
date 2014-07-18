
function loadTagCloud(cont,sca)
{
      var continent=cont;
      var scale=sca;
      d3.csv('Olimpic_games_continent.csv', loaded);

      function loaded(data)
      {

            var currentData;
            if(continent.length<=0){
                  currentData=data;
            }
            else
            {
                  currentData=[];
                  for (var i = data.length - 1; i >= 0; i--) {
                        if(data[i].continent==continent)
                              currentData.push(data[i]);
                  }
            }


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

                  words.push({text: forTag[i].key, size: (num)/scale});
            }

            var colorScale=d3.scale.category20();


            d3.layout.cloud().size([width, height])
            .words(words)
            .padding(1)
            // .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .rotate(function() { return 0; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();


            function draw(w, b) {

                  var words=w;
                  var bounds=b;
                 d3.select("#tagSVG")
                 .transition()
                 .duration(100)
                 .style("opacity", 0)
                 .each('end',firstEnd);


                 function firstEnd(){
                  d3.select("#tagSVG").selectAll('g').remove()
                  d3.select("#tagSVG").style("opacity", 1);

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
                  .on("mouseover", function(d){ d3.select(this).style("opacity", 0.5); })
                  .on("mouseout", function(d){ d3.select(this).style("opacity", 1); })

                  .transition()
                  .duration(2000)
                  .style("opacity", 1)
                  .style("font-size", function(d) { return d.size + "px"; })
                  .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; });
            };

      }

}





d3.select('#tagSVG').attr('width',width);
d3.select('#tagSVG').attr('height',height);

}