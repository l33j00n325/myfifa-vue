<template>
  <base-form :submit="submit">
    <template #default="{ loading, valid }">
      <v-card>
        <v-toolbar
          color="warning"
          dense
        >
          <v-toolbar-title class="font-weight-light white--text">
            Change Password
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="user.current_password"
                  label="Current Password"
                  :rules="rulesFor.current_password"
                  :type="visible ? 'text' : 'password'"
                  :append-icon="`mdi-eye${visible ? '' : '-off'}`"
                  @click:append="visible = !visible"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="user.password"
                  label="New Password"
                  :rules="rulesFor.new_password"
                  :type="visible ? 'text' : 'password'"
                  :append-icon="`mdi-eye${visible ? '' : '-off'}`"
                  autocomplete="new-password"
                  @click:append="visible = !visible"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="user.password_confirmation"
                  label="Confirm Password"
                  :rules="rulesFor.password_confirmation"
                  :type="visible ? 'text' : 'password'"
                  :append-icon="`mdi-eye${visible ? '' : '-off'}`"
                  autocomplete="new-password"
                  @click:append="visible = !visible"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            color="warning"
            text
            large
            :disabled="!valid"
            :loading="loading"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </base-form>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { isRequired } from '@/functions'

  export default {
    name: 'UserPasswordForm',
    data: () => ({
      user: {
        id: null,
        current_password: null,
        password: null,
        password_confirmation: null
      },
      rulesFor: {
        current_password: [isRequired('Current Password')],
        new_password: [isRequired('New Password')],
        password_confirmation: [isRequired('Password Confirmation')]
      },
      visible: false
    }),
    computed: mapState([
      'currentUser'
    ]),
    mounted () {
      this.user.id = this.currentUser.id
    },
    methods: {
      ...mapMutations('broadcaster', [
        'announce'
      ]),
      ...mapActions('user', [
        'changePassword'
      ]),
      async submit () {
        try {
          this.loading = true
          await this.changePassword(this.user)
          this.announce({
            message: 'Password has been changed!',
            color: 'success'
          })
        } catch ({ response }) {
          let errorMessage = ''
          if (response) {
            const { data: { errors } } = response
            for (const attribute in errors) {
              const attributeTitle = attribute
                .split('_')
                .map(token => `${token[0].toUpperCase()}${token.slice(1)}`)
              errorMessage = `${attributeTitle} ${errors[attribute][0]}`
              break
            }
          } else {
            errorMessage = 'API is not enabled.'
          }
          this.announce({
            message: errorMessage,
            color: 'red'
          })
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
