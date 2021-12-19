import { Debug, on, once, printConsole } from 'skyrimPlatform'

// Import code from some other files (may be useful to organize your code)
import { onPlayerHit } from './onPlayerHit'

// This will print a message to the console at the game's main menu.
// If you make changes to this while `yarn watch` or `npm run watch`
// is running, you will see the message print out again immediately!
once('tick', () => {
    printConsole('Hello from example plugin! (on main menu)')
})

// This will popup a message when the game loads (e.g. new game or load same )
once('update', () => {
    Debug.messageBox('Hello from example plugin! (in loaded game)')
})

// Sometimes, it's useful to organize your Skyrim Platform code into functions in separate files
// This calls the function defined in onPlayerHit.ts
onPlayerHit(event => {
    Debug.messageBox(`${event.aggressor}`)
})
