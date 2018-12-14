const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const d = new Date();

var day = days[ d.getDay() ];

$('#day-of-week').text(day);
$('#month').text(monthNames[d.getMonth()]);
$('#day').text(d.getDate());
$('#year').text(d.getFullYear());
