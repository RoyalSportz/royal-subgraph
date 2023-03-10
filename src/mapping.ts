import { BigInt } from '@graphprotocol/graph-ts';
import { Contract, Created } from '../generated/Contract/Contract';
import { Match } from '../generated/schema';
import { Matches } from '../generated/templates';

export function handleCreated(event: Created): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = Match.load(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new Match(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    );
  }

  // BigInt and BigDecimal math are supported
  // entity.i = event.params.id;
  entity.matchAddress = event.params.matchAddress;
  entity.timestamp = event.block.timestamp;
  Matches.create(event.params.matchAddress);
  // Entity fields can be set based on event parameters

  // Entities can be written to the store with `.save()`
  entity.save();
}
