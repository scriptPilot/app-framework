<template>
  <div data-page="pull-to-refresh" class="page kitchen-sink-material">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left"><a class="back link icon-only" href="#"><i class="icon icon-back"></i></a></div>
        <div class="center">Pull To Refresh</div>
      </div>
    </div>
    <div class="page-content pull-to-refresh-content">
      <div class="pull-to-refresh-layer">
        <div class="preloader"></div>
        <div class="pull-to-refresh-arrow"></div>
      </div>
      <div class="list-block media-list">
        <ul>
          <li class="item-content">
            <div class="item-media"><img src="http://lorempixel.com/88/88/abstract/1" width="44"></div>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">Yellow Submarine</div>
              </div>
              <div class="item-subtitle">Beatles</div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-media"><img src="http://lorempixel.com/88/88/abstract/2" width="44"></div>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">Don't Stop Me Now</div>
              </div>
              <div class="item-subtitle">Queen</div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-media"><img src="http://lorempixel.com/88/88/abstract/3" width="44"></div>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">Billie Jean</div>
              </div>
              <div class="item-subtitle">Michael Jackson</div>
            </div>
          </li>
        </ul>
        <div class="list-block-label">
          <p>Just pull page down to let the magic happen.<br>Note that pull-to-refresh feature is optimised for touch and native scrolling so it may not work on desktop browser.</p>
        </div>
      </div>
    </div>
  </div>
</template>
