(function($) {
	$(document).ready(function() {
		$(function() {
			const $button = document.querySelector('#sendImages');
			const $fileInput = document.querySelector('#imageInput');
			const $watermarkInput = document.querySelector('#watermarkInput');
			const $watermark = document.querySelector('#watermark');
			const $carousel = document.querySelector('.images-list');
			const $watermarkBox = document.querySelector('#wm-box')

			var carouselInitialized = false;
			/* TODO: make preview for thumbnail */
			var imagesPreview = function(input, whereToInsertImage, htmlItem, _callback) {
				whereToInsertImage.innerHTML = '';
				var newHtml = '';
				if (input.files) {
					var filesAmount = input.files.length;

					console.log(filesAmount)
					for (var i = 0; i < filesAmount; i++) {
						var reader = new FileReader();

						reader.onload = function(event) {
							console.log(event.target.result)
							newHtml = htmlItem.replace('variable', event.target.result);
							whereToInsertImage.insertAdjacentHTML('afterbegin', newHtml);
						}

						reader.readAsDataURL(input.files[i]);

					}

				}
				_callback();
			};
			//jQuery
			var showSelectedImages = function() {
				$('#imageInput').on('change', function() {
					imagesPreview(this, $carousel, `<div class="carousel-item active"><img src="variable"></div>`, function() {
						console.log('finish')
						setTimeout(function() {

						}, 50);
					});
				});
			}
			//jQuery
			var showSelectedWatermark = function() {
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
				function download(dataurl, filename) {
					var a = document.createElement("a");
					a.href = dataurl;
					a.setAttribute("download", filename);
					var b = document.createEvent("MouseEvents");
					b.initEvent("click", false, true);
					a.dispatchEvent(b);
					return false;
				}
				$button.addEventListener('click', function() {
					var imgs = $fileInput.files;
					var wm = $watermarkInput.files[0];
					var wmTransparency = document.querySelector('#watermarkTransparency').value / 100;
					var $whereToInsertImage = document.querySelector('#finalResult');
					var imgSrc = '';
					var counter = 1;
					$whereToInsertImage.innerHTML = '';
					for (var each of imgs) {
						var img = each;
						watermark([img, wm])
							.image(watermark.image.center(wmTransparency))
							.then(function(img) {
								imgSrc = img.getAttribute('src');
								$whereToInsertImage.insertAdjacentHTML('afterbegin', `<div class="carousel-item carousel-item-${counter}"></div>`);
								$whereToInsertImage.querySelector('.carousel-item-'+counter).appendChild(img);
							})
							.then(function() {
								download(imgSrc, "watermarker-image-"+counter+".png");
								counter += 1;
							});
					}
				});
			};
			var startSideNav = function() {
				$('.sidenav').sidenav();
			};
			var startToolTip = function() {
				$('.tooltipped').tooltip();
			}
			var init = function() {
				showSelectedImages();
				showSelectedWatermark();
				startSideNav();
				startToolTip();
				addWatermarkToImage();
			};

			init();

		});
	});
})(jQuery); // end of jQuery name space