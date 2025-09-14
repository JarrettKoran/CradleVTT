import { CRADLE } from './modules/config.js';
import cradleActor from './modules/objects/cradleActor.js';
import cradleCharacterSheet from './modules/sheets/cradleCharacterSheet.js';
import cradleClassSheet from './modules/sheets/cradleClassSheet.js';

Hooks.once('init', async () => {
  console.log('CRADLE | Initializing Iteration 110 Cradle');

  CONFIG.CRADLE = CRADLE;
  CONFIG.INIT = true;
  CONFIG.Actor.documentClass = cradleActor;

  Handlebars.registerHelper('barWidth', (value, max) => {
    const numValue = Number(value) || 0;
    const numMax = Number(max) || 0;

    if (numMax === 0) {
      return 0;
    }

    const pct = Math.round((numValue / numMax) * 100);
    return Math.clamp(pct, 0, 100);
  });

  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
  DocumentSheetConfig.unregisterSheet(
    Actor,
    'core',
    foundry.appv1.sheets.ActorSheet,
  );
  DocumentSheetConfig.registerSheet(Actor, 'cradle', cradleCharacterSheet, {
    types: ['character'],
    makeDefault: true,
    label: 'CRADLE.SheetClassCharacter',
  });

  DocumentSheetConfig.unregisterSheet(
    Item,
    'core',
    foundry.appv1.sheets.ItemSheet,
  );
  DocumentSheetConfig.registerSheet(Item, 'cradle', cradleClassSheet, {
    types: ['class'],
    makeDefault: true,
    label: 'CRADLE.SheetItemClass',
  });

  preloadHandlebardsTemplates();
  registerHandlebarsHelpers();
});

Hooks.once('ready', async () => {
  CONFIG.INIT = false;
  if (!game.user.isGM) return;
});

Hooks.on('createActor', async (actor, options, userId) => {
  if (actor.type === 'character' && game.user.id === userId) {
    const compendium = game.packs.get('cradle.classes');
    if (!compendium) {
      console.error('Cradle | Could not find the class compendium!');
      return;
    }

    const classItem = await compendium.getDocument(
      compendium.index.find(i => i.name === 'Sacred Artist')?._id,
    );

    if (classItem) {
      await actor.createEmbeddedDocuments('Item', [classItem.toObject()]);
      ui.notifications.info(`Added "Sacred Artist" class to ${actor.name}.`);
    }
  }
});

function preloadHandlebardsTemplates() {
  const templatePaths = [
    'systems/cradle/templates/partials/character-sheet-character.hbs',
    'systems/cradle/templates/partials/character-sheet-background.hbs',
    'systems/cradle/templates/partials/character-sheet-skill.hbs',
    'systems/cradle/templates/partials/character-sheet-combat.hbs',
    'systems/cradle/templates/partials/character-sheet-progression.hbs',
    'systems/cradle/templates/partials/character-sheet-edit.hbs',
  ];

  return foundry.applications.handlebars.loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper('equals', function (v1, v2) {
    return v1 === v2;
  });
  Handlebars.registerHelper('contains', function (element, search) {
    return element.includes(search);
  });
  Handlebars.registerHelper('concat', function (s1, s2, s3 = '') {
    return s1 + s2 + s3;
  });
  Handlebars.registerHelper('isGreater', function (p1, p2) {
    return p1 > p2;
  });
  Handlebars.registerHelper('isEqualORGreater', function (p1, p2) {
    return p1 >= p2;
  });
  Handlebars.registerHelper('ifOR', function (conditional1, conditional2) {
    return conditional1 || conditional2;
  });
  Handlebars.registerHelper('doLog', function (value) {
    return console.log(value);
  });
  Handlebars.registerHelper('toBoolean', function (string) {
    return string === 'true';
  });
  Handlebars.registerHelper('for', function (from, to, incr, content) {
    let result = '';

    for (let i = from; i < to; i += incr) result += content.fn(i);

    return result;
  });
  Handlebars.registerHelper('times', function (n, content) {
    let result = '';

    for (let i = 0; i < n; i++) result += content.fn(i);

    return result;
  });
  Handlebars.registerHelper('notEmpty', function (value) {
    if (value == 0 || value == '0') return true;
    if (value == null || value == '') return false;
    return true;
  });
}
