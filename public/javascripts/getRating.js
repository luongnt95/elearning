$(".rating-value").each(function(index) {
	var score = parseInt($(this).val());
	$(".star").each(function(index) {
		if(index >= score) return false;
		$(this).addClass("glow");	
	});
});