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

    context = this.calculateAbilityScores(context);

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

  calculateAbilityScores(context) {
    console.log('fuck shroud', context);

    let str =
      context.system.abilityScores.physical.strength.base +
      context.system.abilityScores.physical.strength.raised +
      context.system.abilityScores.physical.strength.bonus;

    context.system.abilityScores.physical.strength.total = str;

    let agi =
      context.system.abilityScores.physical.agility.base +
      context.system.abilityScores.physical.agility.raised +
      context.system.abilityScores.physical.agility.bonus;

    context.system.abilityScores.physical.agility.total = agi;

    let int =
      context.system.abilityScores.mental.intellect.base +
      context.system.abilityScores.mental.intellect.raised +
      context.system.abilityScores.mental.intellect.bonus;

    context.system.abilityScores.mental.intellect.total = int;

    let wil =
      context.system.abilityScores.mental.willpower.base +
      context.system.abilityScores.mental.willpower.raised +
      context.system.abilityScores.mental.willpower.bonus;

    context.system.abilityScores.mental.willpower.total = wil;

    let awa =
      context.system.abilityScores.spiritual.awareness.base +
      context.system.abilityScores.spiritual.awareness.raised +
      context.system.abilityScores.spiritual.awareness.bonus;

    context.system.abilityScores.spiritual.awareness.total = awa;

    let pre =
      context.system.abilityScores.spiritual.presence.base +
      context.system.abilityScores.spiritual.presence.raised +
      context.system.abilityScores.spiritual.presence.bonus;

    context.system.abilityScores.spiritual.presence.total = pre;

    return context;
  }
}
