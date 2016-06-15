
$(document).ready(function(){
    $('form#commentform').submit(function(e){            
        var postData = $(this).serializeArray();
        var formURL = $(this).attr("action");

        $.ajax({
            url : formURL,
            type: 'POST',
            data : postData,
            dataType : 'json', // what type of data do we expect back from the server
            encode : true
        }).done(function(data, textStatus, jqXHR) {
                console.log(data.message);

                $('#new_message').html('<p>' + data.message + '</p>');
                $('#comment_area').prepend(
                    '<div class="comment"><a class="avatar"><img src="' + data.result.avatar_url +'"> </a>' +
                    '<div class="content">' + '<a class="author">' + data.result.username + 
                    '</a><div class="text"><p>' + data.result.content + '</p></div></div></div>'
                );
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                $('#new_message').html('<p> You can not comment on this!');
            });
        e.preventDefault(); //STOP default action
    });
});