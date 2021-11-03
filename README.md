### Space Hulk Death Angel - The Card Game

#### Space Marine formation mock-up

Supervise your formation in a glance. See which positions each of your Space Marines may attack, know where the breaches are and plan your next move.

This tool was made to help have an overview of the formation's current state. It may help find a strategy but doesn't provide any hints and doesn't tell how to order the Space Marines. You keep making your own decisions.

So far, it is text-mode only.

#### Usage

This is how a formation looks like. In the example below, we are playing the red, green and blue teams. Hence, Space Marines in combat are Brother Leon, Brother Valencio, Brother Noctis, Sergeant Gideon, Sergeant Lorenzo and Brother Deino. Each of them are referred to by their initials.

```
            Space Marine
                 /
 Space Marine   /
is facing left /  _ _ Space Marine's Range
       \      / /
        \    / /
BL BV BN < BL(3)    
BL BV BN < BV(2)    
BL BV BN < BN(2)   SL
BL BV BN   SG(0) > SG SL BD
      BN   SL(2) > SL BD   \__ position covered by
           BD(2) > SL BD       Sergeant Gideon, Sergeant Lorenzo and Brother Deino
                  \
                   \
              Space Marine
             is facing right

```

We quickly see some potential breaches. No marine will be able to defeat any Genetealer in these 3 positions:

```
BL BV BN < BL(3)   x <---
BL BV BN < BV(2)   x <---
BL BV BN < BN(2)   SL
BL BV BN   SG(0) > SG SL BD
      BN   SL(2) > SL BD
  ---> x   BD(2) > SL BD
```

Let's suppose we want to correct this situation. One easy way to do this is to, first, move Brother Noctis down so he can cover the last position on the left. This can be simulated with the command `m('BN','down')`. The formation is instantly redrawn:

```
   BL BV < BL(3)   x <---
BL BV BN < BV(2)   x <---
BL BV BN   SG(0) > SG SL
BL BV BN < BN(2)   SL BD
      BN   SL(2) > SL BD
      BN   BD(2) > SL BD
```

Then we can flip Brother Leon so he is facing right, and we no longer have any uncovered positions. This can be simulated with the command `f('BL')`. The new formation looks like this:

```
   BV   BL(3) > BL
BV BN < BV(2)   BL
BV BN   SG(0) > BL SG SL
BV BN < BN(2)   BL SL BD
   BN   SL(2) > SL BD
   BN   BD(2) > SL BD
```

This is clearly not the best possible configuration but at least the mock-up allowed us to easily spot out a configuration which we thought was incorrect. Now the breaches have been plugged. Real decisions will of course take several things into consideration like terrain placements, Genestealers already spawned, action cards sequency and so on. You do apply your own strategy there.

#### Usage

Paste the whole script in a JavaScript console and follow the instructions. You can find a JavaScript console online (for instance [https://jsconsole.com](https://jsconsole.com)) or in your browser's Development Tools.

Below an example of a full configuration:

```
------------------------------------------
 Space Hulk Death Angel - The Card Game
 Space Marine formation mock-up
------------------------------------------
1) Select your game:
   Type select('1') for Base Game
   Type select('2') for Mission Pack 1 expansion
   Type select('3') for Space Marine Pack 1 expansion
   Type select('4') for Deathwing expansion
   Type select('5') for Tyranid expansion
   Type select('6') for Wolf Guard (fan-made) expansion

> select('1')

Setting up Base Game...

2) Select your teams (use the combat team markers for randomness):
   Available teams: yellow, red, purple, green, grey, blue
   Type select(['team1', 'team2', ... ])

> select(['red','green','blue'])

Setting up teams...

3) Select Space Marines in order (from top to bottom):
   Space Marines: Brother Leon, Brother Valencio, Brother Noctis, Sergeant Gideon, Sergeant Lorenzo, Brother Deino
   Type select(['Space Marine 1', 'Space Marine 2', ... ])

> select(['Brother Leon','Brother Valencio','Brother Noctis','Sergeant Gideon','Sergeant Lorenzo','Brother Deino'])

Setting up Space Marines...

Formation is ready!

BL BV BN < BL(3)  
BL BV BN < BV(2)  
BL BV BN < BN(2)   SL
BL BV BN   SG(0) > SG SL BD
      BN   SL(2) > SL BD
           BD(2) > SL BD

To move Space Marine 'SM' type: m('SM','up') or m('SM','down')
To flip Space Marine 'SM' type: f('SM')
To kill Space Marine 'SM' type: k('SM')
To undo a previous command type: u()
```

#### Preview

https://user-images.githubusercontent.com/30340460/140045908-1c842567-8503-4d35-a23a-94da75d7bd1d.mov


#### Contact

This development was made for my own use. You may use it as well and improve it if you like.

If anyone wishes to implement a mobile-friendly GUI on top of this code to make it more sexy, feel free to get in touch at blodhemn.donotabuse@neverbox.com so I could know about it and add it to this repository.
