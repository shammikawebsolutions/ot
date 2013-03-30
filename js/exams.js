$(document).ready(function()
{		
	var delete_exam_id='';
	var edit_exam_id='';
	var is_exam_edit=false;

	$('#exam_color_picker_div').farbtastic('#exam_color_picker_textbox');
	
	$("#exam_color_picker_textbox").click(function()
	{
		$("#exam_color_picker_dialog").dialog("open");
	});
	
	$("#exam_color_picker_dialog").dialog
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
				$("#exam_color_picker_dialog").dialog("close");
            }
        }
	})	
	
	$("#view_exams").on("click","#my_exams_list div div .delete",function(event)
	{
		$("#delete_exam_confirm").dialog("open");
		delete_exam_id=$(this).attr('tag');    		
	});
	
	$("#delete_exam_confirm").dialog
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
		        		transaction.executeSql('DELETE FROM exams WHERE id='+delete_exam_id+';');
		        	}
		    	);
	        	
				render_exams();
                $(this).dialog("close");
            },
            "No": function() 
            {
                $(this).dialog("close");
            }
        }
    });
    	
	//EDIT 	
	$("#view_exams").on("click","#my_exams_list div div .edit",function(event)
	{
		reset_exam_form();
		
		edit_exam_id=$(this).attr('tag');
		$("#add_new_exam .toolbar h1").html("Edit Exam");
		is_exam_edit=true;
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM exams WHERE id=?;',
    				[edit_exam_id],
    				function(transaction,result) 
    				{
    					for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				$("#exam_subject_id").val(row.subject_id);
	        				//$("#exam_color_picker_textbox").val(row.colour_code);
	        				$("#exam_color_picker_textbox").css('background-color',row.colour_code);

	        				$('#exam_location').val(row.location);
	        				$("#exam_date").val(row.exam_date);
	        				$("#exam_start_time").val(row.start_time);
	        				$("#exam_end_time").val(row.end_time);
	        				$("#exam_notes").val(row.notes);
        				}
					},
					errorHandler
				);
			}
		);		
	});
	
	$("#add_new_exam_button").click(function()
	{
		reset_exam_form();
		$("#add_new_exam .toolbar h1").html("Add Exam");
	});
	
	function reset_exam_form()
	{
		is_exam_edit=false;
		
		$('#exam_subject_id').parent().parent().removeClass("error_border");
		$('#exam_location').parent().parent().removeClass("error_border");
		$('#exam_date').parent().parent().removeClass("error_border");
		$('#exam_start_time').parent().parent().removeClass("error_border");
		$('#exam_end_time').parent().parent().removeClass("error_border");
		
		$('#exam_subject_id').val('');
		$('#exam_location').val('');
		$("#exam_date").val('');
		$("#exam_start_time").val('');
		$("#exam_end_time").val('');
		$("#exam_notes").val('');
	}

	$("#add_new_exam form").submit(add_new_exam_entry);
	
	function add_new_exam_entry()
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
							display_alert('Before you can add exams, you must first add subjects.!','No Subjects found','Ok');
							return false;
						}
					}
				)
			}
		);
		
		var exam_subject_id=$('#exam_subject_id').val();
		var exam_location=$('#exam_location').val();
		var exam_date=$("#exam_date").val();
		var exam_start_time=$("#exam_start_time").val();
		var exam_end_time=$("#exam_end_time").val();
		var exam_notes=$("#exam_notes").val();
		var exam_colour_code=$("#exam_color_picker_textbox").css('background-color');
		var error=false;

		$('#exam_subject_id').parent().parent().removeClass("error_border");
		$('#exam_location').parent().parent().removeClass("error_border");
		$('#exam_date').parent().parent().removeClass("error_border");
		$('#exam_start_time').parent().parent().removeClass("error_border");
		$('#exam_end_time').parent().parent().removeClass("error_border");
		
		if(exam_subject_id==''||exam_subject_id=='0'||exam_subject_id==0)
		{
			$('#exam_subject_id').parent().parent().addClass("error_border");
			error=true;
		}
		if(exam_location=='')
		{
			$('#exam_location').parent().parent().addClass("error_border");
			error=true;
		}
		if(exam_date=='')
		{
			$('#exam_date').parent().parent().addClass("error_border");
			error=true;
		}
		if(!is_exam_edit&&is_past_date(exam_date))
		{
			$('#exam_date').parent().parent().addClass("error_border");
			error=true;
		}
		if(exam_start_time=='')
		{
			$('#exam_start_time').parent().parent().addClass("error_border");
			error=true;
		}
		if(exam_end_time!='')
		{
			//alert(exam_start_time+"="+exam_end_time);
			var start_time=exam_start_time.replace(":","");
			var end_time=exam_end_time.replace(":","");
			//alert(start_time+"="+end_time);
			if(start_time>end_time)
			{
				$('#exam_start_time').parent().parent().addClass("error_border");
				$('#exam_end_time').parent().parent().addClass("error_border");
				error=true;
			}
			else
			{
				//error=false;
			}
		}
		if(!error)
		{
			if(is_exam_edit)
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	    				transaction.executeSql
	    				(
	    					"UPDATE exams SET subject_id=?,location=?,exam_date=?,start_time=?,end_time=?,colour_code=?,notes=? WHERE id="+edit_exam_id, 
	    					[exam_subject_id,exam_location,exam_date,exam_start_time,exam_end_time,exam_colour_code,exam_notes]
	    				);

	    				is_exam_edit=false;
	    				render_exams();
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
		        			'INSERT INTO exams '+
		        			'(user_id,subject_id,location,exam_date,start_time,end_time,colour_code,notes) '+
		        			'VALUES (?,?,?,?,?,?,?,?);',
		        			[user_id,exam_subject_id,exam_location,exam_date,exam_start_time,exam_end_time,exam_colour_code,exam_notes],
		        			function()
		        			{
		        				render_exams();
			        			jQT.goBack();
			        		},
		        			errorHandler
	        			);
	    			}
				);
			}

			reset_exam_form();
		}
		return false;
	}

	window.render_exams=function()
	{
		//populate the home screen cell
		var home_cell_exams='';
		var home_cell_exams_count=1;
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT e.*,s.title FROM exams e JOIN subjects s ON (e.subject_id=s.id) WHERE e.user_id=? ORDER BY e.exam_date,e.start_time;',
    				[user_id],
    				function(transaction,result) 
    				{
    					$("#my_exams_list").html("");
    					$("#home_main_cells #exams ul").html("");
    					
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);

	        				//if(i<2)//only display 4 exams on the home cell
	        				if(get_current_date()<=row.exam_date&&home_cell_exams_count<5)
	        				{	        					
	        					//home_cell_exams=home_cell_exams+"<li>"+short_string(row.title)+"<br /><span>"+format_date(row.exam_date)+" - "+row.start_time+"</span></li>";
	        					home_cell_exams=home_cell_exams+"<li><span>"+format_date(row.exam_date)+"</span> "+short_string(row.title,10)+"</li>";
	        					home_cell_exams_count++;
	        				}
	        				
	        				$("#my_exams_list").append
	        				(
		        				"<div>"+
		        					"<div id='"+row.id+"'>"+
		        					"<table>"+
			        					"<tr>"+
			        						"<td width='10%'><span class='colour_code_block' style='background-color:"+row.colour_code+";'></span></td>"+
				        					"<td align='left' width='80%'><span class='exam_date_time'>"+long_string(row.title)+"</span>"+
				        						"<p>"+format_date(row.exam_date)+" "+row.start_time+" - "+row.end_time+"</p>"+
				        						"<p>"+row.location+"</p>"+
				        					"</td>"+
				        					"<td width='10%'>"+
				        						"<a href='#add_new_exam' class='edit' tag='"+row.id+"'><img src='images/edit.png' width='30' /></a>"+
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
        				
        				//home screen exams cell
        				$("#home_main_cells #exams ul").html(home_cell_exams);
        				
					},
					errorHandler
				);
			}
		);
		
	}

	render_exams();

	function errorHandler(transaction, error) 
	{
		//alert('Oops. Error was '+error.message+' (Code '+error.code+')');
		return true;
	}

	$("#view_exams").on("click","#my_exams_list div div",function(event)
	{
    	var toggle_class=$(this).attr('id');
    	$("."+toggle_class).toggle();
	});
	
	create_date_spinner("#exam_date");
	
	/*$("#exam_date").focus(function()
	{
		var now=new Date();
		var days={ };
		var years={ };
		var months={ 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
		
		for( var i=1; i < 32; i += 1 ) {
			days[i]=i;
		}

		for( i=now.getFullYear(); i < now.getFullYear()+10; i += 1 ) {
			years[i]=i;
		}

		SpinningWheel.addSlot(years, 'right', now.getFullYear());
		SpinningWheel.addSlot(months, '', (now.getMonth()+1));
		SpinningWheel.addSlot(days, 'right', now.getDate());
		
		SpinningWheel.setCancelAction(function()
		{
    		//alert(SpinningWheel.getSelectedValues().values);
		});
		
		SpinningWheel.setDoneAction(function()
		{
			var date=SpinningWheel.getSelectedValues().values.toString().split(",");
			date=date[0]+"-"+get_numerical_month(date[1])+"-"+date[2];
			$("#exam_date").val(date);    			
		});
		
		SpinningWheel.open();
	});*/

	//$("#my_exams_list div").accordion();
});