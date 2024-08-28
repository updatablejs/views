
import {Component} from '../../import.js';

export class MultiSeriesChart extends Component {
	
	assignedColors = {};
	requests = [];

	constructor(values) {		
		values = Object.assign({}, values);
		
		values.structure = Object.assign({
			multiSelect: true,
			closeOnSelect: false,
			closeOnDeselect: false,
			closeSiblingsOnOpen: false,
			closeOnOutsideClick: false,	
		}, values.structure);
		
		var buildItem = values.structure.buildItem;
		values.structure.buildItem = (key, item, level) => {
			return buildItem(key, item, level, this);	
		};
		
		values.structure.onSelect = (key, item) => {
			this._addSeries(key, item);
		};
			
		values.structure.onDeselect = (key, item) => {
			if (!this.hasVisibleRequests())
				this.components.get('chart').setOverlayEnabled(false).setLoaderEnabled(false);
				
			this.components.get('chart').hideSeries(key).removeError().update();
		};

		super(values);
	}

	setDefaults() {
		super.setDefaults();
		
		this.set({
			structure: {},
			getSeriesOptions: function(key, item) {},
			getFetcher: function(key, item) {},
			colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
			chart: {}
		});
	}
	
	getTemplate() {
		return `<div class="multi-series-chart">
			<Chart id="chart" src="chart" />
			<Structure id="structure" src="structure" />
		</div>`;
	}
	
	assignColor(key) {
		if (this.colors.current === undefined)
			this.colors.current = 0;
		else
			this.colors.current++;
			
		if (this.colors.current >= this.colors.length) 
			this.colors.current = 0;
			
		this.assignedColors[key] = this.colors[this.colors.current];

		return this.assignedColors[key];
	}
	
	addSeries(key) {
		this._addSeries(key, this.getComponent('structure').getItem(key));
		
		return this;
	}
	
	hasVisibleRequests() {
		return !!this.requests.filter(value => this.components.get('structure').isActive(value)).length;
	}
	
	_addSeries(key, item) {
		var chart = this.components.get('chart');
		
		if (chart.hasSeries(key)) {
			if (!this.hasVisibleRequests()) 
				chart.setOverlayEnabled(false);
			
			chart.showSeries(key).removeError().update();
			
			return;	
		}
		
		chart.setOverlayEnabled(true).setLoaderEnabled(true).removeError().update();
		
		if (!this.requests.includes(key)) {
			this.requests.push(key);
			
			this.getFetcher(key, item).then(response => {
				if (response.length) {
					chart.addSeries(
						Object.assign({}, this.getSeriesOptions(key, item), {
							id: key,
							color: this.assignedColors[key],
							visible: this.components.get('structure').isActive(key) ? true : false,
							data: response
						})
					);	
				}
			})
			.catch(error => {	   
				if (this.components.get('structure').isActive(key)) {
					chart.setError('Fetching data error.');
					this.components.get('structure').deselectSilent(key);
				}
			})
			.finally(() => {
				this.requests = this.requests.filter(value => value !== key);

				if (!this.hasVisibleRequests()) {
					chart.setLoaderEnabled(false);
					
					if (!chart.hasError())
						chart.setOverlayEnabled(false);
				}
				
				chart.update();
			})
			.fetch();	
		}
	}
}
