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
			// .each('end',function(){d3.select(this).remove();});
		}
	}
}



function createPieChart()
{

	d3.csv('Olimpic_games_continent.csv', function(data)
	{

		createPiePerGender('Male');
		createPiePerGender('Female');

		function createPiePerGender(gender)
		{

			currentData=[];
			for (var i = data.length - 1; i >= 0; i--) {
				if(data[i].sport==sports[sportIndex] && data[i].gender==gender){
					currentData.push(data[i]);
				}
			}

			var newData=processData(currentData);

			var offset=7;

			var sourceHeight=iconSize;
			

			var sourceX, targetX;
			if(gender=='Male'){
				sourceX=width/2-iconSize/2;
				targetX=textOffset;
			}
			else{
				sourceX=width/2+iconSize/2;
				targetX=width-textOffset;
			}

			targetHs=[];

			var totalH=0;
			var totEvents=0;

			for(key in newData){
				var tmp=newData[key]+1;
				totalH+=tmp;
				targetHs.push(tmp);
				totEvents++;
			}

			var sourceLocalH=sourceHeight/totEvents;
			var scaling=totalH/(iconSvgHeight-offset*(totEvents-1));



			var prevH=0;

			for(var i=0;i<targetHs.length;i++)
			{
				var tmp=targetHs[i];
				var points=	targetX+','+prevH+' '+
				targetX+','+(tmp/scaling+prevH)+' '+
				sourceX+','+(sourceLocalH*(i+1)+iconSvgHeight/2-iconSize/2)+' '+
				sourceX+','+(sourceLocalH*i+iconSvgHeight/2-iconSize/2);


				prevH+=tmp/scaling+offset;
				

				var d3Img=d3.select('#iconsSVG')
				.append("polygon")
				.attr("points", points)
				.attr("class", gender);
			}
		}
	});






}