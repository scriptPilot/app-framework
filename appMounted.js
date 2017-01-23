module.exports = function () {
  
  // Remember panel
  this.$$(document).on('panel:opened panel:closed', function (ePanel) {
    if (ePanel.type === 'panel:opened') {
      localStorage.panel = /left/.test(ePanel.path[0]._prevClass) ? 'left' : 'right'
    } else {
      localStorage.removeItem('panel')
    }
  })
  
  // Remember popup
  this.$$(document).on('popup:opened popup:closed', function (ePopup) {
    if (ePopup.type === 'popup:opened') {
      localStorage.popup = this.$$(ePopup.target).attr('id')
    } else {
      localStorage.removeItem('popup')
    }
  }.bind(this))
  
  // Remember loginScreen
  this.$$(document).on('loginscreen:opened loginscreen:closed', function (eLoginScreen) {
    if (eLoginScreen.type === 'loginscreen:opened') {
      localStorage.loginScreen = this.$$(eLoginScreen.target).attr('id')
    } else {
      localStorage.removeItem('loginScreen')
    }
  }.bind(this))
  
  // Remember form focus
  this.$$(document).on('focusin focusout', function (eFocus) {
    let focusId = this.$$(eFocus.target).attr('name')
    if (eFocus.type === 'focusin' && focusId !== null && focusId !== '') {
      localStorage.formFocus = focusId
    } else {
      localStorage.removeItem('formFocus')
    }
  }.bind(this))
  
  // Restore pages
  if (localStorage.views) {
    let views = JSON.parse(localStorage.views)
    localStorage.removeItem('views')
    this.$$('.view').each(function (viewNo, viewEl) {
      let viewId = this.$$(viewEl).attr('id')
      for (let pageNo in views[viewId]) {
        setTimeout(function () {
          this.$f7.views[viewNo].router.load({
            url: views[viewId][pageNo].url,
            animatePages: false
          })
        }.bind(this), 0)
      }
    }.bind(this))
  }    
  
  // Restore panel, popup, login screen, form focus
  setTimeout(function () {      
    if (localStorage.panel) {
      this.$f7.openPanel(localStorage.panel)
    }
    if (localStorage.popup) {
      this.$f7.popup('#' + localStorage.popup)
    }
    if (localStorage.loginScreen) {
      this.$f7.loginScreen('#' + localStorage.loginScreen)
    }
    if (localStorage.formFocus) {
      setTimeout(function () {
        let elType = this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']')[0].tagName
        if (elType === 'INPUT') {
          let val = this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').val()
          this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').val('')
          this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').focus()
          this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').val(val)
        } else {
          this.$$(this.$f7.getCurrentView().activePage.container).find('[name=' + localStorage.formFocus + ']').focus()
        }
      }.bind(this), 0)
    }
  }.bind(this), 0)   
    
  // Show app
  setTimeout(function () {
    this.$$('.framework7-root').css('visibility', 'visible')
  }.bind(this), 0)
  
}