import Backbone from 'backbone';
import AppRouter from 'app-sp/router';

$(() => {

	'use strict';

	new AppRouter();
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
	Backbone.history.start({pushState: true});
});