
$(document).ready(function(){
    $('form#comment').submit(function(e){            
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
                $('#new_comment').html("<li><p>" + data.result.content + "</p><div>" + 
                                                   data.result.username + "</div></li>");
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                $('#new_message').html('<p> You can not comment on this!');
            });
        e.preventDefault(); //STOP default action
    });
});