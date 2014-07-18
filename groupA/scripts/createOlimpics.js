
function createCirle(cx,cy,col, radius, clazz, dataName,scale)
{
	d3.select('#headerSVG')
	.append("circle")
	.attr("cx", cx)
	.attr("cy", cy)
	.attr("r", radius)
	.attr('fill','none')
	.attr('stroke',col)
	.attr('class',clazz+', ring')
	.attr('stroke-width',6)
	.on("click", function(d){ loadTagCloud(dataName,scale); });

}

createCirle(width/2-2*radius-offset,radius+offset,'#0081C6',radius,'europe','Europa',4);

createCirle(width/2+2*radius+offset,radius+offset,'#ED1849',radius,'america','America',3);

createCirle(width/2-radius-offset/2,radius+offset+radius,'#FCB034',radius,'asia','Asia',3);
createCirle(width/2+radius+offset/2,radius+offset+radius,'#00A94F',radius,'ocenania','Oceania',2);

createCirle(width/2,radius+offset,'#292526',radius,'africa','Africa',0.5);

d3.select('#headerSVG').attr('width',width);
d3.select('#headerSVG').attr('height',2*offset+3*radius);