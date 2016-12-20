<template>
  <f7-page navbar-fixed>
  
    <!-- Multi language pages use bindings instead of fix text patterns -->
    
    <f7-navbar :back-link="text.backlink" :title="text.title"></f7-navbar>
    
    <f7-block inner><p>{{text.text}}</p></f7-block>    
    
    <f7-block inner>
      <ul>
        <li><b>Url:</b> {{$route.url}}</li>
        <li><b>Path:</b> {{$route.path}}</li>
        <li><b>Hash:</b> {{$route.hash}}</li>
        <li><b>Params:</b>
          <ul>
            <li v-for="(value, key) in $route.params"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Query:</b>
          <ul>
            <li v-for="(value, key) in $route.query"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Route:</b> {{$route.route}}</li>
      </ul>
    </f7-block>
    
  </f7-page> 
</template>
<script>

  // Multi language pages need an object (we use "text") with sub-item per language and sub-sub-items per text pattern
  var text = {
    en: {
      backlink: 'Back',
      title: 'Router test',
      text: 'This page gives you an overview about the flexible routing options.'
    },
    de: {
      backlink: 'Zurück',
      title: 'Router-Test',
      text: 'Diese Seite zeigt die vielfältigen Routing-Möglichkeiten.'
    }
  }

  // To keep the text pattern assigned updated with the current selected language, it has to be assigned as computed property
  module.exports = {
    computed: {
      text: function() {
        return text[this.$root.lang]
      }
    }
  }
  
</script>