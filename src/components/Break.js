import React from 'react';

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
					<i class="fas fa-angle-up fa-2x"></i>
				</button>
				<div id="break-length" className="btn-level">
					{this.props.length}
				</div>
				<button id="break-decrement"
					className="btn-level" value="-"
					onClick={this.props.onDec}>
					<i class="fas fa-angle-down fa-2x"></i>
				</button>
			</div>
		)
	}
};

export default BreakControl;