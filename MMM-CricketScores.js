Module.register("MMM-CricketScores",{
	// Default module config.
	defaults: {
		category: "cricket",
		numberOfResults : 3,
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
		var wrapper = document.getElementById("CKTSCORES");
			while (wrapper.firstChild) {
				wrapper.firstChild.remove();
			}
		Log.info("[CKTSCORES] Updating");
		this.sendSocketNotification("UPDATE", this.config);
		this.updateDom();
		Log.info("[CKTSCORES] Updated");
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
			if(numItems > this.config.numberOfResults)
			{
				numItems = this.config.numberOfResults;
			}
		  }
		  for (var i= 0; i < numItems; i++) {
			var item = matchArray[i];
			this.update(item);

		  }
		  
		}
	},

	update: function(item){
		var match = {
			"matchName" : item.Snm,
			"matchSummary": item.Events[0].ECo,
			"matchType": item.Ccd,
			"team1" : item.Events[0].T1[0].Nm,
			"team1Img" : this.loadTeamImgName(item.Events[0].T1[0].Nm),
			"team2" : item.Events[0].T2[0].Nm,
			"team2Img" : this.loadTeamImgName(item.Events[0].T2[0].Nm),
			"fstInningTeam1": item.Events[0].Tr1C1 + "/" +  item.Events[0].Tr1CW1,
			"fstInningTeam2": item.Events[0].Tr2C1 + "/" +  item.Events[0].Tr2CW1,
			"scndInningTeam1": item.Events[0].Tr1C2 + "/" +  item.Events[0].Tr1CW2,
			"scndInningTeam2": item.Events[0].Tr2C2 + "/" +  item.Events[0].Tr2CW2
		}
		this.displayInfo(match);

	},

	displayInfo: function(item){
		var wrapper = document.getElementById("CKTSCORES");
		
		var title = document.createElement("span");
		title.id = "matchTitle";
		title.className = "header";
		title.innerHTML = item.matchName;

		var summ =  document.createElement("span");
		summ.id = "matchSumm";
		summ.className = "header";
		summ.innerHTML = item.matchSummary;

		var matchTable = document.createElement("table");
		matchTable.id = "MatchTable";

		var teamNameRow = document.createElement("tr");
		var fstInnRow = document.createElement("tr");
		var scndInnRow = document.createElement("tr");

		//Create Header Columns for the table
		var blankCol = document.createElement("td");
		var team1Name = document.createElement("td");
		var team1NameText = document.createElement("span");
		team1NameText.className = "teamName";
		team1NameText.innerHTML = item.team1;
		var team1Img = document.createElement("img");
		team1Img.className = "logos";
		team1Img.src = this.file(item.team1Img);
		team1Name.appendChild(team1Img);
		team1Name.appendChild(team1NameText);
		var team2Name = document.createElement("td")
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
		
		if(item.matchType.toUpperCase() == "INTL-TEST")
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
		
		
		wrapper.appendChild(title);
		wrapper.appendChild(document.createElement("br"));
		wrapper.appendChild(summ);
		wrapper.appendChild(document.createElement("br"));
		wrapper.appendChild(document.createElement("hr"));
		wrapper.appendChild(matchTable);
		wrapper.appendChild(document.createElement("hr"));

		
		
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
		switch(teamName)
		{
			case "India":
				return "Logos/India.svg";
			case "New Zealand":
				return "Logos/nz.svg";
			case "Australia":
				return "Logos/aus.svg";
			case "England":
				return "Logos/eng.svg";
			case "Pakistan":
				return "Logos/pak.svg";
			case "South Africa":
				return "Logos/sa.svg";
			case "United Arab Emirates":
				return "Logos/uae.svg";
			case "West Indies":
				return "Logos/wi.svg";
			default :
				return "Logos/default.svg"
		}
	}
	
});