import { useMemo } from 'react';
import { parseHageReply } from '../components/ai-assistant/utils/parseHageLinks';
import type { HageMessage } from '../util/types/chat.types';

export function useHageSegments(item: HageMessage) {
  return useMemo(
    () => (item.fromAI ? parseHageReply(item.content) : null),
    [item.fromAI, item.content],
  );
}
