
import {Component} from '../import.js';

export class Expandable extends Component {

	setDefaults() {
		super.setDefaults();
		
		this.set({
			expanded: false,
			gradientEnabled: true,
			content: null // (component) => {}
		});
	}

	getTemplate() {
		return `<div class="expandable {{this.isExpanded() ? 'expanded' : ''}}">
			<div class="content {{this.isExpandable() && !this.isExpanded() && this.isGradientEnabled() ? 'gradient' : ''}}">
				{{?Util.getValue(this.content, this)}}
			</div>
			<button class="outline-image-button {{this.isExpanded() ? 'icon-expand-less' : 'icon-expand-more'}}" 
				style="display: {{this.isExpandable() ? 'block' : 'none'}}" type="button" onclick="this.toggle()"></button>
		</div>`;
	}
	
	expand() {
		this.expanded = true;

		this.update();
		
		return this;
	}
	
	collapse() {
		this.expanded = false;

		this.update();
		
		return this;
	}
	
	toggle() {
		return this.expanded ? this.collapse() : this.expand();
	}
	
	isExpanded() {
		return this.expanded;	
	}
	
	isExpandable() {
		return !!this.querySelector('.content .more');
	}
	
	isGradientEnabled() {
		return this.gradientEnabled;	
	}
}
