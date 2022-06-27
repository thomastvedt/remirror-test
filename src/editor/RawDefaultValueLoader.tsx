import React, { useEffect } from 'react';
import { useRemirrorContext } from '@remirror/react';
import { RemirrorJSON } from 'remirror';
import { message } from 'antd';
interface Props {
  defaultValueRaw?: string;
}
const RawDefaultValueLoader: React.FC<Props> = (props) => {
  const { defaultValueRaw } = props;
  const { manager } = useRemirrorContext();

  useEffect(() => {
    if (defaultValueRaw !== undefined) {
      try {
        console.log('📀 autodetect defaultValue format...');
        const json = JSON.parse(defaultValueRaw) as RemirrorJSON;
        console.log('📀 load initial state from RemirrorJSON');
        const jsonState = manager.createState({ content: json });
        manager.view.updateState(jsonState);
      } catch (err) {
        console.log('💿 load initial state from HTML or string');
        try {
          const htmlState = manager.createState({
            content: defaultValueRaw,
            stringHandler: 'html',
          });

          // NOTE: view.updateState() resets the editor's history, meaning user cannot ctrl+z to get back one step
          // Another alternative is setContent from useRemirrorContext()
          manager.view.updateState(htmlState);
        } catch (err2) {
          console.error(err2);
          message.error({
            content: '⚠️ Could not load initial editor value',
          });
        }
      }
    }
  }, [defaultValueRaw, manager]);

  return null;
};
export default RawDefaultValueLoader;
