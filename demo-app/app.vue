<template>
  <f7-app :params="f7Params">
    <f7-statusbar></f7-statusbar>
    <f7-panel left cover>
      <f7-view url="/panel-left/" links-view=".view-main"></f7-view>
    </f7-panel>
    <f7-panel right reveal>
      <f7-view url="/panel-right/"></f7-view>
    </f7-panel>
    <f7-view url="/" :main="true" class="ios-edges"></f7-view>
  </f7-app>
</template>
<script>
import routes from './routes';

export default {
  data() {
    // Demo Theme
    let theme = 'auto';
    if (document.location.search.indexOf('theme=') >= 0) {
      [theme] = document.location.search.split('theme=')[1].split('&');
    }

    return {
      f7Params: {
        theme,
        routes,
        id: 'de.scriptpilot.appframework',
      },
    };
  },
};
</script>
<style>
.demo-list-icon, .icon-f7 {
  background: #ccc;
  display: block;
  position: relative;
}
.theme-dark .demo-list-icon {
  background-color: #555;
}
.icon-f7 {
  background: url(./images/f7-icon.png) no-repeat center;
  background-size: cover;
}
.icon-vi {
  background: url(./images/f7-icon.png) no-repeat center;
  background-size: cover;
}

.ios .demo-list-icon, .ios .icon-f7, .ios .icon-vi {
  width: 29px;
  height: 29px;
  border-radius: 6px;
  box-sizing: border-box;
}
.md .demo-list-icon, .md .icon-f7, .md .icon-vi {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

/* Lazy Demo */
img.demo-lazy {
  display: block;
  width: 100%;
  height: auto;
}
div.demo-lazy {
  background: #aaa;
  -webkit-background-size: cover;
  background-size: cover;
  height: 300px;
  height: 60vw;
}

/* Tab Bar */
.ios .tabbar .tab-link:not(.tab-link-active) .icon-fill {
  display: none;
}
.ios .tabbar .tab-link.tab-link-active .icon:not(.icon-fill) {
  display: none;
}

/* FAB Morph */
.demo-fab-sheet {
  position: absolute;
  left: 16px;
  bottom: 80px;
  width: 140px;
  background: #fff;
  box-shadow: 0px 3px 30px rgba(0,0,0,0.4);
  border-radius: 5px;
  z-index: 1600;
  margin: 0 !important;
}
.ios .demo-fab-sheet {
  bottom: 15px;
}
.md .demo-fab-sheet {
  bottom: 16px;
}
.demo-fab-fullscreen-sheet {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 64px;
  bottom: 0;
  background: #fff;
  z-index: 1600;
  border-radius: 5px 5px 0 0;
  box-shadow: 0px 3px 30px rgba(0,0,0,0.4);
  overflow: hidden;
}
@media (min-width: 768px) {
  .demo-fab-fullscreen-sheet {
    left: 20%;
    width: 60%;
    right: auto;
    height: 80%;
    top: auto;
  }
}
.demo-fab-fullscreen-sheet .page {
  background: #fff;
}

/* Demo Messagebar */
.ios a.demo-send-message-link i {
  font-size: 26px;
}
.ios .messagebar:not(.messagebar-with-value):not(.messagebar-attachments-visible) a.demo-send-message-link {
  pointer-events: none;
  color: #8e8e8e;
}
.md .messagebar:not(.messagebar-with-value):not(.messagebar-attachments-visible) a.demo-send-message-link {
  pointer-events: none;
  opacity: 0.5;
}
/* Grid demo */
.grid-demo div[class*="col"] {
  background: #fff;
  text-align: center;
  color: #000;
  border: 1px solid #ddd;
  padding: 5px;
  margin-bottom: 15px;
  font-size: 12px;
}
.theme-dark .grid-demo div[class*="col"] {
  background-color: #000;
  color: #fff;
  border-color: #444;
}
/* Cards Demo */
.demo-card-header-pic .card-header {
  height: 40vw;
  background-size: cover;
  background-position: center;
  color: #fff;
}
.demo-card-header-pic .card-content-padding .date{
  color: #8e8e93;
}
.demo-facebook-card .card-header {
  display: block;
  padding: 10px;
}
.demo-facebook-card .demo-facebook-avatar {
  float: left;
}
.demo-facebook-card .demo-facebook-name {
  margin-left: 44px;
  font-size: 14px;
  font-weight: 500;
}
.demo-facebook-card .demo-facebook-date {
  margin-left: 44px;
  font-size: 13px;
  color: #8e8e93;
}
.demo-facebook-card .card-footer {
  background: #fafafa;
}
.theme-dark .demo-facebook-card .card-footer {
  background-color: transparent;
}
.demo-facebook-card .card-footer a {
  color: #81848b;
  font-weight: 500;
}
.demo-facebook-card .card-content img {
  display: block;
}
.demo-facebook-card .card-content-padding {
  padding: 15px 10px;
}
.demo-facebook-card .card-content-padding .likes {
  color: #8e8e93;
}
/* Panels Demo */
.ios .panel-right.panel-active ~ .view-main:after,
.ios .panel-right.panel-closing ~ .view-main:after {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  right: 0;
  top: 0;
  background: #ddd;
  z-index: 1000;
}
.ios .theme-dark .panel-right.panel-active ~ .view-main:after,
.ios .theme-dark .panel-right.panel-closing ~ .view-main:after {
  background: #282828;
}

.ios .panel-left:after {
  content: '';
  height: 100%;
  width: 1px;
  position: absolute;
  right: 0;
  top: 0;
  background: #ddd;
  z-index: 1000;
}
.ios .theme-dark .panel-left:after {
  background: #282828;
}

/* Swipers Demo */
.demo-swiper {
  width: 100%;
  height: 100%;
}
.demo-swiper .swiper-slide,
.demo-swiper-multiple .swiper-slide {
  font-size: 25px;
  font-weight: 300;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  background: #fff;
  color: #000;
}
.demo-swiper-multiple .swiper-slide {
  box-sizing: border-box;
  border: 1px solid #ccc;
  background: #fff;
}
.demo-swiper-multiple {
  margin: 0px 0 35px;
  font-size: 18px;
  height: 120px;
}
.demo-swiper-multiple.demo-swiper-multiple-auto .swiper-slide {
  width: 85%;
}
.demo-swiper-multiple.demo-swiper-multiple-auto .swiper-slide:nth-child(2n) {
  width: 70%;
}
.demo-swiper-multiple.demo-swiper-multiple-auto .swiper-slide:nth-child(3n) {
  width: 30%;
}
.demo-swiper-custom {
  height: 100%;
}
.demo-swiper-custom .swiper-container {
  background: #000;
  height: 100%;
}
.demo-swiper-custom .swiper-slide {
  background-size: cover;
  background-position: center;
}
.demo-swiper-custom .swiper-pagination .swiper-pagination-bullet {
  cursor: pointer;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0);
  opacity: 1;
  border-radius: 0;
  transition: 200ms;
  position: relative;
  transform: scale(0.9);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.8);
}
.demo-swiper-custom .swiper-pagination .swiper-pagination-bullet-active {
  z-index: 1;
  border: 1px solid #007aff;
  transform: scale(1.4);
}
.demo-swiper-cube {
  width: 80%;
  height: 70%;
  top: 15%;
}
.demo-swiper-coverflow {
  height: 60%;
  top: 20%;
}
.demo-swiper-coverflow .swiper-slide {
  width: 65%;
}
.demo-swiper-cube .swiper-slide,
.demo-swiper-coverflow .swiper-slide {
  background-size: cover;
  color: #fff;
  -webkit-backface-visibility: hidden;
}
.demo-swiper-fade .swiper-slide {
  background-size: cover;
  background-position: center;
}
.demo-swiper-gallery-top {
  height: 70%;
}
.demo-swiper-gallery-thumbs {
  margin-top: 10px;
  height: 20%;
  height: -webkit-calc(30% - 20px);
  height: -moz-calc(30% - 20px);
  height: -ms-calc(30% - 20px);
  height: calc(30% - 20px);
}
.demo-swiper-gallery-thumbs .swiper-slide {
  width: 25%;
}
.demo-swiper-gallery-thumbs .swiper-slide-pic {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.35;
  transition: 300ms;
}
.demo-swiper-gallery-thumbs .swiper-slide-thumb-active .swiper-slide-pic  {
  opacity: 1;
}
.demo-swiper-gallery-top .swiper-slide,
.demo-swiper-gallery-thumbs .swiper-slide-pic {
  background-size: cover;
  background-position: center;
}
.demo-swiper-parallax {
  height: 100%;
}
.demo-swiper-parallax .swiper-parallax-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 130%;
  height: 100%;
  -webkit-background-size: cover;
  background-size: cover;
  background-position: center;
}
.demo-swiper-parallax .swiper-slide {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 40px 60px;
  color: #fff;
}
.demo-swiper-parallax .swiper-slide-title {
  font-size: 41px;
  font-weight: 300;
}
.demo-swiper-parallax .swiper-slide-subtitle {
  font-size: 21px;
}
.demo-swiper-parallax .swiper-slide-text {
  font-size: 14px;
  max-width: 400px;
  line-height: 1.3;
}
.demo-swiper-lazy {
  height: 100%;
}
.demo-swiper-lazy .swiper-slide {
  position: relative;
}
.demo-swiper-lazy .swiper-slide img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* Icons Demo */
code {
  background: #f3f3f3;
  padding: 5px;
  font-size: 12px;
}
.theme-dark code {
  background: #000;
}
.demo-icon {
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
  color: #333;
}
.theme-dark .demo-icon {
  color: #fff;
}
.demo-icon .demo-icon-name {
  margin-top: 5px;
  font-size: 11px;
  color: #666;
  text-overflow: ellipsis;
  overflow: hidden;
}
.theme-dark .demo-icon .demo-icon-name {
  color: #aaa;
}
#calendar, #calendar-events {
  height: 50%;
  box-sizing: border-box;
}
#calendar .calendar {
  height: 100%;
}
#calendar-events ul {
  height: 100%;
  overflow: auto;
}
#calendar-events .event-color {
  position: absolute;
  left: 0;
  top: 0;
  width: 8px;
  height: 100%;
}
@media (orientation: landscape) {
  #calendar {
    float: left;
  }
  #calendar, #calendar-events {
    height: 100%;
  }
  #calendar, #calendar-events {
    width: 50%;
  }
  #calendar-events {
    margin-left: 50% !important;
    border-left: 1px solid #eee;
  }
  .theme-dark #calendar-events {
    border-left-color: #282828;
  }
}
.elevation-demo {
  height: 100px;
  margin: 30px 10px;
  background: #fff;
  font-size: 18px;
  text-align: center;
  line-height: 100px;
}
</style>
