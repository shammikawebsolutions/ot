
//Notification Handlers

var notification = {
init:function(){
    
},
    
	// This will fire after 60 seconds
local_min:function(){
    var d = new Date();
    d = d.getTime() + 60*1000; //60 seconds from now
    d = new Date(d);
    plugins.localNotification.add({
                                  date: d,
                                  repeat:'daily',
                                  message: 'This just fired after a minute!',
                                  hasAction: true,
                                  badge: 1,
                                  id: '1',
                                  sound:'horn.caf',
                                  background:'app.background',
                                  foreground:'app.running'
                                  });
   
},
    
	// This will fire based on the time provided.
	// Something to note is that the iPhone goes off of 24hr time
	// it defaults to no timezone adjustment so +0000 !IMPORTANT
local_timed:function(hh,mm){
    // the example time we provide is 13:00
    // This means the alarm will go off at 1pm +0000
    // how does this translate to your time? While the phone schedules 1pm +0000
    // it will still go off at your desired time base on your phones time.
    
    console.log(hh+" "+mm);
    // Now lets make a new date
    var d = new Date();
    d = d.setSeconds(00);
    d = new Date(d);
    d = d.setMinutes(mm);
    d = new Date(d);
    d = d.setHours(hh);
    d = new Date(d);
    plugins.localNotification.add({
                                  date: d,
                                  repeat:'daily',
                                  message: 'This went off just as expected!',
                                  hasAction: true,
                                  badge: 1,
                                  id: '2',
                                  sound:'beep.wav',
                                  background:'app.background',
                                  foreground:'app.running'
                                  });
    
},
clear:function(){
    
    plugins.localNotification.cancelAll();
},
tomorrow:function(hh,mm,days){
    // Now lets make a new date
    var d = new Date();
    d = d.setSeconds(00);
    d = new Date(d);
    d = d.setMinutes(mm);
    d = new Date(d);
    d = d.setHours(hh);
    d = new Date(d);
    
    // add a day
    d = d.setDate(d.getDate()+days);
    d = new Date(d);
    
    plugins.localNotification.add({
                                  date: d,
                                  repeat:'daily',
                                  message: 'This went off just as expected!',
                                  hasAction: true,
                                  badge: 1,
                                  id: '3',
                                  sound:'horn.caf',
                                  background:'app.background',
                                  foreground:'app.running'
                                  });
    
},
    
addStudyPlan:function(sub_id,start_data,start_time,remind_before)
    {
        //get current date time
        var d = new Date();
        display_alert('Current Date '+d,'Notification','Ok');
        //get target date time
    },
    
addTask:function(start_data,title)
    {
        
        console.log('Current Date '+d +' title= '+title);

        try
        {
            //get current date time
            var d = new Date();
            showAlert('Current Date '+d +' title= '+title,'Notification');            //get target date time
            d = d.getTime() + 300*1000; //60 seconds from now
            d = new Date(d);
            window.plugins.localNotification.add({
                                          date: d,
                                          repeat:'daily',
                                          message: 'This went off just as expected!',
                                          hasAction: true,
                                          badge: 1,
                                          id: '2',
                                          sound:'beep.wav',
                                          background:'taskBackground',
                                          foreground:'taskRunning'
                                          });
        }
        catch(e)
        {
            console.log("-----------"+e);
        }
        
    }    
    
}



function taskBackground(id){
    console.log("I was in the background but i'm back now! ID="+id);
}

function taskRunning(id){
     console.log("I am currently running, what should I do? ID="+id);
}


function showAlert(title,message)
{
    navigator.notification.alert(
                                 message,  // message
                                 null,
                                 title,            // title
                                 'Ok'                  // buttonName
                                 );
    
}
