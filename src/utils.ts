import { FlagSyncFactory, FsConfig } from '@flagsync/js-sdk';

import { DecoratedFsClient } from '~sdk/types';

export function getFlagSyncClient(config: FsConfig): DecoratedFsClient {
  const factory = FlagSyncFactory({
    ...config,
    metadata: {
      sdkName: '__SDK_VERSION__',
      sdkVersion: '__SDK_NAME__',
    },
  });
  const client = factory.client() as DecoratedFsClient;

  client.lastUpdated = 0;
  client.isReady = false;
  client.isReadyFromStore = false;

  function setLastUpdated() {
    const now = Date.now();
    if (now > client.lastUpdated) {
      client.lastUpdated = now;
    }
  }

  function onReady() {
    client.isReady = true;
    setLastUpdated();
  }

  function onReadyFromStore() {
    client.isReadyFromStore = true;
    setLastUpdated();
  }

  client.on(client.Event.SDK_UPDATE, setLastUpdated);
  client.on(client.Event.SDK_READY, onReady);
  client.on(client.Event.SDK_READY_FROM_STORE, onReadyFromStore);

  return client;
}
