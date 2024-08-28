
import {Component} from '../import.js';

export class Chart extends Component {
	
	_chart;
	
	get chart() {
		if (!this._chart) 
			this._chart = Highcharts.chart(this.querySelector('.content'), this.options);
		
		return this._chart;
	}
	
	setDefaults() {
		this.set({
			options: {},
			overlayEnabled: false,
			loaderEnabled: false,
			error: null
		});
	}
	
	getTemplate() {
		return `<div class="chart {{this.isOverlayEnabled() ? '_overlay' : ''}} 
			{{this.isLoaderEnabled() ? '_loader' : ''}}">
			
			<div class="content" style="display: {{this._chart && this.hasVisibleSeries() ? 'block' : 'none'}}"></div>
			
			{{if (this.error) 
			 	\`<div class="error">{{@this.error}}</div>\`;
			
			else if (!this.isLoaderEnabled() && (!this._chart || !this.hasVisibleSeries()))
				\`<div class="message">No data.</div>\`;}}
		</div>`;
	}

	isInitialized() {
		return !!this._chart;
	}
	
	removeSeries(id) {
		if (id !== undefined) {
			var series = this.chart.get(id);
			if (series) 
				series.remove();
		}
		else {
			while(this.chart.series.length > 0)
				this.chart.series[0].remove();
		}

		return this;
	}
		
	addSeries(series) {
		this.chart.addSeries(series);
		
		return this;
	}

	showSeries(id) {
		var series = this.chart.get(id);
		if (series) 
			series.show();
		
		return this;
	}

	hideSeries(id) {
		var series = this.chart.get(id);
		if (series) 
			series.hide();
		
		return this;
	}
	
	hasSeries(id) {
		return this._chart ? (id ? !!this.chart.get(id) : !!this.chart.series.length) : false;
	}
	
	hasVisibleSeries() {	
		for (var series of this.chart.series) {
    		if (series.visible) 
				return true;
		}
		
		return false;
	}
	
	setOverlayEnabled(value) {
		this.overlayEnabled = value;
		
		return this;
	}
	
	isOverlayEnabled() {
		return this.overlayEnabled;
	}

	setLoaderEnabled(value) {
		this.loaderEnabled = value;
		
		return this;
	}

	isLoaderEnabled() {
		return this.loaderEnabled;
	}
	
	setError(error) {
		this.error = error;
		
		return this;
	}
	
	removeError() {
		return this.setError(null);
	}
	
	hasError() {
		return !!this.error;
	}
}
