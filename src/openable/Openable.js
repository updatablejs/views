
import {OutsideClickAware} from '../outsideClickAware/OutsideClickAware.js';

export class Openable extends OutsideClickAware {

	setDefaults() {
		super.setDefaults();
		
		this.set({
			opened: false	
		});
	}
	
	onOutsideClick() {
		this.close();
	}
	
	setOpen(value) {
		this.opened = value;
	}

	isOpen() {
		return this.opened;
	}
	
	open() {
		this.setOpen(true);
		if (this.isOutsideClickAwareEnabled())
			this.registerOutsideClickHandler();

		this.update();
	}
	
	close() {
		this.setOpen(false);
		this.unregisterOutsideClickHandler();
		this.update();
	}
	
	toggleVisibility() {
		return this.isOpen() ? this.close() : this.open();
	}
}
