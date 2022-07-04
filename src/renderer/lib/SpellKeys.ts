import {QuickSpellKey} from "./QuickSpellKey";

export const defaultKey: QuickSpellKey = new QuickSpellKey({
                                                               keyCode: 2,
                                                               key: '1',
                                                               button: 'right',
                                                               returnKey: '1',
                                                               returnKeyCode: 2
                                                           })
export const spellKeys: QuickSpellKey[] = [
    new QuickSpellKey({keyCode: 2, key: '1', button: 'right', returnKey: null, returnKeyCode: null}),
    new QuickSpellKey({keyCode: 3, key: '2', button: 'right', returnKey: null, returnKeyCode: null}),
    new QuickSpellKey({
                          keyCode: 4,
                          key: '3',
                          button: 'right',
                          returnKey: null,
                          returnKeyCode: null,
                          // returnKey:) defaultKey.key,
                          // returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 5,
                          key: '4',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),

    new QuickSpellKey({
                          keyCode: 6,
                          key: '5',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 7,
                          key: '6',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 59,
                          key: 'f1',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 60,
                          key: 'f2',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),

    new QuickSpellKey({
                          keyCode: 61,
                          key: 'f3',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 62,
                          key: 'f4',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 63,
                          key: 'f5',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 64,
                          key: 'f6',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),

    new QuickSpellKey({
                          keyCode: 65, key: 'f7', button: 'right', returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 66,
                          key: 'f8',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 44,
                          key: 'z',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
    new QuickSpellKey({
                          keyCode: 45,
                          key: 'x',
                          button: 'right',
                          returnKey: defaultKey.key,
                          returnKeyCode: defaultKey.keyCode
                      }),
];