const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export default class cradleCharacterSheet extends api.HandlebarsApplicationMixin(
  sheets.ActorSheetV2,
) {
  sheetContext = {};

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
  };

  static PARTS = {
    header: {
      template: 'systems/cradle/templates/sheets/character/header.hbs',
    },
    sidebar: {
      template: 'systems/cradle/templates/sheets/character/sidebar.hbs',
    },
  };

  get title() {
    return this.actor.name;
  }

  /** @override */
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);

    if (this.document.limited) options.parts = ['header'];
    else options.parts = ['header', 'sidebar'];
  }

  /** @override */
  async _prepareContext(options) {
    const baseData = await super._prepareContext();

    let context = {
      owner: baseData.document.isOwner,
      editable: baseData.editable,
      actor: baseData.document,
      system: baseData.document.system,
      items: baseData.document.items,
      config: CONFIG.CRADLE,
      isGM: baseData.user.isGM,
      effects: baseData.document.effects,
    };

    context.levels = {};
    for (let i = 1; i <= 20; i++) {
      context.levels[i] = i;
    }

    context.sacredArtistClass = null;
    for (const item of context.items) {
      if (item.type === 'class') {
        context.sacredArtistClass = item;
        break;
      }
    }

    this.sheetContext = context;

    return context;
  }

  /** @override */
  _onRender(context, options) {
    const initialTab = this.activeTab || 'tab1';

    const tabs = new foundry.applications.ux.Tabs({
      navSelector: '.tabs',
      contentSelector: '.content',
      initial: initialTab,
      callback: (event, tabs, activeTab) => {
        this.activeTab = activeTab;
      },
    });
    tabs.bind(this.element);

    const initialTab2 = this.activeTab2 || 'tab2-1';
    const tabs2 = new foundry.applications.ux.Tabs({
      navSelector: '.tabs2',
      contentSelector: '.content2',
      initial: initialTab2,
      callback: (event, tabs, activeTab) => {
        this.activeTab2 = activeTab;
      },
    });
    tabs2.bind(this.element);
  }
}
