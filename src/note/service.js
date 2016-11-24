import {action, getLogger, errorPayload} from '../core/utils';
import {search, save} from './resource';

const log = getLogger('note/service');

// Loading notes
const LOAD_NOTES_STARTED = 'note/loadStarted';
const LOAD_NOTES_SUCCEEDED = 'note/loadSucceeded';
const LOAD_NOTES_FAILED = 'note/loadFailed';
const CANCEL_LOAD_NOTES = 'note/cancelLoad';

// Saving notes
const SAVE_NOTE_STARTED = 'note/saveStarted';
const SAVE_NOTE_SUCCEEDED = 'note/saveSucceeded';
const SAVE_NOTE_FAILED = 'note/saveFailed';
const CANCEL_SAVE_NOTE = 'note/cancelSave';

// Note notifications
const NOTE_DELETED = 'note/deleted';

export const loadNotes = () => async(dispatch, getState) => {
  log(`loadNotes...`);
  const state = getState();
  const noteState = state.note;
  try {
    dispatch(action(LOAD_NOTES_STARTED));
    const notes = await search(state.auth.server, state.auth.token)
    log(`loadNotes succeeded`);
    if (!noteState.isLoadingCancelled) {
      dispatch(action(LOAD_NOTES_SUCCEEDED, notes));
    }
  } catch(err) {
    log(`loadNotes failed`);
    if (!noteState.isLoadingCancelled) {
      dispatch(action(LOAD_NOTES_FAILED, errorPayload(err)));
    }
  }
};

export const cancelLoadNotes = () => action(CANCEL_LOAD_NOTES);

export const saveNote = (note) => async(dispatch, getState) => {
  log(`saveNote...`);
  const state = getState();
  const noteState = state.note;
  try {
    dispatch(action(SAVE_NOTE_STARTED));
    const savedNote = await save(state.auth.server, state.auth.token, note)
    log(`saveNote succeeded`);
    if (!noteState.isSavingCancelled) {
      dispatch(action(SAVE_NOTE_SUCCEEDED, savedNote));
    }
  } catch(err) {
    log(`saveNote failed`);
    if (!noteState.isSavingCancelled) {
      dispatch(action(SAVE_NOTE_FAILED, errorPayload(err)));
    }
  }
};

export const cancelSaveNote = () => action(CANCEL_SAVE_NOTE);

export const noteCreated = (createdNote) => action(SAVE_NOTE_SUCCEEDED, createdNote);
export const noteUpdated = (updatedNote) => action(SAVE_NOTE_SUCCEEDED, updatedNote);
export const noteDeleted = (deletedNote) => action(NOTE_DELETED, deletedNote);

export const noteReducer = (state = {items: [], isLoading: false, isSaving: false}, action) => { //newState (new object)
  let items, index;
  switch (action.type) {
    // Loading
    case LOAD_NOTES_STARTED:
      return {...state, isLoading: true, isLoadingCancelled: false, issue: null};
    case LOAD_NOTES_SUCCEEDED:
      return {...state, items: action.payload, isLoading: false};
    case LOAD_NOTES_FAILED:
      return {...state, issue: action.payload.issue, isLoading: false};
    case CANCEL_LOAD_NOTES:
      return {...state, isLoading: false, isLoadingCancelled: true};
    // Saving
    case SAVE_NOTE_STARTED:
      return {...state, isSaving: true, isSavingCancelled: false, issue: null};
    case SAVE_NOTE_SUCCEEDED:
      items = [...state.items];
      index = items.findIndex((i) => i._id == action.payload._id);
      if (index != -1) {
        items.splice(index, 1, action.payload);
      } else {
        items.push(action.payload);
      }
      return {...state, items, isSaving: false};
    case SAVE_NOTE_FAILED:
      return {...state, issue: action.payload.issue, isSaving: false};
    case CANCEL_SAVE_NOTE:
      return {...state, isSaving: false, isSavingCancelled: true};
    // Notifications
    case NOTE_DELETED:
      items = [...state.items];
      const deletedNote = action.payload;
      index = state.items.findIndex((note) => note._id == deletedNote._id);
      if (index != -1) {
        items.splice(index, 1);
        return {...state, items};
      }
      return state;
    default:
      return state;
  }
};