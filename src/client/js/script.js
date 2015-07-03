var ctr = 0;
function validate_form() {
  var reEmail = /^\S+@\S+\.\S+$/ ;
  var reName = /^[a-zA-Z ]+$/ ;
  var reDigits = /^[0-9]*$/ ;
  if ( $('#name').val().length < 1 ) {
    $('#error_name').text('Please enter your name');
    $('#name').css('border-color','#FF0000');
    ctr++;
  }
  if ( $('#email').val().length < 1 ) {
    $('#error_email').text('Please enter your email');
    $('#email').css('border-color','#FF0000');
    ctr++;
  }
  if ( $('#subject').val().length < 1 ) {
    $('#error_subject').text('Please enter the subject');
    $('#subject').css('border-color','#FF0000');
    ctr++;
  }
  if ( $('#contact_number').val().length < 1 ) {
    $('#error_number').text('Please enter your contact number');
    $('#contact_number').css('border-color','#FF0000');
    ctr++;
  }
  if ( $('#message').val().length < 1 ) {
    $('#error_message').text('Please enter your message');
    $('#message').css('border-color','#FF0000');
    ctr++;
  }
  if ( ctr > 0){
    $("#send").removeClass("disabled");
    return;
  }
  if(!reName.test($('#name').val())) {
    $('#error_name').text('Please use only alphabets');
    $("#send").removeClass("disabled");
    return;
  }
  if(!reEmail.test($('#email').val())) {
    $('#error_email').text('Please enter correct email address');
    $("#send").removeClass("disabled");
    return;
  }
  if(!reDigits.test($('#contact_number').val())) {
    $('#error_number').text('Please enter correct contact number');
    $("#send").removeClass("disabled");
    return;
  }
  var m = {'name':$('#name').val(),'email':$('#email').val(),'subject':$('#subject').val(),'contact':$('#contact_number').val(),'message':$('#message').val()};
  console.log(m);
  $.ajax({
    type: "POST",
    dataType :'json',
    url: "<'Enter URL here to post'>",
    data: m,
    success: function(data) {
      console.log(data.error);
      $("#send").removeClass("disabled");
      $('#name,#message,#email,#contact_number,#subject').val('');
      $('#success').text('We have received your message. We will contact you as soon as possible.');
    },
    error: function(err) {
      $("#send").removeClass("disabled");
      $('#success').text('We are facing some issues in our backend. Please try later.');
      console.log(err);
    }
  });
}


$(document).ready(function() {
  $('#send').click(function() {
    if($("#send").hasClass("disabled")){
      return;
    }
    $("#send").addClass("disabled");
    $('#error_name,#error_message,#error_email,#error_number,#error_subject').text('');
    $('#name,#message,#email,#contact_number,#subject').css('border-color','#484848');
    ctr = 0;
    validate_form();
  }); 
});
