/* 
index.js contains the state of the of the document and allows 
for a unidirectional data flow cycle. 
The state includes: 
    - The "clicked" state 
    - The selected sensor ID
    - The selected time-period
    - ... 
    - (zoom, center coords, etc)?
*/

import "map.js"

let selectedSensor = new Object();
let sensors; 

let selectedSensor = {
    label: null, 
    monitorID: null,
    coordinates: {
        longitude: null,
        latitude: null
    }
};

const onClick = d => {
    selectedSensor = d; 
    console.log(selectedSensor);
}

