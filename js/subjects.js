$(document).ready(function()
{
	var delete_subject_id='';
	var edit_subject_id='';
	var is_subject_edit=false;
	var current_date=get_current_date();
	
	$('#subject_color_picker_div').farbtastic('#subject_color_picker_textbox');
	
	$("#subject_color_picker_textbox").click(function()
	{
		$("#subject_color_picker_dialog").dialog("open");
	});
	
	$("#subject_color_picker_dialog").dialog
	({
		resizable	: 	false,
		autoOpen	: 	false,
        height		:	340,
        width		:	230,
        modal		: 	true,
        buttons		: 
		{
            "Ok": function() 
            {
				$("#subject_color_picker_dialog").dialog("close");
            }
        }
	});
	
	$("#view_subjects").on("click","#my_subjects_list div div .delete",function(event)
	{
		delete_subject_id=$(this).attr('tag');
		$("#delete_subject_confirm").dialog("open");
	});	
	
	$("#delete_subject_confirm").dialog
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
		        		transaction.executeSql('DELETE FROM subjects WHERE id='+delete_subject_id+';');
		        		
		        		transaction.executeSql('DELETE FROM exams WHERE subject_id='+delete_subject_id+';');
		        		
		        		transaction.executeSql('DELETE FROM study_plan WHERE subject_id='+delete_subject_id+';');
		        	}
		    	);
	        	
				render_subjects();
				render_exams();
				render_study_plans();
				
				$("#delete_subject_confirm").dialog("close");
            },
            "No": function() 
            {
            	$("#delete_subject_confirm").dialog("close");
            }
        }
    });
    	
	//EDIT	
	$("#view_subjects").on("dblclick","#my_subjects_list div div .edit",function(event)
	{
		//alert("A");
		// $('#view_subjects #my_subjects_list div div .edit').trigger('click');
	});
			
	$("#jqt").on("click",".add_subject",function(event)
	{
		reset_subject_form();
		$("#add_new_subject .toolbar h1").html("Add Subject");
	});
				
	$("#view_subjects").on("click","#my_subjects_list div div .edit",function(event)
	{
		reset_subject_form();
		
		edit_subject_id=$(this).attr('tag');
		$("#add_new_subject .toolbar h1").html("Edit Subject");
		is_subject_edit=true;
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM subjects WHERE id=?;',
    				[edit_subject_id],
    				function(transaction,result) 
    				{
    					for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				$('#subject_title').val(row.title);
	        				$("#subject_abbreviation").val(row.abbreviation);
	        				$('#subject_location').val(row.location);
	        				$("#subject_days").val(row.days);
	        				$("#subject_start_time").val(row.start_time);
	        				$("#subject_end_time").val(row.end_time);
	        				$("#subject_notes").val(row.notes);
	        				//$("#subject_color_picker_textbox").val(row.colour_code);
	        				$("#subject_color_picker_textbox").css('background-color',row.colour_code);
	        				$("#semester_end_date").val(row.semester_end_date);
	        				$("#semester_start_date").val(row.semester_start_date);

	        				$("#lecturer_name").val(row.lecturer);
	        				$("#lecturer_phone").val(row.lecturer_phone);
	        				$("#lecturer_email").val(row.lecturer_email);
	        				$("#lecturer_office_location").val(row.lecturer_office_location);
        				}
					},
					subject_errorHandler
				);
			}
		);		
	});
	
	$("#add_new_subject_button").click(function()
	{
		reset_subject_form();
		$("#add_new_subject .toolbar h1").html("Add Subject");
	});

	function reset_subject_form()
	{
		id_subject_edit=false;
		
		$('#subject_title').parent().removeClass("error_border");
		$('#subject_location').parent().removeClass("error_border");
		$('#subject_days').parent().removeClass("error_border");
		$('#subject_start_time').parent().removeClass("error_border");
		$('#subject_end_time').parent().removeClass("error_border");
		$('#lecturer_email').parent().removeClass("error_border");
		$("#semester_start_date").parent().removeClass("error_border");
		$("#semester_end_date").parent().removeClass("error_border");
		
		$('#subject_title').val('');
		$('#subject_abbreviation').val('');		        				
		$('#subject_location').val('');
		$("#subject_days").val('');
		$("#subject_start_time").val('');
		$("#subject_end_time").val('');
		$("#subject_notes").val('');
		$("#semester_start_date").val('');
		$("#semester_end_date").val('');
		
		$("#lecturer_name").val('');
		$("#lecturer_phone").val('');
		$("#lecturer_email").val('');
		$("#lecturer_office_location").val('');
	}

	$("#add_new_subject form").submit(add_new_subject_entry);

	function add_new_subject_entry()
	{
		var subject_title=$('#subject_title').val();
		var subject_abbreviation=$("#subject_abbreviation").val();
		var subject_location=$('#subject_location').val();
		var subject_days=$("#subject_days").val();
		var subject_start_time=$("#subject_start_time").val();
		var subject_end_time=$("#subject_end_time").val();
		var subject_notes=$("#subject_notes").val();
		var colour_code=$("#subject_color_picker_textbox").css('background-color');
		var semester_start_date=$("#semester_start_date").val();
		var semester_end_date=$("#semester_end_date").val();
		
		var lecturer_name=$("#lecturer_name").val();
		var lecturer_phone=$("#lecturer_phone").val();
		var lecturer_email=$("#lecturer_email").val();
		var lecturer_office_location=$("#lecturer_office_location").val();
				
		var subject_error=false;

		$('#subject_title').parent().removeClass("error_border");
		$('#subject_location').parent().removeClass("error_border");
		$('#subject_days').parent().removeClass("error_border");
		$('#subject_start_time').parent().removeClass("error_border");
		$('#subject_end_time').parent().removeClass("error_border");
		$('#lecturer_email').parent().removeClass("error_border");
		$("#semester_start_date").parent().removeClass("error_border");
		$("#semester_end_date").parent().removeClass("error_border");
				
		if(subject_title=='')
		{
			$('#subject_title').parent().addClass("error_border");
			subject_error=true;
		}
		if(subject_location=='')
		{
			$('#subject_location').parent().addClass("error_border");
			subject_error=true;
		}
		if(subject_days=='')
		{
			$('#subject_days').parent().addClass("error_border");
			subject_error=true;
		}
		if(subject_start_time=='')
		{
			$('#subject_start_time').parent().addClass("error_border");
			subject_error=true;
		}
		if(subject_end_time!='')
		{
			var start_time=subject_start_time.replace(":","");
			var end_time=subject_end_time.replace(":","");
			
			if(start_time>end_time)
			{
				$('#subject_start_time').parent().addClass("error_border");
				$('#subject_end_time').parent().addClass("error_border");
				subject_error=true;
			}
		}
		if(semester_start_date=="")
		{
			$('#semester_start_date').parent().addClass("error_border");
			subject_error=true;
		}
		else if(is_past_date(semester_start_date))
		{
			//$('#semester_start_date').parent().addClass("error_border");
			//subject_error=true;
		}
		if(semester_end_date=="")
		{
			$('#semester_end_date').parent().addClass("error_border");
			subject_error=true;
		}
		else if(is_past_date(semester_end_date))
		{
			$('#semester_end_date').parent().addClass("error_border");
			subject_error=true;
		}
		if(!check_date_range(semester_end_date,semester_start_date))
		{
			$('#semester_start_date').parent().addClass("error_border");
			$('#semester_end_date').parent().addClass("error_border");
			subject_error=true;
		}
		if(lecturer_email!=""&&!validate_email_address(lecturer_email))
		{
			$('#lecturer_email').parent().addClass("error_border");
			subject_error=true;
		}
		if(!subject_error)
		{
			if(is_subject_edit)//EDIT
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	    				transaction.executeSql
	    				(
	    					"UPDATE subjects SET title=?,semester_start_date=?,semester_end_date=?,abbreviation=?,location=?,days=?,start_time=?,end_time=?,colour_code=?,notes=?,lecturer=?,lecturer_phone=?,lecturer_email=?,lecturer_office_location=? WHERE id="+edit_subject_id, 
	    					[subject_title,semester_start_date,semester_end_date,subject_abbreviation,subject_location,subject_days,subject_start_time,subject_end_time,colour_code,subject_notes,lecturer_name,lecturer_phone,lecturer_email,lecturer_office_location]
	    				);

	    				is_subject_edit=false;
        				render_subjects();
	        			jQT.goBack();
	    			}
	    		);		    
			}
			else//INSERT
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	        			transaction.executeSql
	        			(
		        			'INSERT INTO subjects '+
		        			'(user_id,title,abbreviation,location,days,start_time,end_time,semester_start_date,semester_end_date,colour_code,notes,lecturer,lecturer_phone,lecturer_email,lecturer_office_location) '+
		        			'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
		        			[user_id,subject_title,subject_abbreviation,subject_location,subject_days,subject_start_time,subject_end_time,semester_start_date,semester_end_date,colour_code,subject_notes,lecturer_name,lecturer_phone,lecturer_email,lecturer_office_location],
		        			function(tx,resultSet)
		        			{
		        				$('#subject_title').val('');
		        				$('#subject_abbreviation').val('');		        				
		        				$('#subject_location').val('');
		        				$("#subject_days").val('');
		        				$("#subject_start_time").val('');
		        				$("#subject_end_time").val('');
		        				$("#subject_notes").val('');
		        				$("#semester_start_date").val('');
		        				$("#semester_end_date").val('');
		        				
		        				$("#lecturer_name").val('');
		        				$("#lecturer_phone").val('');
		        				$("#lecturer_email").val('');
		        				$("#lecturer_office_location").val('');
		        				
		        				render_subjects();
		        				//alert(resultSet.insertId);
			        			jQT.goBack();
		        				//jQT.goTo($('#add_teacher_to_subject'),'flip'); 
			        		},
		        			subject_errorHandler
	        			);
	    			}
				);
			}

			$('#subject_title').parent().removeClass("error_border");
			$('#subject_location').parent().removeClass("error_border");
			$('#subject_days').parent().removeClass("error_border");
			$('#subject_start_time').parent().removeClass("error_border");
			$('#subject_end_time').parent().removeClass("error_border");
			$('#lecturer_email').parent().removeClass("error_border");
			$("#semester_start_date").parent().removeClass("error_border");
			$("#semester_end_date").parent().removeClass("error_border");
		}
		return false;
	}
	
	var date=new Date();
	var current_day=date.getDay();
	
	//Rotate through the days of the week, starting from current day
	var display_day=0;
	var found_next_subject=false;
	window.populate_time_table_list=function()
	{
		found_next_subject=false;
		for(var count=1;count<=7;count++)
		{
			if(count==1)
			{
				display_day=current_day;
			}
			else
			{
				display_day++;
				if(display_day==7)
				{
					display_day=0;
				}
			}
			render_timetable_list(display_day);
		}
	}
	
	window.render_timetable_list=function(display_day)
	{	
		$("#view_timetable_list_results").html("");
		$("#timetable ul").html("");			
		
		var current_minutes=date.getMinutes();
		var current_hours=date.getHours();
		
		if(current_minutes<10)
		{
			current_minutes="0"+current_minutes;
		}
		if(current_hours<10)
		{
			current_hours="0"+current_hours;
		}
		var current_time=date.getHours()+":"+current_minutes;	
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
					'SELECT * FROM subjects WHERE days=? AND semester_end_date>=? ORDER BY days,start_time;',
					[display_day,current_date],
					function(transaction,result) 
					{
	    				for(var i=0;i<result.rows.length;i++) 
	    				{
	        				var row=result.rows.item(i);
	        				var what_day_in_week='next '+get_what_day_in_week(row.days);
	        				var today=new Date();
    						if(today.getDay()==row.days)
    						{
    							var date_label=Date.today().toString('dddd, dd/MMM/yyyy');
    						}
    						else
    						{
    							var date_label=Date.parse(what_day_in_week).toString('dddd, dd/MMM/yyyy');
    						}
    						
	        				$("#view_timetable_list_results").append
	        				(
        						"<tr>"+
	        						"<td>"+
	        							"<div class='date'>"+date_label+"</div>"+
	        							"<div class='details'>"+
	        								"<div style='border-left:10px solid "+row.colour_code+"'>"+
	        									"<p>"+row.title+"</p>"+
	        									"<span>"+row.start_time+" ~ "+row.end_time+"</span>"+
	        								"</div>"+
	        							"</div>"+
	        						"</td>"+
	        					"</tr>"
	        				);
	        				
	        				//until the next subject is found, keep looping through
	        				if(!found_next_subject)
	        				{
		        				if(current_day==display_day)//&&row.start_time>current_time)
		        				{
		        					//console.log(row.start_time+"+"+current_time)
		        					if(row.start_time>current_time)
		        					{
			        					//populate the home timetable cell			        					
			        					//home timetable cell, only the first upcoming subject
			        					var home_cell_timetable='';	        			        					
			        					home_cell_timetable="<li>"+short_string(row.title)+"</li>";
				        					
			        					if(row.lecturer!='')
			        					{
			        						home_cell_timetable=home_cell_timetable+"<li>"+short_string(row.lecturer)+"</li>";
			        					}
			        					if(row.start_time!='')
			        					{
			        						home_cell_timetable=home_cell_timetable+"<li>"+row.start_time+" - "+row.end_time+"</li>";
			        					}
			        					if(row.lecturer_office_location!='')
			        					{
			        						home_cell_timetable=home_cell_timetable+"<li>"+short_string(row.lecturer_office_location)+"</li>";
			        					}
			        					$("#timetable ul").html(home_cell_timetable);
			        					found_next_subject=true;
		        					}
		        				}
		        				else
		        				{
		        					//populate the home timetable cell			        					
		        					//home timetable cell, only the first upcoming subject
		        					var home_cell_timetable='';	        			        					
		        					home_cell_timetable="<li>"+short_string(row.title)+"</li>";
			        					
		        					if(row.lecturer!='')
		        					{
		        						home_cell_timetable=home_cell_timetable+"<li>"+short_string(row.lecturer)+"</li>";
		        					}
		        					if(row.start_time!='')
		        					{
		        						home_cell_timetable=home_cell_timetable+"<li>"+row.start_time+" - "+row.end_time+"</li>";
		        					}
		        					if(row.lecturer_office_location!='')
		        					{
		        						home_cell_timetable=home_cell_timetable+"<li>"+short_string(row.lecturer_office_location)+"</li>";
		        					}
		        					$("#timetable ul").html(home_cell_timetable);
		        					found_next_subject=true;
		        				}
	        				}
	    				}
					},
					subject_errorHandler
				);
			}
		);
	}
	
	var end_time='';
	var colour_code='';
	var title='';
	var subject_location='';

	window.populate_timetable_day=function(timetable_date)
	{

		end_time='';
		colour_code='';
		title='';
		subject_location='';

		$("#view_timetable_day_results").html("");
		
		if(timetable_date==undefined)
		{
			timetable_date=Date.today();
		}
		
		current_day=get_what_day_in_week_in_number(timetable_date.getDayName());
		
		var d=new Date();
		d.setHours(7);
		d.setMinutes(0);
		d.setSeconds(0);
		
		var minutes=0;
		
		db.transaction
		(
			function(transaction)
			{
				transaction.executeSql
				(
					'SELECT start_time FROM subjects WHERE semester_end_date>=? ORDER BY start_time LIMIT 1;',
					[get_current_date()],
					function(transaction,result)
					{
						if(result.rows.length==1)
						{
							var row=result.rows.item(0);
							find_first_subject(row.start_time);
							for(var i=0;i<34;i++)
							{
								var m=d.getMinutes();
								if(m==0)
								{
									m="00";
								}
								var t=d.getHours();
								if(t<10)
								{
									t="0"+t;
								}
								start_time=t+":"+m;

								render_timetable_day(current_day,start_time);
								
								minutes=d.getMinutes()+30;
								d.setMinutes(minutes);	
							}
						}
						else
						{
							for(var i=0;i<34;i++)
							{
								var m=d.getMinutes();
								if(m==0)
								{
									m="00";
								}
								var t=d.getHours();
								if(t<10)
								{
									t="0"+t;
								}
								start_time=t+":"+m;

								render_timetable_day(current_day,start_time);
								
								minutes=d.getMinutes()+30;
								d.setMinutes(minutes);	
							}
						}
					},
					function(){}
				);
			}
		);
		
		timetable_date=timetable_date.toString().split("00:00:00");
		$("#current_timetable_date").html(timetable_date[0]);
	}

	function render_timetable_day(current_day,start_time)
	{
		var temp_title='';
		var temp_colour_code="#F8F8FB";
		var temp_location='';

		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
					'SELECT * FROM subjects WHERE days=? AND start_time=? AND semester_end_date>=? ORDER BY start_time;',
					[current_day,start_time,current_date],
					function(transaction,result) 
					{		
						//console.log('SELECT * FROM subjects WHERE days='+current_day+' AND start_time='+start_time+' AND semester_end_date>='+current_date+' ORDER BY start_time;');
						if(result.rows.length==1)
						{
		    				for(var inner=0;inner<result.rows.length;inner++) 
		    				{
		        				var row=result.rows.item(inner);	
		        				//console.log(row.end_time);
		        				end_time=row.end_time;
		        				colour_code=row.colour_code;
		        				title=long_string(row.title);
		        				subject_location=long_string(row.location);
		        				
		        				$("#view_timetable_day_results").append
		        				(
		        					"<tr>"+
		        						"<td>"+
		        							"<div class='details'>"+
		        								"<div style='width:15%;'>"+start_time+"</div>"+
		        								"<div style='border-left:10px solid "+colour_code+"'>"+
		        									"<p>"+title+" <br />@ "+subject_location+"</p>"+
		        								"</div>"+
		        							"</div>"+
		        						"</td>"+
		        					"</tr>"
		        				);
		    				}
	    				}
						else
						{
							if(end_time!=undefined)
							{
								if(start_time<=end_time)
								{
									temp_title='';//title;
									temp_colour_code=colour_code;
									temp_location='';//" @ "+subject_location;
								}
								else
								{
									temp_title='';
									temp_colour_code="#F8F8FB";
									temp_location='';
								}
							}
        					$("#view_timetable_day_results").append
	        				(
	        					"<tr>"+
	        						"<td>"+
	        							"<div class='details'>"+
	        								"<div style='width:15%;'>"+start_time+"</div>"+
	        								"<div style='border-left:10px solid "+temp_colour_code+";'><p>"+temp_title+"<br />"+temp_location+"</p></div>"+
	        							"</div>"+
	        						"</td>"+
	        					"</tr>"
	        				);
        				}
					},
					subject_errorHandler
				);
			}
		);
	}

	var add_days=0;
	
	$("#view_timetable_day").on("click",".timetable_area .forward_arrow",function(event)
	{
		add_days=add_days+1;
		populate_timetable_day(Date.today().add(add_days).day());
	});

	$("#view_timetable_day").on("click",".timetable_area .back_arrow",function(event)
	{
		add_days=add_days-1;
		populate_timetable_day(Date.today().add(add_days).day());
		
	});
	
	var week_end_time='';
	var week_colour_code='';
	var temp_colour_code="#F8F8FB";
	var add_week=0;
	
	$("#view_timetable_week").on("click",".timetable_area .forward_arrow",function(event)
	{
		add_week=add_week+7;
		populate_timetable_week(Date.parse('sunday').add(add_week).day());
	});

	$("#view_timetable_week").on("click",".timetable_area .back_arrow",function(event)
	{
		add_week=add_week-7;
		populate_timetable_week(Date.parse('sunday').add(add_week).day());
		
	});
	
	window.populate_timetable_week=function(week_day)
	{
		var expiry_date=get_format_date(String(week_day).substring(4,15));
		//alert(expiry_date);
		$("#view_timetable_week_results_time").html("");
		$("#view_timetable_week_results_0").html("");
		$("#view_timetable_week_results_1").html("");
		$("#view_timetable_week_results_2").html("");
		$("#view_timetable_week_results_3").html("");
		$("#view_timetable_week_results_4").html("");
		$("#view_timetable_week_results_5").html("");
		$("#view_timetable_week_results_6").html("");
		
		var minutes=0;
		var start_time='';
		var d=new Date();
		//7->34, 9->30
		for(var day=0;day<7;day++)
		{
			d.setHours(7);
			d.setMinutes(0);
			d.setSeconds(0);

			week_end_time=undefined;
			for(var ii=0;ii<34;ii++)
			{
				var m=d.getMinutes();
				if(m==0)
				{
					m="00";
				}
				var t=d.getHours();
				if(t<10)
				{
					t="0"+t;
				}
				start_time=t+":"+m;
	
				if(day==0)
				{
					$("#view_timetable_week_results_time").append("<tr><td valign='middle'><div class='time'>"+start_time+"</div></td></tr>");
				}
				//console.log(week_day);
				render_timetable_week(day,expiry_date,start_time,"#view_timetable_week_results_"+day);
						
				minutes=d.getMinutes()+30;
				d.setMinutes(minutes);
			}
		}
		
		if(week_day==undefined)
		{
			week_day=Date.parse('sunday');
		}
		
		var last_day_of_week=week_day;
		
		week_day=week_day.toString().split("00:00:00");
		week_day=week_day[0];
		
		last_day_of_week=last_day_of_week.add(6).day().toString().split("00:00:00");
		last_day_of_week=last_day_of_week[0];
		
		$("#current_timetable_week").html(week_day+" - <br />"+last_day_of_week);
		
	}
	var current_working_day=0;
	
	function render_timetable_week(current_day,expiry_date,start_time,display_div_container)
	{
		$(display_div_container).append
		(
			"<colgroup>"+
			    "<col style='width:45px;'>"+
			    "<col style='width:45px;'>"+
			    "<col style='width:45px;'>"+
			    "<col style='width:45px;'>"+
			    "<col style='width:45px;'>"+
			    "<col style='width:45px;'>"+
			    "<col style='width:45px;'>"+
			 "</colgroup>"
		);
		
		if(expiry_date=="undefined--undefined")
		{
			expiry_date=current_date;
		}
		console.log(Date.parse(expiry_date));
		//console.log('SELECT * FROM subjects WHERE days='+current_day+' AND start_time='+start_time+' AND semester_end_date>='+current_date+' AND semester_end_date>='+expiry_date);
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
					'SELECT * FROM subjects WHERE days=? AND start_time=? AND semester_end_date>=? AND semester_end_date>=? ORDER BY start_time;',
					[current_day,start_time,current_date,expiry_date],
					function(transaction,result)
					{		
						if(result.rows.length==1)
						{
		    				for(var inner=0;inner<result.rows.length;inner++) 
		    				{
		        				var row=result.rows.item(inner);	
		        				week_end_time=row.end_time;
		        				week_colour_code=row.colour_code;
		        				current_working_day=row.days;
		        				
		        				$(display_div_container).append
		        				(
		        					"<tr>" +
			        					"<td>"+
		        							"<div style='opacity:0.9;background-color:"+week_colour_code+"'>"+row.abbreviation.substring(0,2).toUpperCase()+"</div>"+
		        						"</td>"+
		        					"</tr>"
	        					);
		    				}
	    				}
						else
						{
							if(week_end_time!=undefined)
							{
								if(start_time<=week_end_time&&current_working_day==current_day)
								{
									temp_colour_code=week_colour_code;
								}
								else
								{
									temp_colour_code="#F8F8FB";
								}
							}
							else
							{
								temp_colour_code="#F8F8FB";
							}
        												
							$(display_div_container).append
							(
								"<tr>"+
		        					"<td>"+
	        							"<div style='opacity:0.9;background-color:"+temp_colour_code+"'></div>"+
	        						"</td>"+
	        					"</tr>"
	        				);
						}
					},
					subject_errorHandler
				);
			}
		);
	}
	
	window.render_subjects=function()
	{	
		//populate the home screen cell
		var home_cell_subjects='';
				
		//populate subject plan subjects select box
		var subjects_select_box_content="<option value='0'>Select Your Subject</option>";
				
		//$("#my_subjects_list")
		db.transaction
		(
			function(transaction) 
			{
				//first display current ones
				transaction.executeSql
				(
    				'SELECT * FROM subjects WHERE user_id=? AND semester_end_date>=? ORDER BY days,start_time;',
    				[user_id,current_date],
    				function(transaction,result) 
    				{
    					$("#my_subjects_list").html("");
    					$("#home_main_cells #subjects ul").html("");
    					$("#study_plan_subject_id").html("");
    					$("#exam_subject_id").html("");
    					//$("#timetable ul").html("");
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				subjects_select_box_content=subjects_select_box_content+"<option value='"+row.id+"'>"+row.title+"</option>";
	        			
	        				if(i<4)//only display 4 subjects on the home cell
	        				{
	        					home_cell_subjects=home_cell_subjects+"<li>"+short_string(row.title)+"</li>";		        					
	        				}
	        				
	        				$("#my_subjects_list").append
	        				(
		        				"<div>"+
		        					"<div id='"+row.id+"'>"+
		        					"<table>"+
			        					"<tr>"+
			        						"<td width='10%'><span class='colour_code_block' style='background-color:"+row.colour_code+";'></span></td>"+
				        					"<td align='left' width='80%'><span class='subject_days_time'>"+long_string(row.title)+"</span>"+
				        					"<p>"+get_what_day_in_week(row.days)+" "+row.start_time+" - "+row.end_time+"</p>"+
				        					"<p>"+row.location+"</td>"+
				        					"<td width='10%'>"+
				        						"<a href='#add_new_subject' class='edit' tag='"+row.id+"'><img src='images/edit.png' width='30' /></a>"+
		        								"<span class='delete' tag='"+row.id+"'><img src='images/delete.png' width='30' /></span>"+
		        							"</td>"+
				        				"</tr>"+			        				
		        					"</table>"+
		        					"</div>"+
			        				"<div class='"+row.id+" toggle_message'>"+
		        						"<p>"+row.lecturer+"</p>"+
		        						"<p>"+row.lecturer_phone+"</p>"+
		        						"<p>"+row.lecturer_email+"</p>"+
		        						"<p>"+row.lecturer_office_location+"</p>"+      						
			        					"<p>"+row.notes+"</p>"+
			        				"</div>"+
			        			"</div>"
			        		);
        				}
        				
        				//home screen subjects cell
        				$("#home_main_cells #subjects ul").html(home_cell_subjects);
        				
        				$("#study_plan_subject_id").html(subjects_select_box_content);
        				$("#exam_subject_id").html(subjects_select_box_content);
        				
        				       				
					},
					subject_errorHandler
				);
				
				//then display the previous semester subjects
				transaction.executeSql
				(
    				'SELECT * FROM subjects WHERE user_id=? AND semester_end_date<? ORDER BY days,start_time;',
    				[user_id,current_date],
    				function(transaction,result) 
    				{
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				$("#my_subjects_list").append
	        				(
		        				"<div>"+
		        					"<div id='"+row.id+"'>"+
		        					"<table>"+
			        					"<tr>"+
			        						"<td width='10%'><span class='colour_code_block' style='background-color:"+row.colour_code+";'></span></td>"+
				        					"<td align='left' width='80%'><span class='subject_days_time'>"+long_string(row.title)+"</span>"+
				        					"<p>"+get_what_day_in_week(row.days)+" "+row.start_time+" - "+row.end_time+"</p>"+
				        					"<p>"+row.location+"</td>"+
				        					"<td width='10%'>"+
				        						"<a href='#add_new_subject' class='edit' tag='"+row.id+"'><img src='images/edit.png' width='30' /></a>"+
		        								"<span class='delete' tag='"+row.id+"'><img src='images/delete.png' width='30' /></span>"+
		        							"</td>"+
				        				"</tr>"+			        				
		        					"</table>"+
		        					"</div>"+
			        				"<div class='"+row.id+" toggle_message'>"+
		        						"<p>"+row.lecturer+"</p>"+
		        						"<p>"+row.lecturer_phone+"</p>"+
		        						"<p>"+row.lecturer_email+"</p>"+
		        						"<p>"+row.lecturer_office_location+"</p>"+      						
			        					"<p>"+row.notes+"</p>"+
			        				"</div>"+
			        			"</div>"
			        		);
                 
                            if(result.rows.length>0&&i==0)
                            {
                                //display a seperator
                                $("#my_subjects_list").append("<div class='seperator'>Past Semester Subjects</div>");
                            }
        				}
					},
					subject_errorHandler
				);
			}
		);

		populate_timetable_week();
		populate_timetable_day();
		populate_time_table_list();
	}

	render_subjects();

	function subject_errorHandler(transaction, subject_error) 
	{
		alert('Oops. subject_error was '+subject_error.message+' (Code '+subject_error.code+')');
		return true;
	}

	$("#view_subjects").on("click","#my_subjects_list div div",function(event)
	{
    	var toggle_class=$(this).attr('id');
    	$("."+toggle_class).toggle();
	});

	create_date_spinner("#semester_start_date");
	create_date_spinner("#semester_end_date");
});