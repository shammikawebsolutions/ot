$(document).ready(function()
{
	var record_id=0;
	
	$(".go_home").click(function()
	{
		jQT.goTo('#home','flip');
	});
	
	$(".create_new_record").click(function()
    {
		//jQT.goTo('#home','flip');
		try
		{
			navigator.device.capture.captureAudio(captureSuccess,captureError,{limit:2});
		}
		catch(e)
		{
			alert(e);
		}
	});
	
	function captureError(error)
	{
		//jQT.goTo('#view_records','flip');
		console.log("error");
	}
	
	function captureSuccess(mediaFiles)
	{
		var i,len;
	    for(i=0,len=mediaFiles.length;i<len;i+=1) 
	    {
	    	//uploadFile(mediaFiles[i]);
	    	
	    	var file_path=mediaFiles[i].fullPath;
	    	var file_size=mediaFiles[i].size;
	    	var file_name=mediaFiles[i].name;
	    	
            var record_title=$('#record_title').val();
	    	record_title=file_name;
                  
            var record_date=get_current_date();
            var record_time=get_current_time();
                  
			var error=false;
			var record_duration=0;
            mediaFiles[0].getFormatData(function(dataa)
            {
                record_duration=dataa.duration;
            });
			var notes='';

            console.log(mediaFiles[i]);
                  
			if(record_title=='')
			{
				$('#record_title').parent().parent().addClass("error_border");
				error=true;
			}
			if(!error)
			{
				db.transaction
				(
	    			function(transaction) 
	    			{
	        			transaction.executeSql
	        			(
		        			'INSERT INTO records '+
		        			'(user_id,title,record_date,record_time,duration,file_path,file_name,file_size,notes) '+
		        			'VALUES (?,?,?,?,?,?,?,?,?);',
		        			[user_id,record_title,record_date,record_time,record_duration,file_path,file_name,file_size,notes],
		        			function(tx,sql_res)
		        			{
		        				$('#record_title').val('');
		        				render_record_list();
                                $("#edit_record_file_name").val(record_title);
                                $("#edit_record_file_date").val(record_date+" - "+record_time);
			        			//jQT.goBack();
                                inserted_record_id=sql_res.insertId;
                                //alert(inserted_record_id);
			        		},
		        			errorHandler
	        			);
	    			}
                );
            }
            jQT.goTo('#view_records','flip');
			return false;
    	}
    }
	
    $("#edit_record_file form").submit(save_record_file_info);
                  
    function save_record_file_info()
    {
        var edit_record_file_name=$('#edit_record_file_name').val();
        var edit_record_file_notes=$('#edit_record_file_notes').val();
       
        var error=false;
        $('#edit_record_file_name').parent().parent().removeClass("error_border");
                  
        if(edit_record_file_name=='')
        {
            $('#edit_record_file_name').parent().parent().addClass("error_border");
            error=true;
        }
                  
        if(!error)
        {
            if(record_id>0)
            {
                db.transaction
                (
                   function(transaction)
                   {
                        transaction.executeSql
                        (
                            "UPDATE records SET title=?,notes=? WHERE id="+record_id,
                            [edit_record_file_name,edit_record_file_notes]
                        );
                 
                        render_record_list();
                        
                        $(".play_recording h1").html("Play : "+edit_record_file_name);
                        		
                        jQT.goBack();
                        return false;
                   }
                );
            }
        }
    }
	
	function render_record_list()
	{
		//$("#my_record_list")
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM records WHERE user_id=? ORDER BY record_date DESC;',
    				[user_id],
    				function(transaction,result) 
    				{
    					$("#my_record_list").html("");
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				var row=result.rows.item(i);
	        				
	        				var duration=row.duration;
	        				var hours,minutes,seconds=0;
	        				hours=parseInt(duration/3600);
	        				duration=duration%3600;
	        				minutes=parseInt(duration/60);
	        				duration=duration%60;
	        				seconds=parseInt(duration);
	        				duration=hours+"h "+minutes+"m "+seconds+"s";
	        					
	        				$("#my_record_list").append
	        				(
                                "<a tag='"+row.id+"' class='slideup view_record_file_playback' href='#view_record_file'>" +
		        				"<div>"+
		        					"<div>"+
			        					"<table>"+
				        					"<tr>"+
					        					"<td align='left' width='80%'>"+
                                                    "<span class='exam_date_time'>"+long_string(row.title)+"</span>"+
                                                    "<p>"+format_date(row.record_date)+" - "+row.record_time+"</p>"+
                                                    "<p>"+duration+"</p>"+
                                                "</td>"+
					        					"<td width='10%'>"+
                                                    "<a href='#edit_record_file' class='flip'><img class='record_file_edit' tag='"+row.id+"'  src='images/edit.png' width='30' /></a>"+
                                                    "<a href='#' class='delete' tag='"+row.id+"'><img src='images/delete.png' width=30' /></span>"+
                                                "</td>"+
					        				"</tr>"+
			        					"</table>"+
		        					"</div>"+
                                    "<p class='location hidden' style='display:none;' alt='"+row.file_path+"' />"+
			        			"</div>"+
                                "</a>"
			        		);
        				}
					},
					errorHandler
				);
			}
		);		
	}
    
    var delete_record_id='';
    var record_play_path='';
    $("#view_records").on("click","#my_record_list .delete",function(event)
    {
        delete_record_id=$(this).attr('tag');
        record_id=$(this).attr('tag');
        //alert(record_id);
        if(record_id!=undefined)
        {
            record_play_path=$("#"+record_id+" .location").attr('alt');
            console.log(record_id+" = "+record_play_path);
         
            $("#delete_record_confirm").dialog("open");
        }
    });
                
    $("#delete_record_confirm").dialog
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
                        transaction.executeSql('DELETE FROM records WHERE id='+delete_record_id+';');
		        	}
                );
                
                my_media.stop();
                mediaTimer = null;
                $(".play_recording h1").html("");
                $("#timebar").html("");
            
            	$("#play_recording").show();
            	$("#pause_recording").hide();
                playing = false; 
                record_play_path="";
                
                render_record_list();
                $("#delete_record_confirm").dialog("close");
            },
            "No": function() 
            {
                $("#delete_record_confirm").dialog("close");
            }
        }
    });
                  
	$("#view_records").on("click","#my_record_list .record_file_edit",function(event)
	{
        record_id=$(this).attr('tag');
        //alert("edit"+record_id);

        if(record_id!=undefined)
    	{
            db.transaction
            (
                function(transaction)
                {
                    transaction.executeSql
                    (
                        'SELECT * FROM records WHERE id=?;',
                        [record_id],
                        function(transaction,result)
                        {
                            for(var i=0;i<result.rows.length;i++)
                            {
                                var row=result.rows.item(i);
	        				
                                $('#edit_record_file_name').val(row.title);
                                $('#edit_record_file_date').val(format_date(row.record_date)+" - "+row.record_time);
                                $('#edit_record_file_notes').val(row.notes);
                                record_play_path=row.file_path;
                                console.log(record_id+" = "+record_play_path); 
                            }
                        },
                        errorHandler
                    );
                }
             );
    	}
	});	
	
    var my_media=null;
    var mediaTimer=null;
    var playing = false;
                  
    var window_width=$(window).width()-25;
    $('#progressbar').css('width',window_width);
    window_width=window_width+30;
    $(".play_recording").css('width',window_width+"px");
    
	//tap on the recorded items
    $("#view_records").on("click","#my_record_list .view_record_file_playback div table",function(event)
    {
        var view_record_file_playback_id=$(this).parent().parent().parent().attr('tag');
        //alert(view_record_file_playback_id);
        if(view_record_file_playback_id!=undefined)
        {
            playing = false; 
        	$("#play_recording").show();
        	$("#pause_recording").hide();
        	
        	/////////////////fetch_recording(view_record_file_playback_id);
        	if(my_media)
            {
                my_media.stop();
            }        
            mediaTimer = null;
            
    		var row=null;
    		db.transaction
    		(
    			function(transaction) 
    			{
    				transaction.executeSql
    				(
        				'SELECT * FROM records WHERE id=?;',
        				[view_record_file_playback_id],
        				function(transaction,result)
        				{
            				for(var i=0;i<result.rows.length;i++) 
            				{
    	        				row=result.rows.item(i);
                     
                                $(".play_recording h1").html("Play : "+long_string(row.title)); 
                                $("#timebar").html("");
                                record_play_path=row.file_path;
                                //alert(record_play_path);
                                
                                $("#play_recording").hide();
                            	$("#pause_recording").removeClass("hidden");
                            	$("#pause_recording").show();
                                //play_recording(record_play_path);
                                
                                
                                if(record_play_path!=undefined)
                                {
                                    my_media = new Media(record_play_path, onSuccess, onError);
                                    
                    	            if (!playing) 
                    	            {
                    	    	        // Play audio
                    	    	        my_media.play();
                    	    	        playing = true;	
                    	            }
                    	            else
                    	            {
                    	            	myMedia.pause();   
                    	                playing = false; 
                    	            }
                    	                      
                    	            // Update my_media position every second
                    	            if(mediaTimer == null)
                    	            {
                    	                mediaTimer = setInterval(function()
                    	                {
                    	                    // get my_media position
                    	                    my_media.getCurrentPosition
                    	                    (
                    	                        // success callback
                    	                        function(position)
                    	                        {
                    	                            if (position > -1)
                    	                            {
                    	                            	var duration=position;
                    	    	        				var hours,minutes,seconds=0;
                    	    	        				hours=parseInt(duration/3600);
                    	    	        				duration=duration%3600;
                    	    	        				minutes=parseInt(duration/60);
                    	    	        				duration=duration%60;
                    	    	        				seconds=parseInt(duration);
                    	    	        				duration=hours+"h "+minutes+"m "+seconds+"s";
                    	                                
                    	                                $("#timebar").html(duration);
                    	                                $('#progressbar').progressbar("value",position);
                    	                            }
                    	                        },
                    	                        // error callback
                    	                        function(e)
                    	                        {
                    	                            console.log("Error getting pos=" + e);
                    	                           //setAudioPosition("Error: " + e);
                    	                        }
                    	                    );
                    	                },1000);
                    	            }
                                }
                                
                                $("#progressbar").progressbar
                                ({
                                    max         :   row.duration,
                                    complete    :   function(event,ui)
                                    {
                                    }
                                });

            				}
    					},
    					errorHandler
    				);
    			}
    		);
    		/////////////////fetch_recording(view_record_file_playback_id);
    		
    		
        }
                                        
    });
                  
	function fetch_recording(recording_id)
	{
		/*
		if(my_media)
        {
            my_media.stop();
        }        
        mediaTimer = null;
        
		var row=null;
		db.transaction
		(
			function(transaction) 
			{
				transaction.executeSql
				(
    				'SELECT * FROM records WHERE id=?;',
    				[recording_id],
    				function(transaction,result)
    				{
        				for(var i=0;i<result.rows.length;i++) 
        				{
	        				row=result.rows.item(i);
                 
                            $(".play_recording h1").html("Play : "+long_string(row.title)); 
                            $("#timebar").html("");
                            record_play_path=row.file_path;
                            //alert(row.file_path);
                            $("#progressbar").progressbar
                            ({
                                max         :   row.duration,
                                complete    :   function(event,ui)
                                {
                                }
                            });

        				}
					},
					errorHandler
				);
			}
		);*/
	}
	
    $("#play_recording").click(function()
    {
    	$("#play_recording").hide();
    	$("#pause_recording").removeClass("hidden");
    	$("#pause_recording").show();
        play_recording(record_play_path);
    });
                                    
    function play_recording(path)
    {
    	/*if(my_media)
        {
            my_media.stop();
        }        
        mediaTimer = null;
        
        my_media = new Media(path, onSuccess, onError);*/
        //alert(playing);
        if (!playing) 
        {
	        // Play audio
	        my_media.play();
	        playing = true;	
        }
        else
        {
        	myMedia.pause();
            //document.getElementById('play').src = "images/play.png";    
            playing = false; 
        }
                  
        // Update my_media position every second
        if(mediaTimer == null)
        {
            mediaTimer = setInterval(function()
            {
                // get my_media position
                my_media.getCurrentPosition
                (
                    // success callback
                    function(position)
                    {
                        if (position > -1)
                        {
                        	var duration=position;
	        				var hours,minutes,seconds=0;
	        				hours=parseInt(duration/3600);
	        				duration=duration%3600;
	        				minutes=parseInt(duration/60);
	        				duration=duration%60;
	        				seconds=parseInt(duration);
	        				duration=hours+"h "+minutes+"m "+seconds+"s";
                            
                            $("#timebar").html(duration);
                            $('#progressbar').progressbar("value",position);
                        }
                    },
                    // error callback
                    function(e)
                    {
                        console.log("Error getting pos=" + e);
                       //setAudioPosition("Error: " + e);
                    }
                );
            },1000);
        }
    }

    $("#pause_recording").click(function()
    {
        if (my_media)
        {
        	playing = false; 
        	$("#play_recording").show();
        	$("#pause_recording").hide();
            my_media.pause();
        }
    });

    // Stop audio
    $("#stop_recording").click(function()
    {
        if(my_media)
        {
            my_media.stop();
        	$("#play_recording").show();
        	$("#pause_recording").hide();
            playing = false; 
        }        
        mediaTimer = null;
    });

    function onSuccess()
    {
        console.log("playAudio():Audio Success");
        $('#progressbar').progressbar("value",0);

    	$("#play_recording").show();
    	$("#pause_recording").hide();
        playing = false; 
    }

    // onError Callback
    function onError(error) 
    {
    	//alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
    }

	render_record_list();

	function errorHandler(transaction, error) 
	{
		//alert('Oops. Error was '+error.message+' (Code '+error.code+')');
		return true;
	}
                  
    $("#progressbar").progressbar
    ({
    });
});