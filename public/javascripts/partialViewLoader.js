var loadPartialView = function(viewId,Url,paramaters){
	$.ajax({
	  url: Url,
	  data :paramaters
	}).done(function(data) {
		$('#'+viewId).append(data);
	});	
};