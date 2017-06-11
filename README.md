# InitiativeTracker
An initiative tracker project for D&amp;D 5e

## Purpose
The purpose of this project is to create a simple tool that any DM can use to quickly and easily track initiative at the table.

The inspiration for this tracker was the initiative tracking in [Roll20](https://roll20.net).

## Data Files
### monsters.json
This file was downloaded from [greylurk's](https://github.com/greylurk) [5e-ogl project](https://github.com/greylurk/5e-ogl).  All credit belongs to this developer.

### xp.json
This file contains a simple list of all monster CRs and their respective xp value.

### players.json
This file contains a list of the players in your campaign and a list of relevant stats that a DM might want to have at their disposal.
* Passive Perception
* Passive Investigation
* Passive Stealth
* Perception Bonus
* Investigation Bonus
* Stealth Bonus

Players in this file will also be automatically listed on the Index page so that a DM doesn't have to enter their name every session.

## Pages
### Index
The index page is the initiative tracker.  It contains everything necessary to run a combat in D&D

### Players
The players page is for checking various player stats.  Since this is stored in a json file, these stats should not need to be updated very often.

## Tutorial
### Optional Step
You must have a players.json file in your project, however, it does not need any real player information.  However, as it will speed up your setup time, it is recommended.  Simply modify the names and stats in the file using any text-editor of your choice, then save the file and you are ready to begin.

### Step 1 - Add player initiatives
![alt text](https://github.com/DarthKeller/InitiativeTracker/blob/master/Content/Images/players.PNG "Players Section")

Ask each player what their initiative roll was and record that information in the Initiative column under the Players section of the index page

### Step 2 - Add monsters
![alt text](https://github.com/DarthKeller/InitiativeTracker/blob/master/Content/Images/Monsters.PNG "Monsters Section")

The monsters.json file contains all the monsters from the [D&D 5e SRD](http://dnd.wizards.com/articles/features/systems-reference-document-srd).  If the monster you wish to use is in the SRD you can simply select the monster from the Select drop down list.  All relevant stats will be taken into account.

If the monster you want to use is NOT in the SRD, simply fill in the items in the Monster section.

In both cases, make sure you have entered a number in the Count box (if left blank, it will automatically add one copy of this monster).  Once complete, hit Add

Repeat these steps for each monster you wish to add.

### Step 3 - Roll initiative
![alt text](https://github.com/DarthKeller/InitiativeTracker/blob/master/Content/Images/Initiative.PNG "Initiative Section")

In the Initiative section, hit the Roll Initiative button.  When you hit this button it will roll a d20 for each monster in your list, add the players to the same list, then order them by their final initiative before displaying them in the grid under the buttons.

For your convenience, a round counter, the XP for the generated encounter, and the XP for each player, is shown under the Roll Initiative and Clear Initiative buttons.

### Step 4 - Advance combat
After initiatives are rolled, hitting Next will advance the initiative tracker to the next entity (monster or player).  

### Step 5 - Applying damage
The last column in the Initiative grid is Damage.  This field will always be blank.  However, clicking on this column will give you a textbox to enter the amount of damage to apply.  Enter a POSITIVE number to remove health.  Enter a NEGATIVE number to heal mobs.  

The formula for calculating Current HP is CurrentHP - Damage.  Therefore, entering a negative number changes this formula to CurrentHP + Damage.

Because of the grid that I am using, the proper way to enter damage is to click on the column in the row of the monster you wish to damage, enter a number, then click (do not press Enter) OUTSIDE of the grid (above the title bar, to the right of the border, etc)

### Fields
* Name - The name of the monster.  I add a number to the end of each monster to make applying damage easier when you have to look between the battle map and the initiative tracker.
* Initiative - The number rolled plus relevant modifiers.
* AC - Armor Class
* Max HP - This is the maximum HP for the monster that you gave it (when selecting a monster from the drop down it will use the average HP given in the Monster Manual.  "Max" is simply to differentiate it from "Current".  It is NOT the maximum amount of hit points available for a mob if you multiply their hit dice and add the modifier)
* Current HP - The mob's current HP
* Damage - A field to enter an amount of HP to take from the monster

Players DO NOT have AC, Max or Current HP fields.  This information is not necessary for the DM.

### Colors in the grid
* Purple - The entity whose turn it is currently
* Dark Green - Full health mob
* Light Green - Injured mob
* Yellow - "Bloody" mob
* Red - Dead mob
* White - Player

It should be noted that a mob will NEVER have less than 0 health.  This ensures that if you have a health-regenerating mob, such as a troll, when you activate his regen ability, it will raise their HP from 0 to 10 as the rules state it should.

## Extra Buttons
There are a few extra buttons meant to make life easier for the DM.

### Clear (under Monsters)
This button removes all monsters from the grid under the monsters tab.  It does NOT affect the initiative order.  Use this button in case you've made a mistake, or simply want to start over with your monsters.

### Clear Initiative (under Initiative)
This button clears the initiative grid, the monsters grid, as well as the player initiatives (but not the player names).  Use this button when combat is over and you're ready to start setting up the next encounter.

## Stat Block
![alt text](https://github.com/DarthKeller/InitiativeTracker/blob/master/Content/Images/StatBlock.PNG "Stat Block")

There is a stat block on the lower left of the index page.  Since we have the SRD, it will use all data from the SRD to populate fields and will attempt to create as complete a Monster Manual-esque stat block as possible.

There is one known exception: Under Legendary Actions there is usually a paragraph that explains how many points the creature has per round, and how many they regain each round.  This information is missing from the SRD, and as such, is missing from this project.

## Players
This page is not yet complete, but has a very simple interface.  It will load the data from the players.json file and display that data in a grid.  Clicking the Roll button at the bottom of the grid will roll Perception, Investigation and Stealth for each player in the grid, then display those results in the grid.

## Note
You MUST run this project on a server!  For Windows users, this means setting up IIS, creating an application, and pointing it at your copy of the Initiative Tracker project.  Since I'm using javascript to read json files, you cannot accomplish this while running either index.html or players.html from the file system directly.
