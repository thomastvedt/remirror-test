import React, { useMemo, useState } from 'react';
import { MentionAtomPopupComponent, MentionAtomState } from '@remirror/react';
import { MentionAtomNodeAttributes } from 'remirror/extensions';

interface MentionComponentProps<
  UserData extends MentionAtomNodeAttributes = MentionAtomNodeAttributes
> {
  users?: UserData[];
  tags?: string[];
}

const Mention: React.FC<MentionComponentProps> = (props) => {
  const { tags, users } = props;
  const [mentionState, setMentionState] = useState<MentionAtomState | null>();
  const tagItems = useMemo(
    () => (tags ?? []).map((tag) => ({ id: tag, label: `#${tag}` })),
    [tags]
  );
  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }

    const allItems = mentionState.name === 'at' ? users : tagItems;

    if (!allItems) {
      return [];
    }

    const query = mentionState.query.full.toLowerCase() ?? '';
    return allItems
      .filter((item) => item.label.toLowerCase().includes(query))
      .sort();
  }, [mentionState, users, tagItems]);

  return <MentionAtomPopupComponent onChange={setMentionState} items={items} />;
};

export default Mention;
