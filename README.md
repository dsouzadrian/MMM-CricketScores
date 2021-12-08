# MMM-CricketScores
This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

This module display's cricket scores for ongoing live cricket matches

![Screenshot](/Screenshots/Screenshot.gif "Screenshot")


## Installation

1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/dsouzadrian/MMM-CricketScores.git`.
2. Enter the new `MMM-CricketScores` directory and execute `npm install`.





## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>numberOfResults</code></td>
      <td>The number of matches to be displayed at a time.<br>Defaults to <code>1</code></td>
    </tr>
    <tr>
      <td><code>screenRefreshInterval</code></td>
      <td>The interval in seconds at which MMM-CricketScores iterates through all live matches. If <code>numberOfReslts</code> is defined as 2 - then 2 matches are displayed at one time. Additional results will be displayed next and we continue looping through.<br>Defaults to <code>10 seconds</code></td>
    </tr>
    <tr>
      <td><code>focusTeam</code></td>
      <td>Determines which team is prioritized first. The team entered for this property will be pulled first in the list followed by others.<br>Defaults to <code>none</code></td>
    </tr>
    <tr>
      <td><code>apiKey</code></td>
      <td>API Key to retrieve cricket scores from <a href="https://www.livescore.com/en/cricket/">https://www.livescore.com/en/cricket/</a>. You can sign up for an API Key here : <a href="https://rapidapi.com/apidojo/api/livescore6/">https://rapidapi.com/apidojo/api/livescore6/</a><br>After signing up, you must subscribe to the service to receive your api key. <br><br>Defaults to <code>none</code></td>
    </tr>
    <tr>
      <td><code>refreshInterval</code></td>
      <td>The interval at which the module is refreshed in minutes to retrieve results from the API. Beaware of API limits when setting this variable. The API Limit is 500 / month for the free subscription. Refreshing every 90 minutes will allow you to get updates for the whole month. <br>Defaults to <code>90 minutes</code></td>
    </tr>
  </tbody>
</table>



## Example configuration

```
{
    module: 'MMM-CricketScores',
    position: 'right',
    config:{
        category: "cricket",
        numberOfResults : 1,
        screenRefreshInterval : 10,
        focusTeam: "India",
        apiKey: '21345', // refer to the apiKey description to get an apiKey
        refreshInterval: 90
    }
},

```

