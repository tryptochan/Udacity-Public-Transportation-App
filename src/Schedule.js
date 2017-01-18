import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import {RadioGroup, RadioButton} from 'react-toolbox/lib/radio';
import {Button} from 'react-toolbox/lib/button';
import Info from './Info.js';

class Schedule extends React.Component {
	constructor() {
		super();
		this.apiKey = '6b700f7ea9db408e9745c207da7ca827';
		let stops = []; //NB sequence of stations
		this.state = {
			stops: stops,
			startValue: '',
			endValue: '',
			direction: 'nb',
			nextTrain: null,
			tripInfo: null
		}
		const pathApi = `https://api.wmata.com/Rail.svc/json/jPath?FromStationCode=J03&ToStationCode=G05&api_key=${this.apiKey}`
		fetch(pathApi)
		.then(response => response.json())
		.then(j => {
			j.Path.forEach(function(sta) {
				stops.push({value: sta.StationCode, label: sta.StationName});
			})
			this.setState({stops: stops})
		})
		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleDirection = this.handleDirection.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleStart(value) {
		this.setState({startValue: value});
	}

	handleEnd(value) {
		this.setState({endValue: value});
	}

	handleDirection(value) {
		this.state.stops.reverse();
		this.setState({
			direction: value,
		  startValue:'', 
		  endValue: '',
			nextTrain: null,
			tripInfo: null
		});
	}

	handleClick() {
		const arriveApi = `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${this.state.startValue}?api_key=${this.apiKey}`
		const tripApi = `https://api.wmata.com/Rail.svc/json/jSrcStationToDstStationInfo?FromStationCode=${this.state.startValue}&ToStationCode=${this.state.endValue}&api_key=${this.apiKey}`
		fetch(arriveApi)
		.then(response => response.json())
		.then(j => {
			let nextTrain;
			if (this.state.direction === 'nb') {
				nextTrain = j.Trains.filter((elem) => elem.DestinationCode === 'G05')[0];
			} else if (this.state.direction === 'sb') {
				nextTrain = j.Trains.filter((elem) => elem.DestinationCode === 'J03')[0];
			}
			let time = {min: nextTrain.Min};
			if (!j.updateTime) {
				time.updateTime = new Date();
			} else {
				time.updateTime = new Date(j.updateTime);
			}
			this.setState({nextTrain: time});
		});

		fetch(tripApi)
		.then(response =>response.json())
		.then(j => {
			this.setState({
				tripInfo: {
					time: j.StationToStationInfos[0].RailTime,
				  dist: j.StationToStationInfos[0].CompositeMiles
				}
			})
		});
	}

	render() {
		let startStops, endStops;
		startStops = this.state.stops;
		if (!this.state.startValue) {
			endStops = []
		} else {
			let startIdx = startStops.findIndex((elem) => elem.value === this.state.startValue);
			endStops = startStops.slice(startIdx+1)
		}

		return (
			<div>
			<RadioGroup
				name="direction"
			  value={this.state.direction}
			  onChange={this.handleDirection}
			>
				<RadioButton label='Northbound' value='nb' />
				<RadioButton label='Southbound' value='sb' />
			</RadioGroup>
			<Dropdown
				auto={false}
				label="Select departure station"
				source={startStops}
				value={this.state.startValue}
				onChange={this.handleStart}
				required
			/>
			<Dropdown
				auto={false}
				label="Select arrival station"
				source={endStops}
				value={this.state.endValue}
				onChange={this.handleEnd}
				required
			/>
			<Button label='check' onMouseUp={this.handleClick} raised primary />
			<Info next={this.state.nextTrain} trip={this.state.tripInfo} />
			</div>
		)
	}
}

export default Schedule;