$(document).ready(function()
{		
	var complete_task_id='';	
	var delete_task_id='';		
	
	$("#view_tasks").on("click","#my_task_list div h3 input[type='checkbox']",function(event)
	{
		if($(this).is(":checked"))
		{
			if($(this).parent().parent().attr('class')!="completed")
			{
				complete_task_id=$(this).attr('id').split('_');
				complete_task_id=complete_task_id[1];
				$("#complete_task_confirm").dialog("open");				
			}
			else
			{
				delete_task_id=$(this).attr('id').split('_');
				delete_task_id=delete_task_id[1];
				$("#delete_completed_task_confirm").dialog("open");		
			}
		}
	});
	
	$("#view_tasks").on("click","#my_task_list .delete",function(event)
	{
		var task_id=$(this).attr('tag');
		delete_task_id=task_id;
		$("#delete_completed_task_confirm").dialog('option','title',"Are you sure you want to delete the task?").dialog("open");
	});
	
	$("#complete_task_confirm").dialog
	({
        resizable	: 	false,
		autoOpen	: 	false,
        height		:	140,
        modal		: 	true,
        buttons		: 
		{
            "Yes": function() 
            {
				complete_task(complete_task_id);
				//alert(complete_task_id);
				render_tasks(0);
				render_my_tasks_list();
                $(this).dialog("close");
            },
            "No": function() 
            {
                $(this).dialog("close");
                $("#my_task_list div h3 input[type='checkbox']").prop("checked",false);
            }
        }
    });
    	
	$("#delete_completed_task_confirm").dialog
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
		        		transaction.executeSql('DELETE FROM tasks WHERE id='+delete_task_id+';');
		        	}
		    	);

				render_tasks(0);
				render_my_tasks_list();
                $(this).dialog("close");
            },
            "No": function() 
            {
                $(this).dialog("close");
                $("#my_task_list div h3 input[type='checkbox']").prop("checked",false);
            }
        }
    });
	
	db.transaction
	(
    	function(transaction) 
    	{
    		//transaction.executeSql('drop table tasks');
    		//transaction.executeSql('drop table task_types');
    		
    		transaction.executeSql
			(
				'SELECT * FROM task_types WHERE user_id=? AND title="Personal";',
				[user_id],
				function(transaction,result)
				{		        				    
					if(result.rows.length==0)
					{
			    		transaction.executeSql
						(
			    			'INSERT INTO task_types (user_id,title) VALUES (?,?);',
			    			[user_id,"Personal"]
			    		);
					}
				}
			);
    		
    		transaction.executeSql
			(
				'SELECT * FROM task_types WHERE user_id=? AND title="Work";',
				[user_id],
				function(transaction,result)
				{		        				    
					if(result.rows.length==0)
					{
			    		transaction.executeSql
						(
			    			'INSERT INTO task_types (user_id,title) VALUES (?,?);',
			    			[user_id,"Work"]
			    		);
					}
				}
			);    		
    	}
	);

	$("#add_new_task_list form").submit(add_new_task_list_entry);
			
	function add_new_task_list_entry()
	{
		var task_list_title=$("#task_list_title").val();
		var task_list_error=false;

		$('#task_list_title').parent().parent().removeClass("error_border");

		if(task_list_title=='')
		{
			$('#task_list_title').parent().parent().addClass("error_border");
			task_list_error=true;
		}
		
		if(!task_list_error)
		{
			db.transaction
			(
    			function(transaction) 
    			{
        			transaction.executeSql
        			(
	        			'INSERT INTO task_types '+
	        			'(user_id,title) '+
	        			'VALUES (?,?);',
	        			[user_id,task_list_title],
	        			function()
	        			{
	        				$('#task_list_title').val('');
	        				render_tasks(0);
		        			jQT.goBack();
		        		},
	        			errorTaskHandler
        			);
    			}
			);

			$('#task_list_title').parent().parent().removeClass("error_border");
		}
		render_my_tasks_list();
		return false;
	}
	
	$("#add_new_task form").submit(add_new_task_entry);

	function add_new_task_entry()
	{
		var task_title=$('#task_title').val();
		var task_date=$("#task_date").val();
		var task_start_time=$("#task_start_time").val();
		var task_reminder_time=$("#task_reminder_time").val();
		var task_type=$("#task_type").val();
		var task_category=$("#task_category").val();
		var colour_code=$("#task_color_picker").val();
		var task_notes=$("#task_notes").val();
		var task_error=false;

		$('#task_title').parent().parent().removeClass("error_border");
		$('#task_date').parent().parent().removeClass("error_border");
		$('#task_type').parent().parent().removeClass("error_border");
		
		if(task_title=='')
		{
			$('#task_title').parent().parent().addClass("error_border");
			task_error=true;
		}
		if(task_type=='')
		{
			$('#task_type').parent().parent().addClass("error_border");
			task_error=true;
		}
		if(task_date=='')
		{
			$('#task_date').parent().parent().addClass("error_border");
			task_error=true;
		}
		if(is_past_date(task_date))
		{
			$('#task_date').parent().parent().addClass("error_border");
			task_error=true;
		}
		if(task_date!='')//check if a past date
		{
			/*
			//alert(task_start_date+"="+task_end_date);
			var start_time=task_start_date.replace(":","");
			var end_time=task_end_date.replace(":","");
			//alert(start_time+"="+end_time);
			if(start_time>end_time)
			{
				$('#task_start_date').parent().parent().addClass("error_border");
				$('#task_end_date').parent().parent().addClass("error_border");
				task_error=true;
			}
			else
			{
				//error=false;
			}*/
		}
		if(!task_error)
		{
			db.transaction
			(
    			function(transaction) 
    			{
        			transaction.executeSql
        			(
	        			'INSERT INTO tasks '+
	        			'(user_id,title,type,category,due_date,start_time,reminder_time,notes) '+
	        			'VALUES (?,?,?,?,?,?,?,?);',
	        			[user_id,task_title,task_type,task_category,task_date,task_start_time,task_reminder_time,task_notes],
	        			function()
	        			{
	        				$('#task_title').val('');
	        				$("#task_date").val('');
	        				$("#task_type").val('');
	        				$("#task_notes").val('');
	        				$("#task_start_time").prop("selectedIndex",0);
	        				$("#task_reminder_time").prop("selectedIndex",0);
	        				render_tasks(0);
		        			jQT.goBack();
		        		},
	        			errorTaskHandler
        			);
    			}
			);

			$('#task_title').parent().parent().removeClass("error_border");
			$('#task_date').parent().parent().removeClass("error_border");
			$('#task_type').parent().parent().removeClass("error_border");
			
			if(task_reminder_time!="")
			{
				add_task_schedule(task_date,task_title,task_start_time,task_reminder_time);
			}
		}
           
           
        render_my_tasks_list();
                  
		return false;
	}
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
    
    function add_task_schedule(task_date,task_title,start_time,remind_before)
    {
                  
                  try
                  {
                  
                  var arrD = task_date.split('-');
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
								                      message: 'The '+task_title+' task is to be Done!',
								                      hasAction: true,
								                      badge: 1,
								                      id: '2',
								                      sound:'horn.caf',
								                      background:'taskBackground',
								                      foreground:'taskRunning'
                                                       });
                  
                  }
                  catch(e)
                  {
                  console.log("Error while adding study plan schedule "+e);
                  }
                  
                  
    }
    
    //Add functionality to schedule task notification
    function aadd_task_schedule(task_date,task_title)
    {
                  try
                  {
                  var arrD = task_date.split('-');
                  var d = new Date(parseInt(arrD[0]),parseInt(arrD[1]) -1,parseInt(arrD[2]),6,0,0);
                  //d.setFullYear(parseInt(arrD[0]),parseInt(arrD[1]) -1,parseInt(arrD[2]),6,0,0);
                  //alert('task_date '+task_date+' date is '+d + " window.plugins.localNotification = "+window.plugins.localNotification);
                  //d = d.getTime() + 30*1000; //60 seconds from now
                  d = new Date(d);
                  window.plugins.localNotification.add({
                                                       date: d,
                                                       repeat:'',
                                                       message: 'The '+task_title+' task is to be done!',
                                                       hasAction: true,
                                                       badge: 1,
                                                       id: '2',
                                                       sound:'horn.caf',
                                                       background:'taskBackground',
                                                       foreground:'taskRunning'
                                                       });
                  
                  
                  //only for testing purpose
                  /*var d = new Date();
                   d = d.getTime() + 15*1000; //60 seconds from now
                   d = new Date(d);
                   
                   window.plugins.localNotification.scheduleAlarm({
                   date: d,
                   message: 'This is just for testing!'
                   });*/
                  
                  }
                  catch(e)
                  {
                  console.log("add_task_schedule error "+e);
                  }
        
    }
                  

	function complete_task(task_id)
	{
		var today_date=new Date();
		today_date=today_date.getFullYear()+"-"+(today_date.getMonth()+1)+"-"+today_date.getDate();
		
		db.transaction
		(
	    	function(transaction) 
	    	{
	    		transaction.executeSql
	        	(
		        	'UPDATE tasks SET category=4,completed_date=? WHERE id=?;',
		        	[today_date,task_id],
		        	function(transaction,result)
		        	{
		        	},
					errorTaskHandler
	        	);
	    	}
	    );
	}
	
	function check_overdue_tasks()
	{
		var today_date=new Date();
		
		var date=today_date.getDate();
		if(date<10)
		{
			date="0"+date;
		}
		today_date=today_date.getFullYear()+"-"+(today_date.getMonth()+1)+"-"+date;
			//alert('UPDATE tasks SET category=2 WHERE category!=1 AND category!=4 AND due_date<='+today_date);	
		db.transaction
		(
	    	function(transaction) 
	    	{
	    		transaction.executeSql
	        	(
		        	'UPDATE tasks SET category=2 WHERE category!=1 AND category!=4 AND due_date<?;',
		        	[today_date],
		        	function(transaction,result)
		        	{
		        	},
					errorTaskHandler
	        	);
	    	}
	    );
	}
	
	function render_my_tasks_list()
	{
		db.transaction
		(
			function(transaction) 
			{
				var html="";
				var select_html="";
				$("#my_task_list_list").html("");
				$("#task_type").html("");
				
				transaction.executeSql
				(
    				'SELECT * FROM task_types WHERE user_id=? ORDER BY title;',
    				[user_id],
    				function(transaction,result)
    				{		        				    					
        				for(var i=0;i<result.rows.length;i++)
        				{	
            				var row=result.rows.item(i);
        					select_html=select_html+
	        					"<option value='"+row.id+"'>"
	        						+row.title+
	        					"</option>";
        				}
        				//$("#task_type").html("<option value='0'>All Tasks</option>"+select_html);
        				$("#task_type").html(select_html);
    				}
    			);
				
				var num_of_tasks_array=new Array();
				var total_num_of_tasks=0;
				
				console.log('SELECT type,COUNT(id) as num_of_tasks FROM tasks WHERE category!=4  GROUP BY type;');
				transaction.executeSql
				(
    				'SELECT type,COUNT(id) as num_of_tasks FROM tasks WHERE category!=?  GROUP BY type;',
    				[4],
    				function(transaction_inner,result_inner)
    				{
						for(var ii=0;ii<result_inner.rows.length;ii++)
        				{
	        				var row_inner=result_inner.rows.item(ii);
	        				num_of_tasks_array[row_inner.type]=row_inner.num_of_tasks;
	        				total_num_of_tasks=total_num_of_tasks+row_inner.num_of_tasks;
        				}
    				},
					errorTaskHandler	        				
				);
				
				transaction.executeSql
				(
    				//'SELECT tt.*,count(t.id) as num_of_tasks FROM task_types tt LEFT JOIN tasks t ON (tt.id=t.type) WHERE t.user_id=? GROUP BY tt.id ORDER BY tt.title;',
					'SELECT * FROM task_types WHERE user_id=? ORDER BY title;',
    				[user_id],
    				function(transaction,result)
    				{     		
						var num_of_tasks=0;
        				for(var i=0;i<result.rows.length;i++)
        				{
	        				var row=result.rows.item(i);

	        				var task_type_id='task_type_'+row.id;
	        				
	        				if(num_of_tasks_array[row.id]==undefined)
	        				{
	        					num_of_tasks=0;
	        				}
	        				else
	        				{
	        					num_of_tasks=num_of_tasks_array[row.id];
	        				}
	        				                   
	        				html=html+
        					"<a href='#view_tasks'>"+
        						"<div class='task_type' alt='"+row.title+"' tag='"+row.id+"'>"+
	        						"<div>"+	        					
	        							"<h3>"+long_string(row.title)+
		        						"<span>"+num_of_tasks+"</span></h3>"+
	    							"</div>"+
	    						"</div>"+
	    					"</a>";
        				}
        				$("#my_task_list_list").html("<a href='#view_tasks'><div class='task_type' alt='All Tasks' tag='0'><div><h3>All Tasks<span>"+total_num_of_tasks+"</span></h3></div></div></a>"+html);
					},
					errorTaskHandler
				);
			}
		);
	}
	
	var clicked_task_type_id=0;
	var h1_label="All Tasks";
	$("#add_task_summary_list").on("click","#my_task_list_list .task_type",function(event)
	{
		clicked_task_type_id=$(this).attr('tag');
		h1_label=$(this).attr('alt');
		render_tasks(clicked_task_type_id);
		$("#task_type").val(clicked_task_type_id);
	});	
	
	function render_tasks(selected_task_type_id)
	{
		//populate the home screen cell
		var home_cell_tasks='';
		var number_of_home_cell_tasks=0;
		
		check_overdue_tasks();

		var html="";
		$("#my_task_list").html("");
		
		if(selected_task_type_id==0)//all tasks
		{
			var sql='SELECT t.*,tt.title as task_list_type FROM tasks t LEFT JOIN task_types tt ON (tt.id=t.type) WHERE category=? AND (t.type=? OR t.type!=0) ORDER BY t.due_date ASC,completed_date DESC;';			
		}
		else
		{
			var sql='SELECT t.*,tt.title as task_list_type FROM tasks t LEFT JOIN task_types tt ON (tt.id=t.type) WHERE category=? AND t.type=? ORDER BY t.due_date ASC,completed_date DESC;';
		}

		db.transaction
		(
			function(transaction) 
			{
				for(var categories=1;categories<5;categories++)
				{
					transaction.executeSql
					(
						//1=urgent,2=overdue,3=upcoming,4=completed===>categories
	    				sql,
	    				[categories,selected_task_type_id],
	    				function(transaction,result)
	    				{		        				
	        				var category_class_name='upcoming';

	    					if(result.rows.length>0)
	    					{	    						
		    					var row=result.rows.item(0);
		    					
		    					if(row.category==1)//urgent
		        				{
		        					category_class_name='urgent';
			    					html=html+"<h2 id='urgent'>Urgent</h2>";
		        				}
		        				else if(row.category==2)//overdue
		        				{
		        					category_class_name='overdue';
		        					html=html+"<h2 id='overdue'>Overdue</h2>";
		        				}
		        				else if(row.category==3)//upcoming
		        				{
		        					category_class_name='upcoming';	
		        					html=html+"<h2 id='upcoming'>Upcoming</h2>";	        					
		        				}
		        				else//completed
		        				{
		        					category_class_name='completed';
		        					html=html+"<h2 id='completed'>Completed</h2>";		
		        				}
	    					}
	    					
	        				for(var i=0;i<result.rows.length;i++)
	        				{
		        				row=result.rows.item(i);

		        				if(number_of_home_cell_tasks<4&&category_class_name!="completed")//only display 4 on the home cell
		        				{	
		        					//home_cell_tasks=home_cell_tasks+"<li><span>"+format_date(row.due_date)+" - </span><br />"+short_string(row.title)+"</li>";
		        					home_cell_tasks=home_cell_tasks+"<li><span>"+format_date(row.due_date)+" </span>"+short_string(row.title,10)+"</li>";
		        					
		        					number_of_home_cell_tasks++;
		        				}
		        				
		        				var label_id='label_'+row.id;
		        				
		        				if(row.task_list_type==null)
        						{
        							var task_list_type="(All Tasks)";
        						}
        						else
        						{
        							var task_list_type="("+row.task_list_type+")";
        						}
		        				
		        				if(row.category==4)//completed
        						{
		        					//alert("here");
		        					var completed_or_due_date="<p>Completed on : "+format_date(row.completed_date)+"</p>";
        						}
        						else
        						{
        							var completed_or_due_date="<p>Due on : "+format_date(row.due_date)+"</p>";
        						}
		        				
		        				html=html+
	        					"<div class='"+category_class_name+"'>"+	        					
	        						"<h3>"+
	        							"<input type='checkbox' id='"+label_id+"'/><label for='"+label_id+"'>"+row.title+"</label>"+
	        							"<span class='delete' tag='"+row.id+"'><img src='images/delete.png' width='30' /></span>"+
	        						"</h3>"+
	        						completed_or_due_date+
	        						"<span>"+row.notes+"</span>"+
	        						task_list_type+
	        					"</div>";

		        				$("#my_task_list").html(html);
	        				}
	        				
	        				//home screen tasks cell
	        				$("#home_main_cells #task_list ul").html(home_cell_tasks);
	        				
	        				$("#view_tasks h1").html(h1_label);
						},
						errorTaskHandler
					);
				}
			}
		);	
	}
	render_my_tasks_list();
	
	render_tasks(0);

	function errorTaskHandler(transaction, error) 
	{
		//alert('Oops. Error was '+error.message+' (Code '+error.code+')');
		return true;
	}

	create_date_spinner("#task_date");
});