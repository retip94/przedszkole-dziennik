// ==UserScript==
// @name         przedszkole32
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Przedszkole 32
// @author       Piotr Piekielny
// @match        http://koninsp4.vot.pl/wydarzenia/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js
// ==/UserScript==

(function() {
  'use strict';
  document.body.style.float = "right";
  document.documentElement.style.height = "100%";


  $("html").append ( `
    <div id="retip-nav" style="float: left; top: 0; z-index: 1; width:20%; height: 100%; padding:20px; background: #69d8ff;">
				<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
        <div>
					<h4>Skrypt Piotrka</h1>
				</div>
				<div style="width:100%;">
					<div style="padding:10px; width:100%;">
						<label for="start-min">Start min</label><br>
  					<input type="text" id="start-min" name="start-min" value="00"></br>
						<label for="end-min">Końcowe min</label><br>
  					<input type="text" id="end-min" name="end-min" value="59"></br></br></br>
						<label for="retip-hour">Godzina</label><br>
						<input id="retip-hour" type="number" min="0" max="23" step="1" value="08" onchange="updateHour()" />
						<button onclick="decreaseValue('retip-hour')">v</button>
            <button onclick="increaseValue('retip-hour')">^</button>
            <button onclick="document.getElementById('retip-hour').value='08'">8</button></br>
						<label for="retip-date">Dzień</label><br>
  					<input type="date" id="retip-date" name="retip-date" value="2021-02-14">
            <button onclick="increaseDate('retip-date')">^</button></br></br>
						<label for="kid">Wybierz bachora:</label><br>
						<select id="kid" name="kid" style="width:100%;">
            </select>
					</div>
					<button class="btn btn-success" id="retip-save-btn">Zapisz</button>
					</br></br></br></br>
					<p>Linki do kreatorów zajęć:</p>
					<a class="btn btn-warning" href="http://koninsp4.vot.pl/wydarzenia/create">Zaplanuj zajęcia indywidualne</a></br></br>
					<a class="btn btn-warning" href="http://koninsp4.vot.pl/wydarzenia/creategroupevent">Zaplanuj zajęcia grupowe</a></br>
				</div>
      <script>
        function increaseValue(id) {
          var value = parseInt(document.getElementById(id).value, 10);
          value = isNaN(value) ? 0 : value;
          value++;
          value > 23 ? value = 23 : '';
          document.getElementById(id).value = value;
          updateHour();
        }

        function decreaseValue(id) {
          var value = parseInt(document.getElementById(id).value, 10);
          value = isNaN(value) ? 0 : value;
          value--;
          value < 0 ? value = 0 : '';
          document.getElementById(id).value = value;
          updateHour();
        }

        function updateHour() {
          var h = parseInt(document.getElementById('retip-hour').value);
          if(h < 10) document.getElementById('retip-hour').value = '0' + h;
        }

				function increaseDate(id) {
          var date = new Date(document.getElementById(id).value);
          date.setDate(date.getDate() + 1);
          document.getElementById(id).valueAsDate = date;
        }
      </script>
		</div>
` );


//   hide native calendars
  $('#datetimepicker').hide();
  $('#datetimepicker2').hide();


//   set database variable
  var db = window.sessionStorage;


// change activity to desired
  var activity = document.getElementById("activitie");
  if(activity != null) activity.value = 7;


//   set date to the one previously picked
  var retip_date = document.getElementById('retip-date');
  if (db.getItem('retip_date_picked') != null){
    retip_date.value = db.getItem("retip_date_picked");
  }

//   set hour to the one previously picked
  var retip_hour = document.getElementById('retip-hour');
  if (db.getItem('retip_hour_picked') != null){
    retip_hour.value = parseInt(db.getItem("retip_hour_picked"))+1;
  }

//   copy select from native and make it searchable
  var kid = document.getElementById('kid');
  var students_list = document.getElementById("student");
  if(students_list != null) kid.innerHTML = students_list.innerHTML;
  $('#kid').select2();

	var start_min = document.getElementById("start-min");
	var end_min = document.getElementById("end-min");

//   native submit button
  var submit_btn = document.querySelector('.btn-primary');
	submit_btn.style.display = "none";

  function doc_keyUp(e) {
    switch (e.keyCode) {
      case 13:
        e.preventDefault();
        document.getElementById("retip-save-btn").click();
        break;
      default:
        break;
    }
  }
  document.addEventListener('keyup', doc_keyUp, false);

  $('#retip-save-btn').click(function() {
    var start_datetime = retip_date.value + " " + retip_hour.value + ":" + start_min.value;
    var end_datetime = retip_date.value + " " + retip_hour.value + ":" + end_min.value;
    try {
      document.getElementById('my_hidden_input').value = start_datetime;
      document.getElementById('my_hidden_input2').value = end_datetime;
    } catch { };
		if(students_list != null) students_list.value = document.getElementById('kid').value;

    submit_btn.click();

    db.setItem("retip_date_picked", retip_date.value);
    db.setItem("retip_hour_picked", retip_hour.value);
  });


  if(students_list != null) $('#kid').select2('open');



})();