<template>
  <f7-page>
    <f7-navbar title="App State Restoration" back-link="Back" sliding />

    <f7-block>
      <p>Scroll down, open modals or type some text and leave the focus on a form input.</p>
      <p>And then close and reopen the application.</p>
      <p>Everything will be restored immediately!</p>
    </f7-block>

    <!-- Side panels -->
    <f7-block>
      <f7-grid>
        <f7-col><f7-button raised open-panel="left">Left panel</f7-button></f7-col>
        <f7-col><f7-button raised open-panel="right">Right panel</f7-button></f7-col>
      </f7-grid>
    </f7-block>

    <!-- Action sheet -->
    <f7-actions id="demoActions">
      <f7-actions-group>
        <f7-actions-label>Whatever you want</f7-actions-label>
        <f7-actions-button @click="$f7.alert('Clicked first button')">Button 1</f7-actions-button>
        <f7-actions-button @click="$f7.alert('Clicked second button')">Button 2</f7-actions-button>
      </f7-actions-group>
      <f7-actions-group>
        <f7-actions-button color="red" bold>Cancel</f7-actions-button>
      </f7-actions-group>
    </f7-actions>
    <f7-block>
      <f7-col><f7-button raised @click="$f7.openModal('#demoActions')">Action sheet</f7-button></f7-col>
    </f7-block>

    <!-- Login screen -->
    <f7-login-screen id="demoLoginScreen">
      <f7-login-screen-title>My App</f7-login-screen-title>
      <f7-list form id="state-restoration-login-screen" inset>
        <f7-list-item>
          <f7-label>Username</f7-label>
          <f7-input type="text" name="username" placeholder="Username"></f7-input>
        </f7-list-item>
        <f7-list-item>
          <f7-label>Password</f7-label>
          <f7-input name="password" type="password" placeholder="Password"></f7-input>
        </f7-list-item>
      </f7-list>
      <f7-list inset>
        <f7-list-button title="Sign In" close-login-screen></f7-list-button>
        <f7-list-label>
          <p>Click Sign In to close Login Screen</p>
        </f7-list-label>
      </f7-list>
    </f7-login-screen>
    <f7-block>
      <f7-col><f7-button raised open-login-screen="#demoLoginScreen">Login screen</f7-button></f7-col>
    </f7-block>

    <!-- Picker -->
    <f7-picker-modal id="demoPicker" overlay>
      <f7-toolbar>
        <f7-nav-left></f7-nav-left>
        <f7-nav-right>
          <f7-link close-picker>Done</f7-link>
        </f7-nav-right>
      </f7-toolbar>
      <f7-block>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis iste qui architecto recusandae veniam delectus vero libero illo aliquid, fuga ratione vel facilis iure est fugiat sunt nihil, consectetur veritatis.</p>
      </f7-block>
    </f7-picker-modal>
    <f7-block>
      <f7-col><f7-button raised open-picker="#demoPicker">Picker modal</f7-button></f7-col>
    </f7-block>

    <!-- Popup -->
    <f7-popup id="demoPopup">
      <f7-toolbar>
        <f7-nav-left></f7-nav-left>
        <f7-nav-right>
          <f7-link close-popup>Close</f7-link>
        </f7-nav-right>
      </f7-toolbar>
      <f7-block>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis iste qui architecto recusandae veniam delectus vero libero illo aliquid, fuga ratione vel facilis iure est fugiat sunt nihil, consectetur veritatis.</p>
        <p>Itaque impedit, nam, sed reprehenderit quaerat commodi veritatis ducimus eos nisi, at aliquam dolorum alias optio natus. Sit voluptate aperiam, cupiditate repellat quod fugiat non doloribus eveniet dolorem fugit nihil.</p>
        <p>Necessitatibus minima quidem fugit corporis reprehenderit saepe facilis perspiciatis sit, consectetur nulla officia, pariatur accusantium quas voluptas. Illum placeat eligendi dolor nihil libero culpa, ex quas voluptas deleniti, unde id.</p>
      </f7-block>
    </f7-popup>
    <f7-block>
      <f7-col><f7-button raised open-popup="#demoPopup">Popup modal</f7-button></f7-col>
    </f7-block>

    <!-- Form inputs and focus -->
    <f7-list form id="state-restoration" inset>
      <f7-list-item>
        <f7-label>Text input</f7-label>
        <f7-input type="text" name="text" placeholder="Some text ..." />
      </f7-list-item>
      <f7-list-item>
        <f7-label>Select</f7-label>
        <f7-input type="select" name="select">
          <option value=""></option>
          <option value="first">First value</option>
          <option value="second">Second value</option>
          <option value="third">Third value</option>
        </f7-input>
      </f7-list-item>
    </f7-list>

  </f7-page>
</template>
