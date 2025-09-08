import { act } from 'react'

const api = foundry.applications.api
const sheets = foundry.applications.sheets

export default class cradleCharacterSheet extends api.HandlebarsApplicationMixin(
  sheets.ActorSheetV2,
) {
  sheetContext = {}

  static DEFAULT_OPTIONS = {
    tag: 'form',
    classes: ['cradle', 'sheet', 'characterSheet'],
    actions: {},
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
    },
    position: {
      width: 650,
    },
  }

  static PARTS = {
    header: {
      template: 'systems/cradle/templates/sheets/character/header.hbs',
    },
    sidebar: {
      template: 'systems/cradle/templates/sheets/character/sidebar.hbs',
    },
  }

  get title() {
    return this.actor.name
  }

  /** @override */
  _configureRenderOptions(options) {
    super._configureRenderOptions(options)

    if (this.document.limited) options.parts = ['header']
    else options.parts = ['header', 'sidebar']
  }

  /** @override */
  async _prepareContext(options) {
    const baseData = await super._prepareContext()

    const context = {
      owner: baseData.document.isOwner,
      editable: baseData.editable,
      actor: baseData.document,
      system: baseData.document.system,
      items: baseData.document.items,
      config: CONFIG.CRADLE,
      isGM: baseData.user.isGM,
      effects: baseData.document.effects,
    }

    this.sheetContext = context

    return context
  }

  /** @override */
  _onRender(context, options) {
    const tabs = new foundry.applications.ux.Tabs({
      navSelector: '.tabs',
      contentSelector: '.content',
      initial: 'tab1',
    })
    tabs.bind(this.element)

    const tabs2 = new foundry.applications.ux.Tabs({
      navSelector: '.tabs2',
      contentSelector: '.content2',
      initial: 'tab2-1',
    })
    tabs2.bind(this.element)
  }
}
