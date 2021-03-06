<template>
  <base-form
    :submit="submit"
    :reset-after-submit="false"
  >
    <template #default="{ loading, valid }">
      <v-card>
        <v-toolbar
          color="primary"
          dense
        >
          <v-toolbar-title class="font-weight-light white--text">
            Profile
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="user.full_name"
                  label="Name"
                  :rules="rulesFor.full_name"
                  spellcheck="false"
                  autocapitalize="words"
                  autocomplete="off"
                  autocorrect="off"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="user.username"
                  label="Username"
                  :rules="rulesFor.username"
                  spellcheck="false"
                  autocapitalize="off"
                  autocorrect="off"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="user.email"
                  label="Email Address"
                  :rules="rulesFor.email"
                  type="email"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
            color="primary"
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
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import pick from 'lodash.pick'
  import { isRequired, isEmail } from '@/functions'

  export default {
    name: 'UserProfile',
    data: () => ({
      user: {
        id: null,
        full_name: null,
        username: null,
        email: null
      },
      rulesFor: {
        full_name: [isRequired('Name')],
        username: [isRequired('Username')],
        email: [
          isRequired('Email Address'),
          isEmail
        ]
      }
    }),
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    },
    mounted () {
      this.user = pick(this.currentUser, [
        'id',
        'full_name',
        'username',
        'email'
      ])
    },
    methods: {
      ...mapMutations('broadcaster', [
        'announce'
      ]),
      ...mapActions('user', {
        updateUser: 'update'
      }),
      async submit () {
        try {
          this.loading = true
          await this.updateUser(this.user)
          this.announce({
            message: 'Profile has been updated!',
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
