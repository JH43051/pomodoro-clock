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
class SessionControl extends React.Component {
  render() {
    return (
      <div className="length-control">
        <div id="session-label">
          Session Length
        </div>
        <button id="session-increment"
          className="btn-level" value="+" 
          onClick={this.props.onInc}>
          <i className="fa fa-arrow-up fa-2x"/>
        </button>
        <div id="session-length" className="btn-level">
          {this.props.length}
        </div>
        <button id="session-decrement"
          className="btn-level" value="-" 
          onClick={this.props.onDec}>
          <i className="fa fa-arrow-down fa-2x"/>
        </button>
      </div>
    )
  }
};

class BreakControl extends React.Component {
  render() {
    return (
      <div className="length-control">
        <div id="break-label">
          Break Length
        </div>
        <button id="break-increment"
          className="btn-level" value="+" 
          onClick={this.props.onInc}>
          <i className="fa fa-arrow-up fa-2x"/>
        </button>
        <div id="break-length" className="btn-level">
          {this.props.length}
        </div>
        <button id="break-decrement"
          className="btn-level" value="-" 
          onClick={this.props.onDec}>
          <i className="fa fa-arrow-down fa-2x"/>
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
      clockType: 'Session', // Changing this between 'session' and 'break' resets clockTimer to either sessionTimer or breakTimer
      clockState: 'stopped', // If 'stopped', nothing happens; if 'running' clockTimer will decrement every second (WATCH ME FOR WHEN startStop() CHANGES ME!)
      alarmColor: {color: 'white'}, // White normally, will be red when counter gets low
      intervalID: undefined
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
  decrementSessionTimer() {
    if (this.state.sessionTimer > 1) {
      this.setState((state) => ({
        sessionTimer: state.sessionTimer - 1
      }));
      this.updateClock();
    }
  }

  // When user hits the increment button on the session timer, it increments it by 1 minute
  incrementSessionTimer() {
    if (this.state.sessionTimer < 60) {
      this.setState((state) => ({
        sessionTimer: state.sessionTimer + 1
      }));
      this.updateClock();
    }
  }

  // When user hits the decrement button on the break timer, it decrements it by 1 minute
  decrementBreakTimer() {
    if (this.state.breakTimer > 1) {
      this.setState((state) => ({
        breakTimer: state.breakTimer - 1
      }));
      this.updateClock();
    }
  }

  // When user hits the increment button on the break timer, it increments it by 1 minute
  incrementBreakTimer() {
    if (this.state.breakTimer < 60) {
      this.setState((state) => ({
        breakTimer: state.breakTimer + 1
      }));
      this.updateClock();
    }
  }

  // Decrements the main clock; call me every second!
  decrementClockTimer() {
    this.setState((state) => ({
      clockTimer: state.clockTimer - 1
    }));
  }

  // Resets the clock to the defaults
  resetClockTimer() {
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
  startStop() {
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
  clockTranslater() {
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
        <div className="main-title">
          Pomodoro Clock
        </div>
        <SessionControl
          onInc={this.incrementSessionTimer}
          onDec={this.decrementSessionTimer}
          length={this.state.sessionTimer}/>
        <BreakControl
          onInc={this.incrementBreakTimer}
          onDec={this.decrementBreakTimer}
          length={this.state.breakTimer} />
        <div className="timer" style={this.state.alarmColor}>
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
            <i className="fa fa-play fa-2x"/>
            <i className="fa fa-pause fa-2x"/>
          </button>
          <button id="reset" onClick={this.resetClockTimer}>
            <i className="fa fa-refresh fa-2x"/>
          </button>
        </div>
        <div className="author">Designed and Coded by<br />
          <a rel="noopener noreferrer" target="_blank" href="https://jh43051.github.io/FCC-portfolio"> 
            John Holler
          </a>
        </div>
        <audio id="beep" src="/BeepSound.wav" preload="true" 
          ref={(audio) => {this.buzzer = audio;}} />
      </div>
    )
  }
};

export default App;
