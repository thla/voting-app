$(document).ready(function(){

	//client side data validation
	$('form').on('submit',function(e){
		var errors = '';

       //alert('test' + $('#question').val());
 
		//require user to input a question
		if($('#question').val() === '') {
			errors+='Submit a question.  ';
		}

		//require user to input at least 2 options for poll
		var lines = $('#option-field').val().split('\n');
		if(lines.length < 2) {
			errors+='You need at least two options.  ';
		}

		if(errors){
			alert(errors);
			e.preventDefault();
		}
	});
});
