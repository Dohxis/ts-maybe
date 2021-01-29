import Maybe, { Nothing } from '.';
import { Nothing as NothingSymbol } from './symbol';

export const isNothing = <T>(maybe: Maybe<T>) => {
  return maybe.unwrap() === NothingSymbol;
};

export const isSomething = <T>(maybe: Maybe<T>) => {
  return !isNothing(maybe);
};

export const filterList = <T>(
  list: Maybe<T | Nothing>[],
  callback: (value: T) => boolean
): Maybe<T>[] =>
  list.filter(
    item => !isNothing(item) && callback(item.unwrap() as T)
  ) as Maybe<T>[];

export const mapList = <T, M>(
  list: Maybe<T | Nothing>[],
  callback: (value: T) => M | Nothing
): Maybe<M | Nothing>[] =>
  list.map(item =>
    isNothing(item) ? item : Maybe.Just(callback(item.unwrap() as T))
  ) as Maybe<M | Nothing>[];
