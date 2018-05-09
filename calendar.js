window.onload = function() {
	class Calendar{
		constructor(id){			
			this.d = new Date();											//date wich calendar will show
			this.d = new Date(this.d.getFullYear(), this.d.getMonth(), 1)//first date in month
			this.parentID = id;
			this.today = (new Date).getDate();				
			this.currentMonth = this.d.getMonth();		//month wich calendar will show
			this.lastDay = (new Date(this.d.getFullYear(), this.d.getMonth()+1, 0)).getDate();  //last day in current month
			this.firstweekday = (new Date(this.d.getFullYear(), this.d.getMonth(), 1)).getDay();

			this.rd = new Date();										//date wich represent current day
			this.rMonth = this.rd.getMonth();//month wich represent current day
			this.rYear = this.rd.getFullYear();//year wich represent current day

			this.head = ``;		//head of calendar body
			this.drawToDom(id);

			this.eventList = []; // array which will save users events to trace
			this.numbersList = [];//numbers that user clicked
		}

		/**
		*compares two dates
		*@returns true or false
		*/
		equalDate(d1, d2){
			if(d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate()){
				return true;
			}
			return false;
		}

		/**
		*takes the number from 0 to 11 and returns the appropriate months in string
		*/
		monthToString (month) {
			var arr=[
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
			];
			return arr[month];
		}

		/** 
		*draw the head of calendar
		* @param id - id of parent element
		*/
		drawHead(id){
			this.head = `<div class="calendar">
			<div class="calendar-head">
			<div id = 'btnleft' class="calendar-btn left-button"><img src="images/lefticon.png" alt=""></div>
			<p class="calendar-month">${this.monthToString(this.d.getMonth())}</p>
			<p class="calendar-year">${this.d.getFullYear()}</p>
			<div id = 'btnright' class="calendar-btn right-button"><img src="images/righticon.png" alt=""></div>
			</div>
			<table id="main" class="main-table">
			<tr class="days">
			<td>SUN</td>
			<td>MON</td>
			<td>TUE</td>
			<td>WED</td>
			<td>THU</td>
			<td>FRI</td>
			<td>SAT</td>
			</tr>`;
			const el = document.getElementById(id);
			el.innerHTML = this.head;	
		}

		/**
		*draws setted calendar date( this.d ) to DOM
		*/
		drawToDom(id){
			const el = document.getElementById(id);
			this.drawHead(id);					
			const tab = document.getElementById('main');
			var r = 0;

			var d2 = new Date(this.d.getFullYear(), this.d.getMonth(), 1);			//temp date object for manipulation
			this.lastDay = (new Date(this.d.getFullYear(), this.d.getMonth()+1, 0)).getDate();//lastDay will be different for every month
			this.firstweekday = (new Date(this.d.getFullYear(), this.d.getMonth(), 1)).getDay();//firstweekday will be different for every month

			while(d2.getDate()!=this.lastDay){
				var tr = document.createElement('tr');
				tr.classList.add('days-line');
				var i = 0;
				while (i<7) {				
					var td = document.createElement('td');
					td.classList.add('calendar-day');
							if (r==0){														//if its first row
								if(i<this.firstweekday){						//if the week doesn't begin on Sunday
									td.innerHTML = '';

							}else{
									if (this.equalDate(d2, this.rd)) {td.classList.add('calendar-today');}//highlight if its today
									td.innerHTML = d2.getDate();
									d2.setDate(d2.getDate()+1);
								}
							}else{
								if (this.equalDate(d2, this.rd)) {td.classList.add('calendar-today');}//highlight if its today
								td.innerHTML = d2.getDate();
								d2.setDate(d2.getDate()+1);
							}
							tr.appendChild(td);
							i++;

							if (d2.getDate()==this.lastDay) {	
								td.innerHTML = d2.getDate()-1;
								tr.appendChild(td);
								var td2 = document.createElement('td');

								if (d2.getDate()-1 == this.today && d2.getMonth() == this.rMonth) {td.classList.add('calendar-today');}//highlight if its today

								td2.classList.add('calendar-day')
								td2.innerHTML = d2.getDate();
								if (d2.getDate()-1 == this.today && d2.getMonth() == this.rMonth) {td2.classList.add('calendar-today');}//highlight if its today
								tr.appendChild(td2);
								break;
							}
						}
						tab.appendChild(tr);
						r++;
					}
					el.innerHTML+=`</div>`;	
					document.getElementById('btnright').addEventListener('click', moveRight);//adds events for clicks
					document.getElementById('btnleft').addEventListener('click', moveLeft);
					document.getElementById('main').addEventListener('click', highlight);
				}
	}

	const c = new Calendar('container');

	/**
	*Sets the date to next month and redraw the calendar
	*/
	function moveRight(){
		c.d = new Date(c.d.getFullYear(), c.d.getMonth()+1, 1);
		c.drawToDom(c.parentID);
		c.eventList.push(moveRight);	//adds this event to list
		c.numbersList.push(0);//ads the number of highlited element
	}

	/**
	*Sets the date to previous month and redraw the calendar
	*/
	function  moveLeft(){
		c.d = new Date(c.d.getFullYear(), c.d.getMonth()-1, 1)
		c.drawToDom(c.parentID);
		c.eventList.push(moveLeft);				//adds this event to list
		c.numbersList.push(0);						//ads the number of highlited element
	}

	/**
	*highlightc the clicked cell
	*/
	var highlightedEl = 0;																			//keeps previous selected element
	function highlight (event, num) {
		if (event.target!=undefined) {var target = event.target}

			if((typeof event[0]) == 'string'){
				var cells = document.querySelectorAll('.calendar-day');
				console.log(cells);
				
				for(let k of cells){
					if(k.classList.contains('day-selected')){					//find and remove previous selected cell
						k.className = 'calendar-day';
					}
				}	

				for (let c  of cells) {															//bypassing all cells in main table
					if (c.innerHTML == event) {
						c.className+=' day-selected';
					}
				}
			}

		if (target.tagName=='TD' && target.innerHTML!='') {		//whole table and empty cells wont be highlighted
			target.className+=(' day-selected');
			
			if (highlightedEl.innerHTML == c.rd.getDate()  &&  c.d.getMonth() == c.rMonth && c.rYear==c.d.getFullYear()) {//if highlighted element was current day
				highlightedEl.className=('calendar-day calendar-today');
			}else{
				highlightedEl.className=('calendar-day');
			}
			highlightedEl = target;
			c.eventList.push(highlight);				//ads this event to event list
			c.numbersList.push(target.innerHTML);//ads the number of highlited element
			console.log(c.numbersList);
		}
	}

	document.getElementById('run').addEventListener('click', runEvents);
	var i = 0;
	function runEvents () {
		c.d = new Date();
		c.drawToDom(c.parentID);
		for(let i = 0; i<c.eventList.length; i++){
				setTimeout(c.eventList[i], 1000+i*1000,  [c.numbersList[i]]);//if it was highlight event it will take last argument
			}
	}
}