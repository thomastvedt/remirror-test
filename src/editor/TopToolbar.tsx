import React, { CSSProperties, FC } from 'react';
import { useActive, useCommands } from '@remirror/react';
import styled from 'styled-components';
import { Button, Space } from 'antd';
import {
  BoldOutlined,
  CheckSquareOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import CheckableTag from 'antd/es/tag/CheckableTag';

const Container = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: row;
  gap: 12px;
  
  flex: 1 1 auto;
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &&& {
    .ant-tag {
      margin-right: 2px;
    }
  }
`;

interface Props {
  style?: CSSProperties;
}

const UploadButton = styled(Button)`
  && {
    background-color: unset;
    border: none;
    box-shadow: none;
  }
`;

export const TopToolbar: FC<Props> = (props) => {
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrike,
    toggleBulletList,
    toggleOrderedList,
    toggleTaskList,
    toggleBlockquote,
    uploadImageButt,
  } = useCommands();
  const active = useActive();
  return (
    <Container>
        <Group>
          <CheckableTag checked={active.bold()} onChange={() => toggleBold()}>
            <BoldOutlined />
          </CheckableTag>
          <CheckableTag
            checked={active.italic()}
            onChange={() => toggleItalic()}
          >
            <ItalicOutlined />
          </CheckableTag>
          <CheckableTag
            checked={active.underline()}
            onChange={() => toggleUnderline()}
          >
            <UnderlineOutlined />
          </CheckableTag>
          <CheckableTag
            checked={active.strike()}
            onChange={() => toggleStrike()}
          >
            <StrikethroughOutlined />
          </CheckableTag>
        </Group>
        <Group>
          <CheckableTag
            checked={active.bulletList()}
            onChange={() => toggleBulletList()}
          >
            <UnorderedListOutlined />
          </CheckableTag>
          <CheckableTag
            checked={active.orderedList()}
            onChange={() => toggleOrderedList()}
          >
            <OrderedListOutlined />
          </CheckableTag>
          <CheckableTag
            checked={active.taskList()}
            onChange={() => toggleTaskList()}
          >
            <CheckSquareOutlined />
          </CheckableTag>
        </Group>
        <Group>
          <CheckableTag
            checked={active.blockquote()}
            onChange={() => toggleBlockquote()}
          >
            Q
          </CheckableTag>
        </Group>
    </Container>
  );
};
