# MMM-CricketScores
This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

This module display's today's scores for your favourite Cricket Matches

![Screenshot](/../screenshots/screenshot.png?raw=true "Screenshot")


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
  </tbody>
</table>



## Example configuration

```
{
    module: 'MMM-CricketScores',
    position: 'right',
    config:{
        numberOfResults : 1,
        focusTeam: "India"
    }
},

```

