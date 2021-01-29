import Maybe, { filterList, mapList, isNothing, isSomething } from '../src';
import { Nothing } from '../src/symbol';

describe('Maybe', () => {
  it('Maybe.case branches to Just(value)', () => {
    const value = Maybe.Just(5).case({
      Just() {
        return true;
      },
      Nothing() {
        return false;
      },
    });

    expect(value).toEqual(true);
  });

  it('Maybe.case branches to Nothing()', () => {
    const value = Maybe.Nothing().case({
      Just() {
        return true;
      },
      Nothing() {
        return false;
      },
    });

    expect(value).toEqual(false);
  });

  it('Maybe.map accepts a function transforms a value and returns new Maybe', () => {
    const value = Maybe.Just('5')
      .map(parseInt)
      .unwrap();

    expect(value).toEqual(5);
  });

  it('Maybe.Map and Maybe.Just works with standard .map() and .filter()', () => {
    const numbers = [1, 2, undefined, 3, null, 4]
      .map(Maybe.Just)
      .filter(isSomething);

    expect(numbers.length).toEqual(4);
  });
});

describe('Utilities', () => {
  it('filterList() filters out all Nothing() from an array', () => {
    expect(
      filterList([Maybe.Nothing(), Maybe.Nothing()], () => true).length
    ).toEqual(0);

    const arrayWithOneItem = filterList(
      [Maybe.Nothing(), Maybe.Just(5)],
      () => true
    );

    expect(arrayWithOneItem.length).toEqual(1);
    expect(arrayWithOneItem[0].unwrap()).toEqual(5);
  });

  it('filterList() filters out all Nothing() from an array but leaves all Just(value)', () => {
    const arrayWithOneItem = filterList(
      [Maybe.Nothing(), Maybe.Just(5)],
      () => true
    );

    expect(arrayWithOneItem.length).toEqual(1);
    expect(arrayWithOneItem[0].unwrap()).toEqual(5);
  });

  it('filterList() filters out all values from array no matter if they are Nothing() or Just(value)', () => {
    const arrayWithNoItems = filterList(
      [Maybe.Nothing(), Maybe.Just(5)],
      () => false
    );

    expect(arrayWithNoItems.length).toEqual(0);
  });

  it('filterList() filters out all values based on their actual value passed to callback', () => {
    const arrayWithOneItem = filterList(
      [Maybe.Nothing(), Maybe.Just(true), Maybe.Just(false)],
      value => value
    );

    expect(arrayWithOneItem.length).toEqual(1);
    expect(arrayWithOneItem[0].unwrap()).toEqual(true);
  });

  it('mapList() goes over all Just() values', () => {
    const modifiedMaybeList = mapList([Maybe.Just(true)], () => {
      return false;
    });

    expect(modifiedMaybeList.length).toEqual(1);
    expect(modifiedMaybeList[0].unwrap()).toEqual(false);
  });

  it('mapList() goes over all Just() values but leave Nothing() untouched', () => {
    const modifiedMaybeList = mapList(
      [Maybe.Just(true), Maybe.Nothing()],
      () => {
        return false;
      }
    );

    expect(modifiedMaybeList.length).toEqual(2);
    expect(modifiedMaybeList[0].unwrap()).toEqual(false);
    expect(modifiedMaybeList[1].unwrap()).toEqual(Nothing);
  });

  it('mapList() goes over all Just(value) values and changes them based on their value', () => {
    const modifiedMaybeList = mapList([Maybe.Just(false)], value => {
      return !value;
    });

    expect(modifiedMaybeList.length).toEqual(1);
    expect(modifiedMaybeList[0].unwrap()).toEqual(true);
  });
});

describe('Maybe.then()', () => {
  it('Passes Nothing() down to multiple then() chains', () => {
    const value = Maybe.Nothing()
      .map(() => 123)
      .map(() => true)
      .map(() => 'string');

    expect(isNothing(value)).toBe(true);
  });

  it('Passes Just(value) down to multiple then() chains and returns the last one', () => {
    const value = Maybe.Just(true)
      .map(() => 123)
      .map(() => true)
      .map(() => 'string');

    expect(value.unwrap()).toBe('string');
  });

  it('Passes Just(value) down to multiple then() chains but somewhere in the middle the chain breaks with Nothing()', () => {
    const value = Maybe.Just(true)
      .map(() => 123)
      .map(() => Nothing)
      .map(() => 'string');

    expect(isNothing(value)).toBe(true);
  });

  it('Allows passing just a callback ands wraps an output to Maybe.Just()', () => {
    const invert = (value: boolean) => !value;

    const value = Maybe.Just(true)
      .map(invert)
      .unwrap();

    expect(value).toEqual(false);
  });
});

describe('Promises', () => {
  it('Maybe.Just turns promise value to a Maybe', async () => {
    const value = await Promise.resolve(true).then(Maybe.Just);

    expect(value instanceof Maybe).toBe(true);
  });

  it('Maybe.Case works with promise .then()', async () => {
    const value = await Promise.resolve(true)
      .then(Maybe.Just)
      .then(
        Maybe.Case({
          Just(value) {
            return !value;
          },
          Nothing() {
            return undefined;
          },
        })
      );

    expect(value).toBe(false);
  });

  it('Maybe.then inside a promise simulating fetch', async () => {
    const value = await Promise.resolve<Record<string, string> | undefined>(
      undefined
    )
      .then(Maybe.Just)
      .then(Maybe.Map(JSON.stringify));

    expect(value.unwrap()).toEqual(Nothing);
  });
});
