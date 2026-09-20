export const MAX_ADDRESS_LENGTH = 80;
export const ADDRESS_PATTERN = /^(?=.{1,80}$)[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?$/;

export const isFictionalAddress = (address: string): boolean => ADDRESS_PATTERN.test(address);

export const normalizeAddress = (address: string): string => address.trim().toLowerCase();
