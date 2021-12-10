Module.register("MMM-CricketScores",{
	// Default module config.
	defaults: {
		category: "cricket",
		numberOfResults : 1,
		screenRefreshInterval : 10,
		focusTeam : "none",
		apiKey: "1234",
		refreshInterval: 90
	},

    getScripts: function() {
        return ["moment.js"];
    },

    getStyles: function() {
		return ["MMM-CricketScores.css"]
    },

    start: function() {
        this.sendSocketNotification("INIT", this.config);
    },

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.id = "CKTSCORES";
		wrapper.setAttribute("refreshCount", "1");
		return wrapper;
	},

	notificationReceived: function(notifyID, payload) {
		if (notifyID == "DOM_OBJECTS_CREATED") {
			let _this = this;
		  	setInterval(function() {			
				_this.updateScores();			
		  	}, this.config.refreshInterval * 60 * 1000);
		}
	  },

	updateScores: function() {
		this.clearWrapper();
		this.incrementRefreshCount();
		Log.info("[CKTSCORES] Updating");
		this.sendSocketNotification("UPDATE", this.config);
		//this.updateDom();
		Log.info("[CKTSCORES] Updated");
	},

	clearWrapper: function() {
		var wrapper = document.getElementById("CKTSCORES");
			while (wrapper.firstChild) {
				
					wrapper.firstChild.remove();
				
				
			}
	/* 	var wrapper = document.getElementById("CKTSCORES");
		var refreshCount = document.getElementById("refreshCount");
		Log.log("refreshCount innerHtml" + refreshCount.innerHTML);
		wrapper.innerHTML = '';
		wrapper.appendChild(refreshCount); */
		
	},

	socketNotificationReceived: function(notifyID, payload) {
		if (notifyID == "UPDATE") {
		  var numItems = payload.length;
		  var matchArray = payload;
		  var matchArraySorted = [];
		  if(numItems > this.config.numberOfResults && this.config.focusTeam == "none")
		  {
			  numItems = this.config.numberOfResults;
		  }
		  else if(this.config.focusTeam != "none")
		  {
			for (var i= 0; i < numItems; i++) {
				if(matchArray[i].Snm.toUpperCase().includes(this.config.focusTeam.toUpperCase()))
				{
					matchArraySorted.unshift(matchArray[i]);
				}
				else
				{
					matchArraySorted.push(matchArray[i]);
				}
					
			}
			matchArray = matchArraySorted;
			/* if(numItems > this.config.numberOfResults)
			{
				numItems = this.config.numberOfResults;
			} */
		  }
		  for (var i= 0; i < numItems; i++) {
			var item = matchArray[i];
			this.update(item, i);

		  }
		  this.createScreens(numItems);
		  this.addLastUpdated(numItems);
		  
		  
		}
		else if(notifyID == "NO_DATA")
		{
			this.noLiveMatch();
		}
		else if(notifyID == "LIMIT_EXCEEDED")
		{
			this.limitExceeded();
		}
	},

	addLastUpdated: function(itemCount){
		var wrapper = document.getElementById("CKTSCORES");

		var lastUpdtDtTm = document.createElement("span");
		lastUpdtDtTm.id = "lastUpdt";
		let now = new Date();
		var dateString = now.getFullYear() + "/" +
		("0" + (now.getMonth()+1)).slice(-2) + "/" +
		("0" + now.getDate()).slice(-2) + " " +
		("0" + now.getHours()).slice(-2) + ":" +
		("0" + now.getMinutes()).slice(-2) + ":" +
		("0" + now.getSeconds()).slice(-2);
		lastUpdtDtTm.innerHTML = "Last Updated : " + dateString;
		wrapper.appendChild(lastUpdtDtTm);

		var numItems = document.createElement("span");
		numItems.id = "numItems";
		numItems.innerHTML = "# of Live Matches : " + itemCount;
		wrapper.appendChild(numItems);
	
	},

	update: function(item, matchNum){
		var match = {
			"matchName" : item.Snm,
			"matchNum" : matchNum,
			"matchCurrentStat" : item.Events[0].EpsL,
			"matchSummary": item.Events[0].ECo,
			"matchType": item.Ccd,
			"team1" : item.Events[0].T1[0].Nm,
			"team1Img" : this.loadTeamImgName(item.Events[0].T1[0].Nm),
			"team2" : item.Events[0].T2[0].Nm,
			"team2Img" : this.loadTeamImgName(item.Events[0].T2[0].Nm),
			"fstInningTeam1": item.Events[0].Tr1C1 + "/" +  item.Events[0].Tr1CW1 + " (" + +  item.Events[0].Tr1CO1 + "overs)",
			"fstInningTeam2": item.Events[0].Tr2C1 + "/" +  item.Events[0].Tr2CW1 + " (" + +  item.Events[0].Tr2CO1 + "overs)",
			"scndInningTeam1": item.Events[0].Tr1C2 + "/" +  item.Events[0].Tr1CW2 + " (" + +  item.Events[0].Tr1CO2 + "overs)",
			"scndInningTeam2": item.Events[0].Tr2C2 + "/" +  item.Events[0].Tr2CW2 + " (" + +  item.Events[0].Tr2CO2 + "overs)"
		}
		this.populateWrapper(match);

	},

	createScreens: function(numItems){
		Log.log("[CKTSCORES] Creating Screens");
		let _this = this;
		var currPtr = 1;
		var refreshCount = _this.retrieveCurrentRefreshCount();
		var animateScreens = setInterval(function() {
			var startPtr = ((_this.config.numberOfResults * currPtr)-_this.config.numberOfResults);
			var endPtr = _this.config.numberOfResults * currPtr;
			
			Log.log("[CKTSCORES] Showing Screen --> [startPtr] = " + startPtr + " [endPtr] = " + endPtr + " [numItems] = " + numItems + " refreshCount = " + refreshCount);
			for(var i=0;i<numItems;i++)
			{
				if(i>= startPtr && i<endPtr)
				{
					
				}
				else
				{
					Log.log("Hiding Match " + i);
					_this.hideElement(document.getElementById("matchTitle#" + i));
				}
			}
			for(var j=startPtr;j<endPtr;j++)
			{
				
				if(j<numItems)
				{
					Log.log("Showing Match " + j);
					_this.showElement(document.getElementById("matchTitle#" + j));
				}
				
				

			}
			if(endPtr >= numItems)
			{
				currPtr = 0;
			}
			currPtr++;
			if(refreshCount < _this.retrieveCurrentRefreshCount())
			{
				clearInterval(animateScreens);
			}	
			
		}, this.config.screenRefreshInterval * 1000);
		Log.log("Interval Cleared");
	

	},

	hideElement: function(item){
		//item.style.width = "0%";
		//item.style.height = "0%";
		item.style.display = 'none';
	},

	showElement: function(item){
		//item.style.width = "100%";
		//item.style.height = "100%";
		item.style.display = 'block';
	},

	populateWrapper: function(item){
		var wrapper = document.getElementById("CKTSCORES");
		var matchDiv = this.createTitleHeader(item);
		matchDiv.appendChild(document.createElement("hr"));
		matchDiv.appendChild(this.createMatchTable(item));
		matchDiv.appendChild(document.createElement("hr"));
		this.hideElement(matchDiv);
		wrapper.appendChild(matchDiv);
		
	},

	noLiveMatch: function(){
		var wrapper = document.getElementById("CKTSCORES");
		var noMatchSpanTitle = document.createElement("span");
		noMatchSpanTitle.className = "header";
		noMatchSpanTitle.innerHTML = this.name;
		
		var noMatchSpan = document.createElement("span");
		noMatchSpan.className = "warningMsg";
		noMatchSpan.innerHTML = "<br/>There are currently no live matches going on :(";
		wrapper.appendChild(noMatchSpanTitle);
		wrapper.appendChild(noMatchSpan);
	},

	limitExceeded: function(){
		var wrapper = document.getElementById("CKTSCORES");
		var limitExceededTitle = document.createElement("span");
		limitExceededTitle.className = "header";
		limitExceededTitle.innerHTML = this.name;
		var limitExceeded = document.createElement("span");
		limitExceeded.className = "warningMsg"
		limitExceeded.innerHTML = "<br/>You have exceeded the MONTHLY quota for Requests.";
		wrapper.appendChild(limitExceededTitle);
		wrapper.appendChild(limitExceeded);
	},

	createTitleHeader: function(item){
		

		var titleDiv = document.createElement("div");
		titleDiv.id = "matchTitle#" + item.matchNum;
		titleDiv.className = "matchTitle";
		var title = document.createElement("span");
		title.className = "header";
		title.innerHTML = item.matchName;

		var matchStat = document.createElement("span");
		matchStat.id = "matchStatus";
		matchStat.className = "header";
		matchStat.innerHTML = "(" + item.matchCurrentStat + ")";

		var summ =  document.createElement("span");
		summ.id = "matchSumm";
		summ.className = "header";
		summ.innerHTML = item.matchSummary;

		titleDiv.appendChild(title);
		titleDiv.appendChild(matchStat);
		titleDiv.appendChild(document.createElement("br"));
		titleDiv.appendChild(summ);
		titleDiv.appendChild(document.createElement("br"));

		return titleDiv;
		
		

	},

	createMatchTable:function(item){
		var matchTable = document.createElement("table");
		matchTable.id = "MatchTable";

		var teamNameRow = document.createElement("tr");
		var fstInnRow = document.createElement("tr");
		var scndInnRow = document.createElement("tr");

		//Create Header Columns for the table
		var blankCol = document.createElement("th");
		var team1Name = document.createElement("th");
		var team1NameText = document.createElement("span");
		team1NameText.className = "teamName";
		team1NameText.innerHTML = item.team1;
		var team1Img = document.createElement("img");
		team1Img.className = "logos";
		team1Img.src = this.file(item.team1Img);
		team1Name.appendChild(team1Img);
		team1Name.appendChild(team1NameText);
		var team2Name = document.createElement("th")
		var team2NameText = document.createElement("span");
		team2NameText.className = "teamName";
		team2NameText.innerHTML = item.team2;
		var team2Img = document.createElement("img");
		team2Img.className = "logos";
		team2Img.src = this.file(item.team2Img);
		team2Name.appendChild(team2Img);
		team2Name.appendChild(team2NameText);
		matchTable.appendChild(teamNameRow);
		

		teamNameRow.appendChild(blankCol);
		teamNameRow.appendChild(team1Name);
		teamNameRow.appendChild(team2Name);

		//Create First Innings row data		
		var fstInnCol = document.createElement("td");
		fstInnCol.innerHTML = "1st Innings";
		var fstInnTm1Score = document.createElement("td");
		fstInnTm1Score.innerHTML = this.validateScore(item.fstInningTeam1);
		var fstInnTm2Score = document.createElement("td");
		fstInnTm2Score.innerHTML = this.validateScore(item.fstInningTeam2);

		fstInnRow.appendChild(fstInnCol);
		fstInnRow.appendChild(fstInnTm1Score);
		fstInnRow.appendChild(fstInnTm2Score);
		matchTable.appendChild(fstInnRow);
		
		//if(item.matchType.toUpperCase() == "INTL-TEST")
		if(this.validateScore(item.scndInningTeam1)!= "0/0" || this.validateScore(item.scndInningTeam2)!= "0/0")
		{
			var scndInnCol = document.createElement("td");
			scndInnCol.innerHTML = "2nd Innings";
			var scndInnTm1Score = document.createElement("td");
			scndInnTm1Score.innerHTML = this.validateScore(item.scndInningTeam1);
			var scndInnTm2Score = document.createElement("td");
			scndInnTm2Score.innerHTML = this.validateScore(item.scndInningTeam2);
			

			scndInnRow.appendChild(scndInnCol);
			scndInnRow.appendChild(scndInnTm1Score);
			scndInnRow.appendChild(scndInnTm2Score);



			matchTable.appendChild(scndInnRow);
		}
		
		return matchTable;
	},

	validateScore:function(scoreString){
		if(scoreString.includes('undefined'))
		{
			return "0/0";
		}
		else
		{
			return scoreString;
		}
	},

	loadTeamImgName:function(teamName){
		if(teamName.includes('India'))
		{
			return "Logos/India.svg";
		}
		else if(teamName.includes("New Zealand"))
		{
			return "Logos/nz.svg";
		}
		else if(teamName.includes("Australia"))
		{
			return "Logos/australia.svg";
		}
		else if(teamName.includes("England"))
		{
			return "Logos/eng.svg";
		}
		else if(teamName.includes("Pakistan"))
		{
			return "Logos/pak.svg";
		}
		else if(teamName.includes("South Africa"))
		{
			return "Logos/sa.svg";
		}
		else if(teamName.includes("United Arab Emirates"))
		{
			return "Logos/uae.svg";
		}
		else if(teamName.includes("West Indies"))
		{
			return "Logos/wi.svg";
		}
		else
		{
			return "Logos/default.svg"
		}		
		
	},

	retrieveCurrentRefreshCount: function(){
		var refreshCount = document.getElementById("CKTSCORES").getAttribute("refreshCount");
		return parseInt(refreshCount);
	},

	incrementRefreshCount: function(){
		var refreshCount = document.getElementById("CKTSCORES").getAttribute("refreshCount");;
		document.getElementById("CKTSCORES").setAttribute("refreshCount",(parseInt(refreshCount) + 1).toString());
		
	}
	
});