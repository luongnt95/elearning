var Rating = require('rating');

var rating = new Rating([1, 2, 3, 4, 5]);
document.getElementById("rating").appendChild(rating.el);
 
rating.on('rate', function(weight) {
  console.log('rated: ' + weight);
  var class_id = $("#class_id").val();
  var user_id = $("#user_id").val();
  $.post("/ratings", {score: weight, class_id: class_id, user_id: user_id});
});
 
rating.on('current', function(weight) {
  console.log('current: ' + weight);
});