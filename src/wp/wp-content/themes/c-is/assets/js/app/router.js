// Router
// -------------

import Backbone from 'backbone';
import _ from 'underscore';
import classie from 'classie';
import MainView from 'app/views';

let currentView = null,
	mainLoader = document.getElementById('loader');

export default class AppRouter extends Backbone.Router {
	constructor(options) {
		super();

		this.url = '/';
		this.routes = {
			'': 'homeAction',
			'works/:cate': 'singleAction',
			'works/:cate/': 'singleAction',
			'works': 'archiveAction',
			'works/': 'archiveAction',
			'services/': 'servicesAction',
			'*default': 'pageAction',
		};
		this.start = null;
		this._bindRoutes();
		if (Backbone.history.fragment === undefined) {
			// classie.remove(mainLoader, 'show');
			this.start = true;
		}

		this.listenTo(this, this.routes, this.storeRoute);
		this.listenTo(this, 'all', this.ga);
	}
	history(el) {
		let array = new Array();
		return array;
	}
	storeRoute() {
		return this.history().push(Backbone.history.fragment);
	}
	previous() {
		if (this.history().length > 3) {
			this.navigate('/' + this.history(this.history().length - 3), true);
		} else {
			this.navigate('/', true);
		}
	}
	ga() {
		let path = Backbone.history.getFragment();
		ga('send', 'pageview', {page: "/" + path});
	}
	homeAction(slug) {
		let restfulPageUrl = '/';
		this.switchView({
			'url': restfulPageUrl
		});
		console.log('homeAction');
	}
	archiveAction(slug) {
		let restfulPageUrl = '/works';
		console.log(restfulPageUrl);
		this.switchView({
			'url': restfulPageUrl,
			'slug': 'works',
			//'page': true
		});
		console.log('archiveAction');
	}
	singleAction(id) {
		var restfulPageUrl = '/works/' + id + '/';
		console.log(restfulPageUrl);
		var slug = id.split('/')[0];
		this.switchView({
			'url': restfulPageUrl,
			'slug': slug,
			'single': true
		});
		console.log('singleAction');
	}
	servicesAction(id) {
		let restfulPageUrl = id;
		this.switchView({
			'url': restfulPageUrl,
			'slug': 'services'
		});
	}
	pageAction(slug) {
		let restfulPageUrl = '/' + slug;
		this.switchView({
			'url': restfulPageUrl,
			'slug': slug,
			'page': true
		});
		console.log('pageAction');
	}

	switchView(args) {
		// mainLoader.removeAttribute('style');
		// classie.add( mainLoader, 'show' );
		//if Views exisits, reset them
		if (currentView) currentView.remove();
		//if it's an initial load
		(this.start) ? this.switchAct('.main', null, args) : this.ajaxContent(args);

	}
	switchAct(e, ajax, args) {
		if (ajax) {
			//if Ajax content has been fired
			$('.container').append(e);
			initialise();
			currentView = new MainView({el:e, id: args.slug, category: args.category, page: args.page, start: true});
		} else {
			currentView = new MainView({el:e, id: args.slug, category: args.category, page: args.page, single: args.single });
		}
		//go back to the page top
		function initialise(){
			$('html,body').animate({ scrollTop: 0 }, 'slow');
		}
	}
	ajaxContent(args) {
		$.ajax({
			url: args.url,
			cache: false,
		})
		.done((html) => {
			let element = $('.main', $(html));
			this.switchAct(element, true, args);
		})
		.fail((jqXHR, textStatus, errorThrown) => {
			alert(errorThrown);
			// classie.remove( mainLoader, 'show' );
		});
	}
}
