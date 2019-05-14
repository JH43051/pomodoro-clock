import React from 'react';

import SessionControl from './components/Session';
import BreakControl from './components/Break';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sessionTimer: 25, // These only change when user manually adjusts total time
			breakTimer: 5, // These only change when user manually adjusts total time
			clockTimer: 1500, // This is the main clock's time (in seconds) and counts down
			clockType: 'Session', // Changing this between 'session' and 'break' changes clockTimer to value of sessionTimer or breakTimer
			clockState: 'stopped', // If 'stopped', nothing happens; if 'running' clockTimer will decrement every second
			intervalID: undefined
		}
	}
	// This is called whenever a user manually increments/decrements a timer; it updates the main clock to show the new values
	updateClock = () => {
		if (this.state.clockType === 'Session') {
			this.setState((state) => ({
				clockTimer: state.sessionTimer * 60
			}));
		} else if (this.state.clockType === 'Break') {
			this.setState((state) => ({
				clockTimer: state.breakTimer * 60
			}));
		}
	}
	// When user hits the decrement button on the session timer, it decrements it by 1 minute
	decrementSessionTimer = () => {
		if (this.state.sessionTimer > 1) {
			this.setState((state) => ({
				sessionTimer: state.sessionTimer - 1
			}));
			this.updateClock();
		}
	}
	// When user hits the increment button on the session timer, it increments it by 1 minute
	incrementSessionTimer = () => {
		if (this.state.sessionTimer < 60) {
			this.setState((state) => ({
				sessionTimer: state.sessionTimer + 1
			}));
			this.updateClock();
		}
	}
	// When user hits the decrement button on the break timer, it decrements it by 1 minute
	decrementBreakTimer = () => {
		if (this.state.breakTimer > 1) {
			this.setState((state) => ({
				breakTimer: state.breakTimer - 1
			}));
			this.updateClock();
		}
	}
	// When user hits the increment button on the break timer, it increments it by 1 minute
	incrementBreakTimer = () => {
		if (this.state.breakTimer < 60) {
			this.setState((state) => ({
				breakTimer: state.breakTimer + 1
			}));
			this.updateClock();
		}
	}
	// Decrements the main clock; called every second by the interval within startStop
	decrementClockTimer = () => {
		this.setState((state) => ({
			clockTimer: state.clockTimer - 1
		}));
	}
	// Resets the clock to the defaults
	resetClockTimer = () => {
		this.setState({
			sessionTimer: 25,
			breakTimer: 5,
			clockType: 'Session',
			clockState: 'stopped',
			clockTimer: 1500,
			intervalID: window.clearInterval(this.state.intervalID) // Stops the clock on reset
		});
		this.buzzer.pause(); // Stops buzzer
		this.buzzer.currentTime = 0; // Rewinds buzzer
	}
	// Toggles clockState between 'stopped' and 'running'
	startStop = () => {
		if (this.state.clockState === 'running') {
			this.setState({
				clockState: 'stopped',
				intervalID: window.clearInterval(this.state.intervalID) // Stops the clock
			});
		} else if (this.state.clockState === 'stopped') {
			this.setState({
				clockState: 'running',
				intervalID: window.setInterval(this.decrementClockTimer, 1000)  // Starts the clock
			});
		}
	}
	// Converts raw seconds into a readable minutes:seconds format for display
	clockTranslater = () => {
		let minutes = Math.floor(this.state.clockTimer / 60);
		let seconds = this.state.clockTimer - minutes * 60;
		minutes = minutes < 10 ? '0' + minutes : minutes; // Keeps the minutes place 2 digits
		seconds = seconds < 10 ? '0' + seconds : seconds; // Keeps the seconds place 2 digits
		return minutes + ':' + seconds;
	}

	render() {
		// Catches and toggles timer type between session and break when timer runs out
		if (this.state.clockTimer === -1 && this.state.clockType === 'Session') {
			this.setState((state) => ({
				clockType: 'Break',
				clockTimer: state.breakTimer * 60
			}));
		} else if (this.state.clockTimer === -1 && this.state.clockType === 'Break') {
			this.setState((state) => ({
				clockType: 'Session',
				clockTimer: state.sessionTimer * 60
			}));
		}
		// Catches end of timer and triggers buzzer
		if (this.state.clockTimer === 0) {
			this.buzzer.play();
		}
		// JSX returned
		return (
			<div>
				<h1 className="main-title">
					Pomodoro Clock
        		</h1>
				<p>What is this?: <a rel="noopener noreferrer"
									target="_blank"
									href="https://en.wikipedia.org/wiki/Pomodoro_Technique">
					The Pomodoro Technique</a>
				</p>
				<SessionControl
					onInc={this.incrementSessionTimer}
					onDec={this.decrementSessionTimer}
					length={this.state.sessionTimer} />
				<BreakControl
					onInc={this.incrementBreakTimer}
					onDec={this.decrementBreakTimer}
					length={this.state.breakTimer} />
				<img id="tomato" src="./ODHG1M1.svg" alt="Tomato Top" />
				<div className="timer">
					<div className="timer-wrapper">
						<div id='timer-label'>
							{this.state.clockType}
						</div>
						<div id='time-left'>
							{this.clockTranslater()}
						</div>
					</div>
				</div>
				<div className="timer-control">
					<button id="start_stop" onClick={this.startStop}>
						<i className="fa fa-play fa-2x" />
						<i className="fa fa-pause fa-2x" />
					</button>
					<button id="reset" onClick={this.resetClockTimer}>
						<i class="fas fa-redo-alt fa-2x"></i>
					</button>
				</div>
				<audio id="beep" src="./BeepSound.wav" preload="true"
					ref={(audio) => {this.buzzer = audio;}} />
			</div>
		)
	}
};

export default App;
