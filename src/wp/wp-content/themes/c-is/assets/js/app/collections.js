// Collection
// -------------
import Backbone from 'backbone';
import { BasicModel, SingleModel } from 'app/models';

//--------------
// Collection[home]
//--------------
class BasicCollection extends Backbone.Collection {
	constructor(options) {
		super(options);
		this.model = BasicModel;
		this.options = options;
		this.url_querystring = '&slug=' + this.options.id;
	}
	url() {
		return (this.options.id  === 'works' || this.options.id  === 'works/') ? '/wp-json/wp/v2/posts' : '/api/get_profile';
	}
}

//--------------
// Collection[each person]
//--------------
class SingleCollection extends Backbone.Collection {
	constructor(options) {
		super(options);
		this.options = options;
		// this.slug = this.options.slug;
		this.model = SingleModel;
		console.log(this.options);
	}
	url() {
		return '/wp-json/wp/v2/posts?filter[name]=' + this.options.slug;
	}
}

export { BasicCollection, SingleCollection };