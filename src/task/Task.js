
import {Component, Events} from '../import.js';

export class Task extends Component {

	static states = ['execute', 'success', 'fail'];
	state;
	result;
	error;
	// https://stackoverflow.com/questions/55479511/access-javascript-class-property-in-parent-class
	//events;
	
	setDefaults() {
		super.setDefaults();
		
		this.set({	
			task: async (component) => {},
			
			executeOnCreate: true,
			
			displayError: false,
			
			messages: {
				success: 'Task completed.',
				fail: 'An error occurred.'
			},
			
			/*onSuccess: (result, component) => {},
			onFail: (error, component) => {},
			onComplete: (component) => {},*/
			
			buildContent: (component) => {
				return `<p style="display: {{!this.isExecuting() ? 'block' : 'none'}}">
					{{switch(this.state) {
						case 'success':
							this.messages.success;
							break;
						 
						case 'fail':
							\`{{this.messages.fail}} {{this.displayError ? \`({{this.error}})\` : ''}}\`;
							break;
					}}}
					</p>
			
					<button class="button" type="button" onclick="this.execute()" 
						style="display: {{!this.isExecuting() && !this.isSuccessful() ? 'inline-block' : 'none'}}">
						{{switch(this.state) {
							case 'fail':
								'Retry';
								break;
							
							default:
								'Execute'
						}}}
					</button>`;
			}
		});
		
		this.events = new Events(); 
		var _this = this;
		function defineSetter(property) {
			Object.defineProperty(_this, property, {
				set(handler) {
					_this.events.setHandlers({
						[property.toLowerCase().replace(/^on/, '')]: handler
					});
				}
			});
		}
		
		defineSetter('onSuccess');
		defineSetter('onFail');
		defineSetter('onComplete');
	}
	
	getTemplate() {
		return `<div class="task {{this.isExecuting() ? '_loader' : ''}}">
			${this.buildContent(this)}
		</div>`;
	}
	
	onCreate() {
		if (this.executeOnCreate)
			this.execute();
			
		super.onCreate();
	}
	
	setState(state) {
		this.state = state;
		
		return this;	
	}
	
	setResult(result) {
		this.result = result;
		
		return this;	
	}
	
	setError(error) {
		this.error = error;
		
		return this;	
	}

	execute(onSuccess, onFail, onComplete) {
		this.events.setSingleUseHandler('success', onSuccess);
		this.events.setSingleUseHandler('fail', onFail);
		this.events.setSingleUseHandler('complete', onComplete);
		
		if (!this.isExecuting()) {
			this.setState('execute').update();
			
			this.task(this).catch(error => {  
				this.setState('fail').setError(error).update();
				this.events.trigger('fail', error, this);
			})
			.then(result => {						 
				if (result) {
					this.setState('success').setResult(result).update();
					this.events.trigger('success', result, this);
				}
			})
			.finally(() => {	
				this.events.trigger('complete', this);
			});	
		}
		
		return this;
	}
	
	// async/await version.
	/*async execute(onSuccess, onFail, onComplete) {
		this.events.setSingleUseHandler('success', onSuccess);
		this.events.setSingleUseHandler('fail', onFail);
		this.events.setSingleUseHandler('complete', onComplete);
		
		if (!this.isExecuting()) {
			this.setState('execute').update();
			
			try {
				var result = await this.task(this);
			} 
			catch(error) {
				this.setState('fail').setError(error).update();
				this.events.trigger('fail', error, this);
				
				return;
			}

			this.setState('success').setResult(result).update();
			this.events.trigger('success', result, this);

			this.events.trigger('complete', this);
		}
	}*/
	
	isExecuting() {
		return this.state == 'execute';
	}

	isSuccessful() {
		return this.state == 'success';
	}
	
	isFailed() {
		return this.state == 'fail';
	}
	
	isComplete() {
		return this.state == 'success' || this.state == 'fail';
	}
}
