import express from "express";
const app = express();
const port = 3000; //listening port
app.listen(port, () => {
	console.log("the server is running");
})
app.use(express.json())

let alerts = new Map() // this contains all the alerts generated against a vehicle in the format {vehicleID: 1}
let is_driving_safe_history = new Map() //this contains the last five records of a vehicle in the format {vehicleID: [0, 1, 1, 0, 1]} (1 represtns violation 0 represents following of rules)
let X = new Map([ //X is as described in the question
	['highway', 4], 
	['city_center', 3],
	['commercial', 2],
	['residential', 1]
])

function updateHist(isSafe, loc, vId) {
	console.log(isSafe, loc, vId);
	let curr_driver_hist = is_driving_safe_history.get(vId);
	if (!curr_driver_hist) curr_driver_hist = []; //initialize if not already exists
	curr_driver_hist.push(isSafe);
	if (curr_driver_hist && curr_driver_hist.length > 5) curr_driver_hist.shift();
	let total_mistakes = 0;
	for (let ele in curr_driver_hist)  {
		total_mistakes += (1-ele);
	}
	if (total_mistakes > X.get(loc)) { //assume that the vehicle does not change its location type in the last 5 minutes
		alerts.set(vId, 1); //1 represets violation of rule
		curr_driver_hist = [];
	}
	is_driving_safe_history.set(vId, curr_driver_hist);
}

app.post("/event", (req, res) => {
	console.log("post request received at /event.");
	console.log(req.body);
	updateHist(req.body.is_driving_safe, req.body.location_type, req.body.vehicle_id);
	res.send("707")
})

app.get("/alert", (req, res) => {
	console.log("get request received at /alert")
	let vID = req.body.vehicle_id;
	let isAlert = alerts.get(vID);
	console.log(isAlert)
	alerts.set(vID, 0); // reset the alert
	res.send({'val': isAlert});
})

app.get("/", (req, res) => {
	res.send('hi')
})