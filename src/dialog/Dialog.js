
import {Component} from '../import.js';

export class Dialog extends Component {
	
	setDefaults() {
		super.setDefaults();
		
		this.set({
			title: null,
			content: null,
			classes: null,
			fixed: true,
			closeOnOutsideClick: true
		});
	}
	
	getTemplate() {
		return `<div class="overlay ${this.fixed ? 'fixed' : ''}" 
			${this.closeOnOutsideClick ? 'onclick="this.eventHandlers.close(event)"' : ''}>
			<div class="dialog ${this.classes ? this.classes : ''}">
				<div class="header">
					<button type="button" class="image-button close" onclick="this.eventHandlers.close(event)"></button>	
					{{if (this.title)
						\`<h2 class="title">{{@this.title}}</h2>\`
					}}
				</div>
				<div class="content">{{this.content}}</div>
				<div class="footer"></div>
			</div>
		</div>`;	
	}
	
	eventHandlers = {
		close: (event) => {
			if (event.target && (event.target.classList.contains('close') || event.target.classList.contains('overlay'))) {
				this.close();	
			}
			
			event.stopPropagation();
		}
	};

	close() {
		this.detach();

		return this;
	}
}
