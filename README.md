# MMM-CricketScores
This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

This module display's today's scores for your favourite Cricket Matches

![Screenshot](/../Screenshots/screenshot.png?raw=true "Screenshot")


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
      <td>The number of matches to be displayed for live scores<br>Defaults to <code>3</code></td>
    </tr>
    <tr>
      <td><code>focusTeam</code></td>
      <td>Determines which team is prioritized first. The team entered for this property will be pulled first in the list followed by others.<br>Defaults to <code>none</code></td>
    </tr>
    <tr>
      <td><code>apiKey</code></td>
      <td>API Key to retrieve cricket scores from <a href="https://www.livescore.com/en/cricket/">https://www.livescore.com/en/cricket/</a>. You can sign up for an API Key here : <a href="https://rapidapi.com/apidojo/api/livescore6/">https://rapidapi.com/apidojo/api/livescore6/</a><br><br>After signing up, you must subscribe to the service to receive your api key. <br>Defaults to <code>none</code></td>
    </tr>
    <tr>
      <td><code>refreshInterval</code></td>
      <td>The interval at which the module is refreshed in minutes. Beaware of API limits when setting this variable. The API Limit is 500 / month for the free subscription. Refreshing every 90 minutes will allow you to get updates for the whole month. <br>Defaults to <code>none</code></td>
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
        numberOfResults : 3,
        focusTeam: "India",
        apiKey: '21345', // refer to the apiKey description to get an apiKey
        refreshInterval: 90
    }
},

```

