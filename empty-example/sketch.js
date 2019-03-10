
var w = 1260;
var h = 1850;

var charHeight  = 1330;
var charwidth = 1260;

var author;
var authorGender;
var activeStartYear;
var activeYearCount = 0;
var activeYearObject = [];
var objectPosition = [];
var allYearString = "";
var alertMessage = "";
var yearAndAuthorInfo = [];
var authorActiveYears = [];
var maxYearRange = 0;
var currentYear = "1990";
var yearWeight = 0;
var malecount = 0;
var femaleCount = 0;
var yStartM= 200;
var yStartF = 200;
var indicatorLoc = 180;
var xStartM = 610;
var xStartF = 650;
var offset = 10;
var currentYearCount = 1;
var heightArrayForText = [];
var heightOffset = 0;
var genderRatioArray = [];
var ratioTextLoi = 1180;
var maleNumberCount = 0;
var femaleNumberCount = 0;

var table;
var tableGender;
var genderCol;
var authorCol;
var authorPositionRegionCol;
var paperDoiCol;
var paperDoiFromOriginalCol;
var yearCol;
var maleColor;
var femaleColor;
var textColor;

var yearOffset = 5;
var filterStartH = 80;
var filterObjectPosition= [];
var filterGenderPosition =[];
var selectedYearFilters =[];
var selectedGenderFilters =[];


function preload(){
	table = loadTable("data/IEEE VIS papers 1990-2016 - Main dataset.csv", "csv", "header");
	tableGender = loadTable("data/authorPaperGenderPositon.csv", "csv", "header");
}

function setup() {
  // put setup code here
  createCanvas(w,h);
  noLoop();
  //background(239, 241, 239);
  background(8, 8, 8);

  maleColor = color('rgb(0, 137, 167)');
  femaleColor = color('rgb(181, 73, 91)');
  filterTextColor = color(8,8,8);
  textColor = color(252,250,242);
  hightColor = color(255, 204, 0);
  
  console.log(table.getRowCount() + " total rows in table");
  console.log(table.getColumnCount() + " total columns in table");

  console.log(tableGender.getRowCount() + " total rows in table");
  console.log(tableGender.getColumnCount() + " total columns in table");

  genderCol = tableGender.getColumn("gender");
  authorCol = tableGender.getColumn("Author.Names");
  authorPositionRegionCol = tableGender.getColumn("PositionRegion");
  paperDoiCol = tableGender.getColumn("Paper.DOI");
  paperDoiFromOriginalCol = table.getColumn("Paper DOI");
  yearCol = table.getColumn("Year");
}

function mySelectEvent() {
	var genderselected = genderSelection.value();
	console.log("Gender selected", genderselected);
}

//Get array of each author with paper year
function calculateYearSquare(){
	for(var i = 0; i< paperDoiCol.length; i++){
		for(var j = 0; j< paperDoiFromOriginalCol.length; j++){
			if(paperDoiCol[i] === paperDoiFromOriginalCol[j]){
				var region;
				if(authorPositionRegionCol[i] == "F"){
					region = 1;
				}
				else if(authorPositionRegionCol[i] == "M"){
					region = 2;
				}
				else{
					region = 3;
				}
				if(genderCol[i] == "unisex"){
					genderCol[i] = "unisexsex" ;
				}

				yearAndAuthorInfo.push({
					paperDoi: paperDoiCol[i],
					author: authorCol[i],
					gender: genderCol[i],
					positionRegion: region,
					year: yearCol[j]
				});
			}
		}
	}

  // Multiple sort https://github.com/Teun/thenBy.js
  // First by year, then gender, then by postion region
  yearAndAuthorInfo.sort(
  	firstBy("author")
  	.thenBy("year")
  	.thenBy(function (v1, v2) { return v1.gender.length - v2.gender.length; })
  	);

  console.log("The joint data from two tables ", yearAndAuthorInfo);

}

// Get active year range object
function countActiveYear(){
	// Initial author and activeStartYear
	author = yearAndAuthorInfo[0].author;
	activeStartYear = 1990;

	for(var i =0; i< Object.keys(yearAndAuthorInfo).length; i++){ 
    	// Same author only counts different year, in case publish two papers in same year, will store all the years in authorActiveYears[]
    	if(author == yearAndAuthorInfo[i].author){
    		if(activeStartYear != yearAndAuthorInfo[i].year){
    			activeYearCount++;
    		}  
    		author = yearAndAuthorInfo[i].author;
    		authorGender = yearAndAuthorInfo[i].gender;
    		activeStartYear = yearAndAuthorInfo[i].year; 
    		authorActiveYears.push({year: yearAndAuthorInfo[i].year});  
    	}
    	else{
    		activeYearObject.push({
    			author: author,
    			gender: authorGender,
    			year: authorActiveYears,
    			activeyearTotal: activeYearCount,
    		});

    		authorActiveYears=[];
    		author = yearAndAuthorInfo[i].author;
    		authorGender = yearAndAuthorInfo[i].gender;
    		activeYearCount = 1;
    		activeStartYear = yearAndAuthorInfo[i].year; 
    		authorActiveYears.push({year: yearAndAuthorInfo[i].year}); 
    	}
    }
    console.log("Active Year object with calculated active year range ",activeYearObject);

	// Sort the objects first by ative year range, then by author
    activeYearObject.sort(
    	firstBy("activeyearTotal")
    	.thenBy("author")
    	);
    console.log("Active Year object sorted ", activeYearObject);

    // Get max ative year range
    //maxYearRange = activeYearObject[0].activeyearTotal;
    // console.log("Max year range ", maxYearRange);
    // for(var i = 0; i< Object.keys(activeYearObject).length; i++) {
    // 	if(activeYearObject[i].activeyearTotal > maxYearRange){
    // 		maxYearRange = activeYearObject[i].activeyearTotal;
    // 		if(maxYearRange == 23){
    // 			console.log("Detail of max year range object: ", activeYearObject[i]);
    // 		}
    // 	}
    // }   
}

// Loop all the active year ranges
function loopDraw(selectedYearFilters, selectedGenderFilters){
	for(var i =0; i< Object.keys(activeYearObject).length; i++){
		switch(activeYearObject[i].activeyearTotal){
			case 1:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 1, i);
			break;
			case 2:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 2, i);
			break;
			case 3:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 3, i);
			break;
			case 4:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 4, i);
			break;
			case 5:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 5, i);
			break;
			case 6:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 6, i);
			break;
			case 7:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 7, i);
			break;
			case 8:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 8, i);
			break;
			case 9:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 9, i);
			break;
			case 10:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 10, i);
			break;
			case 11:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 11, i);
			break;
			case 12:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 12, i);
			break;
			case 13:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 13, i);
			break;
			case 14:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 14, i);
			break;
			case 15:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 15, i);
			break;
			case 16:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 16, i);
			break;
			case 17:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 17, i);
			break;
			case 18:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 18, i);
			break;
			case 19:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 19, i);
			break;
			case 20:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 20, i);
			break;
			case 21:
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 21, i);
			break;
			//No 22 in dateset
			case 22:			
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters, activeYearObject[i].gender, 22, i);
			break;
			case 23:
			yStartF = yStartM;
			drawGenderYearPoint(selectedYearFilters, selectedGenderFilters,activeYearObject[i].gender, 23, i);
			heightArrayForText.push({currentYear: 22, height: yStartM-30});
			genderRatioArray.push({male: 0, female: 0});
			heightArrayForText.push({currentYear: 23, height: yStartM});
			genderRatioArray.push({male: 1, female: 0});
			break;
		}

	}
}

// Draw author points
function drawGenderYearPoint(yearFilters, genderFilters, gender, cYear, i){
	// strokeWeight(4);
	var find = false;
	for(var index = 0; index < Object.keys(activeYearObject[i].year).length; index++){
		if(yearFilters.indexOf(parseInt(activeYearObject[i].year[index].year)) >- 1){			
			find = true;
			break;
		}
		else{
			find = false;
		}
	}

	if(cYear == currentYearCount){
		if(gender == "male"){
			if(genderFilters.indexOf(gender)> -1 && find){
				stroke(hightColor);
			}
			else{
				stroke(maleColor);
			}	
			xStartM = xStartM - offset;
			if(xStartM <= 0){
				yStartM = yStartM + offset;
				xStartM = 610 - offset;
			}
			point(xStartM,yStartM);
			objectPosition.push({
				name: activeYearObject[i].author, 
				gender: activeYearObject[i].gender, 
				range: activeYearObject[i].activeyearTotal, 
				years: activeYearObject[i].year,
				positionX: xStartM, 
				positionY: yStartM});
			malecount++;
		}

		if(gender == "female"){		
			if( genderFilters.indexOf(gender)> -1 && find){
				stroke(hightColor);
			}
			else{
				stroke(femaleColor);
			}	
			xStartF = xStartF + offset;
			if(xStartF >= charwidth){			
				yStartF = yStartF + offset;
				xStartF = 650 + offset;
			}
			point(xStartF,yStartF);	
			objectPosition.push({
				name: activeYearObject[i].author, 
				gender: activeYearObject[i].gender, 
				range: activeYearObject[i].activeyearTotal, 
				years: activeYearObject[i].year,
				positionX: xStartF, 
				positionY: yStartF});
			femaleCount++;
		}	
	}
	else{
		heightArrayForText.push({currentYear: currentYearCount, height: yStartM});
		genderRatioArray.push({male: malecount, female: femaleCount});
  		//console.log( "year: "+ currentYearCount+ "male: " + malecount + "female: " + femaleCount);
  		malecount = 0;
  		femaleCount = 0;

  		if(cYear == 23){
  			yStartM= yStartM + 60;
  		}
  		else{
  			yStartM= yStartM + 30;
  		}	
  		
  		yStartF = yStartM;
  		xStartM = 610;
  		xStartF = 650;
  		strokeWeight(4);
  		if(gender == "male"){
  			if( genderFilters.indexOf(gender)> -1 && find){
  				stroke(hightColor);
  			}
  			else{
  				stroke(maleColor);
  			}
  			xStartM = xStartM - offset;
  			if(xStartM <= 0){		
  				yStartM = yStartM + offset;
  				xStartM = 610 - offset;			
  			}
  			point(xStartM,yStartM);	
  			objectPosition.push({
  				name: activeYearObject[i].author, 
  				gender: activeYearObject[i].gender, 
  				range: activeYearObject[i].activeyearTotal,
  				years: activeYearObject[i].year, 
  				positionX: xStartM, 
  				positionY: yStartM});
  			malecount ++;
  		}

  		if(gender == "female"){
  			if( genderFilters.indexOf(gender)> -1 && find){
  				stroke(hightColor);
  			}
  			else{
  				stroke(femaleColor);
  			}
  			xStartF = xStartF + offset;
  			if(xStartF >= charwidth){
  				yStartF = yStartF + offset;
  				xStartF = 650 + offset;			
  			}
  			point(xStartF,yStartF);
  			objectPosition.push({
  				name: activeYearObject[i].author, 
  				gender: activeYearObject[i].gender, 
  				range: activeYearObject[i].activeyearTotal,
  				years: activeYearObject[i].year,
  				positionX: xStartF, 
  				positionY: yStartF}); 
  			femaleCount ++;
  		}
  		currentYearCount = cYear;
  	}

  }

//Year filters
function yearSelection(){
	// Year filter
	for(var i = 1990; i < 2017; i++){
		rect(yearOffset, filterStartH, 45, 20);
		text(i, yearOffset+10, filterStartH+15);
		filterObjectPosition.push({
			year: i,
			positionX: yearOffset,
			positionY: filterStartH, 
		});
		yearOffset +=45;
	}
	var locTemp = yearOffset;
	rect(locTemp, filterStartH, 30, 20);
	text("All", locTemp+10, filterStartH+15);
	filterObjectPosition.push({
		year: "All",
		positionX: locTemp,
		positionY: filterStartH,
	});	
	//console.log("Filter postiion", filterObjectPosition);
}

// Gender filters
function genderSelection(){
	//Gender filter
	//Female
	yearOffset = 5;
	filterStartH = filterStartH + 40;
	rect(yearOffset, filterStartH, 135, 20);
	text("Female authors", yearOffset+25, filterStartH+15);
	filterGenderPosition.push({
		gender: "female",
		positionX: yearOffset,
		positionY: filterStartH,
	});
	yearOffset +=135;

	// Male
	rect(yearOffset, filterStartH, 135, 20);
	text("Male authors", yearOffset+30, filterStartH+15);
	filterGenderPosition.push({
		gender: "male",
		positionX: yearOffset,
		positionY: filterStartH,
	});
	//console.log("Gender filter position", filterGenderPosition);
}

// Draw 
function draw() {
	calculateYearSquare();
	countActiveYear();
	yearSelection();
	genderSelection();

	fill(textColor);
	textSize(12);
	text("A male author", 15, indicatorLoc);
	text("A female author", 115, indicatorLoc);
	text("Filtered out authors", 225, indicatorLoc);
	text("M | F Number", ratioTextLoi, indicatorLoc);
	text("Active Year Range", 580, indicatorLoc);
	// text("Male", 10, charHeight+40);
	// text("Female", charwidth-50, charHeight+40);
	// text("M | F Number", ratioTextLoi, charHeight+95);
	text("Active Year Range", 580, charHeight+195);
	textSize(18);
	text("How is the range of active years of authors different regarding the genders?", 330, 30);
	text("Active year range checker -- Compare how many female and male authors in each active year range easily", 220, charHeight+230);
	textSize(12);
	text("Active year means the author has publish(es) in this year. Active year range means the sum of all the active year.", 330, 50);

	// Draw points in each active year range
	strokeWeight(4);
	loopDraw(selectedYearFilters, selectedGenderFilters);
	console.log("Point position ",objectPosition);

    // Draw active year ranges on the middle 
    for(var i=0; i< Object.keys(heightArrayForText).length; i++){
    	//console.log(heightArrayForText[i].currentYear);
    	fill(textColor);
    	textSize(14); 
    	noStroke();
		// console.log(heightArrayForText[i].height);
		if(heightArrayForText[i].currentYear == 1){
			text(heightArrayForText[i].currentYear, charwidth/2-4, (heightArrayForText[i].height-30)/2 + 27);
			textSize(12); 
			text(genderRatioArray[i].male+" | "+ genderRatioArray[i].female + " ("+heightArrayForText[i].currentYear +")", ratioTextLoi, (heightArrayForText[i].height-30)/2 + 28);
			maleNumberCount += genderRatioArray[i].male;
			femaleNumberCount += genderRatioArray[i].female;
		}
		else if(heightArrayForText[i].currentYear < 10){
			text(heightArrayForText[i].currentYear, charwidth/2-4, heightArrayForText[i-1].height + (heightArrayForText[i].height-heightArrayForText[i-1].height-15)/2 + 27);
			textSize(12); 
			text(genderRatioArray[i].male+" | "+ genderRatioArray[i].female + " ("+heightArrayForText[i].currentYear +")", ratioTextLoi, heightArrayForText[i-1].height + (heightArrayForText[i].height-heightArrayForText[i-1].height-15)/2 + 28);
			maleNumberCount += genderRatioArray[i].male;
			femaleNumberCount += genderRatioArray[i].female;
		}
		else if(heightArrayForText[i].currentYear >= 10 && heightArrayForText[i].currentYear < 24){
			text(heightArrayForText[i].currentYear, charwidth/2-8, heightArrayForText[i-1].height + (heightArrayForText[i].height-heightArrayForText[i-1].height-15)/2 + 27);
			textSize(12); 
			text(genderRatioArray[i].male+" | "+ genderRatioArray[i].female + " ("+heightArrayForText[i].currentYear +")", ratioTextLoi, heightArrayForText[i-1].height + (heightArrayForText[i].height-heightArrayForText[i-1].height-15)/2 + 28);
			maleNumberCount += genderRatioArray[i].male;
			femaleNumberCount += genderRatioArray[i].female;
		}

	}

	//Draw the total numbers, add active year range 21 and 23
	textSize(12); 
	text(maleNumberCount+ " | " +femaleNumberCount, ratioTextLoi, charHeight+195);

	//Comment
	comment();

	// Draw gender reprensetation point
	strokeWeight(4);
	stroke(maleColor);
	point(10,indicatorLoc-4);
	stroke(femaleColor);
	point(110,indicatorLoc-4);
	stroke(hightColor);
	point(220,indicatorLoc-4);

}

function mousePressed(){
	// Iterate all the object to check the distance with mouse click postion
	alertMessage = "";
	for(var i =0; i< Object.keys(objectPosition).length; i++) {
		var d  = dist(mouseX, mouseY, objectPosition[i].positionX, objectPosition[i].positionY);
		// If distance < 4, then this point is clicked
		if (d < 4) {		
			currentYear = objectPosition[i].years[0].year;
			console.log("current year" + currentYear);

			// Get each the active year in a string
			for(var j = 0; j< Object.keys(objectPosition[i].years).length; j++){
				if(Object.keys(objectPosition[i].years).length == 1){
					allYearString = allYearString + ("<p><h5>"+ currentYear + " 1 paper</h5>");
				}
				// The years array > 1
				else{
					// Deal with the last year in the object
					if(j == Object.keys(objectPosition[i].years).length-1){
						//2015 2016 2016
						if(objectPosition[i].years[j].year == currentYear){
							yearWeight++;
							if(yearWeight == 1){
								allYearString = allYearString + ("<h5>"+ objectPosition[i].years[j].year + " " +yearWeight + " paper </h5>");
							}
							else if(yearWeight == 2)
							{
								allYearString = allYearString + ("<h4>"+ objectPosition[i].years[j].year + " " + yearWeight + " papers </h4>");
							}
							else if(yearWeight == 3)
							{
								allYearString = allYearString + ("<h3>"+ objectPosition[i].years[j].year + " " + yearWeight + " papers </h3>");
							}
							else if(yearWeight == 4){
								allYearString = allYearString + ("<h2>"+ objectPosition[i].years[j].year+ " " + yearWeight + " papers </h2>");
							}
							else{
								allYearString = allYearString + ("<h1>"+ objectPosition[i].years[j].year + " " + yearWeight + " papers </h1>");
							}
						}
						//2015, 2015, 2016
						else{
							if(yearWeight == 1){
								allYearString = allYearString + ("<h5>"+ currentYear + " " +yearWeight + " paper </h5>");
							}
							else if(yearWeight == 2)
							{
								allYearString = allYearString + ("<h4>"+ currentYear + " " + yearWeight + " papers </h4>");
							}
							else if(yearWeight == 3)
							{
								allYearString = allYearString + ("<h3>"+ currentYear + " " + yearWeight + " papers </h3>");
							}
							else if(yearWeight == 4){
								allYearString = allYearString + ("<h2>"+ currentYear + " " + yearWeight + " papers </h2>");
							}
							else{
								allYearString = allYearString + ("<h1>"+ currentYear + " " + yearWeight + " papers </h1>");
							}
							allYearString = allYearString + ("<h5>"+ objectPosition[i].years[j].year + " 1 paper </h5>");
						}						
					}
					// Deal with besides the last one
					else{
						if(objectPosition[i].years[j].year == currentYear){
							yearWeight++;
						}
						else{
							if(yearWeight == 1){
								allYearString = allYearString + ("<h5>"+ currentYear + " " +yearWeight + " paper </h5>");
							}
							else if(yearWeight == 2)
							{
								allYearString = allYearString + ("<h4>"+ currentYear + " " + yearWeight + " papers </h4>");
							}
							else if(yearWeight == 3)
							{
								allYearString = allYearString + ("<h3>"+ currentYear + " " + yearWeight + " papers </h3>");
							}
							else if(yearWeight == 4){
								allYearString = allYearString + ("<h2>"+ currentYear+ " " + yearWeight + " papers </h2>");
							}
							else{
								allYearString = allYearString + ("<h1>"+ currentYear + " " + yearWeight + " papers </h1>");
							}
							yearWeight = 1;
							currentYear = objectPosition[i].years[j].year;
						}
					}
				}
				//console.log("year text", allYearString);			
			}
			allYearString = "<p>"+ allYearString + "</p>";

			//Capitalize the first alphabet
			var genderTemp = "";
			var rangeTemp = "";
			if(objectPosition[i].gender == "male"){
				genderTemp = "<p style=" + "\"" + "color: rgb(0, 137, 167) ;"+ "\""+ "> Male </p>";
				rangeTemp = "<p style=" + "\"" + "color: rgb(0, 137, 167) ;"+ "\""+ "> &nbsp;&nbsp;&nbsp;&nbsp;Active year range: "+ objectPosition[i].range + " Year(s)</p><br>";
			}
			else{
				genderTemp = "<p style=" + "\"" + "color: rgb(181, 73, 91) ;"+ "\""+ "> Female </p>";
				rangeTemp = "<p style=" + "\"" + "color: rgb(181, 73, 91) ;"+ "\""+ "> &nbsp;&nbsp;&nbsp;&nbsp;Active year range: "+ objectPosition[i].range + " Year(s)</p><br>";
			}

			// Pop up message box, using bootbox.js
			bootbox.alert({
				title: objectPosition[i].name,
				message: genderTemp + rangeTemp + allYearString,
				backdrop: true,
				className: "authorPopUp",
			});
		}

		// reset year and html text weight
		allYearString = "";
		yearWeight = 0;
	}

	// Year Filter click detection
	for(var i =0; i< Object.keys(filterObjectPosition).length; i++) {
		var rectX = filterObjectPosition[i].positionX;
		var rectY = filterObjectPosition[i].positionY;
		var rectWidth = 45;
		var rectHeight = 20;

		textSize(12); 
		// Detect mouse click location
		if (mouseX > rectX && mouseX < rectX +rectWidth && mouseY > rectY && mouseY < rectY +rectHeight){
			if(filterObjectPosition[i].year == "All"){
				rectWidth = 30;
			}
			//deselect
			if( selectedYearFilters.indexOf(filterObjectPosition[i].year) > -1){
				var index = selectedYearFilters.indexOf(filterObjectPosition[i].year);
				stroke(filterTextColor);
				fill("white");
				strokeWeight(1);
				rect(rectX,rectY, rectWidth, rectHeight);
				noStroke();
				fill(filterTextColor);
				selectedYearFilters.splice(index, 1);
				// console.log("Deleted year array", selectedYearFilters);
				// deslect all the years, clear selectedYearFilters and redraw rectangle
				if(filterObjectPosition[i].year == "All"){
					selectedYearFilters =[];
					for(var index =0; index< Object.keys(filterObjectPosition).length-1; index++){
						stroke(filterTextColor);
						fill("white");
						strokeWeight(1);
						rect(filterObjectPosition[index].positionX,filterObjectPosition[index].positionY, 45, 20);
						fill(filterTextColor);
						noStroke();
						text(filterObjectPosition[index].year, filterObjectPosition[index].positionX+10, filterObjectPosition[index].positionY+15);
					}
				}
			}
			//select
			else{
				stroke(filterTextColor);
				fill(hightColor);
				strokeWeight(1);
				rect(rectX,rectY, rectWidth, rectHeight);
				noStroke();
				fill(filterTextColor);	
				// console.log("Selected year", filterObjectPosition[i].year);
				selectedYearFilters.push(filterObjectPosition[i].year);	
				// console.log("Added year array", selectedYearFilters);
				if(filterObjectPosition[i].year == "All"){
					selectedYearFilters =[];
					for(var index =0; index< Object.keys(filterObjectPosition).length-1; index++){
						stroke(filterTextColor);
						fill(hightColor);
						strokeWeight(1);
						rect(filterObjectPosition[index].positionX,filterObjectPosition[index].positionY, 45, 20);
						fill(filterTextColor);
						noStroke();
						text(filterObjectPosition[index].year, filterObjectPosition[index].positionX+10, filterObjectPosition[index].positionY+15);
						selectedYearFilters.push(filterObjectPosition[index].year);
					}
					selectedYearFilters.push("All");
				}
			}
			text(filterObjectPosition[i].year, rectX+10, rectY+15);
			initialData();
			loopDraw(selectedYearFilters, selectedGenderFilters);
		}			
	}

	// Gender Filter click detection
	for(var i =0; i< Object.keys(filterGenderPosition).length; i++) {
		var rectX = filterGenderPosition[i].positionX;
		var rectY = filterGenderPosition[i].positionY;
		var rectWidth = 135;
		var rectHeight = 20;

		textSize(12); 
		//Detect mouse in a rectangle shape
		//https://forum.processing.org/two/discussion/12172/detect-mouse-withing-a-rectangle-shape
		if (mouseX > rectX && mouseX < rectX +rectWidth && mouseY > rectY && mouseY < rectY +rectHeight){
			//deselect
			if( selectedGenderFilters.indexOf(filterGenderPosition[i].gender) > -1){
				var index = selectedGenderFilters.indexOf(filterGenderPosition[i].gender);
				stroke(filterTextColor);
				fill("white");
				strokeWeight(1);
				rect(rectX,rectY, rectWidth, rectHeight);
				noStroke();
				fill(filterTextColor);
				selectedGenderFilters.splice(index, 1);
				console.log("Deleted gender array", selectedGenderFilters);

			}
			//select
			else{
				stroke(filterTextColor);
				fill(hightColor);
				strokeWeight(1);
				rect(rectX,rectY, rectWidth, rectHeight);
				noStroke();
				fill(filterTextColor);
				console.log("Selected gender", filterGenderPosition[i].gender);
				selectedGenderFilters.push(filterGenderPosition[i].gender);
				console.log("Added gender array", selectedGenderFilters);
			}
			if(filterGenderPosition[i].gender == "female"){
				text("Female authors", rectX+25, rectY+15);
			}
			else{
				text("Male authors", rectX+30, rectY+15);
			}
			initialData();
			loopDraw(selectedYearFilters, selectedGenderFilters);
		}
	}			
}

// Initial all the data releted to author points redraw
function initialData(){
	yStartM= 200;
	yStartF = 200;
	xStartM = 610;
	xStartF = 650;
	yearAndAuthorInfo = [];
	authorActiveYears = [];
	maxYearRange = 0;
	currentYear = "1990";
	yearWeight = 0;
	malecount = 0;
	femaleCount = 0;
	currentYearCount = 1;
	heightArrayForText = [];
	genderRatioArray = [];
	maleNumberCount = 0;
	femaleNumberCount = 0;
	objectPosition=[];
	strokeWeight(4);
}

function comment(){
	textSize(16);
	text("Active year range checker tool instructions", 15, charHeight+300);
	textSize(14);
	text("This tool shows the number difference between the female and male authors in each active year range.", 15, charHeight+330);
	text("Female and male authors are visualized in color dots on the two sides of the active year range axis.", 15, charHeight+ 350);
	text("The female authors are in red dots on right side. The male authors are in blue dots on left side.", 15, charHeight+ 370);
	text("The exact female and male author numbers in each active year range show on the very right side with active year range text.", 15, charHeight+ 390);

	text("For each author, users could click on the dot to see the name and the detailed publish information of that author.", 15, charHeight+ 420);
	text("PS. Sometimes when click OK of the dialogue box, the location of the ok button may be in same area of a dot which will trigger mousepressed event of that dot, so a new dialogue box will appear.", 15, charHeight+ 440);
	text("If users interested in who is active in specific year(s), they could get the data with year and gender filters. The filtered out result will be shown in yellow dots.", 15, charHeight+460);
}

