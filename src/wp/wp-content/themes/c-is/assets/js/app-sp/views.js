// View
// -------------
import Backbone from 'backbone';
import _ from 'underscore';
import classie from 'classie';
import mixItUp from 'components/jquery.mixitup.min';
import AppRouter from 'app-sp/router';
import { BasicCollection, SingleCollection } from 'app-sp/collections';
import { BasicModel, SingleModel } from 'app-sp/models';
import { decodeHtmlEntity, imageError, mobilecheck, getUrlVars, splitItems, lazyLoad } from 'app-sp/globals';

require('TweenLite');
require('TimelineLite');
require('components/imagePanning');

const mainLoader = document.getElementById('loader');
const loadAnim = function(colour, callback){

	let square = document.getElementById('square');
	let spans = square.getElementsByTagName('span');

	for (let i = spans.length - 1; i >= 0; i--) {
		spans[i].style.backgroundColor = colour;
	}
	TweenLite.set(square, {autoAlpha: 1});

	const tl = new TimelineLite({ onComplete: Loader() });
	tl.fromTo(".l1", 1, {height:0}, {height:'100%'})
	.fromTo(".l2", 1, {width:0}, {width:'100%'})
	.fromTo(".l3", 1, {height:0}, {height:'100%'})
	.fromTo(".l4", 1, {width:0}, {width:'100%'});

	tl.timeScale(3);

	function Loader(){
		TweenLite.to(mainLoader, 0.6, {
			autoAlpha: 0,
			ease: Sine.easeInOut,
			delay: 1.4,
			onComplete: function(){
				classie.remove( mainLoader, 'show' );
				TweenLite.to(square, 0.4, {autoAlpha: 0});
				TweenLite.to(mainLoader, 0.6, { y: '200%', ease: Sine.easeInOut });
				TweenLite.to(document.getElementById('container'), 0.4, { autoAlpha: 1 });
				if (callback) callback();
			}
		});
	}
};

export default class MainView extends Backbone.View {
	constructor(options) {
		super(options);

		this.$el = $('#main');
		this.category = options.category;
		this.page = options.page;
		this.start = options.start;
		this.path = (this.id) ? this.id.split('/')[0] : '';

		$(this.el).unbind();
		_.bindAll(this, 'render');

		this.render();
	}
	render() {

		if (classie.has(document.body, 'works')) {
			classie.remove(document.body, 'works');
		}

		if(this.path === 'works'){
			classie.add(document.body, 'works');
			new ArchiveView({ el: this.el, id: this.path, category: this.category });
		} else if (this.path === 'services'){
			new ServicesView({ el: this.el, id: this.path });
		} else if (this.path === 'contact'){
			new ContactView({ el: this.el, id: this.path });
		} else {
			(this.page) ? new PageView({ el: this.el }) : new BasicView({ el: this.el });
		}
	}
}

//--------------
// Home
//--------------
class BasicView extends Backbone.View {
	constructor(options) {
		super(options);		
		console.log('home!!');
		
		$(this.el).unbind();
		_.bindAll(this, 'render', 'transitionEffect', 'mainAnim');
		
		this.events = {
			'click .main-menu a': 'transitionEffect',
		};
		this.$mainText = this.$('.main-text');
		this.render();
	}
	render() {
		this.delegateEvents();
		loadAnim('#504f4f');
		this.mainAnim();
		this.mainSize();

		return this;
	}
	transitionEffect(event) {
		event.preventDefault();

		const router = new AppRouter(),
			href = event.currentTarget.getAttribute('href');

		router.navigate(href, true);
	}
	mainAnim() {		
		this.$mainText.each(function(i, el){
			TweenLite.to(this, 1, { alpha: 1, delay: 0.5*i });
		});
	}
	mainSize() {
		const windowWidth = window.innerWidth,
			windowHeight = window.innerHeight;
		document.getElementsByClassName('main')[0].style.height = windowHeight + 'px';
	}
}

class ServicesView extends Backbone.View {
	constructor(options) {
		super(options);
		console.log('service page');

		this.$el = $('.main');
		this.sectionTitle = document.getElementsByClassName('service-outline--title')[0];
		this.$sectionBottom = this.$('.content--services.bottom');
		this.counter = 0;

		$(this.el).unbind();
		_.bindAll(this, 'render', 'setImageSize', 'parallax');
		this.render();
	}
	render() {
		this.setImageSize();
		this.parallax();

		loadAnim('#c8ffc8');
		window.addEventListener('resize', this.setImageSize);
		window.addEventListener('scroll', this.parallax);
	}
	setImageSize() {
		const imageWidth = this.sectionTitle.offsetWidth;
		this.sectionTitle.style.height = imageWidth*0.69 + 'px';
	}
	parallax() {
		let scrolled = $(window).scrollTop(),
			secondContent = this.$sectionBottom,
			secondContentOffset = secondContent.offset().top;

		// $('.services-headline').css('top',80.5 + -(scrolled*0.1)+'%');
		// $('.bg--business').css('top',4 + -(scrolled*0.02)+'%');
		$('.white-wall').css('top',70 + -(scrolled*0.05)+'%');

		if (scrolled >= secondContentOffset - 80) {
			console.log(this.counter );
			this.counter += 1;
			
			TweenLite.to('.storyline', 0.1, { height: (20 + this.counter*1.2) + '%' });
		}
	}
}

class ArchiveView extends Backbone.View {
	constructor(options) {
		super(options);

		this.$el = $('.main');
		this.events = {
			'click .ajax-trigger--single': 'singleAjax',
			'click .category-nav a': 'cateFilter'
		};
		this.id = options.id;
		this.category = options.category;
		this.template = _.template($('#template--index').html());
		this.collection = new BasicCollection({ id: this.id, category: this.category });
		this.$workList = this.$('.work-list');
		this.$content = this.$('.content--works');
		this.$singleContent = this.$('.content--single');

		this.infoItem = document.getElementById('work-info');

		$(this.el).unbind();
		_.bindAll(this, 'render', 'singleAjax', 'blurEffect', 'parallax');

		this.collection.fetch({
			success: (collection, response) => {
				this.render(response);
			},
			error: (errorResponse) => {
				console.log(errorResponse);
			},
			complete:(xhr, textStatus) => {
				console.log(textStatus);
			}
		});
	}
	render() {
		console.log('archiveview');

		let datums = this.collection.toJSON();

		this.delegateEvents();
		this.$workList.html(this.template({ datums: datums }));
		this.$workList.mixItUp();
		this.$workList.on('mixEnd', () => {
			this.$workItem = this.$('.work-item');
			this.blurEffect();
			this.$workItem.on('mouseover', (event) => { this.workInfoDisplay(event) });

			if (window.innerHeight >= this.$workList.outerHeight(true)) {
				TweenLite.to('.scroll-arrows', 0.4, { autoAlpha: 0 });
			} else {
				TweenLite.to('.scroll-arrows', 0.4, { autoAlpha: 1 });
			}
		});
		$(window).on('scroll', this.parallax);
		$(window).on('scroll', this.scrollNav);

		loadAnim('#fff');
	}
	scrollNav(event) {

		let scrolled = $(event.currentTarget).scrollTop();

		if (scrolled > 20) {
			TweenLite.to('.scroll-arrows', 0.4, { autoAlpha: 0 });
		} else {
			TweenLite.to('.scroll-arrows', 0.4, { autoAlpha: 1 });
		}
	}
	singleAjax(event) {
		event.preventDefault();

		let article = $(event.currentTarget).parents('.work-item'),
			articles = $('.work-item').not(article),
			articleImage = article.find('.work-item__image'),
			articleInfo = article.find('.work-item__info'),
			postAmount = $('.work-item').length;

		let scrollTop     = $(window).scrollTop(),
			articlePosition = article.offset().top,
			distance      = (articlePosition - scrollTop),
			windowWidth = window.innerWidth,
			windowHeight = window.innerHeight,
			windowCenterHol = windowWidth/2 - article.width()/2,
			windowCenterVer = windowHeight/2 - article.height()/2,
			offsetAmount;

		if (distance < 0) {
			offsetAmount = {
				hol: windowCenterHol,
				ver: windowCenterVer + Math.abs(distance)
			};
		} else {
			offsetAmount = {
				hol: windowCenterHol,
				ver: windowCenterVer - Math.abs(distance)
			};
		}

		const href = $(event.currentTarget).attr('href'),
			path = href.replace('/', '').split('/')[1],
			singleView = new SingleView({ el:this.$singleContent, parentEl: article, slug: path });

		if (postAmount === 1) {
			TweenLite.to(article, 0.4, { x: offsetAmount.hol, y: offsetAmount.ver, left: 0, right: 0, ease: Circ.easeInOut, onComplete: function(){
				singleView.default();
			}});
		} else {
			TweenLite.to(articleInfo, 0.3, { autoAlpha: 0 });
			TweenLite.to(articles, 0.6, { autoAlpha: 0, onComplete: function(){
				TweenLite.to(article, 0.4, { y: offsetAmount.ver, left: 0, right: 0, ease: Circ.easeInOut, onComplete: function(){
					singleView.default();
				}});
			}});
		}
	}
	cateFilter(event) {
		event.preventDefault();
		$('.category-nav a').removeClass('active');
		classie.add(event.currentTarget, 'active');
		this.blurEffect();
	}
	blurEffect() {
		const windowMiddle = window.innerHeight - window.innerHeight/3;
		this.$workItem.each(function(index, el) {
			let offsetTop = $(this).offset().top;

			if (offsetTop > windowMiddle) {
				TweenLite.set(this, { alpha: 0, 'filter': 'blur(4px)', '-webkit-filter': 'blur(4px)' });
			} else {
				TweenLite.set(this, { alpha: 1, 'filter': 'blur(0)', '-webkit-filter': 'blur(0)' });
			}
		});
	}
	parallax() {
		const scrolled = $(window).scrollTop();

		this.$workItem.each(function(index, el) {
			let offsetTop = $(this).offset().top,
				filters = 1.5 - offsetTop/100,
				windowMiddle = window.innerHeight - window.innerHeight/3.3;

			console.log(scrolled + '  +  ' + offsetTop);

			if (scrolled < offsetTop) {
				TweenLite.to(this, 0.2, {
					alpha: 1,
					'filter': 'blur(0)', 
					'-webkit-filter': 'blur(0)'
				});
			} 
		});
	}
}

class SingleView extends Backbone.View {
	constructor(options){
		super(options);

		this.events = {
			'click .single-post__close': 'closeContent',
			'click #share--facebook': 'faceBook',
		};
		this.id = options.id;
		this.slug = options.slug;
		this.template = _.template($('#template--post').html());
		this.collection = new SingleCollection({ id: this.id, slug: this.slug });
		this.post = document.getElementById('single-post');
		this.inner = document.getElementById('single-post-inner');
		this.buttonClose = document.getElementById('button--close');
		this.$parentEl = options.parentEl;
		this.$overlay = this.$('.overlay--single');

		$(this.el).unbind();
		_.bindAll(this, 'render', 'default', 'closeContent');
	}
	default() {
		this.collection.fetch({
			success: (collection, response) => {
				this.render(response);
			},
			error: (errorResponse) => {
				console.log(errorResponse);
			},
			complete:(xhr, textStatus) => {
				console.log(textStatus);
			}
		});
	}
	render() {
		let datums = this.collection.toJSON()[0];

		this.delegateEvents();
		this.inner.innerHTML = this.template({ datums: datums });

		classie.add(document.body, 'single');

		TweenLite.set(this.post, { height: '100%' });
		TweenLite.to(this.buttonClose, 0.3, { autoAlpha: 0, delay: 0.6 });
		TweenLite.to(this.post, 0.3, { autoAlpha: 1, delay: 0.4 });
		TweenLite.to(this.$overlay, 0.2, { width: '100%', delay: 0.6, onComplete: () => {
			classie.add(this.post, 'show');
			TweenLite.to(this.$overlay, 0.2, { x: '100%', delay: 0.2 });
			$('.mock-inner img').imagePanning();
		}});
	}
	closeContent(event) {
		event.preventDefault();

		this.resetAnim();
		this.inner.innerHTML = '';
		classie.remove(this.post, 'show');
		classie.remove(document.body, 'single');

		TweenLite.to('.work-item__info', 0.4, { autoAlpha: 1 });
		TweenLite.to(this.$overlay, 0.2, { x: '0%', onComplete: () => {
			TweenLite.to(this.$overlay, 0.2, { width: '0%' });
		}});
		TweenLite.to(this.post, 0.6, { autoAlpha: 0, delay: 0.6, onComplete:() => {
			TweenLite.set(this.post, { height: '0%' });
		}});
	}
	resetAnim() {
		TweenLite.set('.work-item', { x: '0%', y: '0%', autoAlpha: 1 });
		$('.work-item').css({ left: '', right: ''});
	}
	faceBook(event) {
		event.preventDefault();

		var ogTitle = decodeHtmlEntity(this.collection.toJSON()[0].title.rendered),
			ogDesc = decodeHtmlEntity(this.collection.toJSON()[0].excerpt.rendered),
			ogLink = decodeHtmlEntity(this.collection.toJSON()[0].link),
			ogThumbnail = this.collection.toJSON()[0].featured_media;

		FB.ui({
			method: 'feed',
			name: ogTitle,
			title: ogTitle,
			href: ogLink,
			link: ogLink,
			picture: ogThumbnail,
			description: ogDesc,
			display: 'popup' 
		}, function(response){});
	}
}
class ContactView extends Backbone.View {
	constructor(options){
		super(options);
		this.el = $('.main');
		this.events = {
			'click .submit': 'formSubmit' 
		};
		this.contactForm = document.getElementById('contact-form');
		this.email = this.contactForm.querySelector('.email');
		this.submitButton = this.contactForm.querySelector( '.submit' );
		this.messageEl = this.contactForm.querySelector( '.form-message' );

		$(this.el).unbind();
		_.bindAll(this, 'render', 'formSubmit');
		this.render();
	}
	render(){
		console.log('contactview');
		this.delegateEvents();
		loadAnim('#504f4f');
		this.contactForm.setAttribute( "autocomplete", "off" );
	}
	formSubmit(event){
		event.preventDefault();

		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		if (this.email.value !== '') {
			if( this.email.value.search(re) === -1){
				this.messageEl.innerHTML = 'Please provide a valid email address';
				classie.addClass( this.messageEl, 'show' );
				return false;
			} else {
				this.ajaxProcess();
			}
		} else {
			this.messageEl.innerHTML = 'Please fill the blank.';
			classie.addClass( this.messageEl, 'show' );
			return false;
		}

	}
	ajaxProcess() {
		let formData = $(this.contactForm).serialize(),
			formMessages = document.createElement('div');
		
		formMessages.id = 'form-messages';
		formMessages.className = 'form-messages';
		document.body.appendChild(formMessages);

		$.ajax({
			//type: 'POST',
			url: this.contactForm.getAttribute('action'),
			data: formData
		})
		.done( (response) => {
			$('input, textarea').not('.submit').val('');

			this.messageEl.innerHTML = 'Thank you! We\'ll be in touch.';
			classie.addClass( this.messageEl, 'show' );
			setTimeout(() => {
				classie.removeClass( this.messageEl, 'show' );
				this.resetContactMenu();
			}, 2000);
		 })
		 .fail((data) => {
			formMessages.textContent = (data.responseText !== '') ? data.responseText : 'Oops! An error occured and your message could not be sent.';
		});
	}
	resetContactMenu() {
		classie.remove(this.contactForm, 'show');
	}
}

class PageView extends Backbone.View {
	constructor(options){
		super(options);
		this.$el = $('.main');
		this.$aboutSection = this.$('.secton');

		this.render();
	}
	render() {
		console.log('pageview');
		TweenLite.set('.section-inner', { x: '-100%', alpha: 0 });
		loadAnim('#504f4f', () => {
			TweenLite.to('.section-inner', 0.4, { x: '0%', alpha: 1, delay: 0.4 });
		});
	}
}