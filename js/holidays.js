$(document).ready(function()
{		
	var delete_holiday_id='';
	var edit_holiday_id='';
	var is_holiday_edit=false;
	
	$('#holiday_color_picker_div').farbtastic('#holiday_color_picker_textbox');
	
	$("#holiday_color_picker_textbox").click(function()
	{
		$("#holiday_color_picker_dialog").dialog("open");
	});
	
	$("#holiday_color_picker_dialog").dialog
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
				$("#holiday_color_picker_dialog").dialog("close");
            }
        }
	})	
	
	$("#view_holidays").on("click","#my_holidays_list div div .delete",function(event)
	{
		$("#delete_holiday_confirm").dialog("open");
		delete_holiday_id=$(this).attr('tag');    		
	});
	
	$("#delete_holiday_confirm").dialog
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
		        		transaction.executeSql('DELETE FROM holidays WHERE id='+delete_holiday_id+';');
		        	}
		    	);
	        	
				render_holidays();
                $(this).dialog("close");
            },
            "No": function() 
            {
                $(this).dialog("close");
            }
        }
    });
    	
	//EDIT 	
	$("#view_holidays").on("click","#my_holidays_list div div .edit",function(event)
	{		
		reset_holiday_form();
		
		edit_holiday_id=$(this).attr('tag');
		$("#add_new_holiday .toolbar h1").html("Edit Holiday");
		is_holiday_edit=true;
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM holidays WHERE id=?;',
    				[edit_holiday_id],
    				function(transaction,result) 
    				{
    					for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);

	        				//$("#holiday_color_picker_textbox").val(row.colour_code);
	        				$("#holiday_color_picker_textbox").css('background-color',row.colour_code);
	        				$('#holiday_title').val(row.title);
	        				$("#holiday_location").val(row.location);
	        				$('#holiday_start_date').val(row.start_date);
	        				$("#holiday_end_date").val(row.end_date);
	        				$("#holiday_notes").val(row.notes);
        				}
					},
					errorHolidayHandler
				);
			}
		);		
	});
	
	$("#add_new_holiday_button").click(function()
	{
		$("#add_new_holiday .toolbar h1").html("Add Holiday");
		reset_holiday_form();
	});
	
	$("#add_new_holiday form").submit(add_new_holiday_entry);

	function add_new_holiday_entry()
	{
		var holiday_title=$('#holiday_title').val();
		var holiday_location=$('#holiday_location').val();
		var holiday_start_date=$("#holiday_start_date").val();
		var holiday_end_date=$("#holiday_end_date").val();
		var holiday_notes=$("#holiday_notes").val();
		var holiday_colour_code=$("#holiday_color_picker_textbox").css('background-color');
		
		var holiday_error=false;

		$('#holiday_title').parent().parent().removeClass("error_border");
		$('#holiday_location').parent().parent().removeClass("error_border");
		$('#holiday_start_date').parent().parent().removeClass("error_border");
		$('#holiday_end_date').parent().parent().removeClass("error_border");
		
		if(holiday_title=='')
		{
			$('#holiday_title').parent().parent().addClass("error_border");
			holiday_error=true;
		}
		if(holiday_start_date=='')
		{
			$('#holiday_start_date').parent().parent().addClass("error_border");
			holiday_error=true;
		}
		if(is_past_date(holiday_start_date))
		{
			$('#holiday_start_date').parent().parent().addClass("error_border");
			holiday_error=true;
		}
		if(holiday_end_date=='')
		{
			$('#holiday_end_date').parent().parent().addClass("error_border");
			holiday_error=true;
		}
		if(is_past_date(holiday_end_date))
		{
			$('#holiday_end_date').parent().parent().addClass("error_border");
			holiday_error=true;
		}
		if(!check_date_range(holiday_end_date,holiday_start_date))
		{
			$('#holiday_start_date').parent().parent().addClass("error_border");
			$('#holiday_end_date').parent().parent().addClass("error_border");
			holiday_error=true;
		}
		
		if(!holiday_error)
		{
			if(is_holiday_edit)//EDIT
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	    				transaction.executeSql
	    				(
	    					"UPDATE holidays SET title=?,colour_code=?,location=?,start_date=?,end_date=?,notes=? WHERE id="+edit_holiday_id, 
	    					[holiday_title,holiday_colour_code,holiday_location,holiday_start_date,holiday_end_date,holiday_notes]
	    				);

	    				is_holiday_edit=false;
	    				render_holidays();
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
		        			'INSERT INTO holidays '+
		        			'(user_id,title,colour_code,location,start_date,end_date,notes) '+
		        			'VALUES (?,?,?,?,?,?,?);',
		        			[user_id,holiday_title,holiday_colour_code,holiday_location,holiday_start_date,holiday_end_date,holiday_notes],
		        			function()
		        			{
		        				render_holidays();
			        			jQT.goBack();
			        		},
		        			errorHolidayHandler
	        			);
	    			}
				);
			}

			reset_holiday_form();
		}
		return false;
	}

	function reset_holiday_form()
	{
		is_holiday_edit=false;
		
		$('#holiday_title').val('');
		$('#holiday_location').val('');
		$("#holiday_start_date").val('');
		$("#holiday_end_date").val('');
		$("#holiday_notes").val('');
		
		$('#holiday_title').parent().parent().removeClass("error_border");
		$('#holiday_location').parent().parent().removeClass("error_border");
		$('#holiday_start_date').parent().parent().removeClass("error_border");
		$('#holiday_end_date').parent().parent().removeClass("error_border");
	}
	
	function render_holidays()
	{
		//populate the home screen cell
		var home_cell_holidays='';
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM holidays WHERE user_id=? ORDER BY start_date,title;',
    				[user_id],
    				function(transaction,result) 
    				{
    					$("#my_holidays_list").html("");
						$("#home_main_cells #home_holidays_cell").html("");
        				var html="";
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				$("#my_holidays_list").append
	        				(
        						"<div>"+
		        					"<div id='"+row.id+"'>"+
		        					"<table>"+
			        					"<tr>"+
			        						"<td width='10%'><span class='colour_code_block' style='background-color:"+row.colour_code+";'></span></td>"+
				        					"<td align='left' width='80%'><span>"+row.title+"</span>"+
				        						"<p>"+row.location+"</p>"+				        					
				        						"<p>"+format_date(row.start_date)+" - "+format_date(row.end_date)+"</p>"+
				        					"</td>"+
				        					"<td width='10%'>"+
				        						"<a href='#add_new_holiday' class='edit' tag='"+row.id+"'><img src='images/edit.png' width='30' /></a>"+
		        								"<span class='delete' tag='"+row.id+"'><img src='images/delete.png' width='30' /></span>"+
		        							"</td>"+
				        				"</tr>"+			        				
		        					"</table>"+
		        					"</div>"+
			        				"<div class='"+row.id+" toggle_message'>"+
		        						"<p>"+row.notes+"</p>"+
			        				"</div>"+
			        			"</div>"
	        				);
	        				
	        				if(i<2)//only display 4 subjects on the home cell
	        				{
	        					var start_date=format_date(row.start_date,true);	        					
	        					var end_date=format_date(row.end_date,true);
	        						
	        					home_cell_holidays=home_cell_holidays+
	        						"<h4>"+short_string(row.title)+"</h4>"+
	        						"<p>"+start_date+" - "+end_date+"</p>";
	        				}
        				}
        				
        				//home screen holidays cell
        				$("#home_main_cells #home_holidays_cell").html(home_cell_holidays);
					},
					errorHolidayHandler
				);
			}
		);
		
	}

	render_holidays();

	$("#view_holidays").on("click","#my_holidays_list div div",function(event)
	{
    	var toggle_class=$(this).attr('id');
    	$("."+toggle_class).toggle();
	});
	
	function errorHolidayHandler(transaction, error) 
	{
		alert('Oops. Error was '+error.message+' (Code '+error.code+')');
		return true;
	}

	create_date_spinner("#holiday_start_date");
	
	create_date_spinner("#holiday_end_date");
	
});