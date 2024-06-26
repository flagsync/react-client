import { useEffect, useState } from 'react';

import { useFlagSyncProviderContext } from '~sdk/flagsync-provider';
import { DecoratedFsClient } from '~sdk/types';

/**
 * Hook to get the FlagSync client from the context. This hook is guaranteed to
 * re-render when the client receives the following events:
 *  > SDK_UPDATE
 *  > SDK_READY
 *  > SDK_READY_FROM_STORE
 */
export function useFlagSyncClient(): DecoratedFsClient {
  const { client } = useFlagSyncProviderContext();
  const [_, setLastUpdated] = useState(Date.now());

  useEffect(() => {
    if (!client) {
      return;
    }

    const onUpdate = () => {
      setLastUpdated(client.lastUpdated);
    };

    client.on(client.Event.SDK_UPDATE, onUpdate);
    client.once(client.Event.SDK_READY, onUpdate);
    client.once(client.Event.SDK_READY_FROM_STORE, onUpdate);

    return () => {
      client.off(client.Event.SDK_UPDATE, onUpdate);
      client.off(client.Event.SDK_READY, onUpdate);
      client.off(client.Event.SDK_READY_FROM_STORE, onUpdate);
    };
  }, [client]);

  return client;
}
