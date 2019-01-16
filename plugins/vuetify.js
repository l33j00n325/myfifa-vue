import Vue from 'vue'
import Vuetify, {
  VApp,
  VNavigationDrawer,
  // VFooter,
  VList,
  VBtn,
  VIcon,
  // VGrid,
  VToolbar,
  VDialog,
  VCard,
  VTextField,
  VAlert,
  VForm,
  VRadioGroup,
  VTooltip,
  VMenu,
  VDatePicker,
  VSnackbar,
  VDataTable,
  VDataIterator,
  VBreadcrumbs,
  VSelect,
  VCheckbox,
  VDivider,
  VCombobox,
  VExpansionPanel,
  VSubheader,
  VProgressCircular,
  VInput,
  VTimeline,
  VBtnToggle
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'
import VGrid from 'vuetify/lib/components/VGrid'
import transitions from 'vuetify/lib/components/transitions'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme: {
    primary: '#4caf50',
    secondary: '#4caf50',
    tertiary: '#495057',
    accent: '#82B1FF',
    error: '#f55a4e',
    info: '#00d3ee',
    success: '#5cb860',
    warning: '#ffa21a'
  },
  components: {
    VApp,
    VNavigationDrawer,
    // VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VDialog,
    VCard,
    VTextField,
    VAlert,
    VForm,
    VRadioGroup,
    VTooltip,
    VMenu,
    VDatePicker,
    VSnackbar,
    VDataTable,
    VDataIterator,
    VBreadcrumbs,
    VSelect,
    VCheckbox,
    VDivider,
    VCombobox,
    VExpansionPanel,
    VSubheader,
    VProgressCircular,
    VInput,
    VTimeline,
    VBtnToggle,
    transitions
  },
  directives: {
    Ripple
  }
})
