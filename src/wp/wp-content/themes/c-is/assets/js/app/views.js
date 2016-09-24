// View
// -------------
import Backbone from 'backbone';
import _ from 'underscore';
import classie from 'classie';
import mixItUp from 'components/jquery.mixitup.min';
import AppRouter from 'app/router';
import { BasicCollection, SingleCollection } from 'app/collections';
import { BasicModel, SingleModel } from 'app/models';
import { decodeHtmlEntity, imageError, mobilecheck, getUrlVars, splitItems, lazyLoad } from 'app/globals';

require('TweenLite');
require('TimelineLite');
require('components/imagePanning');

const mainLoader = document.getElementById('loader');
const loadAnim = function(colour, callback){

	TweenMax.staggerFromTo('.loader img', 1, { scale: 0, rotation: 180 }, { scale: 1, opacity: 1, rotation: 360, ease: Back.easeInOut }, 0.2);

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
				$('.loader img').attr('style','');
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
		this.single = options.single;
		this.start = options.start;
		this.path = (this.id) ? this.id.split('/')[0] : '';

		$(this.el).unbind();
		_.bindAll(this, 'render');

		this.render();
	}
	render() {
		if (classie.has(document.body, 'works')) classie.remove(document.body, 'works');
		console.log(this.path);
		
		if(this.path === 'works'){
			classie.add(document.body, 'works');
			new ArchiveView({ el: this.el, id: this.path, category: this.category });
		} else if (this.path === 'services'){
			new ServicesView({ el: this.el, id: this.path });
		} else if (this.path === 'contact'){
			new ContactView({ el: this.el, id: this.path });
		} else {
			if (this.single) {
				this.$singleContent = this.$('.content--single');
				let singleView = new SingleView({ el: this.el, id: this.path, slug: this.path });
				singleView.default();

				loadAnim('#c8ffc8');
			} else if (this.page) {
				new PageView({ el: this.el });
			} else {
				new BasicView({ el: this.el });
			}
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

		this.events = {
			'click .main-menu a': 'transitionEffect'
		};
		
		$(this.el).unbind();
		_.bindAll(this, 'render', 'transitionEffect', 'mainAnim', 'subAnim');
		
		this.$mainText = this.$('.main-text');
		this.render();
	}
	render() {
		this.delegateEvents();
		loadAnim('#c8ffc8');
		this.mainAnim();

		setInterval(() => {
			this.subAnim();
		}, 6000);

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
	subAnim() {
		const randomz = Math.floor(Math.random() * $(this.el).children('.main-text').length);

		let randomEl = '.main-text-' + randomz,
			randomEl2 = '.main-text-' + (randomz-2),
			randomEl3 = '.main-text-' + (randomz+2),
			elz = randomEl + ', ' + randomEl2 + ', ' + randomEl3;

		if (this.$mainText.is('.active')) {
			this.$mainText.removeClass('active');
		}
		$(elz).addClass('active');
	}
}


//--------------
// SERVICES
//--------------
class ServicesView extends Backbone.View {
	constructor(options) {
		super(options);
		console.log('service page');

		this.$el = $('.main');
		this.sectionTitle = document.getElementsByClassName('service-outline--title')[0];
		this.$sectionTop = this.$('.content--services.top');
		this.$sectionBottom = this.$('.content--services.bottom');
		this.counter = 0;

		$(this.el).unbind();
		_.bindAll(this, 'render', 'setImageSize', 'parallax');
		this.render();
	}
	render() {
		TweenLite.set(this.$sectionBottom, {autoAlpha:0, y: '10%'});
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
			firstContent = this.$sectionTop.find('.section'),
			firstContentBottom = this.$sectionTop.height(),
			secondContent = this.$sectionBottom,
			secondContentOffset = secondContent.offset().top;

		// $('.services-headline').css('top',80.5 + -(scrolled*0.1)+'%');
		$('.bg--business').css('top',4 + -(scrolled*0.02)+'%');
		$('.white-wall').css('top',70 + -(scrolled*0.05)+'%');

		if (scrolled >= secondContentOffset/2) {
			this.counter += 1;
			
			TweenLite.to(secondContent, 1, { autoAlpha: 1, y: '0%' });
			TweenLite.to('.storyline', 0.1, { height: (20 + this.counter*1.2) + '%' });
		}
		if (scrolled >= firstContentBottom/2) {
			TweenLite.to(firstContent, 1, { autoAlpha: 0 });
		} else {
			TweenLite.to(firstContent, 1, { autoAlpha: 1 });
		}
	}
}


//--------------
// WORKS
//--------------
class ArchiveView extends Backbone.View {
	constructor(options) {
		super(options);

		this.$el = $('.main');

		this.events = {
			'click .ajax-trigger--single': 'singleAjax',
			'click .category-nav a': 'cateFilter',
			'click .year-nav a': 'yearFilter',
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
			// this.blurEffect();
			this.getListSize(this.$workItem);
			this.workInfoDisplay();
			this.$workItem.on('mouseover', (event) => { this.workInfoDisplay(event) });
			window.addEventListener('resize', () => { this.getListSize(this.$workItem) });

			if (window.innerHeight >= this.$workList.outerHeight(true)) {
				TweenLite.to('.scroll-arrows', 0.4, { autoAlpha: 0 });
			} else {
				TweenLite.to('.scroll-arrows', 0.4, { autoAlpha: 1 });
			}
		});
		this.addYear();
		$(window).on('scroll', this.scrollNav);
		//$(window).on('scroll', this.parallax);

		loadAnim('#c8ffc8');
	}
	addYear() {
		let data = this.collection.toJSON(),
			years = [];

		for (var i = 0; i < data.length; i++) {
			years.push(data[i].date.split('-')[0]);
		};

		let year = $.unique(years),
			list = document.querySelector('.year-nav ul'),
			item;

		let mixYear = (event) => {
			let dataYear = event.currentTarget.getAttribute('data-filter');
			this.$workList.mixItUp('filter', dataYear );
		}

		for (var i = 0; i < year.length; i++) {
			let content = '<a class="filter" data-filter=".' + year[i] + '" href="">' + year[i] + '</a>';

			item = document.createElement('li');
			$(item).html(content);
			list.appendChild(item);
			
			item.querySelector('.filter').addEventListener('click', mixYear);
		};
	}
	getListSize(target){
		let boxContainer = document.getElementById('svg--grid'),
			boxContainerOffset = ($(window).width() - $(boxContainer).offset().left - $(boxContainer).outerWidth()),
			box = boxContainer.getElementsByTagName('rect'),
			boxWidth = box[0].getBoundingClientRect().width,
			boxOffset = box[0].getBoundingClientRect().top,
			$content = $('.content--works'),
			$listContainer = $('.work-list'),
			$listSize,
			borderSize = ($(boxContainer).outerWidth() - (boxWidth*7))/6;

		$(target).each((index, el) => {
			let listImage = el.querySelector('.work-item__image');

			// if ($(el).is('.largest')) {
			// 	$listSize = { x: boxWidth*7 + borderSize*6, y: boxWidth*5 + borderSize*5 };
			// } else if ($(el).is('.large')) {
			// 	$listSize = { x: boxWidth*7 + borderSize*6, y: boxWidth*3 + borderSize*3 };
			// } else if ($(el).is('.medium')) {
			// 	$listSize = { x: boxWidth*4 + borderSize*3 + borderSize/2, y: boxWidth*3 + borderSize*3 };
			// } else if ($(el).is('.small')) {
			// 	$listSize = { x: boxWidth*3 + borderSize*2 + borderSize/2, y: boxWidth*3 + borderSize*3 };
			// } else if ($(el).is('.small-long')) {
			// 	$listSize = { x: boxWidth*3 + borderSize*2 + borderSize/2, y: boxWidth*2 + borderSize*2 };
			// } else {
			// 	$listSize = { x: boxWidth*2 + borderSize*1 + borderSize/2, y: boxWidth*2 + borderSize*2 };
			// };
			
			if ($(el).is('.largest')) {
				$listSize = { x: boxWidth*5 + borderSize*4, y: boxWidth*5 + borderSize*5 };
			} else if ($(el).is('.large')) {
				$listSize = { x: boxWidth*3 + borderSize*2, y: boxWidth*3 + borderSize*3 };
			} else if ($(el).is('.medium')) {
				$listSize = { x: boxWidth*2 + borderSize*1 + borderSize/2, y: boxWidth*3 + borderSize*3 };
			} else if ($(el).is('.small')) {
				$listSize = { x: boxWidth*1 + borderSize*1 + borderSize/2, y: boxWidth*3 + borderSize*3 };
			} else if ($(el).is('.small-long')) {
				$listSize = { x: boxWidth*1 - borderSize*1 + borderSize/2, y: boxWidth*2 + borderSize*2 };
			} else {
				$listSize = { x: boxWidth*1 - borderSize*2 - borderSize/2, y: boxWidth*2 + borderSize*2 };
			};
			console.log($(window).width()+ ' / ' + $(boxContainer).offset().left + ' / ' + $(boxContainer).outerWidth());
			TweenLite.set($listContainer, { width: boxContainer.offsetWidth, marginTop: boxOffset, marginRight: boxContainerOffset + 1, });
			// TweenLite.set(el, { width: $listSize.x, height: $listSize.x });
			// TweenLite.set(listImage, { width: $listSize.x *1.6, height: $listSize.x *1.6 });
			// TweenLite.set(this.$content, { marginTop: boxOffset, height: ((boxWidth + borderSize)*5) });
			if ($(el).is('.cate-web-design')) {
				TweenLite.set([el, listImage], { width: $listSize.x, height: $listSize.x*0.6 });
			} else {
				TweenLite.set([el, listImage], { width: $listSize.x, height: $listSize.x });
			}
			
		});

		// let contentPos = this.$content.offset().top + this.$content.height();
		// let bottomPos = window.innerHeight - contentPos;

		// this.infoItem.style.bottom = bottomPos + 'px';

	}
	scrollNav(event) {

		let scrolled = $(event.currentTarget).scrollTop();

		if (scrolled > 20) {
			TweenLite.to('.scroll-arrows--archives', 0.4, { autoAlpha: 0 });
		} else {
			TweenLite.to('.scroll-arrows--archives', 0.4, { autoAlpha: 1 });
		}
	}
	workInfoDisplay(event){
		let workItem = (event) ? event.currentTarget : this.$('.work-item')[0],
			workInfo = workItem.querySelector('.work-item__info');

		this.infoItem.innerHTML = workInfo.innerHTML;
	}
	singleAjax(event) {
		event.preventDefault();

		let $article = $(event.currentTarget).parents('.work-item'),
			$articles = $('.work-item').not($article),
			postAmount = $('.work-item').length;

		let scrollTop = $(window).scrollTop(),
			articlePosition = $article.offset().top,
			articlePositionHol = $article.offset().left,
			distance = (articlePosition - scrollTop),
			windowCenterHol = window.innerWidth/2 - $article.width()/2,
			windowCenterVer = window.innerHeight/2 - $article.height()/2,
			containerCenterHol = ( articlePositionHol - window.innerWidth )/2,
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

		const $href = $(event.currentTarget).attr('href'),
			path = $href.replace('/', '').split('/')[1],
			singleView = new SingleView({ el:this.$singleContent, parentEl: $article, slug: path });

		if (postAmount === 1) {
			TweenLite.to($article, 0.4, { x: offsetAmount.hol, y: offsetAmount.ver, left: 0, right: 0, ease: Circ.easeInOut, onComplete: () => {
				singleView.default();
			}});
		} else {
			TweenLite.to($articles, 0.6, { autoAlpha: 0, onComplete: () => {
				TweenLite.to($article, 0.4, { y: offsetAmount.ver, left: 0, right: 0, ease: Circ.easeInOut, onComplete: () => {
					singleView.default();
				}});
			}});
		}
	}
	cateFilter(event) {
		event.preventDefault();
		$('.category-nav a').removeClass('active');
		classie.add(event.currentTarget, 'active');
		// this.blurEffect();
	}
	yearFilter(event) {
		event.preventDefault();
		$('.year-nav a').removeClass('active');
		classie.add(event.currentTarget, 'active');
		// this.blurEffect();
	}
	blurEffect() {
		const windowMiddle = window.innerHeight - window.innerHeight/3,
			windowBottom = window.innerHeight;

		this.$workItem.each(function(index, el) {
			let offsetTop = $(this).offset().top;

			if (offsetTop > windowBottom) {
				TweenLite.set(this, { alpha: 0, 'filter': 'blur(4px)', '-webkit-filter': 'blur(4px)' });
			} else {
				TweenLite.set(this, { alpha: 1, 'filter': 'blur(0)', '-webkit-filter': 'blur(0)' });
			}
		});
	}
	parallax() {
		const scrolled = this.$content.scrollTop();

		this.$workItem.each(function(index, el) {
			let offsetTop = $(this).offset().top,
				filters = 1.5 - offsetTop/100,
				windowMiddle = window.innerHeight - window.innerHeight/3.3,
				windowBottom = window.innerHeight;

			if (offsetTop < windowBottom) {
				TweenLite.to(this, 0.2, {
					alpha: 1,
					'filter': 'blur(0)', 
					'-webkit-filter': 'blur(0)'
				});
			} else {
				TweenLite.to(this, 0.6, {
					alpha: 0,
					'filter': 'blur(10px)',
					'-webkit-filter': 'blur(10px)'
				});
			}
		});
	}
}


//--------------
// WORKS SINGLE
//--------------
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
		TweenLite.to(this.post, 0.3, { autoAlpha: 1, delay: 0.4 });
		TweenLite.to(this.$overlay, 0.2, { width: '100%', delay: 0.6, onComplete: () => {
			classie.add(this.post, 'show');
			TweenLite.to(this.$overlay, 0.2, { x: '100%', delay: 0.2 });
			$('.mock-inner img').imagePanning();
		}});

		$(this.post).on('scroll', this.scrollNav);
	}
	scrollNav(event) {

		let scrolled = $(event.currentTarget).scrollTop();

		if (scrolled > 20) {
			TweenLite.to('.scroll-arrows--single', 0.4, { autoAlpha: 0 });
		} else {
			TweenLite.to('.scroll-arrows--single', 0.4, { autoAlpha: 1 });
		}
	}
	closeContent(event) {
		event.preventDefault();

		this.resetAnim();
		this.inner.innerHTML = '';
		classie.remove(this.post, 'show');
		classie.remove(document.body, 'single');
		
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

//--------------
// CONTACT
//--------------
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
		_.bindAll(this, 'render', 'formSubmit', 'ajaxProcess');
		this.render();
	}
	render(){
		console.log('contactview');

		this.delegateEvents();
		loadAnim('#c8ffc8');

		//this.contactForm.setAttribute( "autocomplete", "off" );
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
		this.contactForm.appendChild(formMessages);

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
			this.messageEl.textContent = (data.responseText !== '') ? data.responseText : 'Oops! An error occured and your message could not be sent.';
		});
	}
	resetContactMenu() {
		classie.remove(this.contactForm, 'show');
	}
}


//--------------
// OTHER PAGES
//--------------
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
		loadAnim('#c8ffc8', () => {
			TweenLite.to('.section-inner', 0.4, { x: '0%', alpha: 1, delay: 0.4 });
		});

	}
}