
import {Component} from '../import.js';

export class Table extends Component {
	
	intersectionObserver;

	setDefaults() {
		super.setDefaults();
		
		this.set({
			values: [],
			sortingDetails: {},
			intersectionObserverEnabled: false,
			intersectionObserver: {
				root: null,
				rootMargin: '0px',
				threshold: 1.0
			}
		});
	}

	onCreate() {
		this.setupRows();
		super.onCreate();
	}

	onUpdate() {
		this.setupRows();
		super.onUpdate();
	}

	setValues(values) {
		this.values = values;
		
		return this;
	}

	hasValues() {
		return this.values.length > 0;
	}

	
	// Sort
	
	isSortedBy(key) {
		return this.sortingDetails.sortBy == key;
	}
	
	getSortOrder() {
		return this.sortingDetails.sortOrder;
	}
	
	sortBy(key) {
		var sortOrder = this.isSortedBy(key) ? 
			(this.sortingDetails.sortOrder == 'asc' ? 'desc' : 'asc') : 'desc';

		this.sortingDetails = {
			'sortBy': key,
			'sortOrder': sortOrder};
		
		this.sortValues(key, sortOrder);	
		this.update();
	}
	
	sortValues(sortBy, sortOrder) {}
	
	
	// IntersectionObserver
	
	setIntersectionObserverEnabled(value) {
		this.intersectionObserverEnabled = !!value;
		
		return this;
	}
	
	isIntersectionObserverEnabled() {
		return this.intersectionObserverEnabled;
	}
	
	setupRows() {
		if (this.isIntersectionObserverEnabled()) {
			this.intersectionObserver = null;
				
			this.querySelectorAll('tr').forEach(element => {
				if (element.parentNode.tagName.toLowerCase() != 'thead')
					this.getIntersectionObserver().observe(element)
			});	
		}
	}
	
	getIntersectionObserver() {
		if (!this.intersectionObserver)
			this.initIntersectionObserver();
		
		return this.intersectionObserver;
	}
	
	initIntersectionObserver() {		
		this.intersectionObserver = new IntersectionObserver(
			this.getIntersectionObserverCallback(), this.intersectionObserver);
	}
	
	getIntersectionObserverCallback() {}
}
