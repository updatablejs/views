
import {Structure} from '../structure/Structure.js';

export class Tabs extends Structure {

	setDefaults() {
		super.setDefaults();
		
		this.set({
			classes: 'tabs',
			floatation: true
		});
	}
}
