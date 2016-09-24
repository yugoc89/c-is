// Router
// -------------

import Backbone from 'backbone';
import _ from 'underscore';
import classie from 'classie';
import MainView from 'app-sp/views';

let currentView = null,
	mainLoader = document.getElementById('loader');

export default class AppRouter extends Backbone.Router {
	constructor(options) {
		super();

		this.url = '/';
		this.routes = {
			'': 'homeAction',
			'*default': 'pageAction',
			'services/': 'servicesAction',
		};
		this.start = null;
		// this.history = [];
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
	archiveAction(id) {
		let restfulPageUrl = id,
			slug = id.split('/')[0];
		this.switchView({
			'url': restfulPageUrl,
			'slug': slug
		});
		console.log('archiveAction');
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
			currentView = new MainView({el:e, id: args.slug, category: args.category, page: args.page });
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
