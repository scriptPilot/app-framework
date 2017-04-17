<template>
  <div data-page="swiper-horizontal" class="page kitchen-sink-ios">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left sliding"><a class="back link" href="#"><i class="icon icon-back"></i><span>Back</span></a></div>
        <div class="center sliding">Slider Lazy Loading</div>
      </div>
    </div>
    <div class="page-content">
      <div data-pagination=".swiper-pagination" data-next-button=".swiper-button-next" data-prev-button=".swiper-button-prev" data-preload-images="false" data-lazy-loading="true" class="swiper-container swiper-init ks-lazy-slider">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/1" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/2" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/3" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/4" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/5" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/6" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/7" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/8" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/9" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
          <div class="swiper-slide"><img data-src="http://lorempixel.com/1600/1200/nature/10" class="swiper-lazy">
            <div class="preloader"></div>
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-white"></div>
        <div class="swiper-button-prev swiper-button-white"></div>
        <div class="swiper-button-next swiper-button-white"></div>
      </div>
    </div>
  </div>
</template>
