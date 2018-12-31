<template>
  <f7-page>

    <!-- Navbar and backlink -->
    <f7-navbar title="Private Firebase Storage" back-link="Back" sliding />

    <!-- Description box -->
    <f7-block>
      Enter some notes, upload a photo, login from multiple devices and see how everything is synchronized in real time.
    </f7-block>

    <!-- Private notes text field -->
    <f7-list form>
      <f7-list-item>
        <f7-input name="notes" :value="notes" @change="updateNotes" type="textarea" placeholder="Your private Notes ..."></f7-input>
      </f7-list-item>
    </f7-list>

    <!-- Image uploader component -->
    <f7-block v-if="$root.user">
      <image-uploader
        :store="'privateData/' + $root.user.uid"
        :db="'privateData/' + $root.user.uid + '/photo'" />
    </f7-block>

    <!-- Image -->
    <f7-block inset v-if="photo">
      <img :src="photo" width="100%" />
    </f7-block>

  </f7-page>
</template>
<script>
  module.exports = {
    // Set initial data
    data: function () {
      return {
        notes: '',
        photo: null
      }
    },
    // Update notes and photo from Firebase
    mounted: function () {
      window.db('privateData/' + window.user.uid).on('value', snapshot => {
        let data = snapshot.val()
        if (data) {
          this.notes = data.notes
          this.photo = data.photo
        }
      })
    },
    // Update notes after change
    methods: {
      updateNotes: function (e) {
        window.db('privateData/' + window.user.uid + '/notes')
          .set(e.target.value)
          .catch(() => {
            window.f7.alert('Cannot update the notes :-(<br />Please try again later', 'Trouble with Firebase')
          })
      }
    }
  }
</script>
