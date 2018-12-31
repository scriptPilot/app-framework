<template>
  <div data-page="virtual-list" class="page kitchen-sink-material">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left"><a class="back link icon-only" href="#"><i class="icon icon-back"></i></a></div>
        <div class="center">Virtual List</div>
      </div>
    </div>
    <form data-search-list=".virtual-list" class="searchbar searchbar-init">
      <div class="searchbar-input">
        <input type="search" placeholder="Search"><a href="#" class="searchbar-clear"></a>
      </div>
    </form>
    <div class="searchbar-overlay"></div>
    <div class="page-content">
      <div class="content-block">
        <p>Virtual List allows to render lists with huge amount of elements without loss of performance. And it is fully compatible with all Framework7 list components such as Search Bar, Infinite Scroll, Pull To Refresh, Swipeouts (swipe-to-delete) and Sortable.</p>
        <p>Here is the example of virtual list with 10 000 items:</p>
      </div>
      <div class="list-block virtual-list searchbar-found media-list"></div>
      <div class="list-block searchbar-not-found">
        <ul>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">Nothing found</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
