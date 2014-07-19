function createIcon(x, y, imgName, index, clazz)
{
	var d3Img=d3.select('#iconsSVG')
	.append("svg:image")
	.attr("x", x)
	.attr("y", y)
	.attr("width", iconSize)
	.attr("height", iconSize)
	.attr('class',clazz)
	.attr('xlink:href','img/icons/'+imgName+'.png')
	.on("click", function(d){ sportIconClicked(index) })
	
	res={ 	d3Img: d3Img,
		originalX: x,
		originalY: y,
		open: false
	};

	return res;
}


d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

var icons=[];

for(var riga=0; riga<3; riga++){
	var y=riga*(iconSize+inconOffset)
	for(var colonna=0; colonna<6; colonna++)
	{	
		var index=riga*6+colonna;
		var name=sports[index];
		icons.push(createIcon(colonna*(iconSize+inconOffset),y,name,index,'sportIcon'));
	}
}


var pieCharGroupId='pieCharGroup';

var iconSvgHeight=3*iconSize+3*inconOffset;
var isOpen=false;
var sportIndex=-1;
var textOffset=100;

d3.select('#iconsSVG').attr('width',width);
d3.select('#iconsSVG').attr('height',iconSvgHeight);


function sportIconClicked(index)
{

	if(icons[index].open)
	{
		d3.selectAll('.'+pieCharGroupId).remove();

		for(var i=0;i<icons.length;i++)
		{
			if(i==index)
			{
				icons[i].open=false;

				icons[i].d3Img
				.style('opacity',1)
				.transition()
				.duration(500)
				.attr("x", icons[i].originalX)
				.attr("y", icons[i].originalY);
			}
			else
			{
				icons[i].d3Img
				.attr('class','sportIcon')
				.transition()
				.duration(500)
				.style("opacity", 1);
			}
		}

		isOpen=false;

		return;
	}

	if(isOpen) return;

	isOpen=true;

	for(var i=0;i<icons.length;i++)
	{
		if(i==index)
		{
			sportIndex=index;
			icons[i].open=true;

			icons[i].d3Img.moveToFront();

			icons[i].d3Img
			.style('opacity',1)
			.transition()
			.duration(500)
			.attr("x", width/2-iconSize/2)
			.attr("y", iconSvgHeight/2-iconSize/2)
			.each('end',createPieChart());

		}
		else
		{
			icons[i].d3Img
			.classed({'sportIcon':false})
			.transition()
			.duration(500)
			.style("opacity", 0)
		}
	}
}



function createPieChart()
{

	d3.csv('Olimpic_games_continent.csv', function(data)
	{

		var nameGroup=d3.select('#iconsSVG')
		.append("g")
		.attr('class',pieCharGroupId);

		nameGroup.append("text")
		.attr("font-family", "Arial")
		.attr("font-size", "18px")
		.attr('y',iconSvgHeight/2+iconSize/2+20)
		.attr('x',width/2)
		.attr('class','sportLabel')
		.attr('font-weight','bold')
		.text(sports[sportIndex])
		.style("opacity", 0)
		.attr('text-anchor','middle')
		.transition()
		.duration(500)
		.style("opacity", 1);


		maleData=extractData('Male');
		femaleData=extractData('Female');

		var tmp;
		tmp=d3.nest()
		.key( function(d) { return d.name; })
		.entries(maleData);

		var maleLength=tmp.length;

		tmp=d3.nest()
		.key( function(d) { return d.name; })
		.entries(femaleData);

		var femaleLength=tmp.length;

		var tot=maleLength+femaleLength;
		maleLength/=tot;
		femaleLength/=tot;


		createPiePerGender('Male',"Men's",maleData, maleLength,'#a4e6ff','#00baff');
		createPiePerGender('Female',"Women's",femaleData,femaleLength,'#f993ff','#f000ff');


		function extractData(gender)
		{
			currentData=[];
			for (var i = data.length - 1; i >= 0; i--) {
				if(data[i].sport==sports[sportIndex] && data[i].gender==gender){
					currentData.push(data[i]);
				}
			}

			return currentData;
		}

		function createPiePerGender(gender,toRemove,currentData, percent, colBar, overCol)
		{
			var newData=processData(currentData);

			var offset=7;

			var sourceHeight=iconSize*percent;
			

			var sourceX, targetX, startLabel, location;
			if(gender=='Male'){
				sourceX=width/2-iconSize/2;
				targetX=textOffset;
				startLabel=textOffset-5;
				location='end';
			}
			else{
				sourceX=width/2+iconSize/2;
				targetX=width-textOffset;
				startLabel=targetX+5;
				location='start';
			}

			targetHs=[];

			var totalH=0;
			var totEvents=0;

			for(key in newData){
				var tmp=newData[key]+1;
				totalH+=tmp;
				var label=key.replace(toRemove,'');
				targetHs.push({value: tmp, evt: label});
				totEvents++;
			}

			targetHs= targetHs.sort(function(a, b) { 
				if(a.value==b.value)
				{
					if ( a.evt < b.evt )
						return -1;
					if ( a.evt > b.evt )
						return 1;
					return 0;
				}
				return b.value - a.value; 
			});


			var sourceLocalH=sourceHeight/totEvents;
			var scaling=totalH/(iconSvgHeight-offset*(totEvents-1));





			var prevH=0;

			var group=d3.select('#iconsSVG')
			.append("g")
			.attr('class',pieCharGroupId);



			for(var i=0;i<targetHs.length;i++)
			{
				var tmp=targetHs[i].value;
				var points=	targetX+','+prevH+' '+
				targetX+','+(tmp/scaling+prevH)+' '+
				sourceX+','+(sourceLocalH*(i+1)+iconSvgHeight/2-sourceHeight/2)+' '+
				sourceX+','+(sourceLocalH*i+iconSvgHeight/2-sourceHeight/2);

				var points0 =
				sourceX+','+prevH+' '+
				sourceX+','+(tmp/scaling+prevH)+' '+
				sourceX+','+(sourceLocalH*(i+1)+iconSvgHeight/2-sourceHeight/2)+' '+
				sourceX+','+(sourceLocalH*i+iconSvgHeight/2-sourceHeight/2);

				var centerTextY=(prevH+(tmp/scaling+prevH))/2;


				prevH+=tmp/scaling+offset;
				
				group.append("text")
				.attr("font-family", "Arial")
				.attr("font-size", "10px")
				.attr('y',centerTextY)
				.attr('x',sourceX)
				.text(targetHs[i].evt)
				.style("opacity", 0)
				.attr('text-anchor',location)

				.transition()
				.duration(500)
				.style("opacity", 1)
				.attr('x',startLabel)

				group
				.append("polygon")
				.attr("points", points0)
				.attr("class", gender)
				.style("opacity", 0)
				.attr('data',tmp)
				.attr('fill',colBar)
				.on('mouseover',function(d){	
					var tmp=d3.select(this);
					var data=tmp.attr('data');

					div.transition()        
					.duration(200)      
					.style("opacity", .9);      
					div.html(data)  
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px"); 

					tmp.attr('fill',overCol); 
				})
				.on('mouseout',function(){
					div.transition()        
					.duration(200)      
					.style("opacity", 0);

					d3.select(this).attr('fill',colBar);
				})
				.transition()
				.duration(500)
				.style("opacity", 1)
				.attr("points", points);
			}
		}
	});






}