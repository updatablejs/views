
import {Openable} from '../openable/Openable.js';

export class Search extends Openable {
	
	setDefaults() {
		super.setDefaults();
		
		this.set({
			values: [],
			displayedValues: [],
			constraint: '',	
			error: null,
			filter: (value, constraint) => {},
			buildItem: (index, value) => {},
			onSelect: (index, value) => {},
			getFetcher: () => {}
		});
	}
	
	getTemplate() {
		return `<div class="search outside-click-aware {{this.isOpen() ? 'opened' : ''}}">
			<div class="form-grup">
				<input type="submit" class="image-button icon-search" onclick="this.open()" value="">
				<input type="text" placeholder="Search" oninput="this.eventHandlers.filter(event)">
				<button type="button" class="image-button close" onclick="this.close()"></button>	
			</div>
			<div class="content">
				{{if (this.isFetching()) 
			 		\`<div class="loader"></div>\`;}}
				
				<ul onclick="this.eventHandlers.select(event)" 
					style="display: {{this.displayedValues.length ? 'block' : 'none'}}">{{this.populate()}}</ul>
				
				{{if (this.error) 
			 		\`<div class="error">{{@this.error}}</div>\`;}}
			</div>
		</div>`;
	}
	
	populate() {
		return this.displayedValues.map((value, index) => {
			return this.buildItem(index, value);
		}).join('');
	}
	
	eventHandlers = {
		filter: (event) => {
			this.constraint = event.target.value.toLowerCase().trim();
			if (this.hasValues()) {
				this.doFilter().update();
			}
			else if (!this.isFetching()) {
				this.fetchValues();
			}
		},

		select: (event) => {
			event.preventDefault();
			var li = event.target.closest('li');
			if (li) {
				var index = li.dataset.index;
				this.onSelect(index, this.displayedValues[index]);
				this.close();
			}
		}
	};

	close() {
		this.constraint = '';
		this.displayedValues = [];
		this.removeError();
		super.close();
	}
	
	doFilter() {
		this.displayedValues = this.constraint.length ? 
			this.values.filter(value => this.filter(value, this.constraint)).slice(0, 100) : [];
		
		return this;
	}
	
	hasValues() {
		return this.values.length > 0;
	}
	
	setError(error) {
		this.error = error;
		
		return this;
	}
	
	removeError() {
		return this.setError(null);
	}
	
	fetchValues() {
		this.setFetching(true).removeError().update();
		
		this.getFetcher().then(values => { 
			this.values = values;
				
			if (this.isOpen())
				this.doFilter();
		})
		.catch(error => {	   
			if (this.isOpen()) 
				this.setError('Fetching data error.');  
		})
		.finally(() => {
			this.setFetching(false);
			if (this.isOpen()) 
				this.update();
		})
		.fetch();
	}
}
