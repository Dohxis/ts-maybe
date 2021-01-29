import { Nothing } from '.';
import { Nothing as NothingSymbol } from './symbol';
import { isNothing } from './utilities';

export interface Case<T, M, N> {
  Just(value: T): M;
  Nothing(): N;
}

export class Maybe<T extends unknown> {
  private constructor(private exists: boolean, private value?: T) {}

  static Just<T>(value: T): Maybe<T> {
    if (typeof value === 'undefined' || value === null) {
      return Maybe.Nothing<T>();
    }

    return new Maybe(true, value);
  }

  static Nothing<T = Nothing>(): Maybe<T> {
    return new Maybe(false);
  }

  static Case<T, M, N>(branches: Case<T, M, N>): (value: T) => M | N {
    return (value: T) => {
      if (value instanceof Maybe) {
        return Maybe.Just(value.unwrap()).case(branches);
      }

      return Maybe.Just(value).case(branches);
    };
  }

  public case<M, N>(branches: Case<T, M, N>): M | N {
    if (isNothing(this)) {
      return branches.Nothing();
    }

    return branches.Just(this.value as T);
  }

  static Map<T, M>(
    callback: (value: T) => M
  ): (value: T) => Maybe<M | Nothing> {
    return (value: T) => {
      if (value instanceof Maybe) {
        return Maybe.Just(value.unwrap()).map(callback);
      }

      return Maybe.Just(value).map(callback);
    };
  }

  public map<M>(callback: (value: T) => M): Maybe<M> {
    if (isNothing(this)) {
      return Maybe.Nothing();
    }

    return Maybe.Just(callback(this.unwrap() as T));
  }

  public unwrap(): T | Nothing {
    if (this.exists) {
      return this.value!;
    }

    return NothingSymbol;
  }
}
