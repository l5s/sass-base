// JavaScript Document

(function( $ ) {

	$.widget( 'l5.calendar', {

		options: {
		data : null
	},

	_create: function () {
			
			with (this) {
				
				var dateObj = new Date();
				var month = dateObj.getMonth();
				var year = dateObj.getFullYear();
				
				element.append('<div class="bar"><span class="left"><a href="#" class="prev sprites-btn-left-small ir">Back</a></span><span class="title middle">[Month] [Year]</span><span class="right"><a href="#" class="next sprites-btn-right-small ir">Next</a></span></div>');
				element.append('<table width="100%"></table>');
				
				element.on('click', '.next', function () { 
					if (++month > 11) {
						month = 0;
						year++;
					}
					
					_buildTable( new Date( year, month, 1 ) );
					
					if ( options.data )
						addEvents( options.data );
					
					return false;
				});
				
				element.on('click', '.prev', function () { 
					if (--month < 0) {
						month = 11;
						year--;
					}
					
					_buildTable( new Date( year, month, 1 ) );
					
					if ( options.data )
						addEvents( options.data );
					
					return false;
				});
				
				_buildTable( );
				
				if ( options.data )
					addEvents( options.data );
			}

    },
		
		_buildTable : function ( date ) {
			
			// Variables to be used later.  Place holders right now.
			var padding = "";
			var totalFeb = "";
			var i = 1;
			var testing="";
			
			date = date || new Date();
			var month = date.getMonth();
			var day = date.getDate();
			var year = date.getFullYear();
			var tempMonth = month+1; //+1; //Used to match up the current month with the correct start date.
			var prevMonth = month -1;
			
			//Determing if Feb has 28 or 29 days in it.  
			if ( month == 1 ) {
				if ( (year%100!=0) && (year%4==0) || (year%400==0)) {
					totalFeb = 29;
				} else {
					totalFeb = 28;
				}
			}
			
			//////////////////////////////////////////
			// Setting up arrays for the name of 	//
			// the	months, days, and the number of	//
			// days in the month.					//
			//////////////////////////////////////////
			
			var monthNames = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov", "Dec"];
			var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday", "Saturday"];
			var totalDays = ["31", ""+totalFeb+"","31","30","31","30","31","31","30","31","30","31"]
			
			//////////////////////////////////////////
			// Temp values to get the number of days//
			// in current month, and previous month.//
			// Also getting the day of the week.	//
			//////////////////////////////////////////
			
			var tempDate = new Date(year, tempMonth, 1);
			var tempweekday= tempDate.getDay();
			var tempweekday2 = tempweekday;
			var dayAmount = totalDays[month];
			// var preAmount = totalDays[prevMonth] - tempweekday + 1;	
			
			//////////////////////////////////////////////////
			// After getting the first day of the week for	//
			// the month, padding the other days for that	//
			// week with the previous months days.  IE, if	//
			// the first day of the week is on a Thursday,	//
			// then this fills in Sun - Wed with the last	//
			// months dates, counting down from the last	//
			// day on Wed, until Sunday.					//
			//////////////////////////////////////////////////
			
			while (tempweekday>0){
				padding += '<td class="premonth"></td>';
				//preAmount++;
				tempweekday--;
			}
			//////////////////////////////////////////////////
			// Filling in the calendar with the current 	//
			// month days in the correct location along.	//
			//////////////////////////////////////////////////
			
			while (i <= dayAmount) {
			
				//////////////////////////////////////////
				// Determining when to start a new row	//
				//////////////////////////////////////////
				
				if (tempweekday2 > 6) {
					tempweekday2 = 0;
					padding += "</tr><tr>";
				}
				
				//////////////////////////////////////////////////////////////////////////////////////////////////
				// checking to see if i is equal to the current day, if so then we are making the color of		//
				//that cell a different color using CSS.  Also adding a rollover effect to highlight the 		//
				//day the user rolls over. This loop creates the acutal calendar that is displayed.				//
				//////////////////////////////////////////////////////////////////////////////////////////////////
				
				if (i == day) {
					padding +='<td class="currentday" data-key="' + (new Date(year, month, i)).getTime() + '">' + i + '</td>';
				} else {
					padding +='<td class="currentmonth" data-key="' + (new Date(year, month, i)).getTime() + '">' + i + '</td>';	
				}
				
				tempweekday2++;
				i++;
			}
			
			//////////////////////////////////////////
			// Ouptputing the calendar onto the		//
			// site.  Also, putting in the month	//
			// name and days of the week.			//
			//////////////////////////////////////////
			
			this.element.find('.title').html( monthNames[month] + ' ' + year );
			this.element.find('table').empty().append('<thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody><tr>' + padding + '</tr></tbody>');
		},
		
		addEvents : function (dates) {
			
			var calendarObj = this;
			
			$.each(dates, function (i, date) {
		
				var items = [];
				
				$.each(date.events, function(key, event) {
					items.push('<li><a href="' + event.url + '"> ' + event.title + '</a></li>');
				});
				
				$( '#event-tooltip .body' ).empty().append(
					$('<ul/>', {
						'class': 'dividers dark tight',
						html: items.join('')
					})
				);	
				
				$('[data-key="' + date.key +'"]', calendarObj.element).addClass('event').attach({ selector : '#event-tooltip', center : true });
				
			});
			
		}

	});

}( jQuery ) );
