
function createCirle(cx,cy,col, radius, clazz)
{
	d3.select('#headerSVG')
	.append("circle")
	.attr("cx", cx)
	.attr("cy", cy)
	.attr("r", radius)
	.attr('fill','none')
	.attr('stroke',col)
	.attr('class',clazz+', ring')
	.attr('stroke-width',6);

}

createCirle(width/2-2*radius-offset,radius+offset,'#0081C6',radius,'europe');

createCirle(width/2+2*radius+offset,radius+offset,'#ED1849',radius,'america');

createCirle(width/2-radius-offset/2,radius+offset+radius,'#FCB034',radius,'asia');
createCirle(width/2+radius+offset/2,radius+offset+radius,'#00A94F',radius,'ocenania');

createCirle(width/2,radius+offset,'#292526',radius,'africa');

d3.select('#headerSVG').attr('width',width);
d3.select('#headerSVG').attr('height',2*offset+3*radius);