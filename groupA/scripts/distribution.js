 d3.csv('Olimpic_games_continent.csv', loaded);

 var distributionH=600;
 var maxColH=400;
 var distributionOffset=6;
 var imgH=30;

 d3.select('#podiumSVG')
 .attr('width',width)
 .attr('height',distributionH*2);



 function loaded(data){
    var distribution = d3.nest()
    .key(function(d){
        return d.full_name;
    })
    .entries(data);

    distribution.sort(function(a, b){
        if(a.values.length == b.values.length){
            return d3.descending(a.values[0].gender, b.values[0].gender);
        }else{
            return d3.descending(a.values.length, b.values.length);
        }
    });


    var filteredDistr = distribution.filter(function(d){
        return (d.values.length > 2)
    });


    var colMap = d3.scale.linear()
    .domain([0, 8])
    .range([0, maxColH])

    var colSize=(distributionH-8*distributionOffset)/filteredDistr.length;

    var spacing=0;
    var starts=[];
    var labels=[];
    var sports=[];
    // labels.push(0);
    var globalAckIndex=-1;

    d3.select('#podiumSVG')
    .selectAll('rect')
    .data(filteredDistr)
    .enter()
    .append('rect')
    .attr('height', 3)
    .attr('width',0)
    .attr('y', function(d, i){
        if(i>0 && filteredDistr[i].values.length==filteredDistr[i-1].values.length){
            labels[globalAckIndex]++;
            spacing+=3;
            
            for(var k=0;k<filteredDistr[i].values.length;++k)
            {
                var key=filteredDistr[i].values[k].sport;
                if(key in sports[globalAckIndex])
                    sports[globalAckIndex][key]++;
                else
                    sports[globalAckIndex][key]=1;
            }

        }
        else{
            spacing+=3+distributionOffset;

            starts.push(spacing-(3+distributionOffset)/2);
            labels.push(0);
            sports.push({});
            globalAckIndex++;
        }

        return spacing-3-distributionOffset;

    })
    .attr('x', 40)
    .style('fill', function(d, i){
        if(d.values[0].gender == 'Male'){
            return '#00baff';
        }else{
            return '#f000ff';
        }
    })
    .transition()
    .duration(1000)
    .attr('width', function(d, i){
        return colMap( d.values.length );
    });

    starts.push(spacing);

    var anotherAck = [], item;

    for(var i in sports)
    {
        anotherAck.push([]);
        for (var type in sports[i]) {
            item = {};
            item.event = type;
            item.value = sports[i][type];
            anotherAck[i].push(item);
        }
    }
    console.log(sports);

    console.log(anotherAck);


    anotherAck.sort(function(b, a){
        if(a.value == b.value){
            return d3.descending(a.event, b.event);
        }else{
            return d3.descending(a.value, b.value);
        }
    });

    console.log(anotherAck);


    d3.select('#podiumSVG')
    .selectAll('text')
    .data(labels)
    .enter()
    .append('text')
    .attr('height', 6)
    .attr("font-family", "Impact")
    .attr('fill', 'gray')
    .attr("font-size", 20)
    .attr('y',function(d,i){ return (starts[i]+starts[i+1])/2; })
    .attr('x',35)
    .text(function(d,i){ return d; })
    .attr('text-anchor','end')
    .style('opacity',0)
    .transition()
    .duration(1000)
    .style('opacity',1);




    // for(var k=0; k<anotherAck.length;k++)
    // {
    //     var y=(starts[k]+starts[k+1])/2-imgH/2;

    //     d3.select('#podiumSVG')
    //     .selectAll('image')
    //     .data(anotherAck[k])
    //     .enter()
    //     .append('image')
    //     .attr('height', imgH)
    //     .attr('width', imgH)
    //     .attr('xlink:href',function(d,i){return 'img/icons/'+d.event+'.png';})
    //     .attr('y',y)
    //     .attr('x',300)
    //     .style('opacity',function(d,i){return i*(imgH+10);})
    //     .transition()
    //     .duration(1000)
    //     .style('opacity',1);
    // }





}