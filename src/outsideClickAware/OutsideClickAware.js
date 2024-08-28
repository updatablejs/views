
import {Component, Util} from '../import.js';

export class OutsideClickAware extends Component {
	
	outsideClickHandler;
	outsideClickHandlerRegistered;
	 
	setDefaults() {
		super.setDefaults();
		
		this.set({
			outsideClickAwareEnabled: true,
		});
	}
	
	setOutsideClickAwareEnabled(value) {
		this.outsideClickAwareEnabled = value;
	}
	
	isOutsideClickAwareEnabled() {
		return Util.getValue(this.outsideClickAwareEnabled, this);
	}
	
	registerOutsideClickHandler() {
		if (!this.outsideClickHandlerRegistered) {
			document.addEventListener('click', this.getOutsideClickHandler());	
			this.outsideClickHandlerRegistered = true;
		}
		
		return this;
	}
	
	unregisterOutsideClickHandler() {
		if (this.outsideClickHandlerRegistered) {
			document.removeEventListener('click', this.getOutsideClickHandler());
			this.outsideClickHandlerRegistered = false;
		}
		
		return this;
	}

	getOutsideClickHandler() {
		if (!this.outsideClickHandler) {
			this.outsideClickHandler = (event) => {
				var element = event.target.closest('.outside-click-aware');
				
				if (this.isOutsideClickAwareEnabled() && (!element || element != this.element)) {
					this.onOutsideClick();
				}
			};
		}
		
		return this.outsideClickHandler;
	}
	
	onOutsideClick() {
		if ('onOutsideClick' in this.callbacks)
			this.callbacks.onOutsideClick(this);
	}
}
