import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Modal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpenClass : '',
			scrollPos   : 0
		}

		this.closeOnEsc = this.closeOnEsc.bind(this);
		this.closeOnOverlay = this.closeOnOverlay.bind(this);
	}

	componentWillMount() {
		this.state.scrollPos = document.body.scrollTop;
	}

	componentDidMount() {
		var self = this;
		ReactDOM.findDOMNode(this.refs.btnModalClose).focus();

		document.addEventListener('keydown', this.closeOnEsc, false);
		this.props.overlay.addEventListener('click', this.closeOnOverlay, false);

		setTimeout(function() {
			self.animateOpen();
		}, 300);
	}

	animateOpen() {
		this.setState({isOpenClass: 'isOpen'});
	}

	setOpenClass() {
		return 'modal-window ' + this.state.isOpenClass;
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.closeOnEsc, false);
		this.props.overlay.removeEventListener('click', this.closeOnOverlay, false);
	}

	closeOnEsc(event) {
		if (event.keyCode === 27) {
			this.closeModal(event);
		}
	}

	closeOnOverlay(event) {
		event.preventDefault();

		if (event.currentTarget !== event.target) {
			return;
		}

		this.closeModal(event);
	}

	closeModal(event) {
		event.preventDefault();

		document.body.classList.remove('modal-open');
		document.body.style.top = '';
		window.scrollTo(0, this.state.scrollPos);
		this.props.overlay.classList.remove('isOpen');
		document.getElementById('app').setAttribute('aria-hidden', false);
		ReactDOM.unmountComponentAtNode(this.props.overlay);
	}

	render() {
		let altText = this.props.data.name + ' logo';

		document.body.classList.add('modal-open');
		document.body.style.top = -this.state.scrollPos + 'px';
		this.props.overlay.classList.add('isOpen');
		document.getElementById('app').setAttribute('aria-hidden', true);

		return(
			<div className={this.setOpenClass()}>
				<button className="btn-modal-close" ref="btnModalClose" onClick={() => this.closeModal(event)}>
					close modal window
				</button>
				<div className="modal-content">
					<div className="image">
						<img src={this.props.data.image} alt={altText} />
					</div>
					<div className="details" dangerouslySetInnerHTML={{__html: this.props.data.details}} />
				</div>
			</div>
		)
	}
}

export default Modal;
