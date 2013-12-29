/**
 * Main JS file
 */

/* Globals jQuery, Document */
(function ($) {
	"use strict";


	// PrismJS handler
	// =================
	Prism.languages.html = Prism.languages.markup;

	var _prismHandler = function() {
		$('code').not('[class*="language-"]').addClass(function() {
			var _lang = $(this).attr('class')  || 'markup';

			_lang = _lang.replace(/(language|lang)+\-/gi, '');
			return 'language-' + (Prism.languages.hasOwnProperty(_lang) ? _lang : 'markup');
		});

		Prism.highlightAll();
	};

	_prismHandler();


	// Identify larger viewports with a little css hook
  var isLargeViewport = function() {
    if($('.container').css('z-index') == "10") {
      return true;
    } else {
      return false;
    }
  }

	// Text trimmer
	// =================
	var trimText = function(classname, size) {
		if (isLargeViewport()) {
			$(classname).html(function() {
				var classText = this.innerHTML;

				if (classText.length > size) {
				var trimmedText = jQuery.trim(classText).substring(0, size).split(" ").slice(0, -1).join(" ") + "&hellip;";

				return trimmedText;
			}
			});
		}
	}

	trimText('.post-grid .post-title a', 30);


	// Ajax Loading methods
	// =================
	// Based on Ghostwriter by Rory Gibson - https://github.com/roryg/ghostwriter

	var History = window.History;
	var loading = false;
	var showIndex = true;
	var $ajaxContainer = $('#ajax-container');
	var $postIndex = $('#post-index');
	var $blogLink = $('.js-show-index');

	// Initially hide the index and show the latest post
	$postIndex.show();

	// Show the index if the url has "page" in it (a simple
	// way of checking if we're on a paginated page.)
	if (window.location.pathname.indexOf('page') === 1) {
		$postIndex.show();
	}

	// Check if history is enabled for the browser
	if ( ! History.enabled) {
		return false;
	}

	History.Adapter.bind(window, 'statechange', function() {
		var State = History.getState();

		// Get the requested url and replace the current content
		// with the loaded content
		$.get(State.url, function(result) {
			var $html = $(result);
			var $newContent = $('#ajax-container', $html).contents();

			$('html, body').animate({'scrollTop': 0});

			$ajaxContainer.fadeOut(500, function() {
				$postIndex = $newContent.filter('#post-index');

				if (showIndex === true) {
				} else {
				}

				$ajaxContainer.html($newContent);
				$ajaxContainer.fadeIn(500);

				_prismHandler();
				trimText('.post-grid .post-title a', 30);
				NProgress.done();

				$('#site-footer').fadeIn(100);

				loading = false;
				showIndex = false;
			});
		});
	});

	$('body').on('click', '.js-ajax-link, .pagination a', function(e) {
			e.preventDefault();

			if (loading === false) {
				var currentState = History.getState();
				var url = $(this).attr('href');
				var title = $(this).attr('title') || null;

				// If the requested url is not the current states url push
				// the new state and make the ajax call.
				if (url !== currentState.url.replace(/\/$/, "")) {
					loading = true;

					// Check if we need to show the post index after we've
					// loaded the new content
					if ($(this).hasClass('js-show-index') || $(this).parent('.pagination').length > 0) {
						showIndex = true;
					}
					if ($(this).hasClass('post-link')) {
				$blogLink.addClass('single');

			} else if($(this).hasClass('js-show-index')) {
				if($(this).hasClass('single')) {}
				$blogLink.removeClass('single');

			}
			NProgress.start();

			History.pushState({}, title, url);
			} else {

				// Swap in the latest post or post index as needed
				if (!$(this).hasClass('js-show-index')) {
					$('html, body').animate({'scrollTop': 0});

					NProgress.start();

					$postIndex.fadeOut(300, function() {
						NProgress.done();
					});
				}
			}
		}

	});


	// Theme's header and Nav behavior
	// ===============================
	var headerNav = function() {

		var $window = $(window);
		var $mainContent = $('#wrapper');
		var $header = $('#site-head');

		// Scroll event handlers
		$window.scroll(function () {

			var scrollTop = $(window).scrollTop();
			var windowHeight = $(window).height();
			var headerHeight = $header.height() - $window.scrollTop();

			// Effect only applies if a logo is present and screen is 560px +
			if ($('#blog-logo').length && isLargeViewport()) {
				var $logo = $('#blog-logo');
				var logoHeight = $logo.height() + 40;
				var offset = $logo.offset().top;
				var height = $header.outerHeight();

				// Check if above or below viewport
				if (offset + height <= scrollTop || offset >= scrollTop + windowHeight) {
					return;
				}

				var yBgPosition = Math.round((offset - scrollTop - 40) * 0.6);

				// Apply the Y Background Position for a subtle Parallax Effect
				$('#site-cover').css('background-position', 'left ' + yBgPosition + 'px');

				// To position logo
				// if (headerHeight > logoHeight) {
				// 	var marginTop = (headerHeight / 2 - logoHeight / 2) + 'px';
				// 	$logo.css({marginTop: yBgPosition});
				// }
			}

			// if header is completely gone
			var $secondaryTitle = $('#header-nav');
			if (headerHeight <= 0) {
				if (!$secondaryTitle.hasClass('displayed')) {
					$secondaryTitle.addClass('displayed');
					$secondaryTitle.animate({top: '0px'}, 500);
				}
			}
			// if not
			else {
				if ($secondaryTitle.hasClass('displayed')) {
					$secondaryTitle.removeClass('displayed');
					$secondaryTitle.animate({top: '-200px'}, 500);
				}
			}

		});

		// Check for nav and add it to DOM
		if (!$('#header-nav').length){
			var siteURL = location.host;
			var siteName = $('#site-head h1').text().replace(/\s+/g, ' ');
			var header = $('<nav id="header-nav"><h2 class="heading"><a class="js-ajax-link js-show-index"  href="http://'+ siteURL +'">' + siteName + '</a></h2><a href="#top" id="scroll-to-top"></a></nav>');
			$('body').prepend(header);
		}

		// scroll to top button
		$('#scroll-to-top').click(function (e) {
			e.preventDefault();
			$('html, body').animate({scrollTop: 0}, 200);
		});
	}

	// if (isLargeViewport()) {
		headerNav();
	// }

}(jQuery));