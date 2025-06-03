import { ReactNode } from 'react';
import { Seq } from 'immutable';

export function commaSeparated(
  seq: Seq.Indexed<ReactNode>,
): readonly ReactNode[] {
  return seq
    .flatMap((v) => [v, ', '])
    .butLast()
    .toArray();
}
