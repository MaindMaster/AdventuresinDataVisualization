function processData(data)
{
	var categories=d3.nest()
	.key( function(d) { return d.event; })
	.entries(data);

	categoriesMap={};

	for (var i = categories.length - 1; i >= 0; i--) {
		categoriesMap[categories[i].key]=0;
	}

	var perName=d3.nest()
	.key( function(d) { return d.name; })
	.entries(data);

	for (var i = perName.length - 1; i >= 0; i--) {
		if(perName[i].values.length>1){
			var lll=perName[i].values.length;
			for(var j=lll-1; j>=0; j--){
				categoriesMap[perName[i].values[j].event]+=1;
			}
		}
	}

	return categoriesMap;
}