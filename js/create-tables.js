$(document).ready(function()
{
 	db.transaction
	(
    	function(transaction)
    	{
    		//transaction.executeSql('drop table subjects');
    		//transaction.executeSql('drop table school');
    		//transaction.executeSql('drop table holidays');
    		//transaction.executeSql('drop table exams');
    		//transaction.executeSql('drop table tasks');
    		//transaction.executeSql('drop table task_types');
    		//transaction.executeSql('drop table records');
    		//transaction.executeSql('drop table work_schedule;');
    		//transaction.executeSql('drop table study_plan');
    		//transaction.executeSql('drop table library');
    	}
    );
 	
	//subjects
	db.transaction
	(
    	function(transaction)
    	{
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS subjects (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'title TEXT NOT NULL, ' +
	        	'abbreviation TEXT NOT NULL, ' +
	        	'colour_code TEXT, '+
	        	'location TEXT NOT NULL, '+
	        	'days INTEGER, '+
	        	'start_time TIME, '+
	        	'end_time TIME, '+
	        	'semester_start_date DATE, '+
	        	'semester_end_date DATE, '+
	        	'notes TEXT, '+
	        	'lecturer TEXT, '+
	        	'lecturer_phone TEXT, '+
	        	'lecturer_email TEXT, '+
	        	'lecturer_office_location TEXT'+
	        	');'
        	);
    	}
	);
	
	//schools
	db.transaction
	(
    	function(transaction) 
    	{
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS school (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'name TEXT NOT NULL, ' +
	        	'url TEXT NOT NULL, ' +
	        	'detils TEXT'+
	        	');'
        	);
    	}
	);	
	
	//holidays
	db.transaction
	(
    	function(transaction) 
    	{
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS holidays (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'title TEXT NOT NULL, ' +
	        	'location TEXT NOT NULL, '+
	        	'colour_code TEXT, '+
	        	'start_date DATE, '+
	        	'end_date DATE, '+
	        	'notes TEXT'+
	        	');'
        	);
    	}
	);

	//exams
	db.transaction
	(
    	function(transaction) 
    	{
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS exams (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'subject_id INTEGER NOT NULL, ' +
	        	'location TEXT NOT NULL, '+
	        	'exam_date DATE, '+
	        	'start_time TEXT, '+
	        	'end_time TEXT, '+
	        	'colour_code TEXT, '+
	        	'notes TEXT'+
	        	');'
        	);
    	}
	);
	
	//tasks
	db.transaction
	(
    	function(transaction) 
    	{	
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS task_types (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER, '+
	        	'title TEXT NOT NULL '+
	        	');'
        	);
    		
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS tasks (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'title TEXT NOT NULL, ' +
	        	'category INTEGER NOT NULL, ' +
	        	'type INTEGER NOT NULL, ' +
	        	'colour_code TEXT, ' +
	        	'due_date DATE, '+
	        	'start_time TIME, '+
	        	'reminder_time TIME, '+
	        	'completed_date DATE, '+
	        	'notes TEXT'+
	        	');'
        	);
    	}
	);
	
	//record
	db.transaction
	(
    	function(transaction) 
    	{
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS records (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'title TEXT NOT NULL, ' +
	        	'record_date DATE, '+
                'record_time TIME, '+
	        	'duration FLOAT, '+
	        	'file_path TEXT, '+
	        	'file_name TEXT, '+
                'file_size FLOAT, '+
	        	'notes TEXT'+
	        	');'
        	);
    	}
	);	
   
	//work_schedule
	db.transaction
	(
    	function(transaction) 
    	{	
    		transaction.executeSql
        	(
    			'CREATE TABLE IF NOT EXISTS work_schedule (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'job TEXT NOT NULL, ' +
	        	'abbreviation TEXT, '+
	        	'location TEXT, '+
	        	'date DATE NOT NULL, '+
	        	'start_time TIME, '+
	        	'end_time TIME, '+
	        	'break REAL, '+
	        	'rate_per_hour REAL, '+
	        	'notes TEXT'+
	        	');'
        	);
    	}
	);
	
	//library
	db.transaction
	(
    	function(transaction) 
    	{
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS library (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'title TEXT NOT NULL, ' +
	        	'author TEXT NOT NULL, '+
	        	'isbn TEXT, '+
	        	'subject TEXT, '+
	        	'publisher TEXT, '+
	        	'return_date DATE, '+
	        	'color TEXT, '+
	        	'description TEXT'+
	        	');'
        	);
    	}
	);
	
	//study plan
	db.transaction
	(
    	function(transaction) 
    	{
    		transaction.executeSql
        	(
	        	'CREATE TABLE IF NOT EXISTS study_plan (' +
	        	'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
	        	'user_id INTEGER NOT NULL, '+
	        	'subject_id INTEGER NOT NULL, ' +
	        	'start_time TIME, '+
	        	'reminder_time TIME, '+
	        	'start_date DATE, '+
	        	'notes TEXT'+
	        	');'
        	);
    	}
	);
	//*/
});