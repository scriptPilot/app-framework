<template>
  <div data-page="swiper-nested" class="page kitchen-sink-ios">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left sliding"><a class="back link" href="#"><i class="icon icon-back"></i><span>Back</span></a></div>
        <div class="center sliding">Nested Sliders</div>
      </div>
    </div>
    <div class="page-content">
      <div data-pagination=".swiper-pagination-h" data-pagination-hide="false" class="swiper-container swiper-init ks-demo-slider">
        <div class="swiper-pagination swiper-pagination-h"></div>
        <div class="swiper-wrapper">
          <div class="swiper-slide">Horizontal Slide 1</div>
          <div class="swiper-slide">
            <div data-pagination=".swiper-pagination-v" data-direction="vertical" data-pagination-hide="false" class="swiper-container swiper-init ks-demo-slider">
              <div class="swiper-pagination swiper-pagination-v"></div>
              <div class="swiper-wrapper">
                <div class="swiper-slide">Vertical Slide 1</div>
                <div class="swiper-slide">Vertical Slide 2</div>
                <div class="swiper-slide">Vertical Slide 3</div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">Horizontal Slide 3</div>
          <div class="swiper-slide">Horizontal Slide 4</div>
        </div>
      </div>
    </div>
  </div>
</template>
