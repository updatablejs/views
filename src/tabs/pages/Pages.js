
import {Component, Updatable, _} from '../../import.js';

export class Pages extends Component {
	
	//generated;
	
	setDefaults() {
		super.setDefaults();
		
		this.setSettersEnabled(true);
		
		this.set({
			active: null,
			pages: {},
			onChange: function(key) {}
		});		
	}
	
	getTemplate() {
		var pages = '';
		for (var key of Object.keys(this.pages)) {	
			pages += `<div class="page" style="display: {{this.isActive('${_(_(key))}') ? 'block' : 'none'}}">
					{{this.getContent('${_(_(key))}')}}
				</div>`;		
		}

		return `<div class="pages">${pages}</div>`;
	}

	getContent(key) {
		if (this.getGenerated().has(key)) 
			return Updatable.noChange;
			
		if (!this.isActive(key)) return '';

		var content = typeof this.pages[key].content == 'function' ?  
			this.pages[key].content() : this.pages[key].content;
		
		if ('title' in this.pages[key]) {	
			var title = typeof this.pages[key].title == 'function' ? 
				this.pages[key].title() : this.pages[key].title;
			
			content = [title, content]
		}
		
		this.getGenerated().add(key);

		return content;
	}
	
	isActive(key) {
		return this.active == key;
	}
	
	change(key) {
		if (!this.isActive(key)) {
			var previous = this.active;
			this.active = key;
			this.update();	
			this.onChange(key, this);
	
			if (previous && 'onInactive' in this.pages[previous])
				this.pages[previous].onInactive(this);
			
			if ('onActive' in this.pages[key])
				this.pages[key].onActive(this);
		}
	}
	
	getGenerated() {
		if (!this.generated)
			this.generated = new Set();
		
		return this.generated;
	}
	
	setPages(pages) {
		if (!this.pages) this.pages = {};
		
		for (var key of Object.keys(pages)) {
			this.setPage(key, pages[key]);
		}
		
		return this;
	}
	
	setPage(key, page) {
		if (page instanceof Object && 'content' in page) {
			this.pages[key] = page;
		}
		else {
			this.pages[key] = {
				content: page
			};
		}
					
		this.getGenerated().delete(key);
		
		return this;
	}	
	
	getPage(key) {
		return this.pages[key];
	}	
}
