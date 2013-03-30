$(document).ready(function()
{
	var width=$(window).width();
    var window_height=$(window).height()-30;
	
    var table_height=$("#home_page_1").height();
    var id_name='';
    
    var paid_ad_slots=new Array
    (
    	"home_page_wrapper_ad",
    	"my_holidays_list_wrapper_ad",
    	"my_exams_list_wrapper_ad",
    	"my_subjects_list_wrapper_ad",
    	"my_task_list_wrapper_ad",
    	"my_task_list_list_wrapper_ad",
    	"work_schedule_calendar_events_wrapper_ad",
    	"timetable_week_wrapper_ad",
    	"timetable_day_wrapper_ad",
    	"timetable_list_wrapper_ad",
    	"my_library_books_list_wrapper_ad",
    	"study_plan_calendar_events_wrapper_ad"
    );
    
    $.each(paid_ad_slots,function(i,val) 
	{
    	$("#"+paid_ad_slots[i]).css('height','0px');
		id_name=paid_ad_slots[i].replace("_ad","");
		$("#"+id_name).addClass("full_extended_wrapper");
	});
    
    function jsonp_callback(response)
    {
		response=JSON.parse(response);
        try // try to output this to the javascript console
        {
        	$.each(response,function(i,item)
        	{
        		//alert(item.type+"-"+item.url);
    			$("#"+item.type).css('height','60px');
    			id_name=item.type.replace("_ad","");
    			$("#"+id_name).removeClass("full_extended_wrapper");
    			
    			$("#"+item.type).html("<img href='"+item.url+"' src='http://www.onetimetable.com/ads/"+item.image+"' />");
	    		$("#"+item.type+" img").css("width",width);
        	});
        }
        catch(an_exception) // alert for the users that don't have a javascript console
        {
        	console.log('product id ' + response.item_id + ': quantity = ' + response.quantity + ' & price = ' + response.price);
        }
    }

	$.ajax
	({
		url				: 	'http://www.onetimetable.com/json/ads.php?callback=?',
		type			: 	"GET",
	    dataType		: 	"jsonp",
	    async			:	false,
	    jsonpCallback	: 	'jsonp_callback',
	    contentType		: 	"application/json",
	    
		beforeSend		:	function()
		{
			//alert("beforeSend");
		},
    	success			: 	function(data)
    	{
    		jsonp_callback(data);
			
    	},
    	error			: 	function(jqXHR, textStatus, errorThrown) 
    	{   
             console.log('Error Message: '+textStatus);
             console.log('HTTP Error: '+errorThrown);
        },
	});
});