// These example tests test the PlayerPickupTracker.ts class

import { FormType } from 'skyrimPlatform'
import PlayerPickupTracker from 'src/PlayerPickupTracker'

describe('PlayerPickupTracker', () => {

    it('can trigger callback when item of tracked type is picked up', () => {

        console.log('HELLO FROM TEST')

        // Define pickup tracker

        // const pickupTracker = new PlayerPickupTracker(onContainerEvent => {

        // })
        // pickupTracker.track(FormType.Book)
        // pickupTracker.onPickup()

        // The callback should not have ever been called
        //

        // Trigger a player item pickup (of a Book which is the tracked type)
        //

        // The callback should have been run!
        //
    })

    test.todo('does not trigger callback for wrong item type')

    test.todo('does not trigger if the player is not who picked up the item')
    
    test.todo('different player pickup trackers can track different item types')

})