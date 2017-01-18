<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Left Panel -->
    <f7-panel left reveal layout="dark">
      <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true">
        <f7-navbar title="Left Panel"></f7-navbar>
        <f7-pages>
          <f7-page>
            <f7-block inner>
              <p>Left panel content goes here</p>
            </f7-block>
            <f7-block-title>Load page in panel</f7-block-title>
            <f7-list>
              <f7-list-item link="about" title="About"></f7-list-item>
              <f7-list-item link="form" title="Form"></f7-list-item>
            </f7-list>
            <f7-block-title>Load page in main view</f7-block-title>
            <f7-list>
              <f7-list-item link="about" title="About" link-view="#main-view" link-close-panel></f7-list-item>
              <f7-list-item link="form" title="Form" link-view="#main-view" link-close-panel></f7-list-item>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-panel>

    <!-- Right Panel -->
    <f7-panel right cover layout="dark">
      <f7-view id="right-panel-view" navbar-through :dynamic-navbar="true">
        <f7-navbar title="Right Panel" sliding></f7-navbar>
        <f7-pages>
          <f7-page>
            <f7-block>
              <p>Right panel content goes here</p>
            </f7-block>
            <f7-block-title>Load page in panel</f7-block-title>
            <f7-list>
              <f7-list-item link="about" title="About"></f7-list-item>
              <f7-list-item link="form" title="Form"></f7-list-item>
            </f7-list>
            <f7-block-title>Load page in main view</f7-block-title>
            <f7-list>
              <f7-list-item link="about" title="About" link-view="#main-view" link-close-panel></f7-list-item>
              <f7-list-item link="form" title="Form" link-view="#main-view" link-close-panel></f7-list-item>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-panel>

    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" navbar-through :dynamic-navbar="true" main>
        <!-- Navbar -->
        <f7-navbar>
          <f7-nav-left>
            <f7-link icon="icon-bars" open-panel="left"></f7-link>
          </f7-nav-left>
          <f7-nav-center sliding>Framework7</f7-nav-center>
          <f7-nav-right>
            <f7-link icon="icon-bars" open-panel="right"></f7-link>
          </f7-nav-right>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <f7-page>
            <f7-block inner inset style="text-align: center">
              <p><b>For native App feeling, pin this page to your homescreen and reopen it!</b></p>
            </f7-block>
            <f7-block-title>Test pages</f7-block-title>            
            <f7-list>
              <f7-list-item link="about" title="About"></f7-list-item>
              <f7-list-item link="form" title="Form"></f7-list-item>
              <f7-list-item link="dynamic-route/blog/45/post/125?foo=bar#about" title="Dynamic Route"></f7-list-item>
              <f7-list-item link="image" title="Icon & Image" badge="new" badge-color="green"></f7-list-item>
              <f7-list-item link="localStorage" title="LocalStorage ToDo" badge="new" badge-color="green"></f7-list-item>
              <!--<f7-list-item link="firebase" title="Firebase ToDo" badge="wip" badge-color="red"></f7-list-item>-->
              <f7-list-item link="multipleLanguages" title="Multiple languages" badge="new" badge-color="green"></f7-list-item>
              <f7-list-item link="https://framework7.io/kitchen-sink-ios" title="iOS Showcase" link-external></f7-list-item>
              <f7-list-item link="https://framework7.io/kitchen-sink-material" title="Material Showcase" link-external></f7-list-item>
            </f7-list>
            <f7-block-title>Side Panels</f7-block-title>
            <f7-block>
              <f7-grid>
                <f7-col width="50">
                  <f7-button open-panel="left">Left Panel</f7-button>
                </f7-col>
                <f7-col width="50">
                  <f7-button open-panel="right">Right Panel</f7-button>
                </f7-col>
              </f7-grid>
            </f7-block>
            <f7-block-title>Modals</f7-block-title>
            <f7-block>
              <f7-grid>
                <f7-col width="50">
                  <f7-button open-popup="#popup">Popup</f7-button>
                </f7-col>
                <f7-col width="50">
                  <f7-button open-login-screen="#login-screen">Login Screen</f7-button>
                </f7-col>
              </f7-grid>
            </f7-block>
            <f7-block style="text-align: center">
              <f7-link href="https://github.com/scriptPilot/app-framework" external>
                <f7-icon fa="github"></fa-icon> App Framework - v{{$root.version}}
              </f7-link>
            </f7-block>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>

    <!-- Popup -->
    <f7-popup id="popup">
      <f7-view navbar-fixed>
        <f7-pages>
          <f7-page>
            <f7-navbar title="Popup">
              <f7-nav-right>
                <f7-link close-popup>Close</f7-link>
              </f7-nav-right>
            </f7-navbar>
            <f7-block>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, architecto. Cupiditate laudantium rem nesciunt numquam, ipsam. Voluptates omnis, a inventore atque ratione aliquam. Omnis iusto nemo quos ullam obcaecati, quod.</f7-block>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-popup>

    <!-- Login Screen -->
    <f7-login-screen id="login-screen">
      <f7-view>
        <f7-pages>
          <f7-page login-screen>
            <f7-login-screen-title>Login</f7-login-screen-title>
            <f7-list form>
              <f7-list-item>
                <f7-label>Username</f7-label>
                <f7-input name="username" placeholder="Username" type="text"></f7-input>
              </f7-list-item>
              <f7-list-item>
                <f7-label>Password</f7-label>
                <f7-input name="password" type="password" placeholder="Password"></f7-input>
              </f7-list-item>
            </f7-list>
            <f7-list>
              <f7-list-button title="Sign In" close-login-screen></f7-list-button>
              <f7-list-label>
                <p>Click Sign In to close Login Screen</p>
              </f7-list-label>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-login-screen>

  </div>
</template>

<script>
require('./images/test.jpg')
module.exports = {}
</script>