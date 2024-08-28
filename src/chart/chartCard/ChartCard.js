
import {Component, _} from '../../import.js';

export class ChartCard extends Component {
	
	setDefaults() {
		super.setDefaults();
		
		this.set({
			title: null,
			subtitle: null,
			href: null, // It will not be sanitized.
			currentValue: null,
			displayCurrentValue: (currentValue) => {},
			getFetcher: () => {},
			getSeriesOptions: () => {},			
			chart: {}
		});
	}
	
	onCreate() {
		this.components.get('chart')
			.setOverlayEnabled(true).setLoaderEnabled(true).update();
			
		this.getFetcher().then(response => {
			this.update({currentValue: response[1]});

			this.components.get('chart').addSeries(
				Object.assign({}, this.getSeriesOptions(), {
					data: response[0]
				})
			); 
				
			this.components.get('chart')
				.setOverlayEnabled(false)
				.setLoaderEnabled(false)
				.update();
		})
		.catch(error => {	   
			this.components.get('chart')
				.setOverlayEnabled(false)
				.setLoaderEnabled(false)
				.setError('Fetching data error.')
				.update();
		})
		.fetch();
		
		super.onCreate();
	}
	
	getTemplate() {
		return `<div class="card chart-card">
			{{if (this.currentValue) this.displayCurrentValue(this.currentValue)}}
			
			<Chart id="chart" src="chart" />
			<div class="details">
				<a href="${this.href}">
					<h3 class="title">${_(this.title)}</h3>
					${this.subtitle ? `<div class="subtitle">${_(this.subtitle)}</div>` : ''}
				</a>
			</div>
		</div>`;	
	}
}
