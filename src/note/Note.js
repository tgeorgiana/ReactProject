export class Note {
  constructor(_id, text, status, updated, version) {
    this._id = _id;
    this.text = text;
    this.status = status;
    this.updated = updated;
    this.version = version;
  }
}