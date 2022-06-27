import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import {
  ExtensionPriority,
  IdentifierSchemaAttributes,
  isDocNodeEmpty,
  RemirrorEventListener,
} from 'remirror';
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  DropCursorExtension,
  EmojiExtension,
  GapCursorExtension,
  HardBreakExtension,
  ImageExtension,
  ItalicExtension,
  LinkExtension,
  MentionAtomExtension,
  OrderedListExtension,
  PlaceholderExtension,
  ShortcutsExtension,
  StrikeExtension,
  TaskListExtension,
  TrailingNodeExtension,
  UnderlineExtension,
} from 'remirror/extensions';
import styled from 'styled-components';
import { FileExtension } from '@remirror/extension-file';
import RawDefaultValueLoader from 'editor/RawDefaultValueLoader';
import {
  EditorComponent,
  EmojiPopupComponent,
  Remirror,
  ThemeProvider,
  useRemirror,
} from '@remirror/react';

import SaveDocument, { PreparedDocument } from 'editor/SaveDocument';
import { TopToolbar } from 'editor/TopToolbar';
import { CompanyEditorDef, UsedExtensions } from 'editor/companyEditorDef';
import data from 'svgmoji/emoji.json';
import { useEditorTheme } from 'editor/useEditorTheme';
import { AllStyledComponent } from '@remirror/styles/styled-components';


const extraAttributes: IdentifierSchemaAttributes[] = [
  {
    identifiers: ['mention', 'emoji'],
    attributes: { role: { default: 'presentation' } },
  },
  { identifiers: ['mention'], attributes: { href: { default: null } } },
];

export interface Props {
  /***
   * If false Editor will render a read only version that cannot be edited
   */
  editable: boolean;

  /***
   * Text to render as a placeholder when the document is empty
   */
  placeholder?: string;

  /***
   * This can be raw HTMl, a plain string, or RemirrorJSON.
   * Format will be detected automatically
   */
  defaultValueRaw?: string;

  /***
   * Nest your own Remirror components here to customize the editor
   */
  children?: React.ReactNode;

  /***
   * Will trigger when document is auto saving. Will contain json useful for storing
   * @param document
   */
  onAutoSave?: (document: PreparedDocument) => void;

  /***
   * isEmpty is True if the current document is empty.
   * Will only trigger if status changes
   * @param isEmpty
   */
  onIsEmptyChange?: (isEmpty: boolean) => void;
}

const Container = styled.div<{ readonly: boolean }>`
  &&& {
    .remirror-editor-wrapper {
      padding-top: ${(props) => props.readonly ? 0 : '12px'};

      .remirror-is-empty {
        height: 0; // dont take any height when empty?
      }

      .remirror-editor {
        // In addition to setting theme variables, we can override styles here
        padding: ${(props) => (props.readonly ? 0 : '4px 11px')};
        border: ${(props) => props.readonly ? 0 : '1px solid black'};
        transition: all 0.3s;
        box-shadow: none;
        min-height: ${(props) => (props.readonly ? 'unset' : '150px')};
      }
      .remirror-is-empty {
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
      }
      .ProseMirror:hover {
        border-color: #333;
      }
      .ProseMirror:focus {
        border-color: #333;
        box-shadow: 0 0 0 2px rgb(80 135 162 / 20%);
      }
      
      .remirror-resizable-view {
        resize: none;
      }
    }
    .remirror-floating-popover {
      z-index: 1; // Fixes emoji popup z-index
    }
  }
`;

const Editor = forwardRef<CompanyEditorDef | undefined, Props>(
  (props, ref) => {
    const {
      placeholder,
      defaultValueRaw,
      children,
      editable,
      onAutoSave,
      onIsEmptyChange,
    } = props;

    const enableAutoSave = onAutoSave !== undefined;

    const extensions = useCallback(
      () => [
        new LinkExtension({
          autoLink: true,
        }),
        new GapCursorExtension(),
        new HardBreakExtension(),
        new ImageExtension({
          enableResizing: true, // TODO: setting to editable won't work
          // uploadHandler: connectImageUploadHandler,
          priority: ExtensionPriority.High,
        }),
        new ItalicExtension(),
        new StrikeExtension(),
        new UnderlineExtension(),
        new BlockquoteExtension(),
        new BoldExtension(),
        new CodeBlockExtension(),
        new DropCursorExtension(), // render cursor when dropping files, or moving image around
        new TrailingNodeExtension(),
        new BulletListExtension(),
        new OrderedListExtension(),
        new TaskListExtension(),
        new ShortcutsExtension(),
        new PlaceholderExtension({ placeholder }),
        new MentionAtomExtension({
          matchers: [
            { name: 'at', char: '@', appendText: ' ' },
            { name: 'tag', char: '#', appendText: ' ' },
          ],
        }),
        new EmojiExtension({ plainText: false, data, moji: 'openmoji' }),
        new FileExtension({
          // uploadFileHandler: createConnectFileUploader,
          priority: ExtensionPriority.Default,
        }),
      ],
      [placeholder]
    );

    const handleAutoSave = useCallback(
      (document: PreparedDocument) => {
        if (enableAutoSave) {
          onAutoSave?.(document);
        }
      },
      [onAutoSave]
    );

    const { manager, getContext, state, setState } = useRemirror({
      extensions,
      extraAttributes,
      defaultSelection: 'end',
      stringHandler: 'html', // <== if STRING is passed to initialContent below, it will be parsed as HTML
    });

    // Expose content handling to outside via ref:
    useImperativeHandle(ref, () => getContext(), [getContext]);
    const { theme } = useEditorTheme();

    const handleChange = useCallback<
      RemirrorEventListener<UsedExtensions>
      >((params) => {
      const nextState = params.state;

      // custom controlled logic here...
      if (params.tr) {
        if (params.tr.docChanged) {
          // document HAS changed in this transaction. Let's see if document is empty:
          // NOTE: This might be heavy, optimize later?
          const isNextEmpty = isDocNodeEmpty(params.tr.doc);
          onIsEmptyChange?.(isNextEmpty);
        }
      }

      setState(nextState);
    }, []);

    useEffect(() => {
      console.log('run code when changing editable mode...:' + editable);
      const test1 = manager.extensions.find(c => c.name === 'image');
      test1?.setOptions({
        enableResizing: editable
      });
    }, [editable])

    return (
      <Container readonly={!editable}>
        <AllStyledComponent>
          <ThemeProvider theme={theme}>
            <Remirror
              manager={manager}
              label={'Text editor'}
              editable={editable}
              // initialContent={initialContent} // <== NOTE: doesn't work with controlled mode, I guess we have to load initial data ourselves?
              onChange={handleChange}
              state={state}
            >
              <RawDefaultValueLoader defaultValueRaw={defaultValueRaw} />
              {enableAutoSave && (
                <SaveDocument
                  saveOnBlur={true}
                  saveOnShortcut={true}
                  saveOnInactivity={5000}
                  onSave={handleAutoSave}
                />
              )}
              {editable && <TopToolbar />}
              <EditorComponent />
              <EmojiPopupComponent />
              {children}
            </Remirror>
          </ThemeProvider>
        </AllStyledComponent>
      </Container>
    );
  }
);

export default Editor;
