export default class cradleClassSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cradle', 'sheet', 'item', 'class'],
      width: 520,
      height: 480,
      template: 'systems/cradle/templates/sheets/item/class-sheet.hbs',
    });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.feature-add').on('click', this._onAddFeature.bind(this));

    html.find('.feature-delete').on('click', this._onDeleteFeature.bind(this));
  }

  /**
   * Handle creating a new feature on the class.
   * @param {Event} event The originating click event
   */
  _onAddFeature(event) {
    event.preventDefault();
    const newFeature = {
      name: 'New Feature',
      level: 1,
      description: '',
    };
    const newFeatures = {
      ...this.item.system.features, // Copy existing features
      [foundry.utils.randomID(16)]: newFeature, // Add the new one with a random ID
    };
    this.item.update({ 'system.features': newFeatures });
  }

  /**
   * Handle deleting a feature from the class.
   * @param {Event} event The originating click event
   */
  _onDeleteFeature(event) {
    event.preventDefault();
    const featureId = event.currentTarget.dataset.featureId;
    const newFeatures = { ...this.item.system.features }; // Copy existing
    delete newFeatures[featureId]; // Delete the specified one
    this.item.update({ 'system.features': newFeatures });
  }
}
