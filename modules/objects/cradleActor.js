export default class cradleActor extends Actor {
  prepareData() {
    super.prepareData()
  }

  preapreDriverData() {
    const actorData = this.system

    this._preparePlayerCharacterData(actorData)
  }

  _preparePlayerCharacterData(actorData) {
    this._setCharacterValues(actorData)
  }

  async _setCharacterValues(data) {
    // Calculation of values here
  }

  setNote(note) {
    this.update({ 'system.note': note })
  }

  addLogEntry(Entry) {
    let log = this.system.log
    log.push(Entry)
    this.update({ 'system.log': log })
  }
}
