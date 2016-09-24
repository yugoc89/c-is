// Model
// -------------

import Backbone from 'backbone';

class BasicModel extends Backbone.Model {
	urlRoot: '/'
	idAttribute: 'cid'
}

class SingleModel extends Backbone.Model {
	urlRoot: '/'
	initialize() {
	}
	destroy(id) {
		localStorage.removeItem(id);
	}
}

export { BasicModel, SingleModel };