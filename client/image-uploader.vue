<template>
  <div>

    <!-- Non-native application input field -->
    <input type="file" accept="image/*;capture=camera" style="display: none" @change="handleFileChanged" />

    <!-- Native application actions -->
    <f7-actions :opened="actionsOpened" @actions:closed="actionsOpened=false">
      <f7-actions-group>
        <f7-actions-button @click="handleTakePhotoClicked">Take photo</f7-actions-button>
        <f7-actions-button @click="handleSelectPhotoClicked">Select photo</f7-actions-button>
      </f7-actions-group>
      <f7-actions-group>
        <f7-actions-button color="red">Cancel</f7-actions-button>
      </f7-actions-group>
    </f7-actions>

    <!-- Upload button -->
    <f7-button @click="handleUploadClicked" raised>Upload photo</f7-button>

  </div>
</template>
<script>
  export default {
    props: {
      store: {
        type: String,
        required: true
      },
      db: {
        type: String,
        default: ''
      },
      size: {
        type: Number,
        default: 1024
      }
    },
    data: function () {
      return {
        actionsOpened: false
      }
    },
    methods: {
      handleUploadClicked: function (e) {
        // User is online
        if (navigator.onLine) {
          // Native application
          if (window.cordova) {
            // Show actions
            this.actionsOpened = true
          // No native application
          } else {
            // Click hidden file selection field
            window.Dom7(e.target).parent().find('input').click()
          }
        // User is offline
        } else {
          window.f7.addNotification({
            title: 'Offline',
            message: 'This action is not possible in offline mode.',
            hold: 3000,
            closeIcon: false
          })
        }
      },
      handleFileChanged: function (e) {
        let file = e.target.files[0]
        if (file) {
          window.f7.showIndicator()
          window.store(this.store).put(file)
            .then(() => {
              this.handleFileUploaded()
            })
            .catch(() => {
              window.f7.hideIndicator()
              window.f7.alert('Cannot upload the photo :-(<br />Please try again later', 'Trouble with Firebase')
            })
        } else {
          window.f7.addNotification({
            title: 'Select photo',
            message: 'Please select a photo first.',
            hold: 3000,
            closeIcon: false
          })
        }
      },
      handleTakePhotoClicked: function () {
        this.handlePhotoUploadFromDevice('camera')
      },
      handleSelectPhotoClicked: function () {
        this.handlePhotoUploadFromDevice('gallery')
      },
      handlePhotoUploadFromDevice: function (type) {
        let self = this
        // Camera and file plugins available
        if (navigator.camera && window.resolveLocalFileSystemURL) {
          navigator.camera.getPicture(function (imageUri) {
            window.f7.showIndicator()
            window.resolveLocalFileSystemURL(imageUri, function (fileEntry) {
              fileEntry.file(function (file) {
                let reader = new window.FileReader()
                reader.onloadend = function () {
                  let blob = new window.Blob([new Uint8Array(this.result)], {type: file.type})
                  window.store(self.store).put(blob, {contentType: blob.type})
                    .then(() => {
                      self.handleFileUploaded()
                    })
                    .catch(() => {
                      window.f7.hideIndicator()
                      window.f7.alert('Cannot upload the photo :-(<br />Please try again later', 'Trouble with Firebase')
                    })
                }
                reader.readAsArrayBuffer(file)
              })
            })
          }, function (err) {
            if (err !== 'no image selected') {
              window.f7.alert(err, 'Error')
            }
          }, {
            sourceType: window.Camera.PictureSourceType[type === 'gallery' ? 'PHOTOLIBRARY' : 'CAMERA'],
            destinationType: window.Camera.DestinationType.FILE_URI,
            targetWidth: self.size,
            targetHeight: self.size
          })
        // Camera plugin not available
        } else if (!navigator.camera) {
          window.f7.alert('Please add "cordova-plugin-camera" to useCordovaPlugins option in the configuration file.')
        // File plugin not available
        } else {
          window.f7.alert('Please add "cordova-plugin-file" to useCordovaPlugins option in the configuration file.')
        }
      },
      handleFileUploaded: function () {
        if (this.db !== '') {
          // Get download URL
          window.store(this.store).getDownloadURL()
            .then(url => {
              // Save download URL to user data
              window.db(this.db).set(url)
                .then(() => {
                  window.f7.hideIndicator()
                })
                .catch(() => {
                  window.f7.hideIndicator()
                  window.f7.alert('Cannot update the photo url :-(<br />Please try again later', 'Trouble with Firebase')
                })
            })
            .catch(() => {
              window.f7.hideIndicator()
              window.f7.alert('Cannot load the photo url :-(<br />Please try again later', 'Trouble with Firebase')
            })
        } else {
          window.f7.hideIndicator()
        }
      }
    }
  }
</script>
