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
			icons[i].open=true;
			// icons[i].d3Img.parentNode.appendChild(icons[i].d3Img); // move to top


			icons[i].d3Img
			.style('opacity',1)
			.transition()
			.duration(500)
			.attr("x", width/2-iconSize/2)
			.attr("y", iconSvgHeight/2-iconSize/2)
			.each('end',createPieChart(index));

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



function createPieChart(index)
{
	console.log('cretatin pie for sport', sports[index]);
}