(function($) {
	$(document).ready(function() {
		$(function() {
			const $button = document.querySelector('#sendImages');
			const $fileInput = document.querySelector('#imageInput');
			const $watermark = document.querySelector('#watermark');
			const $carousel = document.querySelector('.images-list');
			const $watermarkBox = document.querySelector('#wm-box')
			
			var carouselInitialized = false;
			/* TODO: make preview for thumbnail */
			var imagesPreview = function(input, whereToInsertImage, htmlItem, _callback) {
				whereToInsertImage.innerHTML = '';
				if (input.files) {
					var filesAmount = input.files.length;

					for (var i = 0; i < filesAmount; i++) {
						var reader = new FileReader();

						reader.onload = function(event) {
							htmlItem = htmlItem.replace('variable', event.target.result)
							whereToInsertImage.insertAdjacentHTML('afterbegin', htmlItem);
						}

						reader.readAsDataURL(input.files[i]);
					}
				}
				_callback();
			};

			//jQuery
			var showSelectedImages = function(){
				$('#imageInput').on('change', function() {
					imagesPreview(this, $carousel, `<div class="carousel-item active"><img src="variable"></div>`, function() {
						console.log('finish')
						setTimeout(function() {
							
						}, 50);
					});
				});
			}
			//jQuery
			var showSelectedWatermark = function(){
				$('#watermarkInput').on('change', function() {
					imagesPreview(this, $watermarkBox, `<img src="variable" alt="Selected thumbnail" class="wm-thumbnail">`, function() {
						console.log('finish')
						setTimeout(function() {
							
						}, 50);
					});
				});
			}
			//vanilla
			var addWatermarkToImage = function() {
				$button.addEventListener('click', function() {
					var imgs = $fileInput.files;
					var wm = $watermark.files[0];
					for (var each of imgs) {
						var img = each;
						watermark([img, wm])
							.image(watermark.image.center(1))
							.then(function(img) {
								document.getElementById('center').appendChild(img);
							});
					}
				});
			};
			var startSideNav = function() {
				$('.sidenav').sidenav();
			};
			var init = function() {
				showSelectedImages();
				showSelectedWatermark();
				startSideNav();
			};

			init();

		});
	});
})(jQuery); // end of jQuery name space