import Backbone from 'backbone';
import AppRouter from 'app/router';

$(() => {

	'use strict';

	new AppRouter();
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
	Backbone.history.start({pushState: true});
});