import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import styled from 'styled-components';
import Editor from 'editor/Editor';

const Container = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
`

const EditorContainer = styled.div`
  border-radius: 4px;
  flex: 0 0 30vh;
  width: 60vw;
  margin-bottom: 12px;
`

function App() {

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Container>
      <Typography.Title>Editor demo</Typography.Title>
      <EditorContainer>
        <Editor editable={isEditing} />
      </EditorContainer>
      {!isEditing && <Button type={'primary'} onClick={() => setIsEditing(true)}> Edit</Button>}
      {isEditing && <Button onClick={() => setIsEditing(false)}>Save</Button>}
    </Container>
  );
}

export default App;
