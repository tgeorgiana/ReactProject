const io = require('socket.io-client/socket.io');
import {serverUrl} from '../core/api';
import {getLogger} from '../core/utils';
import {noteCreated, noteUpdated, noteDeleted} from './service';

window.navigator.userAgent = 'ReactNative';

const log = getLogger('NotificationClient');

const NOTE_CREATED = 'note/created';
const NOTE_UPDATED = 'note/updated';
const NOTE_DELETED = 'note/deleted';

export class NotificationClient {
  constructor(store) {
    this.store = store;
  }

  connect() {
    log(`connect...`);
    const store = this.store;
    const auth = store.getState().auth;
    this.socket = io(auth.server.url, {transports: ['websocket']});
    const socket = this.socket;
    socket.on('connect', () => {
      log('connected');
      socket
        .emit('authenticate', {token: auth.token})
        .on('authenticated', () => log(`authenticated`))
        .on('unauthorized', (msg) => log(`unauthorized: ${JSON.stringify(msg.data)}`))
    });
    socket.on(NOTE_CREATED, (note) => {
      log(NOTE_CREATED);
      store.dispatch(noteCreated(note));
    });
    socket.on(NOTE_UPDATED, (note) => {
      log(NOTE_UPDATED);
      store.dispatch(noteUpdated(note))
    });
    socket.on(NOTE_DELETED, (note) => {
      log(NOTE_DELETED);
      store.dispatch(noteDeleted(note))
    });
  };

  disconnect() {
    log(`disconnect`);
    this.socket.disconnect();
  }
}