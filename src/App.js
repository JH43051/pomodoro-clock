import React from 'react';

// coded by @no-stack-dub-sack (github) / @no_stack_sub_sack (codepen)

/** NOTES:
/** Dependencies are React, ReactDOM, and 
    Accurate_Interval.js by Squuege (external script 
    to keep setInterval() from drifting over time & 
    thus ensuring timer goes off at correct mark).
/** Utilizes embedded <Audio> tag to ensure audio 
    plays when timer tab is inactive or browser is 
    minimized ( rather than new Audio().play() ).
/** Audio of this fashion not supported on most 
    mobile devices it would seem (bummer I know).
**/


// COMPONENTS:
class TimerLengthControl extends React.Component {
  render() {
    return (
      <div className="length-control">
        <div id={this.props.titleID}>
          {this.props.title}
        </div>
        <button id={this.props.minID}
          className="btn-level" value="-" 
          onClick={this.props.onClick}>
          <i className="fa fa-arrow-down fa-2x"/>
        </button>
        <div id={this.props.lengthID} className="btn-level">
          {this.props.length}
        </div>
        <button id={this.props.addID}
          className="btn-level" value="+" 
          onClick={this.props.onClick}>
          <i className="fa fa-arrow-up fa-2x"/>
        </button>
      </div>
    )
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionTimer: 25, // These only change when user manually adjusts total time
      breakTimer: 5, // These only change when user manually adjusts total time
      clockTimer: 1500, // This is the main clock's time (in seconds) and counts down
      clockType: 'session', // Changing this between 'session' and 'break' resets clockTimer to either sessionTimer or breakTimer
      clockState: 'stopped', // If 'stopped', nothing happens; if 'running' clockTimer will decrement every second (WATCH ME FOR WHEN startStop() CHANGES ME!)
      alarmColor: {color: 'white'}  // White normally, will be red when counter gets low
    }
    this.decrementSessionTimer = this.decrementSessionTimer.bind(this);
    this.incrementSessionTimer = this.incrementSessionTimer.bind(this);
    this.decrementBreakTimer = this.decrementBreakTimer.bind(this);
    this.incrementBreakTimer = this.incrementBreakTimer.bind(this);
    this.decrementClockTimer = this.decrementClockTimer.bind(this);
    this.resetClockTimer = this.resetClockTimer.bind(this);
    this.startStop = this.startStop.bind(this);
    this.updateClock = this.updateClock.bind(this);
    this.clockTranslater = this.clockTranslater.bind(this);
  }

  // This is called whenever a user manually increments/decrements a timer; it updates the main clock to show the new values
  updateClock() {
    if (this.state.clockType === 'session') {
      this.setState({
        clockTimer: this.state.sessionTimer * 60
      });
    } else if (this.state.clockType === 'break') {
      this.setState({
        clockTimer: this.state.breakTimer * 60
      });
    }
  }

  // When user hits the decrement button on the session timer, it decrements it by 1 minute
  decrementSessionTimer() {
    let currSessTimer = this.state.sessionTimer;
    this.setState({
      sessionTimer: currSessTimer--
    });
    this.updateClock();
  }

  // When user hits the increment button on the session timer, it increments it by 1 minute
  incrementSessionTimer() {
    let currSessTimer = this.state.sessionTimer;
    this.setState({
      sessionTimer: currSessTimer++
    });
    this.updateClock();
  }

  // When user hits the decrement button on the break timer, it decrements it by 1 minute
  decrementBreakTimer() {
    let currBreakTimer = this.state.breakTimer;
    this.setState({
      breakTimer: currBreakTimer--
    });
    this.updateClock();
  }

  // When user hits the increment button on the break timer, it increments it by 1 minute
  incrementBreakTimer() {
    let currBreakTimer = this.state.breakTimer;
    this.setState({
      breakTimer: currBreakTimer++
    });
    this.updateClock();
  }

  // Decrements the main clock; call me every second!
  decrementClockTimer() {
    let currClockTimer = this.state.clockTimer;
    this.setState({
      clockTimer: currClockTimer++
    });
  }

  // Resets the clock to the time of whatever type of clock is currently displayed in the main clock
  resetClockTimer() {
    if (this.state.clockType === 'session') {
      this.setState({
        clockTimer: this.state.sessionTimer
      });
    } else if (this.state.clockType === 'break'){
      this.setState({
        clockTimer: this.state.breakTimer
      });
    }
    // Stops the clock on reset
    this.setState({
      clockState: 'stopped'
    });
  }

  // Toggles clockState between 'stopped' and 'running'
  startStop() {
    if (this.state.clockState === 'stopped') {
      this.setState({
        clockState: 'running'
      });
    } else if (this.state.clockState === 'running') {
      this.setState({
        clockState: 'stopped'
      });
    }
  }

  // Converts raw seconds into a readable minutes:seconds format for display
  clockTranslater() {
    let minutes = Math.floor(this.state.clockTimer / 60);
    let seconds = this.state.clockTimer - minutes * 60;
    minutes = minutes < 10 ? '0' + minutes : minutes; // Keeps the minutes place 2 digits
    seconds = seconds < 10 ? '0' + seconds : seconds; // Keeps the seconds place 2 digits
    return minutes + ':' + seconds;
  }
    
    
  render() {
    return (
      <div>
        <div className="main-title">
          Pomodoro Clock
        </div>
        <TimerLengthControl 
          titleID="break-label"   minID="break-decrement"
          addID="break-increment" lengthID="break-length"
          title="Break Length"    onClick={this.setBrkLength}
          length={this.state.brkLength}/>
        <TimerLengthControl 
          titleID="session-label"   minID="session-decrement"
          addID="session-increment" lengthID="session-length"
          title="Session Length"    onClick={this.setSeshLength} 
          length={this.state.seshLength}/>
        <div className="timer" style={this.state.alarmColor}>
          <div className="timer-wrapper">
            <div id='timer-label'>
              {this.state.timerType}
            </div>
            <div id='time-left'>
              {this.clockTranslater()}
            </div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.timerControl}>
            <i className="fa fa-play fa-2x"/>
            <i className="fa fa-pause fa-2x"/>
          </button>
          <button id="reset" onClick={this.reset}>
            <i className="fa fa-refresh fa-2x"/>
          </button>
        </div>
        <div className="author"> Designed and Coded by <br />
          <a target="_blank" href="https://goo.gl/6NNLMG"> 
            Peter Weinberg
          </a>
        </div>
        <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1"
          ref={(audio) => { this.audioBeep = audio; }} />
      </div>
    )
  }
};

export default App;
