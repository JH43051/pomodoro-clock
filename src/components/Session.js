import React from 'react';

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
					<i class="fas fa-angle-up fa-2x"></i>
				</button>
				<div id="session-length" className="btn-level">
					{this.props.length}
				</div>
				<button id="session-decrement"
					className="btn-level" value="-"
					onClick={this.props.onDec}>
					<i className="fas fa-angle-down fa-2x" />
				</button>
			</div>
		)
	}
};

export default SessionControl;
