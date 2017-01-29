module.exports = {

  // Define page runtime data
  data: function () {
    return {
      'runtimeView': null,
      'runtimePageNo': null,
      'runtimeUrl': null,
      'runtimePageId': null,
      'runtimeTabs': null,
      'runtimeActiveTab': null,
      'runtimeScrollPosition': 0
    }
  },

  // Method to save page data to local storage
  methods: {
    saveRuntime: function () {
      if (this.runtimePageId) {
        let data = {}
        for (let el in this.$data) {
          data[el] = this.$data[el]
        }
        window.localStorage[this.runtimePageId] = JSON.stringify(data)
      }
    }
  },

  // Get runtime page data and attach event listener
  mounted: function () {
    // Page with Framework7 route object
    if (this.$route) {
      // Assign firebase db object
      this.db = window.db
      if (window.firebase) {
        this.timestamp = window.firebase.database.ServerValue.TIMESTAMP
      }

      // Get views from local storage
      let views = window.localStorage.views ? JSON.parse(window.localStorage.views) : {}

      // Get view
      this.runtimeView = this.$$(this.$el).parents('.view').attr('id')

      // Get page number
      if (!views[this.runtimeView]) {
        views[this.runtimeView] = []
      }
      this.runtimePageNo = views[this.runtimeView].length

      // Get url
      this.runtimeUrl = this.$route.url

      // Get page id
      this.runtimePageId = 'runtime/' + this.runtimeView + '/' + this.runtimePageNo + '/' + this.runtimeUrl

      // Copy initial runtime
      let initialRuntime = window.localStorage[this.runtimePageId] ? JSON.parse(window.localStorage[this.runtimePageId]) : null

      // Update views
      views[this.runtimeView].push({
        url: this.runtimeUrl,
        pageId: this.runtimePageId
      })
      window.localStorage.views = JSON.stringify(views)

      // Loop tabs
      this.$$(this.$el).find('.tab.page-content').each(function (i, elTab) {
        if (!this.runtimeTabs) {
          this.runtimeTabs = {}
        }
        let tabId = this.$$(elTab).attr('id')
        if (tabId !== null && tabId !== '' && this.runtimeTabs[tabId] === undefined) {
          this.runtimeTabs[tabId] = 0
        } else {
          console.error('Please assign a unique "id" attribute to each tab component on page "' + this.runtimeUrl + '"!')
        }
        if (this.$$(elTab).hasClass('active')) {
          this.runtimeActiveTab = tabId
        }
      }.bind(this))

      // Attach tab listener
      if (this.runtimeTabs) {
        this.$$(this.$el).on('tab:show', function (eTab) {
          this.runtimeActiveTab = this.$$(eTab.target).attr('id')
          this.saveRuntime()
        }.bind(this))
      }

      // Attach scroll position listener
      if (!this.runtimeTabs) {
        this.$$(this.$el).find('.page-content').on('scroll', function (ePageContent) {
          this.runtimeScrollPosition = ePageContent.target.scrollTop
          this.saveRuntime()
        }.bind(this))
      } else {
        for (let tab in this.runtimeTabs) {
          this.$$(this.$el).find('.tab.page-content#' + tab).on('scroll', function (ePageContent) {
            this.runtimeTabs[tab] = ePageContent.target.scrollTop
            this.saveRuntime()
          }.bind(this))
        }
      }

      // Restore initial runtime
      if (initialRuntime) {
        // Data
        for (let el in initialRuntime) {
          if (!/^runtime(.*)/.test(el)) {
            this.$data[el] = initialRuntime[el]
          }
        }

        // Tabs, scroll position
        if (initialRuntime.runtimeTabs) {
          setTimeout(function () {
            this.$f7.showTab('.tab#' + initialRuntime.runtimeActiveTab, false)
          }.bind(this), 0)
          for (let tab in initialRuntime.runtimeTabs) {
            setTimeout(function () {
              this.$$(this.$el).find('.tab#' + tab).scrollTop(initialRuntime.runtimeTabs[tab])
            }.bind(this), 0)
          }
        } else {
          this.$$(this.$el).find('.page-content').scrollTop(initialRuntime.runtimeScrollPosition)
        }
      }

      // Save page in local storage
      this.saveRuntime()
    }
  },

  // Update runtime on Dom update
  beforeUpdate: function () {
    this.saveRuntime()
  },

  // Remove page from views and local storage on destroy
  beforeDestroy: function () {
    if (this.runtimePageId) {
      let views = window.localStorage.views ? JSON.parse(window.localStorage.views) : {}
      views[this.runtimeView].splice(this.runtimePageNo, 1)
      window.localStorage.views = JSON.stringify(views)
      window.localStorage.removeItem(this.runtimePageId)
    }
  }

}
