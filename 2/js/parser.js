var clerk;
var data;
var count;
var depth;

$( document ).ready(function() {

// d3.json("data/page.json", function(error, json) {
d3.json("https://gobiernoabierto.cordoba.gob.ar/api/funciones/?format=json&page_size=350", function(error, json) {
  	clerk = json.results;
  	var firstElem = _.find(clerk, function(o) { return o.cargo['depende_de'] == null; });
  	data = {
  		'name': firstElem.funcionario.nombre + ' ' + firstElem.funcionario.apellido,
  		'object': firstElem,
  		'children': []
  	};
  	count = 1;
  	depth = 1;
  	searchDependencies(firstElem.cargo.id, data, depth);
  	draw(data);
  });
});

function searchDependencies(positionId, root, depthItem) {
	const dependencies = _.filter(clerk, function(o) { return o.cargo['depende_de'] == positionId; });
	if (dependencies.length > 0) {
		depth = Math.max(depth, depthItem);
	}
	$.each(dependencies, function(indexDepency, dependency) {
		count++;
		root.children.push({
  		'name': dependency.funcionario.nombre + ' ' + dependency.funcionario.apellido,
  		'object': dependency,
  		'size': 1,
  		'children': []
		})
		searchDependencies(dependency.cargo.id, root.children[indexDepency], depthItem + 1);
	});
}
