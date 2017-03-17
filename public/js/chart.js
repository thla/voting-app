
$(document).ready(function(){

// Get the pollData that was passed from the server side
const pollData = JSON.parse(document.getElementById('data').innerHTML);
//append poll question
$('#question').append(pollData.question);
//create the options of the poll
const formOptions = pollData.options.map(function(option, index){
    return "<div class='form-check'><input class='form-check-input' type='radio' name='option' value='"+index+"'><label class='form-check-label'>" + option + "</label></div>"
});
//prepend the options
$('#voteForm').prepend(formOptions);
//create the chart
const ctx = document.getElementById("poll");
const chart = new Chart(ctx, {
    type: 'doughnut',
    options:{
        animation: {
            animateScale: true
        },
        legend: {
                position: 'bottom' 
        }
       
    },
    data: {
        labels: pollData.options,
        datasets: [{
            label: '# of Votes',
            data: pollData.votes,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            hoverBackgroundColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ]
        }]
    }
});

//
	
});