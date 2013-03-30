$(document).ready(function()
{		
	///////////////////////////////////////
	$("#work_schedule").on("click","a",function(event)
	{
		$('#study_plan_calendar').fullCalendar('render');
		$('#study_plan_calendar').fullCalendar('refetchEvents');
		//alert("B");
	});
	
	function render_study_plan_calendar()
	{
		$("#home_main_cells #study_plan ul").html("");
    	var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();	    
		
		$('#study_plan_calendar').fullCalendar
		({	
			header			: 
			{
				right		: 'prev,next',
				center		: 'title',
				left		: 'month,basicWeek,basicDay'
			},
			events			: function(start,end,callback) 
			{
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
					                    title		: 	row.job.substring(0,1),
					                    start		: 	row.date,
					                    className	:	'work_schedule_cell'
					                });
		        				}        				
		        				//callback(events_array);
							},							
							study_plan_errorHandler
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
					                    title			: 	row.title.substring(0,1),
					                    start			: 	row.start_date,
					                    className		:	'study_plan_cell',
					                    backgroundColor	:	'red',
					                    borderColor		:	'red'
					                });
		        				}
		    					//alert("study_plan");
								callback(events_array);
							},
							study_plan_errorHandler
						);
					}
				);
			},
			eventClick		: function(calEvent, jsEvent, view) 
			{
				fetch_study_plan_event(calEvent.start,calEvent.className);
		    }
		});
		$('#study_plan_calendar').fullCalendar('refetchEvents');
	}

	render_study_plan_calendar();
	///////////////////////////////////////
	
	var delete_study_plan_id='';
	var edit_study_plan_id='';
	var is_study_plan_edit=false;
		
	function fetch_study_plan_event(work_schedule_start_date,clicked_class_name)
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
		
		$("#study_plan_calendar_events").html("");
		var html_calendar_events="";
		
		if(clicked_class_name=="work_schedule_cell")
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
		        					"<h4>Pay = "+round_value((number_of_hours_worked-row.break)*row.rate_per_hour)+"</h4>"+
		        				"</div>";
		        				$("#study_plan_calendar_events").append(html_calendar_events);
		        				$("#study_plan_calendar_events").removeClass("study_plan_background");
	        				}
						},
						study_plan_errorHandler
					);
				}
			);
		}
		else//study plan
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
		        				$("#study_plan_calendar_events").append(html_calendar_events);
		        				$("#study_plan_calendar_events").addClass("study_plan_background");
	        				}
						},
						study_plan_errorHandler
					);
				}
			);
		}
		
		$('html,body').animate
		({
	         scrollTop: $("#study_plan_calendar_events").offset().top
	    }, 2000);
	}
	
	$("#view_study_plans").on("click","#my_study_plan_list div div .delete",function(event)
	{
		$("#delete_study_plan_confirm").dialog("open");
		delete_study_plan_id=$(this).attr('tag');    		
	});
	
	$("#delete_study_plan_confirm").dialog
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
		        		transaction.executeSql('DELETE FROM study_plan WHERE id='+delete_study_plan_id+';');
		        	}
		    	);
	        	
				render_study_plans();
                $(this).dialog("close");
            },
            "No": function() 
            {
                $(this).dialog("close");
            }
        }
    });
	
	//EDIT 	
	$("#view_study_plans").on("click","#my_study_plan_list div div .edit",function(event)
	{
		reset_study_plan_form();
		
		edit_study_plan_id=$(this).attr('tag');
		$("#add_new_study_plan .toolbar h1").html("Edit Study Plan");
		is_study_plan_edit=true;
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM study_plan WHERE id=?;',
    				[edit_study_plan_id],
    				function(transaction,result) 
    				{
    					for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				$("#study_plan_subject_id").val(row.subject_id);
	        				$('#study_plan_start_date').val(row.start_date);
	        				$("#study_plan_start_time").val(row.start_time);
	        				$("#study_plan_reminder_time").val(row.reminder_time);
	        				$("#study_plan_notes").val(row.notes);
        				}
					},
					study_plan_errorHandler
				);
			}
		);		
	});
		
	$("#add_new_study_plan_button").click(function()
	{
		reset_study_plan_form();
		$("#add_new_study_plan .toolbar h1").html("Add Study Plan");
	});

	$("#add_new_study_plan form").submit(add_new_study_plan_entry);
	
	function add_new_study_plan_entry()
	{			
		//first check if there're any subjects
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
					'SELECT id FROM subjects WHERE user_id=?;',
					[1],
					function(transaction,result) 
					{
						if(result.rows.length==0)
						{
							display_alert('Before adding any study plans, you must first add subjects!','No Subjects found','Ok');
							return false;
						}
					}
				)
			}
		);
		
		var study_plan_subject_id=$('#study_plan_subject_id').val();
		var study_plan_start_date=$("#study_plan_start_date").val();
		var study_plan_start_time=$("#study_plan_start_time").val();
		var study_plan_reminder_time=$("#study_plan_reminder_time").val();		
		var study_plan_notes=$("#study_plan_notes").val();
		var error=false;
                  
		$('#study_plan_subject_id').parent().parent().removeClass("error_border");
		$('#study_plan_start_date').parent().parent().removeClass("error_border");
		$('#study_plan_start_time').parent().parent().removeClass("error_border");
		
		if(study_plan_subject_id==''||study_plan_subject_id=='0'||study_plan_subject_id==0)
		{
			$('#study_plan_subject_id').parent().parent().addClass("error_border");
			error=true;
		}
		if(study_plan_start_date=='')
		{
			$('#study_plan_start_date').parent().parent().addClass("error_border");
			error=true;
		}
		if(is_past_date(study_plan_start_date))
		{
			$('#study_plan_start_date').parent().parent().addClass("error_border");
			error=true;
		}
		if(!error)
		{
			if(is_study_plan_edit)
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	    				transaction.executeSql
	    				(
	    					"UPDATE study_plan SET subject_id=?,start_time=?,reminder_time=?,start_date=?,notes=? WHERE id="+edit_study_plan_id, 
	    					[study_plan_subject_id,study_plan_start_time,study_plan_reminder_time,study_plan_start_date,study_plan_notes]
	    				);

	    				is_study_plan_edit=false;
	    				render_study_plans();
	        			jQT.goBack();
	    			}
	    		);		    
			}
			else
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	        			transaction.executeSql
	        			(
		        			'INSERT INTO study_plan '+
		        			'(user_id,subject_id,start_time,reminder_time,start_date,notes) '+
		        			'VALUES (?,?,?,?,?,?);',
		        			[user_id,study_plan_subject_id,study_plan_start_time,study_plan_reminder_time,study_plan_start_date,study_plan_notes],
		        			function()
		        			{
		        				reset_study_plan_form();
		        				render_study_plans();
			        			jQT.goBack();
			        		},
		        			study_plan_errorHandler
	        			);
	    			}
				);
			}
			
			if(study_plan_reminder_time!="")
			{
				add_studyplan_schedule(study_plan_subject_id,study_plan_start_date,study_plan_start_time,study_plan_reminder_time,study_plan_notes);
			}
		}         
		return false;
	}
                  
    //Add timer schedule with Notification and sound
    function taskBackground(id){
        //console.log("I was in the background but i'm back now! ID="+id);
    }
                  
    function taskRunning(id){
        //console.log("I am currently running, what should I do? ID="+id);}
    }
                  
    function getTimeBefore(remind_before)
                  {
                  var time = 0;//15/30/45/60
                  
                  switch(remind_before)
                  {
                  case "":
                  time = 0 * 1000;
                  break;
                  
                  case "15":
                  time = 15 * 60 * 1000;
                  break;
                  
                  case "30":
                  time = 30 * 60 * 1000;
                  break;
                  
                  case "45":
                  time = 45 * 60 * 1000;
                  break;
                  
                  case "60":
                  time = 3600 * 1000;
                  break;
                  }
                  return time;
    }
                  
    function getTimeInSeconds(start_time)
    {
                  
                  var time = 0;
                  switch(start_time)
                  {
                  case "":
                  
                  break;
                  
                  case "01:00":
                  time = 3600 * 1000;
                  break;
                  
                  case "01:30":
                  time = 1.5 * 3600 * 1000;
                  break;
                  
                  case "02:00":
                  time = 2 * 3600 * 1000;
                  break;
                  
                  case "02:30":
                  time = 2.5 * 3600 * 1000;
                  break;
                  
                  case "03:00":
                  time = 3 * 3600 * 1000;
                  break;
                  
                  case "03:30":
                  time = 3.5 * 3600 * 1000;
                  break;
                  
                  case "04:00":
                  time = 4 * 3600 * 1000;
                  break;
                  
                  case "04:30":
                  time = 4.5 * 3600 * 1000;
                  break;
                  
                  case "05:00":
                  time = 5 * 3600 * 1000;
                  break;
                  
                  case "05:30":
                  time = 5.5 * 3600 * 1000;
                  break;
                  
                  case "06:00":
                  time = 6 * 3600 * 1000;
                  break;
                  
                  case "06:00":
                  time = 6 * 3600 * 1000;
                  break;
                  
                  case "07:00":
                  time = 7 * 3600 * 1000;
                  break;
                  
                  case "07:30":
                  time = 7.5 * 3600 * 1000;
                  break;
                  
                  case "08:00":
                  time = 6 * 3600 * 1000;
                  break;
                  
                  case "08:30":
                  time = 8.5 * 3600 * 1000;
                  break;
                  
                  case "09:00":
                  time = 9 * 3600 * 1000;
                  break;
                  
                  case "09:30":
                  time = 9.5 * 3600 * 1000;
                  break;
                  
                  case "10:00":
                  time = 10 * 3600 * 1000;
                  break;
                  
                  case "10:30":
                  time = 10.5 * 3600 * 1000;
                  break;
                  
                  case "11:00":
                  time = 11 * 3600 * 1000;
                  break;
                  
                  case "11:30":
                  time = 11.5 * 3600 * 1000;
                  break;
                  
                  case "12:00":
                  time = 12 * 3600 * 1000;
                  break;
                  case "12:30":
                  time = 12.5 * 3600 * 1000;
                  break;
                  
                  case "13:00":
                  time = 13 * 3600 * 1000;
                  break;
                  
                  case "13:30":
                  time = 13.5 * 3600 * 1000;
                  break;
                  
                  case "14:00":
                  time = 14 * 3600 * 1000;
                  break;
                  
                  case "14:30":
                  time = 14.5 * 3600 * 1000;
                  break;
                  
                  case "15:00":
                  time = 15 * 3600 * 1000;
                  break;
                  
                  case "15:30":
                  time = 15.5 * 3600 * 1000;
                  break;
                  
                  case "16:00":
                  time = 16 * 3600 * 1000;
                  break;
                  
                  case "16:30":
                  time = 16.5 * 3600 * 1000;
                  break;
                  
                  case "17:00":
                  time = 17 * 3600 * 1000;
                  break;
                  
                  case "17:30":
                  time = 17.5 * 3600 * 1000;
                  break;
                  
                  case "18:00":
                  time = 18 * 3600 * 1000;
                  break;
                  
                  case "18:30":
                  time = 18.5 * 3600 * 1000;
                  break;
                  
                  
                  case "19:00":
                  time = 19 * 3600 * 1000;
                  break;
                  
                  case "19:30":
                  time = 19.5 * 3600 * 1000;
                  break;
                  
                  
                  
                  case "20:00":
                  time = 20 * 3600 * 1000;
                  break;
                  
                  case "20:30":
                  time = 20.5 * 3600 * 1000;
                  break;
                  
                  
                  case "21:00":
                  time = 21 * 3600 * 1000;
                  break;
                  
                  case "21:30":
                  time = 21.5 * 3600 * 1000;
                  break;
                  
                  
                  
                  }
                  
                  return time;
    }


                  
    function add_studyplan_schedule(sub_id,start_data,start_time,remind_before,notes)
    {
                  
                  try
                  {
                  
                  var arrD = start_data.split('-');
                  var d = new Date(parseInt(arrD[0]),parseInt(arrD[1]) -1,parseInt(arrD[2]),0,0,0,0);
                  //d.setFullYear(parseInt(arrD[0]),parseInt(arrD[1]) -1,parseInt(arrD[2]),0,0,0);
                  
                  var time = getTimeInSeconds(start_time);
                  //alert("getTimeInSeconds --------- start_time = "+start_time + " , converted time = "+time);
                  var r_time = getTimeBefore(remind_before);
                  d = d.getTime() + time - r_time;
                  d = new Date(d);
                  
                  window.plugins.localNotification.add({
                                                       date: d,
                                                       repeat:'',
                                                       message: 'This is reminder for your study plan! Notes:'+notes,
                                                       hasAction: true,
                                                       badge: 1,
                                                       id: '3',
                                                       sound:'horn.caf',
                                                       background:'studyBackground',
                                                       foreground:'studyRunning'
                                                       });
                  
                  }
                  catch(e)
                  {
                  console.log("Error while adding study plan schedule "+e);
                  }
                  
                  
    }
                  
                      
    
	function reset_study_plan_form()
	{
		is_study_plan_edit=false;
		$('#study_plan_subject_id').parent().parent().removeClass("error_border");
		$('#study_plan_start_date').parent().parent().removeClass("error_border");
		$('#study_plan_start_time').parent().parent().removeClass("error_border");

		$('#study_plan_subject_id').val('0');
		$('#study_plan_start_date').val('');
		$('#study_plan_start_time').val('0');
		$('#study_plan_reminder_time').val('0');
		$("#study_plan_notes").val('');		
	}
	
	window.render_study_plans=function()
	{
		//populate the home screen cell
		var home_cell_study_plan='';
		
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
    					$("#my_study_plan_list").html("");
						$("#home_main_cells #study_plan ul").html("");
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				//only display 4 study plans on the home cell
	        				if(get_current_date()<=row.start_date&&i<4)
	        				{
	        					home_cell_study_plan="<li><span>"+format_date(row.start_date)+" </span>"+short_string(row.title,10)+"</li>";
	        					
	            				//home screen study plan cell
	            				$("#home_main_cells #study_plan ul").append(home_cell_study_plan);
	        				}
	        				
	        				$("#my_study_plan_list").append
	        				(
		        				"<div>"+
		        					"<div id='"+row.id+"'>"+
		        					"<table>"+
			        					"<tr>"+
			        						"<td align='left' width='80%'><span class='study_plan_date_time'>"+long_string(row.title)+"</span>"+
				        					"<p>"+format_date(row.start_date)+" - "+row.start_time+"</p></td>"+
				        					"<td width='10%'>"+
				        						"<a href='#add_new_study_plan' class='edit' tag='"+row.id+"'><img src='images/edit.png' width='30' /></a>"+
		        								"<span class='delete' tag='"+row.id+"'><img src='images/delete.png' width='30' /></span>"+
				        					"</td>"+
				        				"</tr>"+			        				
		        					"</table>"+
		        					"</div>"+
			        				"<div class='"+row.id+" toggle_message'>"+
			        					"<p class='notes'>"+row.notes+"</p>"+
			        				"</div>"+
			        			"</div>"
			        		);
        				}
        				
					},
					study_plan_errorHandler
				);
			}
		);
		
	}

	render_study_plans();

	function study_plan_errorHandler(transaction, error) 
	{
		alert('Oops. Error was '+error.message+' (Code '+error.code+')');
		return true;
	}

	$("#view_study_plans").on("click","#my_study_plan_list div div",function(event)
	{
    	var toggle_class=$(this).attr('id');
    	$("."+toggle_class).toggle();
	});
	
	create_date_spinner("#study_plan_start_date");
});