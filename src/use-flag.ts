import { useFlagSyncClient } from '~sdk/use-flagsync-client';

export type UseFlagValue<T> = T | 'control';

/**
 * A hook to retrieve a flag value from the FlagSync client
 * @param flagKey
 * @param defaultValue
 */
export function useFlag<T>(flagKey: string, defaultValue: T): UseFlagValue<T> {
  const client = useFlagSyncClient();
  return client.flag<T>(flagKey, defaultValue);
}