import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import isDescendant from 'utilities/IsDescendant';

class Modal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpenClass : '',
			scrollPos   : 0,
			setFocus    : false
		}

		this.onFocusIn      = this.onFocusIn.bind(this);
		this.closeOnEsc     = this.closeOnEsc.bind(this);
		this.closeOnOverlay = this.closeOnOverlay.bind(this);
		this.closeModal     = this.closeModal.bind(this);
	}

	componentWillMount() {
		this.state.scrollPos = document.body.scrollTop;

		if (this.props.trigger) {
			this.state.setFocus = true;
		}
	}

	componentDidMount() {
		var self = this;

		if (this.state.setFocus) {
			ReactDOM.findDOMNode(this.refs.btnModalClose).focus();
		}

		this.addEventListeners();

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
		this.removeEventListeners();

		if (this.state.setFocus) {
			this.props.trigger.focus();
		}
	}

	closeOnEsc(event) {
		if (event.keyCode === 27) {
			this.closeModal(event);
		}
	}

	closeOnOverlay(event) {
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
		let website = '';

		document.body.classList.add('modal-open');
		document.body.style.top = -this.state.scrollPos + 'px';
		this.props.overlay.classList.add('isOpen');
		document.getElementById('app').setAttribute('aria-hidden', true);

		if (this.props.data.website) {
			website =
				<p><a href={this.props.data.website} className="website" target="_blank">
					Visit site
					<svg className="icon icon-external"><use xlinkHref='#icon-external' /></svg>
				</a></p>;
		}

		return(
			<div className={this.setOpenClass()}>
				<button className="btn-modal-close" ref="btnModalClose" onClick={(event) => this.closeModal(event)}>
					close modal window
					<svg className="icon icon-close"><use xlinkHref='#icon-close' /></svg>
				</button>
				<div className="modal-content">
					<div className="image">
						<img src={this.props.data.image} alt={altText} />
					</div>
					<div className="details" dangerouslySetInnerHTML={{__html: this.props.data.details}} />
					{website}
				</div>
			</div>
		)
	}

	onFocusIn(event) {
		var child = event.target;
		var parent = this.props.overlay;

		if (!isDescendant(parent, child)) {
			ReactDOM.findDOMNode(this.refs.btnModalClose).focus();
		}
	}

	addEventListeners() {
		document.addEventListener('focusin', this.onFocusIn, false);
		document.addEventListener('keydown', this.closeOnEsc, false);
		this.props.overlay.addEventListener('click', this.closeOnOverlay, false);
	}

	removeEventListeners() {
		document.removeEventListener('focusin', this.onFocusIn, false);
		document.removeEventListener('keydown', this.closeOnEsc, false);
		this.props.overlay.removeEventListener('click', this.closeOnOverlay, false);
	}
}

export default Modal;
