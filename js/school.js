$(document).ready(function()
{
	var is_school_edit=false;
	var edit_school_id=0;
	
	db.transaction
	(
		function(transaction) 
		{
			transaction.executeSql
			(
				'SELECT * FROM school WHERE user_id=? LIMIT 1;',
				[user_id],
				function(transaction,result) 
				{
					if(result.rows.length>0)
					{
						is_school_edit=true;
					}
					else
					{
						$("#school_logo").html("<img style='padding-top:10px;' src='images/university.png' width='64' />");
					}
					
					for(var i=0;i<result.rows.length;i++) 
    				{
        				var row=result.rows.item(i);
        				
        				edit_school_id=row.id;
        				$('#school_name').val(row.name);
        				$('#school_url').val(row.url);
        				$('#school_details').val(row.details);
    				}
				},
				school_errorHandler
			);
		}
	);
	
	function reset_school_form()
	{
		/*$('#school_name').val('');
		$('#school_url').val('');
		$("#school_details").val('');*/
	}
	
	$("#add_new_school form").submit(add_new_school);

	function add_new_school()
	{
		var school_name=$('#school_name').val();
		var school_url=$('#school_url').val();
		var school_details=$("#school_details").val();
		var is_school_edit=false;
		var error=false;

		$('#school_name').parent().parent().removeClass("error_border");
		$('#school_url').parent().parent().removeClass("error_border");
		
		if(school_name=='')
		{
			$('#school_name').parent().parent().addClass("error_border");
			error=true;
		}
		if(school_url=='')
		{
			$('#school_url').parent().parent().addClass("error_border");
			error=true;
		}
		else
		{
			if(school_url.search("http://")==-1)
			{
				school_url="http://"+school_url;
			}
		}
	
		if(!error)
		{
			if(is_school_edit)
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	    				transaction.executeSql
	    				(
	    					"UPDATE school SET name=?,url=?,detils=? WHERE user_id="+user_id,
	    					[school_name,school_url,school_details]
	    				);

	    				render_school_home_cell();
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
		        			'INSERT INTO school '+
		        			'(user_id,name,url,detils) '+
		        			'VALUES (?,?,?,?);',
		        			[user_id,school_name,school_url,school_details],
		        			function()
		        			{		        				
		        				render_school_home_cell();
			        			jQT.goBack();
			        			is_school_edit=true;
			        		},
			        		school_errorHandler
	        			);
	    			}
				);
			}
			reset_school_form();
		}
		return false;
	}
	
	$("#home_page_wrapper").on("click","#school_logo",function(event)
	{
		var url=$("#open_school_link").attr('tag');
		var refe=window.open(url,'_blank','location=yes');
	});	
	
	function render_school_home_cell()
	{
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
					'SELECT * FROM school WHERE user_id=? ORDER BY id DESC LIMIT 1;',
					[user_id],
					function(transaction,result) 
					{
						if(result.rows.length>0)
						{
							for(var i=0;i<result.rows.length;i++) 
		    				{
		        				var row=result.rows.item(i);
		        				$("#school_first_a").removeAttr('href');
		        				$("#school_logo").html
		        				(
		        					"<img tag='"+row.url+"' id='open_school_link' src='images/university-icon.gif' width='80' />"
        						);
		    				}
						}
						else
						{
							
						}
	    				
					},
					school_errorHandler
				);
			}
		);	
	}
	
	render_school_home_cell();
	
	function school_errorHandler(transaction, error) 
	{
		alert('SCHOOL Error was '+error.message+' (Code '+error.code+')');
		return true;
	}
});