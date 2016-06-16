var Rating = require('rating');

var rating = new Rating([1, 2, 3, 4, 5]);
document.getElementById("rating").appendChild(rating.el);

rating.on('rate', function(weight) {
  var class_id = $("#class_id").val();
  var user_id = $("#user_id").val();
  $('body').dimmer('show');
	$('.ui.modal').show();
	$("#cancel").on("click", function() {
		$('.ui.modal').hide();
		$('body').dimmer('hide');
		$(".star").each(function(index) {
			$(this).removeClass('glow');
		});
	});
	$("#ok").on("click", function() {
		$('.ui.modal').hide();
		$('body').dimmer('hide');
		$.post("/ratings", {score: weight, class_id: class_id, user_id: user_id});	
	});
});