// This is an example file which exports a function!

import { ObjectReference, on } from 'skyrimPlatform'

// The player's Form ID is 00000014 in hexadecimal.
// Here I am simply getting the decimal verison of that for comparison below
// so we only print out messages when it was the player who was the target or aggressor or a hid
const playerFormId = parseInt('14', 16)

// This adds TypeScript typing for the event which is used by onPlayerHit
interface PlayerHitEvent {
    aggressor: ObjectReference
    target: ObjectReference
}

// These are the callbacks which have been registered via onPlayerHit
// Reminder: this is just an example! You do not need to follow this pattern!
const callbacks = Array<(event: PlayerHitEvent) => void>()

// For this example, you can register callbacks via onPlayerHit()
// See index.ts for example user
export function onPlayerHit(callback: (event: PlayerHitEvent) => void) {
    callbacks.push(callback)
}

// Everytime a hit event is triggered, check if the player was the target or the aggressor.
// If so, then trigger all callbacks which have been registered via 'onPlayerHit'
on('hit', event => {
    if (event.aggressor.getFormID() == playerFormId || event.target.getFormID() == playerFormId)
        callbacks.forEach(callback => callback({ aggressor: event.aggressor, target: event.target }))
})
