var Rating = require('rating');

var rating = new Rating([1, 2, 3, 4, 5]);
document.getElementById("rating").appendChild(rating.el);

rating.on('rate', function(weight) {
  var class_id = $("#class_id").val();
  var user_id = $("#user_id").val();
	$('.ui.modal').modal('show dimmer').modal('show');
	$("#cancel").on("click", function() {
		$(".star").each(function(index) {
			$(this).removeClass('glow');
		});
	});
	$("#ok").on("click", function() {
		$.post("/ratings", {score: weight, class_id: class_id, user_id: user_id});	
	});
});