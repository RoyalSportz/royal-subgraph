import { BigInt } from '@graphprotocol/graph-ts';
import {
  EnteredContest as EnteredContestSchema,
  ClaimRewards as ClaimRewardsSchema,
  Transaction,
} from '../generated/schema';
import {
  EneteredContest,
  ClaimFunds,
} from '../generated/templates/Matches/Matches';

export function handleEneteredContest(event: EneteredContest): void {
  let entity = EnteredContestSchema.load(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new EnteredContestSchema(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    );
  }

  let transaction = Transaction.load(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );
  if (transaction === null) {
    transaction = new Transaction(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    );
    transaction.wallet = event.address.toHexString();
    transaction.timestamp = event.block.timestamp;
    transaction.transactionHash = event.transaction.hash.toHexString();
    transaction.transactionEvent = 'entered';
  } else {
    transaction.transactionEvent = 'entered';
  }

  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.timestamp = event.block.timestamp;
  entity.team = event.params.team;
  entity.matchAddress = event.params.contest;
  entity.indexedMatchToken = event.params.indexedMatchToken;
  entity.transactionHash = event.transaction.hash.toHexString();

  // Entities can be written to the store with `.save()`
  entity.save();
  transaction.enterContest = entity.id;
  transaction.save();
}

export function handleClaimFunds(event: ClaimFunds): void {
  let entity = ClaimRewardsSchema.load(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ClaimRewardsSchema(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    );
  }

  let transaction = Transaction.load(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );
  if (transaction === null) {
    transaction = new Transaction(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString()
    );
    transaction.wallet = event.address.toHexString();
    transaction.timestamp = event.block.timestamp;
    transaction.transactionHash = event.transaction.hash.toHexString();
    transaction.transactionEvent = 'claimed';
  } else {
    transaction.transactionEvent = 'claimed';
  }

  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.timestamp = event.block.timestamp;
  entity.matchToken = event.params.matchToken;
  entity.transactionHash = event.transaction.hash.toHexString();
  // Entities can be written to the store with `.save()`
  entity.save();
  transaction.claim = entity.id;
  transaction.save();
}
