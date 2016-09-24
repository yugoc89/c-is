require.config({

	paths: {
		'classie': '/wp-content/themes/c-is/assets/js/components/classie',
		'jquery': '/wp-content/themes/c-is/assets/js/vendor/jquery-1.10.2.min',
		'underscore': '/wp-content/themes/c-is/assets/js/vendor/underscore-min',
		'backbone': '/wp-content/themes/c-is/assets/js/vendor/backbone-min',
		'TweenLite': '/wp-content/themes/c-is/assets/js/components/TweenMax.min',
		'TimelineLite':'/wp-content/themes/c-is/assets/js/components/TimelineLite.min',
		'hammer':'/wp-content/themes/c-is/assets/js/components/hammer.min',
		'jqueryHammer':'/wp-content/themes/c-is/assets/js/components/jquery.hammer',
	},

	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		'TweenLite': {
			exports: 'TweenLite'
		}
	}
});

require([
	'classie',
	'backbone',
	'TweenLite',
	'TimelineLite',
	'hammer',
	'jqueryHammer',
], function(classie, Backbone, TweenLite, TimelineLite, Hammer) {

	'use strict';

	var container = '.container',
		main = '#main',
		footer = '.footer',
		animateContent = '.container';

	//--------------
	// Router
	//--------------
	$(document).on('click', '.list--main a, .single-navigator a, .ajax-trigger', function(event) {
		event.preventDefault();
		var router = new AppRouter();
		var href = $(event.currentTarget).attr('href');
		router.navigate(href, true);
		$('.list--main a, .navigation--sp a, .single-navigator a').removeClass('active');
		$(this).addClass('active');
		if (classie.has(contactForm, 'show')) {
			resetContactMenu();
		}
	});

	var currentView = null;

	var AppRouter = Backbone.Router.extend({

		url: '/',

		routes: {
			'': 'homeAction',
			'works/:id': 'worksAction',
			'works/:id/:single': 'singleAction',
			'*page': 'pageAction'
			// '*works': 'defaultWorksAction',
		},
		start: null,
		history: [],

		initialize: function(pass){
			if (Backbone.history.fragment === undefined) {
				$(mainLoader).removeClass('show');
				this.start = true;
			}

			this.on("all", this.storeRoute);
		},
		storeRoute: function() {
			return this.history.push(Backbone.history.fragment);
		},
		previous: function(){
			if (this.history.length > 3) {
				this.navigate('/' + this.history[this.history.length - 3], true);
			} else {
				this.navigate('/', true);
			}
		},
		homeAction: function( home ) {
			var restfulPageUrl = '/';
			this.switchView(restfulPageUrl, MainView);
		},
		pageAction: function(id) {
			var restfulPageUrl = '/' + id;
			this.switchView(restfulPageUrl, MainView, id);
		},
		defaultWorksAction: function( id ) {
			var restfulPageUrl = '/' + id;
			var path = id.split('/')[2];
			this.switchView(restfulPageUrl, MainView, path, id);
			console.log('defaultWorksAction');
		},
		worksAction: function( id ) {
			var restfulPageUrl = this.url + 'works/' + id;
			this.switchView(restfulPageUrl, MainView, id);
			console.log('worksAction');
		},
		singleAction: function( id, single ) {
			var mergedURL = 'works/' + id + '/' + single;
			var restfulPageUrl = this.url + mergedURL;
			this.switchView(restfulPageUrl, MainView, single, id );
			console.log('singleAction');
		},
		switchView: function(pageUrl, TargetView, categoryId, action) {
			var that = this;

			// if (!$(mainLoader).hasClass('show') && !action) {
			// 	$(mainLoader).addClass('show');
			// }

			if (this.start === true) {
				switchAct(main);
			} else {
				ajaxContent();
			}

			function ajaxContent() {
				$.ajax({
					url: pageUrl,
					cache: false,
				})
				.done (function(html){

					var element = $(main, $(html));

					if ($(container).hasClass('left')) {
						ajaxAnim({
							'value': '-100%'
						});
						console.log('swipe left');
					} else if ($(container).hasClass('right')) {
						ajaxAnim({
							'value': '100%'
						});
						console.log('swipe right');
					} else if (action){
						ajaxAnim({
							'value': '-100%',
							'alphaValue': 0
						});
						console.log('single content');
					} else {
						ajaxAnim({
							'value': 0,
							'alphaValue': 0,
						});
						console.log('main content');
					}

					function ajaxAnim(arg){
						TweenLite.to(animateContent, 0.4, {
							y: arg.value,
							alpha: arg.alphaValue,
							ease: Back.easeInOut.config(1.7),
							transformOrigin: 'center left',
							onComplete: function() {
								switchAct(element, true);
							}
						});
					}
				})
				.fail(function() {
					alert("error");
					classie.remove( mainLoader, 'show' );
				});
			}

			function switchAct(e, ajax) {
				if (currentView) {
					currentView.remove();
				}
				if (ajax) {
					$(container).append(e);
					initialise();

					currentView = new TargetView({el:e, id: categoryId, category: action, start: true});	
					
				} else {
					currentView = new TargetView({el:e, id: categoryId, category: action });	
				}

				function initialise(){
					$(container).removeClass('left').removeClass('right');
					$('html,body').animate({ scrollTop: 0 }, 'slow');
				}

			}
		}
	});

	//--------------
	// Models
	//--------------
	var Category = Backbone.Model.extend({
		urlRoot: '/works/',
		url: function() {
			return this.urlRoot + '?name=' + this.id;
		},
		idAttribute: 'cid',
		initialize: function(){
		}
	});

	//--------------
	// Collection
	//--------------
	var Categories = Backbone.Collection.extend({
		model: Category,
		url: function(){
			if (this.options.id) {
				if (this.options.category) {
					return '/api/?json=get_post' + this.url_querystring;
				} else if(this.options.id === 'about'){
					return '/api/?json=get_page' + this.url_querystring;
				} else {
					return '/api/?json=get_category_posts' + this.url_querystring;
				}
			} else {
				return '/api/get_recent_posts/';
			}
		},
		initialize: function(models, options){
			this.options = options;
			this.url_querystring = '&slug=' + this.options.id;
		}
	});

	//--------------
	// Views
	//--------------

	var MainView = Backbone.View.extend({

		el: $(main),
		initialize: function(options, categoryId) {
			var that = this;

			$(this.el).unbind();
			_.bindAll(this, 'render');

			this.category = options.category;
			this.start = options.start;
			this.template = _.template($('#template--index').html());

			this.collection = new Categories([], { id: this.id, category: this.category });

			this.collection.fetch({
				// data: $.param({ id: that.id}),
				success: function (collection, response) {
					that.render(response);
				},
				error: function (errorResponse) {
					console.log(errorResponse);
				},
				complete: function(xhr, textStatus) {
					console.log(textStatus);
				}
			});
		},		
		render: function(model) {

			if (this.category) {
				$('.single-inner').html(this.template({ datums: this.collection.toJSON() }));
				new SingleView({el: this.el, id: this.id, category: this.category, collection: this.collection});

			} else if(this.id === 'about'){
				$('.content').html(this.template({ datums: this.collection.toJSON() }));
				// if browser was Ajaxed
				if (this.start === true){
					new PageView({el: this.el, collection: this.collection});
				} else {
					new PageView({el: this.el, start: true, collection: this.collection});
				}

			} else {
				$('.content').html(this.template({ datums: this.collection.toJSON() }));
				// if browser was Ajaxed
				if (this.start === true){
					new CategoryView({el: this.el});
				} else {
					new CategoryView({el: this.el, start: true});
				}
			}

			// if browser was Ajaxed
			if (this.start === true) {
				this.tweenAnim(0.5, function(){
					classie.remove( mainLoader, 'show' );
				});
			} else {
				classie.remove( mainLoader, 'show' );
			}

			//return this;
		},
		tweenAnim: function(value, callback) {
			TweenLite.set(animateContent, {
				y: '0%',
				opacity: 1,
				delay: value,
				onComplete: function(){
					if (callback) {
						callback();
					}
				}
			});
		}
	});

	var CategoryView = Backbone.View.extend({

		el: $(main),
		events: {
			'click .article-link': 'singleAjax',
			'mouseover .article-inner': 'articleDisplay'
		},
		initialize: function(options, categoryId) {
			console.log('home!!');

			this.start = options.start;
			$(this.el).unbind();

			_.bindAll(this, 'render', 'singleAjax', 'articleDisplay' );

			if (this.start !== true && classie.has(articleImage, 'article-display--single') || classie.has(articleImage, 'article-display--page')) {
				//display animation start
				displayAnim(articleImage.className = 'article-display');
			}

			this.render();
		},		
		render: function(model) {
			this.delegateEvents();
			//this.setWindowSize();

			return this;
		},
		singleAjax: function(event) {
			event.preventDefault();

			$(this.el).unbind();

			var article = $(event.currentTarget).parents('.article'),
				articles = $('.article').not(article),
				postAmount = $('.article').length;

			var scrollTop     = $(window).scrollTop(),
				articlePosition = article.offset().top,
				distance      = (articlePosition - scrollTop),
				windowCenter = $(window).height()/2 - article.height()/2,
				offsetAmount;

			if (distance < 0) {
				offsetAmount = windowCenter + Math.abs(distance);
			} else {
				offsetAmount = windowCenter - Math.abs(distance);
			}

			if (postAmount === 1) {
				TweenLite.to(article, 0.4, {
					y: offsetAmount,
					ease: Circ.easeIn,
					onComplete: function(){
						var router = new AppRouter();
						var href = $(event.currentTarget).attr('href');
						router.navigate(href, true);
					}
				});
			} else {
				TweenLite.to(articles, 0.6, {
					alpha: 0,
					onComplete: function(){
						TweenLite.to(article, 0.4, {
							y: offsetAmount,
							ease: Circ.easeIn,
							onComplete: function(){
								var router = new AppRouter();
								var href = $(event.currentTarget).attr('href');
								router.navigate(href, true);
							}
						});
					}
				});
			}
		},
		articleDisplay: function(event) {

			// var counter = $(event.currentTarget).find('img').clone(),
			var	text = $(event.currentTarget).find('.article-name').text(),
				cate = $(event.currentTarget).find('.article-category').text(),
				image = $(event.currentTarget).find('img').attr('src'),
				imageSVG = document.getElementById('card__image'),
				imageSVGHeight = $(event.currentTarget).find('img').attr('height');

			// $('.cube').html(counter);
			$('.display-image').attr('xlink:href', image);
			if (imageSVGHeight) {
				if (imageSVGHeight < 1240) {
					imageSVG.setAttribute('viewBox', '400 0 1140 660');
				} else {
					imageSVG.setAttribute('viewBox', '650 0 650 650');
				}
			}
			$('h2').text(text);
			$('.headline-title__category').text(cate);
		}
	});

	var PageView = Backbone.View.extend({
		el: $(main),
		events: {

		},
		initialize: function(options){
			console.log('page');

			this.collection = options.collection;
			var that = this;

			if (this.start !== true || classie.has(articleImage, 'article-display--single')) {
				//display animation start
				displayAnim(
					setTimeout(function(){
						that.articleDisplay();
					}, 1800)
				);
			}

			this.render();
		},
		render: function(){
			this.delegateEvents();
			
		},
		articleDisplay: function(){

			var title = this.collection.toJSON()[0].page.title,
				image = this.collection.toJSON()[0].page.attachments[0].url,
				imageSVGHeight = this.collection.toJSON()[0].page.attachments[0].images.full.height;

			var imageSVG = document.getElementById('card__image');

			articleImage.className = 'article-display article-display--page';
			$('.headline-title__category').text('');
			$('h2').text(title);
			$('.display-image').attr('xlink:href', image);
			imageSVG.setAttribute('viewBox', '650 0 650 450');
		}
	});
	

	var SingleView = Backbone.View.extend({
		el: $(main),
		events: {
			'mouseover .button--share': 'svgDraw',
			'click .button--back': 'historyBack',
			'swipeleft': 'swipeEventLeft',
			'swiperight': 'swipeEventRight',
			'scroll': 'arrowNav',
			'click #share--facebook':'faceBook'
		},
		initialize: function(options){
			console.log('single');
			var that = this;

			$(this.el).unbind();
			_.bindAll(this, 'svgDraw', 'render', 'historyBack', 'swipeEventLeft', 'swipeEventRight', 'arrowNav' );
			$(window).scroll(this.arrowNav);

			this.template = _.template($('#template--pager').html());
			this.collection = options.collection;

			this.setWindowSize();
			$('.container').attr('style','');

			//display animation start
			displayAnim(articleImage.className = 'article-display article-display--single');

			this.collection.fetch({
				success: function (collection, response) {
					that.render(response, options);
				},
				error: function (errorResponse) {
					console.log(errorResponse);
				},
				complete: function(xhr, textStatus) {
					console.log(textStatus);
				}
			});

		},
		render: function(e, options){
			this.delegateEvents();
			this.$el.hammer();

			$('.single-navigator').html(this.template({ datums: this.collection.toJSON() }));

			$('.single-navigator a').each( function(){
				var href = $(this).attr('href');
				var url = '/works/' + href.split('/works/')[1];
				$(this).attr('href', url);
			});

			return this;
		},
		svgDraw: function(event) {
			var svg = event.target;
			svg.getElementsByTagName('animate')[0].beginElement();
		},
		historyBack: function(event) {
			event.preventDefault();
			var router = new AppRouter();
			router.previous();
		},
		swipeEventLeft: function(e) {
			var href = $('.single-navigator .navigator-next').attr('href');
			if (href !== undefined) {
				$(container).addClass('left');
				var router = new AppRouter();
				router.navigate(href, true);
			}
		},
		swipeEventRight: function(e) {
			var href = $('.single-navigator .navigator-previous').attr('href');
			if (href !== undefined) {
				$(container).addClass('right');
				var router = new AppRouter();
				router.navigate(href, true);
			}
		},
		arrowNav: function(event) {
			var windowScroll = $(event.currentTarget).scrollTop();

			if (windowScroll > 10) {
				TweenLite.to('.arrow-down', 0.4, {
					alpha: 0
				});
			} else {
				TweenLite.to('.arrow-down', 0.4, {
					alpha: 1
				});
			}
		},
		setWindowSize: function(){
			var windowHeight = $(window).height();
			$(main).css({
				top: windowHeight
			});
		},
		faceBook: function(event){
			event.preventDefault();

			var ogTitle = decodeHtmlEntity(this.collection.toJSON()[0].post.title),
				ogDesc = decodeHtmlEntity(this.collection.toJSON()[0].post.excerpt);

			if (window.innerWidth <= 800 && window.innerHeight <= 600) {
				FB.ui({
					method: 'share_open_graph',
					action_type: 'og.shares',
					action_properties: JSON.stringify({
						object : {
							'og:url': this.collection.toJSON()[0].post.url, // your url to share
							'og:title': ogTitle,
							'og:description': ogDesc,
							'og:image': this.collection.toJSON()[0].post.thumbnail
						}
					})
				}, function(response){});
			} else {
				FB.ui({
					method: 'feed',
					name: this.collection.toJSON()[0].post.title,
					title: this.collection.toJSON()[0].post.title,
					href: this.collection.toJSON()[0].post.url,
					link: this.collection.toJSON()[0].post.url,
					picture: this.collection.toJSON()[0].post.thumbnail,
					// caption: post.caption,
					description: this.collection.toJSON()[0].post.excerpt,
					display: 'popup' 
				}, function(response){});
			}
			return false;
		}
	});

	new AppRouter();
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
	Backbone.history.start({pushState: true});

	//--------------
	// Global
	//--------------

	var mainLoader = document.getElementById('loader');
	var contactForm = document.getElementById( 'form--contact' ),
		contactButton = document.getElementById( 'link--contact' ),
		contactButtonSP = document.getElementById( 'link--contact-sp' ),
		contactTrigger = contactForm.querySelector( '.contact-trigger' );

	var articleImage = document.getElementById('article-display');

	var windowWidth = $(window).width(),
		windowHeight = $(window).height();

	var decodeHtmlEntity = function(str) {
		return str.replace(/&#(\d+);/g, function(match, dec) {
			return String.fromCharCode(dec);
		});
	};

	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	TimelineLite.prototype.addSpace = function (position) {
		return this.set({}, {}, position);
	};

	function displayAnim (functions){
		TweenLite.defaultEase = Expo.easeInOut;
		var tl = new TimelineLite();
		tl.to("#clipPath1 circle", 0.6, {
			attr: {
				r: 60
			}
		})
		.to($('#clipPath1 circle'), 0.8, {css:{rotation:180}})
		.to("#clipPath1 circle", 0.7, {
			attr: {
				r: 992
			}
		}, "+=0.4")
		// .addSpace("+=0.8")
		.add(otherStuff)
		.to($('#clipPath1 circle'), 0.8, {css:{rotation:0}});

		function otherStuff(){
			if (functions) {
				functions;
			}
		}

	}

	function navigationMenu() {

		var nav = document.getElementById('navigation--sp'),
			trigger = document.getElementById('navigation-trigger'),
			navInner = nav.querySelector('.navigation-inner'),
			menulink = nav.getElementsByTagName('a'),
			eventtype = mobilecheck() ? 'touchstart' : 'click';

		var overlay = document.createElement('div');
		overlay.className = 'overlay';
		document.body.appendChild( overlay );

		var resetMenu = function() {
			classie.remove(trigger, 'active');
			classie.remove(overlay, 'active');
			classie.remove(nav, 'navigation--sp--opened');
			document.body.style.overflowY = 'inherit';
		},
		closeClickFn = function () {
			resetMenu();
			overlay.removeEventListener( eventtype, closeClickFn);
		};

		trigger.addEventListener( eventtype, function(event) {
			event.preventDefault();
			var trigger = this;

			if (classie.has(this, 'active')) {
				resetMenu();
			} else {
				classie.add(this, 'active');
				classie.add(overlay, 'active');
				classie.add(nav, 'navigation--sp--opened');
				overlay.addEventListener( eventtype, closeClickFn);
				document.body.style.overflowY = 'hidden';
			}
		});

		$(document).on('click', '.list--main a', function(event) {
			event.preventDefault();
			resetMenu();
		});
	}

	function resetContactMenu() {
		classie.remove(contactButton, 'active');
		classie.remove(contactForm, 'show');
		TweenLite.to('.ovelay--contact', 0.4, {
			x: '-100%',
			onComplete: function(){
				$('.overlay--contact').remove();
			}
		});
		TweenLite.set(contactForm, {
			alpha: 0
		});
	}
	function popup(value) {

		form();

		function contact() {
			classie.add(contactButton, 'active');
			classie.add(contactForm, 'show');
			var overlay = document.createElement('div');
			overlay.className = 'overlay overlay--contact';
			document.body.appendChild( overlay );
			TweenLite.to(overlay, 0.4, {
				x: value,
				onComplete: function(){
					TweenLite.to(contactForm, 0.3, {
						alpha: 1
					});
				}
			});
		}
		function clickEvent(event) {
			event.preventDefault();
			if (classie.has(contactButton, 'active')) {
				resetContactMenu();
			} else {
				contact();
			}

			return false;
		}

		contactButton.addEventListener('click', clickEvent , false);
		contactButtonSP.addEventListener('click', clickEvent , false);
		contactTrigger.addEventListener('click', clickEvent , false);
	}

	function form() {

		var inner = contactForm.querySelector( '.form-inner' );
		var submitButton = contactForm.querySelector( '.submit' );
		var email = contactForm.querySelector('.email');
		var messageEl = contactForm.querySelector( '.form-message' );
		//disable form autocomplete
		contactForm.setAttribute( "autocomplete", "off" );

		submitButton.addEventListener('click', ajaxForm , false);

		function ajaxForm (event) {
			event.preventDefault();

			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

			if (email.value !== '') {
				if( email.value.search(re) === -1){
					messageEl.innerHTML = 'Please provide a valid email address';
					return false;
				} else {
					ajaxProcess();
				}
			} else {
				messageEl.innerHTML = 'Please fill the blank.';
				classie.addClass( messageEl, 'show' );
				return false;
			}

			function ajaxProcess() {
				var	formMessages = document.createElement('div');
				formMessages.id = 'form-messages';
				formMessages.className = 'form-messages';
				document.body.appendChild(formMessages);
				var formData = $(contactForm).serialize();

				$.ajax({
					type: 'POST',
					url: $(contactForm).attr('action'),
					data: formData
				})
				.done(function(response) {
					// Make sure that the formMessages div has the 'success' class.
					console.log( "success!" );

					TweenLite.to(inner, 0.4, {
						alpha: 0,
						onComplete: function(){
							$('input, textarea').val('');

							TweenLite.to(messageEl, 0.4, {
								y: 50
							});

							messageEl.innerHTML = 'Thank you! We\'ll be in touch.';
							classie.addClass( messageEl, 'show' );
							setTimeout(function(){
								classie.removeClass( messageEl, 'show' );
								resetContactMenu();
							}, 2000);
							
						}
					});

					// Set the message text.
					var element = $('#thanksPage', $(response));
					$(formMessages).append(element);

					// Clear the form.
				 })
				 .fail(function(data) {
					// Make sure that the formMessages div has the 'error' class.

					// Set the message text.
					if (data.responseText !== '') {
						$(formMessages).text(data.responseText);
					} else {
						$(formMessages).text('Oops! An error occured and your message could not be sent.');
					}
				 });
			}
		}
	}

	$.fn.cssHide = function(value, callback){
		var amount = (value) ? value : 0;
		TweenLite.to(this, amount, {
			css: {
				opacity: 0,
				visibility: 'hidden'
			},
			onComplete: function(){
				if (callback) {
					callback();
				}
			}
		});
		return false;
	};

	$.fn.cssShow = function(value, callback){
		var amount = (value) ? value : 0;
		TweenLite.to(this, amount, {
			css: {
				opacity: 1,
				visibility: 'inherit'
			},
			onComplete: function(){
				if (callback) {
					callback();
				}
			}
		});
		return false;
	};


	navigator.sayswho= (function(){
	    var ua= navigator.userAgent, tem,
	    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	    if(/trident/i.test(M[1])){
	        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
	        return 'IE '+(tem[1] || '');
	    }
	    if(M[1]=== 'Chrome'){
	        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
	        if(tem!== null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	    }
	    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	    if((tem= ua.match(/version\/(\d+)/i))!== null) M.splice(1, 1, tem[1]);
	    return M.join(' ');
	})();
	var browserName = navigator.sayswho.toLowerCase();
	document.body.className = document.body.className + ' ' + browserName;

	if (browserName.split(' ')[0] === 'ie') {
		$('body').css({
			height: windowHeight
		});
		$('html').css({
			overflow: 'hidden'
		});
		$(window).resize( function(){
			windowHeight = $(window).height();
			$('body').css({
				height: windowHeight
			});
		});
	}

	if (windowWidth < 768) {
		navigationMenu();
		popup(0);
	} else {
		popup('18.3%');
	}
});

