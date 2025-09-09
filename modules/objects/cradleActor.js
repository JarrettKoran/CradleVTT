export default class cradleActor extends Actor {
  prepareData() {
    super.prepareData();
  }

  preapreDriverData() {
    const actorData = this.system;

    this._preparePlayerCharacterData(actorData);
  }

  _preparePlayerCharacterData(actorData) {
    this._setCharacterValues(actorData);
  }

  async _setCharacterValues(data) {
    // Calculation of values here
  }

  setNote(note) {
    this.update({ 'system.note': note });
  }

  addLogEntry(Entry) {
    let log = this.system.log;
    log.push(Entry);
    this.update({ 'system.log': log });
  }

  /**
   * Automatically calculate derived values before an Actor update occurs.
   * @param {object} changed The differential data that is being changed.
   * @param {object} options The options for the update.
   * @param {string} user The id of the user performing the update.
   */
  _preUpdate(changed, options, user) {
    super._preUpdate(changed, options, user);

    // Check if the data we need to recalculate the total is part of the update
    if (changed.system?.abilityScores) {
      this._calculateAbilityScores(changed);
    }
  }

  /**
   * A helper function to calculate and update ability score totals.
   * This modifies the update data directly.
   * @param {object} changed The differential data that is being changed.
   */
  _calculateAbilityScores(changed) {
    console.log('wadu hek', changed);
    const physicalScores = changed.system.abilityScores.physical;

    // Check if strength scores are being updated
    if (physicalScores?.strength) {
      // Get the current values from the actor, and merge in any changes
      const base =
        physicalScores.strength.base ??
        this.system.abilityScores.physical.strength.base;
      const raised =
        physicalScores.strength.raised ??
        this.system.abilityScores.physical.strength.raised;
      const bonus =
        physicalScores.strength.bonus ??
        this.system.abilityScores.physical.strength.bonus;

      // Calculate the new total and embed it in the update data
      foundry.utils.setProperty(
        changed,
        'system.abilityScores.physical.strength.total',
        base + raised + bonus,
      );
    }
    if (physicalScores?.agility) {
      const base =
        physicalScores.agility.base ??
        this.system.abilityScores.physical.agility.base;
      const raised =
        physicalScores.agility.raised ??
        this.system.abilityScores.physical.agility.raised;
      const bonus =
        physicalScores.agility.bonus ??
        this.system.abilityScores.physical.agility.bonus;

      foundry.utils.setProperty(
        changed,
        'system.abilityScores.physical.agility.total',
        base + raised + bonus,
      );
      foundry.utils.setProperty(
        changed,
        'system.baseValues.armorClass.physical',
        10 + base + raised + bonus,
      );
    }

    const mentalScores = changed.system.abilityScores.mental;

    if (mentalScores?.intellect) {
      const base =
        mentalScores.intellect.base ??
        this.system.abilityScores.physical.intellect.base;
      const raised =
        mentalScores.intellect.raised ??
        this.system.abilityScores.physical.intellect.raised;
      const bonus =
        mentalScores.intellect.bonus ??
        this.system.abilityScores.physical.intellect.bonus;

      foundry.utils.setProperty(
        changed,
        'system.abilityScores.physical.intellect.total',
        base + raised + bonus,
      );
    }

    if (mentalScores?.willpower) {
      const base =
        mentalScores.willpower.base ??
        this.system.abilityScores.physical.willpower.base;
      const raised =
        mentalScores.willpower.raised ??
        this.system.abilityScores.physical.willpower.raised;
      const bonus =
        mentalScores.willpower.bonus ??
        this.system.abilityScores.physical.willpower.bonus;

      foundry.utils.setProperty(
        changed,
        'system.abilityScores.physical.willpower.total',
        base + raised + bonus,
      );
      foundry.utils.setProperty(
        changed,
        'system.baseValues.armorClass.mental',
        10 + base + raised + bonus,
      );
    }

    const spiritualScores = changed.system.abilityScores.spiritual;

    if (spiritualScores?.awareness) {
      const base =
        spiritualScores.awareness.base ??
        this.system.abilityScores.physical.awareness.base;
      const raised =
        spiritualScores.awareness.raised ??
        this.system.abilityScores.physical.awareness.raised;
      const bonus =
        spiritualScores.awareness.bonus ??
        this.system.abilityScores.physical.awareness.bonus;

      foundry.utils.setProperty(
        changed,
        'system.abilityScores.physical.awareness.total',
        base + raised + bonus,
      );
    }

    if (spiritualScores?.presence) {
      const base =
        spiritualScores.presence.base ??
        this.system.abilityScores.physical.presence.base;
      const raised =
        spiritualScores.presence.raised ??
        this.system.abilityScores.physical.presence.raised;
      const bonus =
        spiritualScores.presence.bonus ??
        this.system.abilityScores.physical.presence.bonus;

      foundry.utils.setProperty(
        changed,
        'system.abilityScores.physical.presence.total',
        base + raised + bonus,
      );
      foundry.utils.setProperty(
        changed,
        'system.baseValues.armorClass.spiritual',
        10 + base + raised + bonus,
      );
    }
  }
}
