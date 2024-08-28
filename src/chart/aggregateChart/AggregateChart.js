
import {Component, Util} from '../../import.js';

export class AggregateChart extends Component {
	
	timeoutId;
	
	constructor(values) {		
		values = Object.assign({}, values);
		
		var onChange = values.selector ? values.selector.onChange : null;
		values.selector = Object.assign({}, values.selector);
		values.selector.onChange = selector => {
			if (onChange)
				onChange(selector);
				
			this.onChange();
		}
	
		super(values);
	}

	setDefaults() {
		super.setDefaults();
		
		this.set({
			currentValue: null,
			peakValue: null,	
			buildInfo: () => {},
			formatNumber: (number) => {
				return Util.formatNumber(number);
			},
			selector: {},
			getFetcher: (selector) => {},
			getSeriesOptions: () => {},
			markPeakValue: false,
			chart: {},
			classes: null
		});
	}
	
	getTemplate() {
		return `<div class="aggregate-chart ${this.classes ? this.classes : ''}">
			<div class="header">
				${this.buildInfo()}
			</div>
			<div class="content">
				<Chart id="chart" src="chart" />
				<Selector id="selector" src="selector" />
			</div>
		</div>`;
	}
	
	onCreate() {
		this.onChange();
		super.onCreate();
	}
	
	onChange() {
		this.components.get('chart')
			.setOverlayEnabled(true)
			.setLoaderEnabled(true)
			.removeError()
			.update();
		
		if (!this.isFetching())
			this.setFetching(true).update();
			
		clearTimeout(this.timeoutId);
					
		this.timeoutId = setTimeout(() => {
			var timeoutId = this.timeoutId;
		
			this.getFetcher(this.components.get('selector')).then(response => {
				if (timeoutId == this.timeoutId) {
					[this.currentValue, this.peakValue] = this.prepareValues(response);
					
					this.components.get('chart').removeSeries();
					if (response.length) {
						this.components.get('chart').addSeries(
							Object.assign({}, this.getSeriesOptions(), {
								data: response
							})
						);
					}
					
					this.components.get('chart')
						.setOverlayEnabled(false)
						.setLoaderEnabled(false)
						.update();
						
					this.setFetching(false).update();
				}
			})
			.catch(error => {	   
				if (timeoutId == this.timeoutId) {
					this.components.get('chart')
						.setLoaderEnabled(false)
						.setError('Fetching data error.')
						.update();
					
					this.setFetching(false).update();
				}
			})
			.fetch();
		}, 1000);
	}
	
	prepareValues(values) {
		var e;
		var currentValue = values.length ? values[values.length - 1] : undefined;
		var peakValue;
		for (var i = 0; i < values.length; i++) {
			if (!peakValue || peakValue[1] < values[i][1]) {
				peakValue = values[i];
				e = i;
			}
		}

		if (this.markPeakValue && peakValue) {
			values[e] = {
				y: peakValue[1], 
				x: peakValue[0], 
				marker: {fillColor: '#d50000', radius: 4, enabled: true}
			};
		}
		
		return [currentValue, peakValue, values]
	}
	
	hasValues() {
		return this.currentValue && this.peakValue;	
	}

	getDeclinePercentage() {
		return (this.peakValue[1] - this.currentValue[1]) * 100 / this.peakValue[1];
	}
	
	getDecline() {
		return this.peakValue[1] - this.currentValue[1];
	}
	
	getDeclinePerYearPercentage() {
		var years = new Date(this.currentValue[0]).getFullYear() - new Date(this.peakValue[0]).getFullYear();

		return years ? this.getDeclinePercentage() / years : this.getDeclinePercentage();
	}
}
