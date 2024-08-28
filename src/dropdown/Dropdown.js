
import {Openable} from '../openable/Openable.js';
import {Util, Updatable} from '../import.js';

export class Dropdown extends Openable {
	
	setDefaults() {
		super.setDefaults();
		
		this.set({
			hoverable: true,
			content: null,
			button: (component) => `<button type="button" class="image-button icon-more-horiz" 
				onclick="this.toggleVisibility()"></button>`
		});
	}
	
	getTemplate() {
		return `<div class="dropdown ${this.isOutsideClickAwareEnabled() ? 'outside-click-aware' : ''}
			${this.hoverable ? 'hoverable' : ''} {{this.isOpen() ? 'opened' : ''}}" onmouseleave="this.addHoverableClass()">
    		
			${this.button()}

			<div class="content">
				{{this.getContent()}}	
			</div>
		</div>`;
	}
	
	getContent() {
		return !this.isCreated() ? Util.getValue(this.content) : Updatable.noChange;
	}
	
	isHoverable() {
		return this.hoverable;
	}
	
	addHoverableClass() {
		if (this.isHoverable())
			this.element.classList.add('hoverable');
	}
			
	close() {
		super.close();
		
		this.element.classList.remove('hoverable');
	}
	
	onOutsideClick() {
		super.close();
	}
}
