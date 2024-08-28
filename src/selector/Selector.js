
import {Component} from '../import.js';
	
export class Selector extends Component {

	setDefaults() {		
		this.set({
			values: [],
			excluded: [],
			includedListTitle: 'Included',
			excludedListTitle: 'Excluded',
			buildItem: (index, values) => {},
			onChange: (selector) => {},
		});
	}
	
	getTemplate() {
		return `<div class="selector {{!this.hasValues() ? '_overlay _loader' : ''}}">
			<div class="included">
				<h3>@{this.includedListTitle}</h3>
				<button class="button" type="button" onclick="this.excludeAll()"
					style="display: {{this.values.length - this.excluded.length > 1 ? 'block' : 'none'}}">
						Exclude All ({{this.values.length - this.excluded.length}})</button> 
						
				<ul onclick="this.eventHandlers.exclude(event)">{{this.buildIncludedList()}}</ul>
				<div class="message" 
					style="display: {{this.values.length - this.excluded.length == 0 ? 'block' : 'none'}}">Empty</div>
			</div>
  
			<div class="excluded">
				<h3>@{this.excludedListTitle}</h3>
				<button class="button" type="button" onclick="this.includeAll()"
					style="display: {{this.excluded.length > 1 ? 'block' : 'none'}}">
						Include All ({{this.excluded.length}})</button> 
				
				<ul onclick="this.eventHandlers.include(event)">{{this.buildExcludedList()}}</ul>
				<div class="message" 
					style="display: {{this.excluded.length == 0 ? 'block' : 'none'}}">Empty</div>
			</div>
		</div>`;
	}
	
	buildIncludedList() {
		return this.values.map((value, index) => {
			return !this.excluded.includes(value) ?
				this.buildItem(index, value) : '';
		}).join('');
	}
	
	buildExcludedList() {
		return this.excluded.map((value, index) => {
			return this.buildItem(index, value);
		}).join('');
	}
	
	eventHandlers = {
		include: (event) => {
			var li = event.target.closest('li');
			if (li)
				this.include(li.dataset.index);						
		},

		exclude: (event) => {
			var li = event.target.closest('li');
			if (li)
				this.exclude(li.dataset.index);					
		}
	};
	
	excludeAll() {
		for (var value of this.values) {
			if (!this.excluded.includes(value))
				this.excluded.push(value);
		}
		
		this.update();
		
		this.onChange(this);
	}
	
	includeAll() {
		this.excluded = [];
		this.update();
		this.onChange(this);
	}
	
	include(index) {
		this.excluded.splice(index, 1);
		this.update();
		this.onChange(this);
	}
	
	exclude(index) {
		this.excluded.push(this.values[index]);
		this.update();	
		this.onChange(this);
	}
	
	hasValues() {
		return this.values.length > 0;
	}
	
	setValues(values) {
		this.values = values;
		this.excluded = [];
		this.update();
		this.onChange(this);
		
		return this;
	}
	
	getExcluded() {
		return this.excluded;
	}
	
	getExcludedCount() {
		return this.excluded.length;
	}
	
	getIncludedCount() {
		return this.values.length - this.excluded.length;
	}
}
