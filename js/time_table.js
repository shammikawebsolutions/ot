var subjects_array=new Array();
var did_execute=false;

$(document).ready(function()
{
	var weekday=new Array(7);
	weekday[0]="Sunday";
	weekday[1]="Monday";
	weekday[2]="Tuesday";
	weekday[3]="Wednesday";
	weekday[4]="Thursday";
	weekday[5]="Friday";
	weekday[6]="Saturday";	
	
	function fetch_subjects()
	{
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
					'SELECT * FROM subjects WHERE user_id=? AND days=? AND start_time>=? ORDER BY days,start_time;',
					[user_id,current_day,current_time],
					function(transaction,result) 
					{
						//$("#view_timetable_day_results").html("");
	    				for(var i=0;i<result.rows.length;i++) 
	    				{
	        				var row=result.rows.item(i);
	        				
	        				subjects_array[row.start_time]=row.title+row.colour_code+"#"+row.start_time+"#"+row.end_time+"#"+row.location;
	        				//alert(row.start_time+'='+subjects_array[row.start_time]);
	        				did_execute=true;
	        				$("#view_timetable_day_results").append(row.title);
	    				}
					},
					time_table_error_handler
				);
			}
		);
	}
		
	if(!did_execute)
	{
		//alert("running");
		//fetch_subjects();
	}
	
	//render_timetable_day();
	
	function render_timetable_day()
	{
		if(!did_execute)
		{
			fetch_subjects();
		}
		var new_date=new Date();
		var start_time=new_date.getTime();
		start_time=start_time-(start_time%1800000);
		
		var end_time={hour:23,minute:59};
		end_time=Date.today().set(end_time).getTime();//toString('HH:mm');// Set date and time with a config object.
	
		var timetable_html='';
		
		for(i=start_time;i<end_time;i=i+1800000)
		{
			var d=new Date(i);
			var hours=d.getHours();
			var minutes=d.getMinutes();
			
			if(minutes==0)
			{
				minutes="00";
			}
			var key=hours+":"+minutes;
			
			timetable_html=timetable_html+"<tr>";
			
			alert(key+"="+subjects_array[key]);
			if(subjects_array[key]==undefined)
			{
				timetable_html=timetable_html+"<td>"+key+"</td>";
			}
			else
			{
				var values=subjects_array[key].split("#");
				timetable_html=timetable_html+"<td><h1>"+values[0]+"</h1></td>";
			}
			
			timetable_html=timetable_html+"</tr>";
		}
		$("#view_timetable_day_results").append(timetable_html);
	}
		
	function time_table_error_handler(transaction, subject_error) 
	{
		//alert('Oops. time_table was '+subject_error.message+' (Code '+subject_error.code+')');
		return true;
	}
	
	//render_timetable(current_day,date);
	
	function render_timetable(current_day,date)
	{
		current_day=weekday[current_day];
		
		$.ajax
		({
			type		:	"POST",
			url			: 	"ajax/view-timetable-day.php",
			data		:	"current_day="+current_day,
			success		:	function(result)
			{
				$("#view_timetable_day_results").html(result);

				$("#current_timetable_date").html(weekday[date.getDay()]+" "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
			}
		});
	}

	
});