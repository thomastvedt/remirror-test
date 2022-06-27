import { ReactExtensions, ReactFrameworkOutput } from '@remirror/react';
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
import { FileExtension } from '@remirror/extension-file';

/***
 * This is the extensions that we use in our Editor
 * These extensions defines the "ProseMirror format"
 */
export type UsedExtensions = ReactExtensions<
  | GapCursorExtension
  | HardBreakExtension
  | ImageExtension
  | ItalicExtension
  | StrikeExtension
  | UnderlineExtension
  | BlockquoteExtension
  | LinkExtension
  | BoldExtension
  | CodeBlockExtension
  | DropCursorExtension
  | TrailingNodeExtension
  | BulletListExtension
  | OrderedListExtension
  | TaskListExtension
  | ShortcutsExtension
  | PlaceholderExtension
  | MentionAtomExtension
  | EmojiExtension
  | FileExtension
>;

export type CompanyEditorDef = ReactFrameworkOutput<UsedExtensions>;
