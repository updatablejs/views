
import {OutsideClickAware} from '../outsideClickAware/OutsideClickAware.js';
import {Util, _} from '../import.js';

export class Structure extends OutsideClickAware { 
	
	constructor(values) {	
		super(values);
		
		var set = (keys, property) => {
			this[property] = {};
			
			for (var key of Array.isArray(keys) ? keys : [keys]) {
				this[property][key] = this.getItem(key);
			}
		};
		
		if (values.active)
			set(values.active, 'active');
		
		if (values.open)
			set(values.open, 'open');
	}

	setDefaults() {
		super.setDefaults();
		
		this.set({
			open: {},
			active: {},
			items: { 
				/*key: { // The key will not be sanitized.
					value: '',
					href: '', // It will not be sanitized.
					image: '', // It will not be sanitized.
					items: {}
				}*/
			},
			eventExtra: null,
			
			isOpenable: item => {
				return Util.isObject(item) && 'items' in item;
			},
			
			getItems: item => { 
				return Util.isObject(item) && 'items' in item ? item.items : null;
			},
			
			buildItem: (key, item, level) => {
				return `<a ${Util.isObject(item) && 'href' in item ? `href="${Util.getValue(item.href)}"` : ''}  class="{class}">
					${Util.isObject(item) && 'image' in item ? `<img src="${item.image}" />` : ''} 
					${_(Util.isObject(item) && 'value' in item ? item.value : item)}	
				</a>`;
			},
			
			/*hasCustomContent(item) {},
			getCustomContent(item) {},*/
			
			classes: null,
			
			closeSiblingsOnOpen: true,
			
			//closeSiblingsDescendantsOnOpen: true,
			
			closeOnSelect: true,
			
			closeOnDeselect: true,
			
			openIfHasActiveChildren: false,
			
			multiSelect: false,
			
			floatation: false,
			
			onSelect: (key, item, component) => {},
			
			onDeselect: (key, item, component) => {},
			
			onToggleSelect: (key, item, component) => {},
			
			closeOnOutsideClick: true
		});
	}
	
	getTemplate() {
		return `<div class="structure ${this.isOutsideClickAwareEnabled() ? 'outside-click-aware' : ''} 
			${this.floatation ? 'floatation' : ''} ${this.classes ? _(_(this.classes)) : ''}">
				<ul onclick="this.eventHandlers.select(event)">${this.buildItems(this.items)}</ul>
				{{if (this.isFetching()) '<div class="loader"></div>'}}
			</div>`;
	}
	
	buildItems(items, parentKey, level) {
		parentKey = parentKey || '';
		level = level || 0;
		
		var result = '';
		for (var [key, item] of Object.entries(items)) {
			if (parentKey)
				key = `${parentKey}.${key}`;
			
			if (this.isOpenIfHasActiveChildrenEnabled() && this.hasActiveChildren(key)) {
				this.open[key] = item;
			}	
			
			var _class = `{{this.isActive('${key}') || this.hasActiveChildren('${key}') ? 'active' : ''}} button 
				${this.isOpenable(item) ? `image-right {{this.isOpen('${key}') ? 'icon-expand-less' : 'icon-expand-more'}}` : ''}`;
			
			var _item = this.buildItem(key, item, level)
				.replace(/\{class\}/, _class);

			result += `<li class="item" data-key="${key}">
					${_item}
					${this.isOpenable(item) ? 
						`<ul class="content ${level > 0 && this.floatation ? 'top right-outside' : ''}" 
							style="display: {{this.isOpen('${key}') ? 'block' : 'none'}}">
								${this.buildItems(this.getItems(item), key, level + 1)}
						</ul>` : ''} 
				</li>`;	
		}
		
		return result;
	}
	
	eventHandlers = {
		select: (event) => {
			var li = event.target.closest('li');
			if (li) {
				if (this.eventExtra) {
					for (var [key, value] of Object.entries(this.eventExtra)) {
						event[key] = value;
					}
				}

				var item = this.getItem(li.dataset.key);
				if (this.isOpenable(item)) 
					this.toggleVisibility(li.dataset.key);
				else 
					this.toggleSelect(li.dataset.key);
			}
		}
	};

	getItem(key) {
		var result;
		var items = this.items;
		for (var key of key.split('.')) {
			if (!items || !(key in items)) return null;

			result = items[key];
			
			items = this.getItems(result);	
		}

		return result;
	}
	
	setActive(key) {
		if (!this.multiSelect)
			this.active = {};
				
		this.active[key] = this.getItem(key);
		
		return this;
	}
	
	clearActive() {
		this.active = {};
				
		return this;
	}
	
	// Same name with open property.
	_open(key) {
		if (this.isCloseSiblingsOnOpenEnabled()) {			
			this.open = Object.fromEntries(
    			Object.entries(this.open).filter(entry => 
					entry[0].replace(/[^\.]+$/, '') != key.replace(/[^\.]+$/, '')) 
			);
		}
		
		this.open[key] = this.getItem(key);
		
		if (this.isOutsideClickAwareEnabled() && key.indexOf('.') == -1)
			this.registerOutsideClickHandler();
		
		this.update();
		
		return this;
	}
	
	close(key) {
		if (key)
			delete this.open[key];
		else
			this.open = {};
		
		if (!key || key.indexOf('.') == -1)
			this.unregisterOutsideClickHandler();
		
		this.update();
		
		return this;
	}

	toggleVisibility(key) {
		return this.isOpen(key) ? this.close(key) : this._open(key);
	}

	select(key) {		
		this.setActive(key);

		if (this.isCloseOnSelectEnabled())
			this.close();
		else
			this.update();
			
		this.onSelect(key, this.getItem(key), this);
		this.onToggleSelect(key, this.getItem(key), this);

		return this;
	}
	
	deselect(key) {
		return this._deselect(key, false);
	}
	
	deselectSilent(key) {
		return this._deselect(key, true);
	}
	
	_deselect(key, silent) {
		delete this.active[key]
		
		if (this.isCloseOnDeselectEnabled())
			this.close();
		else
			this.update();
		
		if (!silent) {
			this.onDeselect(key, this.getItem(key), this);
			this.onToggleSelect(key, this.getItem(key), this);
		}
		
		return this;
	}
	
	toggleSelect(key) {
		return this.isActive(key) ? this.deselect(key) : this.select(key);
	}
	
	isOpen(key) {
		return key in this.open;
	}

	isActive(key) {
		return key in this.active;
	}
	
	hasActiveChildren(key) {
		for (var active of Object.keys(this.active)) {
			if (active.indexOf(key + '.') == 0)	return true;
		}

		return false;
	}

	onOutsideClick() {		
		if (Util.getValue(this.closeOnOutsideClick, this))
			this.close();		
	}
	
	isCloseOnSelectEnabled() {
		return typeof this.closeOnSelect == 'function' ? 
			this.closeOnSelect() : this.closeOnSelect;
	}
	
	isCloseOnDeselectEnabled() {
		return typeof this.closeOnDeselect == 'function' ? 
			this.closeOnDeselect() : this.closeOnDeselect;
	}
	
	isCloseSiblingsOnOpenEnabled() {
		return typeof this.closeSiblingsOnOpen == 'function' ? 
			this.closeSiblingsOnOpen() : this.closeSiblingsOnOpen;
	}
	
	isOpenIfHasActiveChildrenEnabled() {
		return typeof this.openIfHasActiveChildren == 'function' ? 
			this.openIfHasActiveChildren() : this.openIfHasActiveChildren;
	}
	
	/*// todo
	onUpdate() {
		if (!this.floatation) return;
		
		//console.log('bo!');	
		for (var element of this.querySelectorAll('.structure > li > ul.content')) {
			//console.log(element);
			
			var rect = element.getBoundingClientRect();
			//console.log(rect);
			
			
			if (rect.right > window.innerWidth)
				element.style.left = `-${rect.right - window.innerWidth + 20}px`; 
		}
		

		for (var element of this.querySelectorAll('.structure > li li ul.content')) {
			//console.log(element);
			
			var rect = element.getBoundingClientRect();
			
			if (rect.right > window.innerWidth)
				element.style.left = `-${rect.right - window.innerWidth + 20}px`; 
		}
		
		super.onUpdate();
	}*/
}
