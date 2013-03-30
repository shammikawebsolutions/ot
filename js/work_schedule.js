$(document).ready(function()
{
	numeric_only("#work_schedule_break");
	numeric_only("#work_schedule_rate_per_hour");
	
	$('#calendar').fullCalendar('render');
	$('#calendar').fullCalendar('refetchEvents');
	
	$("#work_schedule").on("click","a",function(event)
	{
		$('#calendar').fullCalendar('render');
		$('#calendar').fullCalendar('refetchEvents');
		//alert("loading B");
	});
	
	var home_cell_work_schedule_count=0;

	render_calendar();
	
	fetch_event(new Date());
	
	function render_calendar()
	{
		$("#home_main_cells #work_schedule ul").html("");
    	var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();	    
		
		$('#calendar').fullCalendar
		({
			header			: 
			{
				right		: 'next',
				center		: 'title',
				left		: 'prev'
			},
			contentHeight: 200,
			timeFormat: 'H(:mm)',
			events			: function(start,end,callback) 
			{
				//alert("loading events");
				var events_array=[];
				db.transaction
				(
					function(transaction) 
					{
						transaction.executeSql
						(
		    				'SELECT * FROM work_schedule WHERE user_id=? ORDER BY date;',
		    				[user_id],
		    				function(transaction,result) 
		    				{
		    					for(var i=0;i<result.rows.length;i++) 
		        				{
			        				var row=result.rows.item(i);
			        				events_array.push
									({
					                    id			: 	row.id,
					                    title		: 	'',//row.job.substring(0,1),
					                    start		: 	row.date,
					                    className	:	'work_schedule_cell'
					                });
		        				}        				
		        				//callback(events_array);
							},							
							work_schedule_errorHandler
						);
					}
				);
				
				//render study plans
				db.transaction
				(
					function(transaction) 
					{
						transaction.executeSql
						(
							'SELECT sp.*,s.title FROM study_plan sp JOIN subjects s ON (sp.subject_id=s.id) WHERE sp.user_id=? ORDER BY sp.start_date;',
		    				[user_id],
		    				function(transaction,result) 
		    				{
		    					for(var i=0;i<result.rows.length;i++) 
		        				{
			        				var row=result.rows.item(i);
			        				events_array.push
									({
					                    id				: 	row.id,
					                    title			: 	'',//row.title.substring(0,1),
					                    start			: 	row.start_date,
					                    className		:	'study_plan_cell',
					                    backgroundColor	:	'red',
					                    borderColor		:	'red'
					                });
		        				}
								callback(events_array);
							},
							work_schedule_errorHandler
						);
					}
				);
			},
			eventClick		: function(calEvent, jsEvent, view) 
			{
				fetch_event(calEvent.start);
		    },
		    dayClick		: function(date, allDay, jsEvent, view) 
			{
		    	$('#calendar td').removeClass("selected_day_cell");
		    	$('#calendar div').removeClass("selected_day_cell");
				fetch_event(date);
				$(this).addClass("selected_day_cell");
		    }
		});
	}
	
	function fetch_event(work_schedule_start_date)//,clicked_class_name=undefined)
	{
		var date=work_schedule_start_date.getDate();
		var month=work_schedule_start_date.getMonth()+1;
		
		if(date<10)
		{
			date="0"+date;
		}
		if(month<10)
		{
			month="0"+month;
		}
		
		work_schedule_start_date=work_schedule_start_date.getFullYear()+"-"+month+"-"+date;
		
		//alert(work_schedule_start_date+" "+clicked_class_name);
		
		$("#work_schedule_calendar_events").html("");
		var html_calendar_events="";
		
		//if(clicked_class_name=="work_schedule_cell")
		{
			//render work schedules
			db.transaction
			(
				function(transaction) 
				{
					transaction.executeSql
					(
	    				'SELECT * FROM work_schedule WHERE date=?;',
	    				[work_schedule_start_date],
	    				function(transaction,result) 
	    				{
	    					for(var i=0;i<result.rows.length;i++) 
	        				{
		        				var row=result.rows.item(i);
		        				
		        				var number_of_hours_worked=calculate_time_difference(row.start_time,row.end_time);
		        				var break_minutes=row.break*60;
		        				
		        				html_calendar_events=
		        				"<div>" +
		        					"<h2>"+row.job+" ("+row.rate_per_hour+" p/h)</h2>"+
		        					"<h3>"+format_date(row.date)+" - from "+row.start_time+" to "+row.end_time+"<br /> = "+number_of_hours_worked+" hrs</h3>"+
		        					"<h3>"+break_minutes+" minute break</h3>"+
		        					"<h3>Pay = "+round_value((number_of_hours_worked-row.break)*row.rate_per_hour)+"</h3>"+
		        				"</div>";
		        				$("#work_schedule_calendar_events").append(html_calendar_events);
		        				$("#work_schedule_calendar_events div").removeClass("study_plan_background");
		        				$("#work_schedule_calendar_events div").addClass("work_schedule_background");
	        				}
						},
						work_schedule_errorHandler
					);
				}
			);
		}
		//else//study plan
		{
			html_calendar_events='';
			db.transaction
			(
				function(transaction) 
				{
					transaction.executeSql
					(
	    				'SELECT sp.*,s.title FROM study_plan sp JOIN subjects s ON (sp.subject_id=s.id) WHERE sp.start_date=?;',
	    				[work_schedule_start_date],
	    				function(transaction,result) 
	    				{
	    					for(var i=0;i<result.rows.length;i++) 
	        				{
		        				var row=result.rows.item(i);
		        				
		        				html_calendar_events=
		        				"<div>" +
		        					"<h2>"+row.title+"</h2>"+
		        					"<h3>"+format_date(row.start_date)+" - from "+row.start_time+"</h3>"+
		        				"</div>";
		        				$("#work_schedule_calendar_events").append(html_calendar_events);
		        				$("#work_schedule_calendar_events div").addClass("study_plan_background");
	        				}
						},
						work_schedule_errorHandler
					);
				}
			);
		}
		//alert(html_calendar_events);
		$('html,body').animate
		({
	         scrollTop: $("#work_schedule_calendar_events").offset().top
	    }, 2000);
	}

	
	var delete_work_schedule_id='';
		
	$("#view_work_schedules").on("click","#my_work_schedule_list div div .delete",function(event)
	{
		$("#delete_work_schedule_confirm").dialog("open");
		delete_work_schedule_id=$(this).attr('tag');    		
	});
	
	$("#delete_work_schedule_confirm").dialog
	({
        resizable	: 	false,
		autoOpen	: 	false,
        height		:	140,
        modal		: 	true,
        buttons		: 
		{
            "Yes": function() 
            {
				db.transaction
		    	(
		        	function(transaction) 
		        	{
		        		transaction.executeSql('DELETE FROM work_schedule WHERE id='+delete_work_schedule_id+';');
		        	}
		    	);
	        	
				render_work_schedules();
                $(this).dialog("close");
            },
            "No": function() 
            {
                $(this).dialog("close");
            }
        }
    });

	$("#add_work_schedule form").submit(add_new_work_schedule_entry);

	function add_new_work_schedule_entry()
	{
		var work_schedule_job=$('#work_schedule_job').val();
		var work_schedule_abbreviation=$("#work_schedule_abbreviation").val();
		var work_schedule_location=$("#work_schedule_location").val();
		var work_schedule_date=$("#work_schedule_date").val();
		var work_schedule_start_time=$("#work_schedule_start_time").val();
		var work_schedule_end_time=$("#work_schedule_end_time").val();
		var work_schedule_break=$("#work_schedule_break").val();
		var work_schedule_break_mins_hours=$("#work_schedule_break_mins_hours").val();
		
		if(work_schedule_break_mins_hours=="minutes")
		{
			work_schedule_break=work_schedule_break/60;
		}
		
		var work_schedule_rate_per_hour=$("#work_schedule_rate_per_hour").val();
		var work_schedule_notes=$("#work_schedule_notes").val();
		
		var work_schedule_error=false;

		$('#work_schedule_job').parent().parent().removeClass("error_border");
		$('#work_schedule_date').parent().parent().removeClass("error_border");
		$('#work_schedule_start_time').parent().parent().removeClass("error_border");
		$('#work_schedule_end_time').parent().parent().removeClass("error_border");
		$('#work_schedule_rate_per_hour').parent().parent().removeClass("error_border");
		
		if(work_schedule_job=='')
		{
			$('#work_schedule_job').parent().parent().addClass("error_border");
			work_schedule_error=true;
		}
		if(work_schedule_date=='')
		{
			$('#work_schedule_date').parent().parent().addClass("error_border");
			work_schedule_error=true;
		}
		if(work_schedule_start_time=='')
		{
			$('#work_schedule_start_time').parent().parent().addClass("error_border");
			work_schedule_error=true;
		}
		if(work_schedule_end_time=='')
		{
			$('#work_schedule_end_time').parent().parent().addClass("error_border");
			work_schedule_error=true;
		}
		if(work_schedule_rate_per_hour=='')
		{
			$('#work_schedule_rate_per_hour').parent().parent().addClass("error_border");
			work_schedule_error=true;
		}
		if(work_schedule_end_time!='')
		{
			//alert(study_plan_start_time+"="+study_plan_end_time);
			var start_date=work_schedule_start_time.replace(":","");
			var end_date=work_schedule_end_time.replace(":","");
			//alert(start_time+"="+end_time);
			if(start_date>end_date)
			{
				$('#work_schedule_start_time').parent().parent().addClass("error_border");
				$('#work_schedule_end_time').parent().parent().addClass("error_border");
				work_schedule_error=true;
			}
			else
			{
				//work_schedule_error=false;
			}
		}
		if(!work_schedule_error)
		{
			db.transaction
			(
    			function(transaction) 
    			{
        			transaction.executeSql
        			(
	        			'INSERT INTO work_schedule '+
	        			'(user_id,job,abbreviation,location,date,start_time,end_time,break,rate_per_hour,notes) '+
	        			'VALUES (?,?,?,?,?,?,?,?,?,?);',
	        			[user_id,work_schedule_job,work_schedule_abbreviation,work_schedule_location,work_schedule_date,work_schedule_start_time,work_schedule_end_time,work_schedule_break,work_schedule_rate_per_hour,work_schedule_notes],
	        			function()
	        			{
	        				$('#work_schedule_job').val('');
	        				$("#work_schedule_abbreviation").val('');
	        				$("#work_schedule_location").val('');
	        				$("#work_schedule_date").val('');
	        				$("#work_schedule_start_time").val('0');
	        				$("#work_schedule_end_time").val('0');
	        				$("#work_schedule_break").val('');
	        				$("#work_schedule_break_mins_hours").val('0');
	        				$("#work_schedule_rate_per_hour").val('');
	        				
	        				render_work_schedules();

	        				$('#calendar').fullCalendar('render');
	        				$('#calendar').fullCalendar('refetchEvents');
		        			jQT.goBack();
		        		},
	        			work_schedule_errorHandler
        			);
    			}
			);

			$('#work_schedule_job').parent().parent().removeClass("error_border");
			$('#work_schedule_date').parent().parent().removeClass("error_border");
			$('#work_schedule_start_time').parent().parent().removeClass("error_border");
			$('#work_schedule_end_time').parent().parent().removeClass("error_border");
			$('#work_schedule_rate_per_hour').parent().parent().removeClass("error_border");
			
		}
		return false;
	}
	
	function render_work_schedules()
	{
		//populate the home screen cell
		var home_cell_work_schedule='';

		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT ws.* FROM work_schedule ws WHERE ws.user_id=? ORDER BY ws.date;',
    				[user_id],
    				function(transaction,result) 
    				{
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				if(get_current_date()<=row.date&&i<4)
	        				{
	        					home_cell_work_schedule="<li><span>"+format_date(row.date)+" </span>"+short_string(row.job,8)+"</li>";

	            				//home screen study plan cell
	            				$("#home_main_cells #work_schedule ul").append(home_cell_work_schedule);
	        				}
	        				
	        				$("#my_work_schedule_list").append
	        				(
		        				
			        		);
        				}
        				
					},
					work_schedule_errorHandler
				);
			}
		);
	}

	render_work_schedules();

	function work_schedule_errorHandler(transaction, work_schedule_error) 
	{
		alert('Oops. work_schedule_error was '+work_schedule_error.message+' (Code '+work_schedule_error.code+')');
		return true;
	}
	
	create_date_spinner("#work_schedule_date");	
});