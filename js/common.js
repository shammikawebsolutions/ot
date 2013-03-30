var home_page_wrapper;
var my_holidays_list_wrapper
var add_new_holiday_wrapper
var my_exams_list_wrapper;
var add_new_exam_wrapper;
var my_subjects_list_wrapper;
var add_new_subject_wrapper;
var my_task_list_wrapper;
var my_task_list_list_wrapper;
var work_schedule_calendar_events_wrapper;
var add_work_schedule_wrapper;
var timetable_week_wrapper;
var timetable_day_wrapper;
var timetable_list_wrapper;
var my_library_books_list_wrapper;
var add_new_library_book_wrapper;
var study_plan_calendar_events_wrapper;
var add_new_study_plan_wrapper;
var my_record_list_wrapper;

/*
function loaded() 
{
	home_page_wrapper=new iScroll('home_page_wrapper',{bounce:false,momentum:true});
	my_subjects_list_wrapper=new iScroll('my_subjects_list_wrapper',{bounce:false,momentum:true});
	
	my_holidays_list_wrapper=new iScroll('my_holidays_list_wrapper',{bounce:false,momentum:true});
	//add_new_holiday_wrapper=new iScroll('add_new_holiday_wrapper');
	
	my_exams_list_wrapper=new iScroll('my_exams_list_wrapper',{bounce:false,momentum:true});
	//add_new_exam_wrapper=new iScroll('add_new_exam_wrapper');

	add_new_subject_wrapper = new iScroll('add_new_subject_wrapper', {
		bounce:false,
		snap:true,
		momentum:true,
		useTransform: false,
		onBeforeScrollStart: function (e) {
			var target = e.target;
			while (target.nodeType != 1) target = target.parentNode;

			if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
				e.preventDefault();
		}
	});
	
	my_task_list_wrapper=new iScroll('my_task_list_wrapper',{bounce:false,momentum:true});
	my_task_list_list_wrapper=new iScroll('my_task_list_list_wrapper',{bounce:false,momentum:true});
	
	work_schedule_calendar_events_wrapper=new iScroll('work_schedule_calendar_events_wrapper',{bounce:false,momentum:true});
	add_work_schedule_wrapper = new iScroll('add_work_schedule_wrapper', {
		useTransform: false,
		onBeforeScrollStart: function (e) {
			var target = e.target;
			while (target.nodeType != 1) target = target.parentNode;

			if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
				e.preventDefault();
		}
	});
	
	timetable_week_wrapper=new iScroll('timetable_week_wrapper',{snap:true,bounce:true,momentum:true});
	timetable_day_wrapper=new iScroll('timetable_day_wrapper',{snap:true,bounce:true,momentum:true});
	timetable_list_wrapper=new iScroll('timetable_list_wrapper',{snap:true,bounce:true,momentum:true});
	
	my_library_books_list_wrapper=new iScroll('my_library_books_list_wrapper',{bounce:false,momentum:true});
	
	study_plan_calendar_events_wrapper=new iScroll('study_plan_calendar_events_wrapper',{bounce:false,momentum:true});
	
	my_record_list_wrapper = new iScroll('my_record_list_wrapper',{snap:true,bounce:true,momentum:true});
}

//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//document.addEventListener('DOMContentLoaded', loaded, false);
*/

function printObject(o) 
{
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function create_date_spinner(component_id)
{
	$(component_id).focus(function()
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
			$(component_id).val(date);    			
		});
		
		SpinningWheel.open();
	});
}

function get_format_date(date)
{
	date=date.split(" ");
	var month='';
	switch(date[0])
	{
		case "Jan":
			month='01';
			break;
		case "Feb":
			month='02';
			break;
		case "Mar":
			month='03';
			break;
		case "Apr":
			month='04';
			break;
		case "May":
			month='05';
			break;
		case "Jun":
			month='06';
			break;
		case "Jul":
			month='07';
			break;
		case "Aug":
			month='08';
			break;
		case "Sep":
			month='09';
			break;
		case "Oct":
			month='10';
			break;
		case "Nov":
			month='11';
			break;
		case "Dec":
			month='01';
			break;
	}
	return date[2]+"-"+month+"-"+date[1];
}

function get_current_date()
{
	var date=new Date();
	var current_year=date.getFullYear();
	var current_month=date.getMonth()+1;
	if(current_month<10)
	{
		current_month="0"+current_month;
	}		
	var current_day=date.getDate();
	if(current_day<10)
	{
		current_day="0"+current_day;
	}
	date=current_year+"-"+current_month+"-"+current_day;
	return date;
}

function get_current_time()
{
    var time=new Date();
	var current_hour=time.getHours();
	var current_minute=time.getMinutes();
    var current_second=time.getSeconds();
    
	if(current_hour<10)
	{
		current_hour="0"+current_hour;
	}
	if(current_minute<10)
	{
		current_minute="0"+current_minute;
	}
	if(current_second<10)
	{
		current_second="0"+current_second;
	}
	time=current_hour+":"+current_minute+":"+current_second;
	return time;
}

function display_alert(message,title,button_text)
{
	try
	{
		navigator.notification.beep(1);
		navigator.notification.alert(message,alertDismissed,title,button_text);
	}
	catch(err)
	{
		alert(message);
	}	
}

function alertDismissed() 
{
    // do something
}

function is_fetch_next_subject(day,start_time)
{
	today=new Date();
	hours=today.getHours();
	minutes=today.getMinutes();
	
	if(hours<10)
	{
		hours="0"+hours;
	}
	if(minutes<10)
	{
		minutes="0"+minutes;
	}
	
	current_time=hours+":"+minutes;
	if(today.getDay()==day)
	{
		if(current_time<start_time)
		{
			return true
		}
		else
		{
			return false;
		}
	}
	else
	{
		return true;
	}
}

function is_past_date(date)
{	
	var value=Date.today().compareTo(Date.parse(date));
	if(value==1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function check_date_range(date1,date2)
{
	var value=Date.parse(date1).compareTo(Date.parse(date2)); 
	if(value==1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function short_string(string,length)
{
	if(length==undefined)
	{
		if(string.length>17)
		{
			return string.substring(0,15)+"...";
		}
		else
		{
			return string;
		}
	}
	else
	{
		if(string.length>length)
		{
			return string.substring(0,length-3)+"...";
		}
		else
		{
			return string;
		}
	}
}

function long_string(string)
{
	if(string.length>20)
	{
		return string.substring(0,18)+"...";
	}
	else
	{
		return string;
	}
}

function get_numerical_month(month)
{
	month=month.toLowerCase(month);
	switch(month)
	{
    	case "jan":return "01";break;
    	case "feb":return "02";break;
    	case "mar":return "03";break;
    	case "apr":return "04";break;
    	case "may":return "05";break;
    	case "jun":return "06";break;
    	case "jul":return "07";break;
    	case "aug":return "08";break;
    	case "sep":return "09";break;
    	case "oct":return "10";break;
    	case "nov":return "11";break;
    	case "dec":return "12";break;
	}
}

function get_what_day_in_week(day_id)
{
	/*
	 * 1-monday
	 * 2-tuesday
	 * 3-wednesday
	 * 4-thursday
	 * 5-friday
	 * 6-saturday
	 * 7-sunday
	 */
	var day='';
	switch(day_id)
	{
		case 0:
			day='Sunday';
			break;
		case 1:
			day='Monday';
			break;
		case 2:
			day='Tuesday';
			break;
		case 3:
			day='Wednesday';
			break;
		case 4:
			day='Thursday';
			break;
		case 5:
			day='Friday';
			break;
		case 6:
			day='Saturday';
			break;
	}
	return day;
}

function get_what_day_in_week_in_number(string_day)
{
	switch(string_day)
	{
		case 'Sunday':
			string_day=0;
			break;
		case 'Monday':
			string_day=1;
			break;
		case 'Tuesday':
			string_day=2;
			break;
		case 'Wednesday':
			string_day=3;
			break;
		case 'Thursday':
			string_day=4;
			break;
		case 'Friday':
			string_day=5;
			break;
		case 'Saturday':
			string_day=6;
			break;
	}
	return string_day;
}

function round_value(val)
{
	var dec = 2;
	var result = Math.round(val*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function calculate_time_difference(valuestart,valuestop)
{
     //create date format, convert to milliseconds, then subtract          
     var timeStart = new Date("01/01/2007 " + valuestart).getTime();
     var timeEnd = new Date("01/01/2007 " + valuestop).getTime();

     var hourDiff = timeEnd - timeStart;  
     hourDiff = hourDiff / 1000/3600;
     return hourDiff; 
}

function format_date(date,is_short)
{
	if(is_short==undefined)
	{
		is_short=false;
	}
	
	date=date.split("-");
	if(is_short)
	{
		date=date[2]+"/"+date[1]+"/"+date[0].substr(2,4);
	}
	else
	{
		date=date[2]+"/"+date[1]+"/"+date[0];
	}
	return date;
}

function validate_email_address(emailAddress) 
{
	var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
	return pattern.test(emailAddress);
}


function numeric_only(textfield)
{
	$(textfield).keydown(function(event) 
	{
		// Allow only backspace and delete
		if(event.keyCode==46||event.keyCode==8||event.keyCode==190) 
		{
			// let it happen, don't do anything
		}
		else 
		{
			// Ensure that it is a number and stop the keypress
			if(event.keyCode<48||event.keyCode>57)
			{
				event.preventDefault();	
			}	
		}
	});
}

function find_first_subject(time)
{
	time=time.replace(":","");
	//alert(34/700*900)
	//700->34
	//900->30
	
}