<!--./index.js-->

/* turn number "8" to "08" to avoid clock-times like "1:3" (and instead use "01:03") */
function formatTwoDigit(parNumber)
{
	/* 0. Prepare string */
	var tmpReturn = parNumber + "";

	/* 1. if single-digit-number... */
	if(tmpReturn.length < 2)
	{
		/* 2. ...add "0" in front of it */
		tmpReturn = "0" + tmpReturn;
	}

	/* 3. Return result */
	return tmpReturn;
}

/* add X minutes to a composition of date and time (a.k.a. "add 57 minutes to 05.12.2013 11:59") */
/* return: A string like "SAME DAY 12:56" or "DAY AFTER 00:13" */
function calcDates(parDay, parMonth, parYear, parHour, parMinute, parDifference)
{
	/* split minutes in minutes and hours */
	var tmpMinuteDifference = parDifference % 60;
	var tmpHourDifference = (parDifference - tmpMinuteDifference) / 60;
	tmpHourDifference = Math.round(tmpHourDifference);

	/* TEST! */
	/* Determine actual hour difference and minute difference based on minute in given time */
	var tmpMinute = +parMinute;
	if((tmpMinute + tmpMinuteDifference) < 0)
	{
		tmpHourDifference -= 1;
		tmpMinute += 60;
	}
	else if((tmpMinute + tmpMinuteDifference) > 60)
	{
		tmpHourDifference += 1;
		tmpMinute -= 60;
	}
	tmpMinute += Math.round(tmpMinuteDifference);

	/* Determine day message based on hour difference and hour in given time */
	var tmpMessage = "SAME DAY";
	var tmpHour = +parHour;
	if((tmpHour + tmpHourDifference) < 0)
	{
		tmpMessage = "DAY BEFORE";
		tmpHour += 24;
	}
	else if((tmpHour + tmpHourDifference) > 24)
	{
		tmpMessage = "DAY AFTER";
		tmpHour -= 24;
	}
	tmpHour += Math.round(tmpHourDifference);
	
	/*console.log(tmpMinute);
	console.log(tmpHourDifference);*/
	/*return "";*/

	/* Return result */
	return tmpMessage + "  " + tmpHour + ":" + tmpMinute;
}

/* Form-Submission-Handler */
function formSubmit(parParameter)
{
	/* Preventing the browser from using the form-submission as a reason to enter a separate "result-page" (a.k.a. "stay on page") */
	parParameter.preventDefault();

	/* Get data */
	var tmpDataDay = document.getElementById("data-day").value;
	var tmpDataMonth = document.getElementById("data-month").value;
	var tmpDataYear = document.getElementById("data-year").value;
	var tmpDataHour = document.getElementById("data-hour").value;
	var tmpDataMinute = document.getElementById("data-minute").value;
	var tmpDataDST = document.getElementById("data-dst").checked;
	var tmpDataTimezone = document.getElementById("data-timezone").value;
	var tmpDataBirthplaceLongitude = document.getElementById("data-longitude").value;

	/*console.log(tmpDataDay);

	console.log(tmpDataDay + "\n" + 
		tmpDataMonth + "\n" + 
		tmpDataYear + "\n" + 
		tmpDataHour + "\n" + 
		tmpDataMinute + "\n" + 
		tmpDataDST + "\n" + 
		tmpDataTimezone + "\n" + 
		tmpDataBirthplaceLongitude + "\n"
	);*/

	/* Determine Timezone Longitude */
	var tmpTimezoneLongitude = tmpDataTimezone * 15;
	var tmpTableCalcTimezoneLongitude = tmpDataTimezone + "*15°";
	var tmpTableResultTimezoneLongitude = tmpTimezoneLongitude + "°";

	/* Determine Difference in Longitude */
	var tmpDifferenceInLongitude = tmpDataBirthplaceLongitude - tmpTimezoneLongitude;
	var tmpTableCalcDiffLongitude = tmpDataBirthplaceLongitude + "° - " + tmpTimezoneLongitude + "°";
	var tmpTableResultDiffLongitude = tmpDifferenceInLongitude.toFixed(5) + "°";

	/* Determine Longitude Time Difference */
	var tmpLongitudeTimeDifference = tmpDifferenceInLongitude * 4;
	var tmpTableCalcLongitudeTimeDifference = tmpDifferenceInLongitude.toFixed(5) + "° * 4 min./°";
	var tmpTableResultLongitudeTimeDifference = tmpLongitudeTimeDifference.toFixed(2) + " min.";

	/* Determine DST Time Difference */
	var tmpDstTimeDifference = 0;
	if(tmpDataDST == true) tmpDstTimeDifference = 60;
	var tmpTableResultDstTimeDifference = "-" + tmpDstTimeDifference + " min.";

	/* Determine Overall Time Difference */
	var tmpOverallTimeDifference = tmpLongitudeTimeDifference - tmpDstTimeDifference; /* "-" because tmpDstTimeDifference is >0 for output reasons */
	var tmpTableCalcOverallTimeDifference = tmpLongitudeTimeDifference.toFixed(2) + " min. - " + tmpDstTimeDifference + " min.";
	var tmpTableResultOverallTimeDifference = tmpOverallTimeDifference.toFixed(2) + " min.";

	/* Determine True Solar Time */
	var tmpNewDateString = calcDates(tmpDataDay, tmpDataMonth, tmpDataYear, tmpDataHour, tmpDataMinute, tmpOverallTimeDifference);

	/* Put Result String in */
	document.getElementById("result-string").innerHTML = tmpNewDateString;

	/* Output the rest of the Result (calculation-table) */
	document.getElementById("table-calc-timezone-longitude").innerHTML = tmpTableCalcTimezoneLongitude;
	document.getElementById("table-result-timezone-longitude").innerHTML = tmpTableResultTimezoneLongitude;
	document.getElementById("table-calc-diff-longitude").innerHTML = tmpTableCalcDiffLongitude;
	document.getElementById("table-result-diff-longitude").innerHTML = tmpTableResultDiffLongitude;
	document.getElementById("table-calc-longitude-time-difference").innerHTML = tmpTableCalcLongitudeTimeDifference;
	document.getElementById("table-result-longitude-time-difference").innerHTML = tmpTableResultLongitudeTimeDifference;
	document.getElementById("table-result-dst-time-difference").innerHTML = tmpTableResultDstTimeDifference;
	document.getElementById("table-calc-overall-time-difference").innerHTML = tmpTableCalcOverallTimeDifference;
	document.getElementById("table-result-overall-time-difference").innerHTML = tmpTableResultOverallTimeDifference;

	/*console.log(document.getElementById("data-dst"));*/
}

/* Update year in DST-link based on date-input (read subsequent text in webpage) */
function updateLinkYear(parParameter)
{
	/* dst-link */
	/*console.log(parParameter.target.value);*/
	var tmpNumber = parParameter.target.value;
	if(tmpNumber < 1970) tmpNumber = 1970;
	document.getElementById("dst-link").href = "https://www.timeanddate.com/time/dst/" + tmpNumber + ".html"
}

/* Add timezone-list from timezones.json/timezones.json into webpage under the subsequent toggle (see frontend) */
function print_timezones()
{
	var tmpStandardTimezones = document.getElementById("standard-timezones").innerHTML;
	fetch('./timezones.json/timezones.json')
	    .then((response) => response.json())
	    .then((json) => { 
	    	var tmpString = "";
	    	for(var i = 0 ; i <= (json.length-1) ; i++)
	    	{
	    		tmpString += json[i].text + "<br />";
	    	}
	    	document.getElementById("list-timezones").innerHTML = "<br />" + tmpStandardTimezones + "Other Timezones<br />===============<br />" + tmpString;
	    	/*console.log(json[0])*/
	    });
}

function droppers_click(parParameter)
{
	/* Toggle divs for "Show/Hide"-links */
	console.log(parParameter);
	if(parParameter.target.nextElementSibling.style.display == "none")
	{
		parParameter.target.nextElementSibling.style.display = "block";
	}
	else
	{
		parParameter.target.nextElementSibling.style.display = "none";
	}
}

function main()
{
	/* put timezones in document */
	print_timezones();

	/* make droppers (links with text "Show/Hide" work) */
	var tmpDroppers = document.getElementsByClassName("dropper");
	for(var i = 0 ; i <= (tmpDroppers.length-1) ; i++)
	{
		tmpDroppers[i].addEventListener("click", droppers_click);
	}
	/*document.getElementsByClassName("dropper")[0].nextElementSibling.style.display = "none";*/

	/* Update year in DST-link based on date-input (read subsequent text in webpage) */
	document.getElementById("data-year").addEventListener("input", updateLinkYear);

	/* Link form-submission-function */
	document.getElementById("form-for-data").addEventListener("submit", formSubmit);
}

/* Call main() */
main();
