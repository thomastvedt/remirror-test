import React, { useCallback, useState } from 'react';
import {
  useEvent,
  useHelpers,
  useKeymap,
  useRemirrorContext,
} from '@remirror/react';
import { EditorState } from '@remirror/pm';
import { useDebouncedCallback } from 'use-debounce';
import { RemirrorJSON } from 'remirror';

export type SaveTrigger = 'shortcut' | 'blur' | 'inactive';

export interface PreparedDocument {
  remirrorJson: RemirrorJSON; // object, use for local storage etc.
  rawJson: string; // raw json string, send to server
  state: EditorState; // can use this to persist actual editor state, like cursor position, selected text, etc.
  trigger: SaveTrigger; // what triggered the save event?
}

interface Props {
  saveOnBlur: boolean; // save when loosing focus
  saveOnShortcut: boolean; // save when pressing Cmd+S
  saveOnInactivity: number | false; // save when inactive milliseconds
  onSave?: (document: PreparedDocument) => void;
}

/**
 * SaveDocument - empty component to handle saving a document in various scenarios
 * @param props
 * @constructor
 */
const SaveDocument: React.FC<Props> = (props) => {
  const { saveOnBlur, saveOnShortcut, saveOnInactivity, onSave } = props;
  const { getJSON } = useHelpers();
  const { getState } = useRemirrorContext();

  const [lastPunch, setLastPunch] = useState<Date | undefined>(undefined);

  const handleChangeDebounced = useDebouncedCallback(() => {
    if (lastPunch) {
      saveStuff(getState(), 'inactive');
    }
    setLastPunch(new Date());
  }, saveOnInactivity || 5000);
  useRemirrorContext(handleChangeDebounced);

  const saveStuff = useCallback(
    (state: EditorState, trigger: SaveTrigger) => {
      if (trigger === 'blur' && !saveOnBlur) {
        return;
      } else if (trigger === 'inactive' && !saveOnInactivity) {
        return;
      } else if (trigger === 'shortcut' && !saveOnShortcut) {
        return;
      }

      const remirrorJson = getJSON(state);
      const rawJson = JSON.stringify(remirrorJson);
      onSave?.({ rawJson, trigger, state, remirrorJson });
    },
    [getJSON, saveOnBlur, saveOnShortcut, onSave, saveOnInactivity]
  );

  const handleSaveShortcut = useCallback(
    (props: unknown) => {
      // eslint-disable-next-line
      const state = (props as any).state;
      saveStuff(state, 'shortcut');
      return true; // Prevents any further key handlers from being run.
    },
    [saveStuff]
  );

  const handleBlur = useCallback(
    (props: unknown) => {
      // eslint-disable-next-line
      const state = (props as any).state;
      saveStuff(state, 'blur');
      return false;
    },
    [saveStuff]
  );

  useKeymap('Mod-s', handleSaveShortcut);
  useEvent('blur', handleBlur);

  return null;
};

export default SaveDocument;
