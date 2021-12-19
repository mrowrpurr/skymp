// This is an example file which exports a class!

import { Form, FormType, ContainerChangedEvent } from 'skyrimPlatform'

/*
 * Using classes in your Skyrim Platform plugins is completely optional!
 */

// The player's Form ID is 00000014 in hexadecimal.
// Here I am simply getting the decimal verison of that for comparison below
// so we only print out messages when it was the player who was the target or aggressor or a hid
const playerFormId = parseInt('14', 16)

// This class allows you to trigger code whenever the player
// picks up a certain type of item (by checking its FormType)
export default class PlayerPickupTracker {
    private callbacks = new Array<(form: Form) => void>()
    private formTypes = new Array<FormType>()

    constructor(onContainerChanged: (callback: (event: ContainerChangedEvent) => void) => void) {
        onContainerChanged(event => {
            // If the 'newContainer' is the player, then the player picked up an item!
            // Check if the tracked types includes this item's type
            // If it does, trigger all callbacks registered via 'onPickup'
            if (event.newContainer && event.newContainer.getFormID() == playerFormId)
                if (this.formTypes.includes(event.baseObj.getType()))
                    this.callbacks.forEach(callback => callback(event.baseObj))
        })
    }

    track(formType: FormType) {
        this.formTypes.push(formType)
    }

    onPickup(callback: (form: Form) => void) {
        this.callbacks.push(callback)
    }
}