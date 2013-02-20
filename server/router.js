module.exports = function(app,express,passport) {

	app.get('/',function(request, response){
			response.render('index');
    });
	
    app.get('/NodeSearch',function(request, response){
		var resultViewId = request.query["resultViewId"]
		console.log("resultViewId:"+resultViewId);
		response.render('contractSearchBar',{resultViewId:resultViewId});
    });

	app.get('/contractSearch',function(request, response){
		var search = request.query["searchString"];
		console.log("Search:"+search);
		response.render('contractSearchResult',{search:search});
	});

}
