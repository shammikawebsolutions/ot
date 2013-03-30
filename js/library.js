$(document).ready(function()
{		
	var delete_library_book_id='';
	var edit_library_book_id='';
	var is_library_edit=false;
		
	$('#library_color_picker_div').farbtastic('#library_color_picker_textbox');
	
	$("#library_color_picker_textbox").click(function()
	{
		$("#library_color_picker_dialog").dialog("open");
	});
	
	$("#library_color_picker_dialog").dialog
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
				$("#library_color_picker_dialog").dialog("close");
            }
        }
	})	
	
	$("#view_library_books").on("click","#my_library_books_list div div .delete",function(event)
	{
		$("#delete_library_book_confirm").dialog("open");
		delete_library_book_id=$(this).attr('tag');    		
	});
	
	$("#delete_library_book_confirm").dialog
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
		        		transaction.executeSql('DELETE FROM library WHERE id='+delete_library_book_id+';');
		        	}
		    	);
	        	
				render_library_books();
                $(this).dialog("close");
            },
            "No": function() 
            {
                $(this).dialog("close");
            }
        }
    });
    	
	//EDIT 	
	$("#view_library_books").on("click","#my_library_books_list div div .edit",function(event)
	{
		reset_library_form();
		
		edit_library_book_id=$(this).attr('tag');
		$("#add_new_library_book .toolbar h1").html("Edit Library Book");
		is_library_edit=true;
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM library WHERE id=?;',
    				[edit_library_book_id],
    				function(transaction,result) 
    				{
    					for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				$('#library_book_title').val(row.title);
	        				$('#library_book_author').val(row.author);
	        				$("#library_book_isbn").val(row.isbn);
	        				$("#library_book_subject").val(row.subject);
	        				$("#library_book_publisher").val(row.publisher);
	        				$("#library_book_return_date").val(row.return_date);
	        				//$("#library_color_picker_textbox").val(row.color);
	        				$("#library_book_description").val(row.description);
        				}
					},
					errorHandler
				);
			}
		);		
	});
		
	$("#add_new_study_plan_button").click(function()
	{
		reset_study_plan_form();
		$("#add_new_study_plan .toolbar h1").html("Add Study Plan");
	});
	
	function reset_library_form()
	{
		is_library_edit=false;
		
		$('#library_book_title').val('');
		$('#library_book_author').val('');
		$("#library_book_isbn").val('');
		$("#library_book_subject").val('');
		$("#library_book_publisher").val('');
		$("#library_book_return_date").val('');
		$("#library_color_picker_textbox").val('');
		$("#library_book_description").val('');
		
		$('#library_book_title').parent().parent().removeClass("error_border");
		$('#library_book_subject').parent().parent().removeClass("error_border");
		$("#library_book_return_date").parent().parent().removeClass("error_border");
	}

	$("#add_new_library_book form").submit(add_new_library_book_entry);

	function add_new_library_book_entry()
	{
		var library_book_title=$('#library_book_title').val();
		var library_book_author=$('#library_book_author').val();
		var library_book_isbn=$("#library_book_isbn").val();
		var library_book_subject=$("#library_book_subject").val();
		var library_book_publisher=$("#library_book_publisher").val();
		var library_book_return_date=$("#library_book_return_date").val();
		var library_book_color_picker=$("#library_color_picker_textbox").css('background-color');
		var library_book_description=$("#library_book_description").val();
		var error=false;

		$('#library_book_title').parent().parent().removeClass("error_border");
		$('#library_book_subject').parent().parent().removeClass("error_border");
		
		if(library_book_title=='')
		{
			$('#library_book_title').parent().parent().addClass("error_border");
			error=true;
		}
		if(library_book_subject=='')
		{
			$('#library_book_subject').parent().parent().addClass("error_border");
			error=true;
		}
		if(!is_library_edit&&is_past_date(library_book_return_date))
		{
			$('#library_book_return_date').parent().parent().addClass("error_border");
			error=true;
		}

		if(!error)
		{
			if(is_library_edit)
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	    				transaction.executeSql
	    				(
	    					"UPDATE library SET title=?,author=?,isbn=?,subject=?,publisher=?,return_date=?,color=?,description=? WHERE id="+edit_library_book_id,
	    					[library_book_title,library_book_author,library_book_isbn,library_book_subject,library_book_publisher,library_book_return_date,library_book_color_picker,library_book_description]
	    				);

	    				is_study_plan_edit=false;
	    				render_library_books();
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
		        			'INSERT INTO library '+
		        			'(user_id,title,author,isbn,subject,publisher,return_date,color,description) '+
		        			'VALUES (?,?,?,?,?,?,?,?,?);',
		        			[user_id,library_book_title,library_book_author,library_book_isbn,library_book_subject,library_book_publisher,library_book_return_date,library_book_color_picker,library_book_description],
		        			function()
		        			{		        				
		        				render_library_books();
			        			jQT.goBack();
			        		},
		        			errorHandler
	        			);
	    			}
				);
			}
			reset_library_form();
		}
		return false;
	}

	function render_library_books()
	{
		//populate the home screen cell
		var home_cell_library='';
		
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM library WHERE user_id=? ORDER BY title;',
    				[user_id],
    				function(transaction,result) 
    				{
    					$("#my_library_books_list").html("");
						$("#home_main_cells #library ul").html("");
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);

	        				if(i<4)//only display 4 exams on the home cell
	        				{
	        					//var home_cell_library_date=row.start_date.split("-");
	        					//home_cell_library_date=home_cell_library_date[2]+"/"+home_cell_library_date[1]+"/"+home_cell_library_date[0].substr(2,2);
	        					
	        					home_cell_library=home_cell_library+"<li>"+short_string(row.title)+"</li>";
	        				}
	        				
	        				$("#my_library_books_list").append
	        				(
		        				"<div>"+
		        					"<div id='"+row.id+"'>"+
		        					"<table>"+
			        					"<tr>"+
			        						"<td width='10%'><span class='colour_code_block' style='background-color:"+row.color+";'></span></td>"+
				        					"<td align='left' width='80%'>"+
				        						"<span class='library_book_date_time'>"+long_string(row.title)+"</span>"+
				        						"<br /><span>"+format_date(row.return_date)+"</span>"+
				        					"</td>"+				        					
				        					"<td width='10%'>"+
				        						"<a href='#add_new_library_book' class='edit' tag='"+row.id+"'><img src='images/edit.png' width='30' /></a>"+
		        								"<span class='delete' tag='"+row.id+"'><img src='images/delete.png' width='30' /></span>"+
				        					"</td>"+
				        				"</tr>"+			        				
		        					"</table>"+
		        					"</div>"+
			        				"<div class='"+row.id+" toggle_message'>"+
			        					"<p>Author: "+row.author+"</p>"+
			        					"<p>ISBN: "+row.isbn+"</p>"+
			        					"<p>Subject: "+row.subject+"</p>"+
			        					"<p>"+row.description+"</p>"+
			        				"</div>"+
			        			"</div>"
			        		);
        				}
        				
        				//home screen study plan cell
        				$("#home_main_cells #library ul").html(home_cell_library);
					},
					errorHandler
				);
			}
		);
		
	}

	render_library_books();

	function errorHandler(transaction, error) 
	{
		alert('Oops. Error was '+error.message+' (Code '+error.code+')');
		return true;
	}

	$("#view_library_books").on("click","#my_library_books_list div div",function(event)
	{
    	var toggle_class=$(this).attr('id');
    	$("."+toggle_class).toggle();
	});
	
	create_date_spinner("#library_book_return_date");
});