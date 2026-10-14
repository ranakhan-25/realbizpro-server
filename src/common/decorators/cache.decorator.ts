import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';
export const CACHE_PREFIX_METADATA =
  'cache:prefix';

export interface CacheDecoratorOptions {
  key?: string;
  ttl?: number;
  prefix?: string;
}

export const Cache = (
  options: CacheDecoratorOptions = {},
) => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata(
      CACHE_KEY_METADATA,
      options.key || propertyName,
    )(target, propertyName, descriptor);
    SetMetadata(CACHE_TTL_METADATA, options.ttl)(
      target,
      propertyName,
      descriptor,
    );
    SetMetadata(
      CACHE_PREFIX_METADATA,
      options.prefix,
    )(target, propertyName, descriptor);
  };
};

export const CacheKey = (key: string) =>
  SetMetadata(CACHE_KEY_METADATA, key);
export const CacheTTL = (ttl: number) =>
  SetMetadata(CACHE_TTL_METADATA, ttl);
export const CachePrefix = (prefix: string) =>
  SetMetadata(CACHE_PREFIX_METADATA, prefix);
