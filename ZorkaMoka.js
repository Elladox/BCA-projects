// prebuilt code
const readline = require("readline");
const { start } = require("repl");
const rlInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rlInterface.question(questionText, resolve);
  });
}
//start of my code
class Item {
  constructor(iName, iDescription, iAction, iTakeable, Idurability) {
    this.name = iName;
    this.description = iDescription;
    this.takeable = iTakeable || false;
    this.action = iAction || "nothing happens";
    this.durability = Idurability;
  }
  take() {
    //check if item takable and is in room's inventory
    if (this.takeable && locationTable[curLoc].inventory.includes(this.name)) {
      //add item to player inventory
      playerInventory.push(this.name);
      //remove item from the room's inventory
      let takeIndex = locationTable[curLoc].inventory.indexOf(this.name);
      locationTable[curLoc].inventory.splice(takeIndex, 1);
      //return a confirmation value to user
      return `you picked up ${this.name}, you inventory is currently ${playerInventory}`;
    } else {
      return `you are unable to pick that up`;
    }
  }
  use() {
    //console.log(this.durability);
    if (playerInventory.includes(this.name)) {
      if (this.durability > 0) {
        this.durability--;
        //console.log(this.durability)
        if (this.name === `stick` && curLoc === `startRoom`) {
          return `you wave to stick around, ready to take on the world`;
        } else {
          //console.log(this.durability)
          return this.action;
        }
      } else if (this.durability <= 0) {
        return `you cant use it, its broken!`;
      }
    } else {
      return `you don't have one of those to use`;
    }
  }

  drop() {
    //if its in your inventory remove it from you inventory and add it to your current location's inventory
    if (playerInventory.includes(this.name)) {
      //add it to the room's inventory
      locationTable[curLoc].inventory.push(this.name);
      //remove it from the player's inventory
      let dropIndex = playerInventory.indexOf(this.name);
      playerInventory.splice(dropIndex, 1);
      return `you dropped ${this.name},`;
    } else {
      return `you don't have one of those to drop`;
    }
  }
}
class Room {
  constructor(name, description, inventory, connectingRooms) {
    this.location = name;
    this.description = description;
    this.inventory = inventory;
    this.conRooms = connectingRooms;
  }
}

let startRoom = new Room(
  "The first room",
  "the room that you started in!",
  ["rock", "stick"],
  ["secRoom"]
);
let secRoom = new Room(
  "the second room",
  "the room after the first one!",
  [],
  ["startRoom"]
);

let rock = new Item(
  "rock",
  "its a small round rock",
  "you bash your ahead against the rock, much like I do against this code",
  true,
  Infinity
);

let stick = new Item(
  "stick",
  "its a small stick",
  "you break the stick in half",
  true,
  1
);

let torch = new Item(
  "torch",
  "a sputtering torch, the light it gives off is comforting however",
  `You raise the torch above your head, illuminating your surroundings`,
  true,
  Infinity
);

let plaque = new Item(
  "plaque",
  `its a plaque dog`,
  `how do you think you use a plaque?`,
  false,
  Infinity
);
let skeleton = new Item(
  'skeleton',
  'its a skeleton my man',
  'how do you plan to use a skeleton?',
  false,
  Infinity
)

let vial = new Item(
  'vial',
  'its a glass vial full of an amber liquid',
  'you guzzle it down like its not an unknown liquid',
  true,
  1
)

let entrance = new Room(
  "entrance",
  `
  You are in the center of the entrance room. It is of a medium size and lit by sconces high up on the walls. In front of you is a large foreboding metal door door with a diamond indent at its center, next to the door a square plaque is illuminated by the flickering torchlight. 
  To your left is a [tunnel], the light from the sconces doesn't go very far and you cannot see how deep the tunnel is
  to your right is a [corridor] with marble tiles and bright torches on the walls
  `,
  ["plaque", "rock", "torch"],
  ["tunnel", "corridor"]
);

let darkRoom = new Room (
  'a dark room',
  `
  you are in a dark cave. Your torchlight plays off the many stalagmites, throwing dozens of shadows about the room. In the center of the room is a skeleton curled up in the fetal position
  `, 
  ['skeleton'],
  ['tunnel']
)



let tunnel = new Room(
  "tunnel",
  `
  You are in a long dark tunnel. The walls are covered in skittering shadows that make you queasy if you try to focus on them. At one end you see the warm light of the [entrance], at the other you see the opening of a [cave] 
  `,
  [],
  [`entrance`, 'darkRoom']
);

let corridor = new Room(
  "corridor",
  `
  its a corridor bro
  `,
  [],
  [`entrance`]
);

let itemTable = {
  rock: rock,
  stick: stick,
  plaque: plaque,
  torch: torch,
  skeleton: skeleton,
  vial: vial
};
let locationTable = {
  startRoom: startRoom,
  secRoom: secRoom,
  tunnel: tunnel,
  entrance: entrance,
  corridor: corridor,
  cave: darkRoom
};
let curLoc = "entrance";
let playerInventory = [];
/* function moveRoom(newRoom) {
  if (locationTable[target].connectingRooms.includes(newRoom)) {
    curLoc = newRoom;
    console.log(`you are now in ${curLoc}`);
  } else {
    console.log(`you cannot go to ${newRoom} from ${curLoc}`);
  }
} */

console.log(`
You have traveled far and wide searching for the lost dungeon of ZorkaMorka, having finally found it you stride forth. 
Carrying nothing but your wits and the clothes on your back you descend in search of Treasure!
 As you enter the dungeon you look around to get your bearings
 `);
console.log(entrance.description);

async function play() {
  //ask for user input
  let userAction = await ask("what would you like to do?");
  //sanitize and split user input
  let inputArray = userAction /* .toLowerCase() */
    .split(" ");
  //the first string of the user input becomes the action and the second becomes the target
  let action = inputArray[0];
  let target = inputArray[1];

  //if the action is valid do something, with the target as the argument
  if (action === "take") {
    //check if the target is valid so it doesn't error out trying to use an undefined argument
    if (itemTable[target] instanceof Item) {
      console.log(itemTable[target].take());
    } else {
      //if the action isn't valid throw an
      console.log("you cant pick that up!");
    }
  } else if (action === "move") {
    if (
      locationTable[target].location === `tunnel` &&
      !playerInventory.includes("torch")
    ) {
      console.log(
        `no way you can make it through that tunnel without a light source!`
      );
    } else {
      if (locationTable[target] instanceof Room) {
        //check if the target location is a valid place the user can go from the current location
        if (locationTable[target].conRooms.includes(curLoc)) {
          //if it is update the current location
          curLoc = target;
          console.log(`you are now in ${locationTable[curLoc].description}`);
        } else {
          //otherwise throw and error
          console.log(`you cannot go to ${target} from ${curLoc}`);
        }
      } else {
        console.log(`that isn't a place you can go`);
      }
    } 
  } else if (action === "drop") {
    if (itemTable[target] instanceof Item) {
      console.log(itemTable[target].drop());
    } else {
      console.log(`you don't have one of those to drop`);
    }
  } else if (action === "lookAround") {
    //re-display the description of the room, and then print the room's inventory as a list of interactive things within the room
    console.log(`
    
    you are in ${locationTable[curLoc].description}
    looking closer you see the following objects of note:
    a ${locationTable[curLoc].inventory.join(", a ")}
    `);
  } else if (action === "examine") {
//set up exceptions for when cerating things are examined
if(itemTable[target] === 'skeleton' && (!darkRoom.inventory.includes('vial') && !playerInventory.includes('vial'))) {
darkRoom.inventory.push('vial')
console.log(darkRoom.inventory)
  }
    //return the description of an item. May cause some confusing if I dont also let the user examine locaitons
    if (itemTable[target] instanceof Item) {
      console.log(itemTable[target].description);
    } else {
      console.log(`you cant examine that`);
    }
  } else if (action === "use") {
    //use a given item. The use method has a number of exceptions that check for certain conditions
    if (itemTable[target] instanceof Item) {
      console.log(itemTable[target].use());
      // itemTable[target].action = "You already used this buddy";
    } else {
      console.log(`You cant use that`);
    }
  } else if (action === "inventory") {
    console.log(playerInventory /* .join(', a ' )*/);
  } else {
    console.log(`That was an invalid command, please try again`);
  }

  return play();
}

play();
