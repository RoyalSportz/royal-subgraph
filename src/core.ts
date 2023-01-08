import { BigInt } from '@graphprotocol/graph-ts';
import { EnteredContest } from '../generated/schema';
import { EnterContest } from '../generated/templates/Matches/Matches';

export function handleEnterContest(event: EnterContest): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = EnteredContest.load(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new EnteredContest(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    );
  }

  // BigInt and BigDecimal math are supported
  // entity.i = event.params.id;
  entity.player = event.params.player;
  entity.amount = event.params.amount;
  entity.timestamp = event.block.timestamp;
  // This will work
  let team = entity.team;
  team.push(BigInt.fromI32(1));
  entity.team = team;
  entity.matchAddress = event.address.toHexString();
  // Entity fields can be set based on event parameters

  // Entities can be written to the store with `.save()`
  entity.save();
}
