import React from 'react';

const styles = {
	fontSize: '1.2rem'
}

function Info(props) {
	if (props.next) {
		var time, stamp;
		switch(props.next.min) {
			case "":
			case '---':
				time = <p>Next train's arrival time is unknown.</p>;
				break;
			case 'ARR':
				time = <p>Train is arriving.</p>
				break;
			case 'BRD':
				time = <p>Train is boarding now.</p>
				break;
			default:
				time = <span>Next train arrives in {props.next.min} minutes.</span>
		}
		if (props.next.updateTime) {
			stamp = <span>(Updated on {props.next.updateTime.toLocaleTimeString()})</span>
		} else {
			stamp = <span>(Updated time is unknown.)</span>
		}
	}	

	if (props.trip) {
		var trip = <p>The distance between two stops are {props.trip.dist} miles.
			It takes {props.trip.time} minutes.</p>
	}

	return (<div style={styles}><p>{time} {stamp}</p>{trip}</div>)
}

export default Info;