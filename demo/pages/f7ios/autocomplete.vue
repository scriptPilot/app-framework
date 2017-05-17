<template>
  <div data-page="autocomplete" class="page kitchen-sink-ios">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left sliding"><a class="back link" href="#"><i class="icon icon-back"></i><span>Back</span></a></div>
        <div class="center sliding">Autocomplete</div>
      </div>
    </div>
    <div class="page-content">
      <div class="content-block-title">Dropdown Autocomplete</div>
      <div class="content-block">
        <p>Dropdown autocomplete is good to use as a quick and simple solution to provide more options in addition to free-type value.</p>
      </div>
      <div class="content-block-title">Simple Dropdown Autocomplete</div>
      <div class="list-block">
        <ul>
          <li class="item-content">
            <div class="item-title label">Fruit</div>
            <div class="item-input">
              <input type="text" placeholder="Fruit" id="autocomplete-dropdown">
            </div>
          </li>
        </ul>
      </div>
      <div class="content-block-title">Dropdown With Input Expand</div>
      <div class="list-block">
        <ul>
          <li class="item-content">
            <div class="item-title label">Fruit</div>
            <div class="item-input">
              <input type="text" placeholder="Fruit" id="autocomplete-dropdown-expand">
            </div>
          </li>
        </ul>
      </div>
      <div class="content-block-title">Dropdown With All Values</div>
      <div class="list-block">
        <ul>
          <li class="item-content">
            <div class="item-title label">Fruit</div>
            <div class="item-input">
              <input type="text" placeholder="Fruit" id="autocomplete-dropdown-all">
            </div>
          </li>
        </ul>
      </div>
      <div class="content-block-title">Dropdown With Placeholder</div>
      <div class="list-block">
        <ul>
          <li class="item-content">
            <div class="item-title label">Fruit</div>
            <div class="item-input">
              <input type="text" placeholder="Fruit" id="autocomplete-dropdown-placeholder">
            </div>
          </li>
        </ul>
      </div>
      <div class="content-block-title">Standalone Autocomplete</div>
      <div class="content-block">
        <p>Standalone autocomplete provides better mobile UX by opening it in a new page or popup. Good to use when you need to get strict values without allowing free-type values.</p>
      </div>
      <div class="content-block-title">Simple Standalone Autocomplete</div>
      <div class="list-block">
        <ul>
          <li><a href="#" id="autocomplete-standalone" class="item-link item-content autocomplete-opener">
                <input type="hidden">
                <div class="item-inner">
                  <div class="item-title">Favorite Fruite</div>
                  <div class="item-after"></div>
                </div></a></li>
        </ul>
      </div>
      <div class="content-block-title">Popup Standalone Autocomplete</div>
      <div class="list-block">
        <ul>
          <li><a href="#" id="autocomplete-standalone-popup" class="item-link item-content autocomplete-opener">
                <input type="hidden">
                <div class="item-inner">
                  <div class="item-title">Favorite Fruite</div>
                  <div class="item-after"></div>
                </div></a></li>
        </ul>
      </div>
      <div class="content-block-title">Multiple Values Standalone Autocomplete</div>
      <div class="list-block">
        <ul>
          <li><a href="#" id="autocomplete-standalone-multiple" class="item-link item-content autocomplete-opener">
                <input type="hidden">
                <div class="item-inner">
                  <div class="item-title">Favorite Fruite</div>
                  <div class="item-after"></div>
                </div></a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
