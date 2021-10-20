/*
 * Space Hulk Death Angel - The Card Game
 * Space Marine formation mock-up
 *
 * https://github.com/Blodhemn/spacehulkdeathangel
 */
const DEBUG = false;

/*
 * Rules and game content
 */
const spaceHulkDeathAngel = {
  "content": {
    "baseGame": {
      "gameSetupOption": 1,
      "description": "Base Game",
      "spaceMarines": [{
        "name": "Brother Claudio",
        "shortName": "BC",
        "team": "yellow",
        "range": 0
      }, {
        "name": "Brother Goriel",
        "shortName": "BG",
        "team": "yellow",
        "range": 2
      }, {
        "name": "Brother Leon",
        "shortName": "BL",
        "team": "red",
        "range": 3
      }, {
        "name": "Brother Valencio",
        "shortName": "BV",
        "team": "red",
        "range": 2
      }, {
        "name": "Brother Zael",
        "shortName": "BZ",
        "team": "purple",
        "range": 1
      }, {
        "name": "Brother Omnio",
        "shortName": "BO",
        "team": "purple",
        "range": 2
      }, {
        "name": "Brother Noctis",
        "shortName": "BN",
        "team": "green",
        "range": 2
      }, {
        "name": "Sergeant Gideon",
        "shortName": "SG",
        "team": "green",
        "range": 0
      }, {
        "name": "Lexicanium Calistarius",
        "shortName": "LC",
        "team": "grey",
        "range": 2
      }, {
        "name": "Brother Scipio",
        "shortName": "BS",
        "team": "grey",
        "range": 2
      }, {
        "name": "Sergeant Lorenzo",
        "shortName": "SL",
        "team": "blue",
        "range": 2
      }, {
        "name": "Brother Deino",
        "shortName": "BD",
        "team": "blue",
        "range": 2
      }]
    },
    "expansions": [{
        "name": "missionPack1",
        "gameSetupOption": 2,
        "description": "Mission Pack 1"
      }, {
        "name": "spaceMarinePack1",
        "gameSetupOption": 3,
        "description": "Space Marine Pack 1",
        "spaceMarines": [{
          "name": "Brother Adron",
          "shortName": "BA",
          "team": "yellow",
          "range": 1
        }]
      }, {
        "name": "deathwing",
        "gameSetupOption": 4,
        "description": "Deathwing"
      }, {
        "name": "tyranid",
        "gameSetupOption": 5,
        "description": "Tyranid"
      }, {
        "name": "wolfGuard",
        "gameSetupOption": 6,
        "description": "Wolf Guard (fan-made)"
      }
    ]
  },
  "rules": {
    "facingInitOrder": {
      "firstSegment": "left",
      "secondSegment": "right"
    }
  }
};

/*
 * Game configuration
 */
let game;
let teamsInCombat = [];
let spaceMarinesInCombat = [];

/*
 * Game setup
 */
let formation = {
  "spaceMarines": [],
  "positions": []
};
function setup() {
  let segmentSize = Math.ceil(spaceMarinesInCombat.length / 2);
  if (DEBUG) {
    console.log('Setting up formation...');
    console.log('Segment size', segmentSize);
    console.log('Space Marines in combat', JSON.stringify(spaceMarinesInCombat));
  }
  for (let index = 0; index < spaceMarinesInCombat.length; index++) {
    const spaceMarine = game.spaceMarines.find(marine => marine.name == spaceMarinesInCombat[index]);
    spaceMarine.position = index + 1;
    let segment = (spaceMarine.position <= segmentSize ? "firstSegment" : "secondSegment");
    spaceMarine.facing = spaceHulkDeathAngel.rules.facingInitOrder[segment];
    if (DEBUG) console.log(` #${index}:`, JSON.stringify(spaceMarine));
    formation.spaceMarines.push(spaceMarine);
    formation.positions.push({
      "row": index + 1,
      "left": {
        "targetableBy": []
      },
      "right": {
        "targetableBy": []
      }
    });
  }
}
/*
 * Flag which positions can be the targets of space marines
 */
function flagPositionsWithinSpaceMarinesReach() {
  // clear previous flags
  for (let position of formation.positions) {
    position.left.targetableBy = [];
    position.right.targetableBy = [];
  }
  if (DEBUG) console.log('Positions within space marines reach:');
  for (let spaceMarine of formation.spaceMarines) {
    for (let range = -spaceMarine.range; range <= spaceMarine.range; range++) {
      let targetPosition = spaceMarine.position + range;
      if (targetPosition > 0 && targetPosition <= formation.positions.length) {
        let targetRow = formation.positions.find(position => position.row == targetPosition);
        targetRow[spaceMarine.facing].targetableBy.push(spaceMarine.name);
      }
    }
  }
  if (DEBUG) {
    for (let position of formation.positions) {
      console.log(` Row${position.row}: Left=${position.left.targetableBy}  Right=${position.right.targetableBy}`);
    }
  }
}
/*
 * Refresh formation
 */
function refreshFormation() {
  flagPositionsWithinSpaceMarinesReach();
}

/*
 * Draw formation in text mode
 */
function drawFormation() {
  // convert team colors to rgb
  function palette(color) {
    switch (color) {
      case "blue": return "60, 100, 185";
      case "green": return "10, 120, 0";
      case "grey": return "110, 110, 110";
      case "purple": return "110, 20, 100";
      case "red": return "200, 0, 50";
      case "yellow": return "200, 160, 25";
      default: return "0, 0, 0";
    }
  }
  // make sure positions are sorted
  formation.positions.sort((a, b) => {
    return a.row - b.row;
  });
  // find max length for line beginning
  let maxLength = 0, buffer;
  for (let position of formation.positions) {
    buffer = '';
    for (let spaceMarineName of position.left.targetableBy) {
      let spaceMarine = formation.spaceMarines.find(marine => marine.name == spaceMarineName);
      buffer += `${spaceMarine.shortName} `;
      maxLength = (buffer.length > maxLength ? buffer.length : maxLength);
    }
  }
  // text-print formation
  for (let position of formation.positions) {
    let spaceMarineAtPosition = formation.spaceMarines.find(marine => marine.position == position.row);
    let output = '', style = [];
    // left side
    for (let spaceMarineName of position.left.targetableBy) {
      let spaceMarine = formation.spaceMarines.find(marine => marine.name == spaceMarineName);
      output += `%c${spaceMarine.shortName} `;
      style.push(`color: rgba(${palette(spaceMarine.team)});`);
    }
    output = output.padStart(maxLength + (output.match(/%c/g) || []).length * 2, ' ');
    // space marine
    output += `%c${spaceMarineAtPosition.facing == 'left' ? '< ' : '  '}`;
    style.push(`color: rgba(${palette()});`);
    output += `%c${spaceMarineAtPosition.shortName}(${spaceMarineAtPosition.range})`;
    style.push(`color: rgba(${palette()}); background: rgba(${palette(spaceMarineAtPosition.team)}, 0.25);`);
    output += `%c${spaceMarineAtPosition.facing == 'right' ? ' >' : '  '}`;
    style.push(`color: rgba(${palette()});`);
    // right side
    for (let spaceMarineName of position.right.targetableBy) {
      let spaceMarine = formation.spaceMarines.find(marine => marine.name == spaceMarineName);
      output += ` %c${spaceMarine.shortName}`;
      style.push(`color:  rgba(${palette(spaceMarine.team)});`);
    }
    console.log(output, ...style);
  }
}

/*
 * Switch space marines positions
 */
function moveSpaceMarine(name, direction) {
  const positionOffset = (direction == "up" ? -1 : 1);
  const spaceMarineInitiatingMovement = formation.spaceMarines.find(marine => marine.name == name || marine.shortName == name);
  const spaceMarineForcedToMove = formation.spaceMarines.find(marine => marine.position == spaceMarineInitiatingMovement.position + positionOffset);
  if (spaceMarineForcedToMove) {
    console.log(`Moving ${spaceMarineInitiatingMovement.name} ${direction == 'up' ? 'up' : 'down'}`);
    spaceMarineInitiatingMovement.position += positionOffset;
    spaceMarineForcedToMove.position -= positionOffset;
    refreshFormation();
  } else {
    console.log('Nothing to do');
  }
}
/*
 * Change space marine's facing
 */
function flipSpaceMarine(name) {
  const spaceMarine = formation.spaceMarines.find(marine => marine.name == name || marine.shortName == name);
  spaceMarine.facing = (spaceMarine.facing == "left" ? "right" : "left");
  console.log(`${spaceMarine.name} is now facing ${spaceMarine.facing}`);
  refreshFormation();
}
/*
 * Kill space marine
 */
function killSpaceMarine(name) {
  const spaceMarine = formation.spaceMarines.find(marine => marine.name == name || marine.shortName == name);
  for (let position = spaceMarine.position + 1; position <= formation.positions.length; position++) {
    let spaceMarineToShift = formation.spaceMarines.find(marine => marine.position == position);
    spaceMarineToShift.position--;
  }
  formation.positions.pop(); // remove the last row of the formation
  formation.spaceMarines.splice(formation.spaceMarines.indexOf(spaceMarine), 1);
  spaceMarinesInCombat.splice(spaceMarinesInCombat.indexOf(name), 1);
  console.log(`${spaceMarine.name} has died horribly!`);
  refreshFormation();
}

/*
 * Command stack handling
 */
let commandStack = [];
function stackCommand(command) {
  commandStack.push(command);
  if (DEBUG) console.log(`Commands in stack: ${JSON.stringify(commandStack)}`);
}
function reverseCommand(command) {
  switch (command.action) {
    case "move": moveSpaceMarine(command.params.name, command.params.direction == 'up' ? 'down' : 'up'); break;
    case "flip": flipSpaceMarine(command.params.name); break;
    case "kill": console.log(`Sorry, a Space Marine can't be resurrected...`); break;
    default: console.log('Nothing to do');
  }
}
function rollbackLastCommand() {
  let lastCommand = commandStack.pop();
  if (lastCommand) {
    if (DEBUG) {
      console.log(`Command to rollback: ${JSON.stringify(lastCommand)}`);
      console.log(`Commands remaining in stack: ${JSON.stringify(commandStack)}`);
    }
    reverseCommand(lastCommand);
  } else {
    console.log('Nothing to do');
  }
}

/*
 * Commands for text mode
 */
function draw() {
  drawFormation();
}
function u/*ndo*/() {
  rollbackLastCommand();
  draw();
}
function m/*ove*/(name, direction/* "up" or "down" */) {
  moveSpaceMarine(name, direction);
  stackCommand({
      "action": "move",
      "params": {
        "name": name,
        "direction": direction
      }
    });
  draw();
}
function f/*lip*/(name) {
  flipSpaceMarine(name);
  stackCommand({
    "action": "flip",
    "params": {
      "name": name
    }
  });
  draw();
}
function k/*ill*/(name) {
  killSpaceMarine(name);
  stackCommand({
    "action": "kill",
    "params": {
      "name": name
    }
  });
  draw();
}
function usage() {
  console.log(`To move Space Marine 'SM' type: m('SM','up') or m('SM','down')`);
  console.log(`To flip Space Marine 'SM' type: f('SM')`);
  console.log(`To kill Space Marine 'SM' type: k('SM')`);
  console.log(`To undo a previous command type: u()`);
}

/*
 * Game initialisation
 */
 let initWizard = {
  "completed": false,
  "steps": [{
    "index": 1,
    "name": "game-setup",
    "description": "Select your game",
    "done": false
  }, {
    "index": 2,
    "name": "teams-setup",
    "description": "Select your teams (use the combat team markers for randomness)",
    "done": false
  }, {
    "index": 3,
    "name": "marines-setup",
    "description": "Select Space Marines in order (from top to bottom)",
    "done": false
  }]
};
function initWizardStepToComplete() {
  // make sure steps are sorted
  initWizard.steps.sort((a, b) => {
    return a.index - b.index;
  });
  // exclude steps already done
  let remainingWizardSteps = initWizard.steps.filter(step => !step.done);
  if (remainingWizardSteps.length === 0) {
    initWizard.completed = true;
    return undefined;
  } else {
    // return first undone step
    return remainingWizardSteps[0];
  }
}
function select(userEntry) { completeInitWizardStep(userEntry); } // user friendly command
function completeInitWizardStep(userEntry) {
  let stepToComplete = initWizardStepToComplete();
  if (stepToComplete && userEntry) {
    switch (stepToComplete.name) {
      case "game-setup":
        let gameSetupOption = parseInt(userEntry);
        if (gameSetupOption == spaceHulkDeathAngel.content.baseGame.gameSetupOption) {
          console.log(`Setting up ${spaceHulkDeathAngel.content.baseGame.description}...`);
          game = spaceHulkDeathAngel.content.baseGame;
          stepToComplete.done = true;
        } else {
          let chosenExpansion = spaceHulkDeathAngel.content.expansions.find(expansion => expansion.gameSetupOption == gameSetupOption);
          if (chosenExpansion) {
            console.log(`Setting up ${chosenExpansion.description} expansion...`);
            game = chosenExpansion;
            stepToComplete.done = true;
          }
        }
        break;
      case "teams-setup":
        console.log(`Setting up teams...`);
        teamsInCombat = userEntry;
        stepToComplete.done = true;
        break;
      case "marines-setup":
        console.log(`Setting up Space Marines...`);
        spaceMarinesInCombat = userEntry;
        stepToComplete.done = true;
        break;
    }
    // proceed to next step
    runInitWizard();
  }
}
function runInitWizard() {
  let stepToComplete = initWizardStepToComplete();
  if (stepToComplete) {
    console.log(`${stepToComplete.index}) ${stepToComplete.description}:`);
    switch (stepToComplete.name) {
      case "game-setup":
        console.log(`   Type select('${spaceHulkDeathAngel.content.baseGame.gameSetupOption}') for ${spaceHulkDeathAngel.content.baseGame.description}`);
        for (let expansion of spaceHulkDeathAngel.content.expansions) {
          if (typeof expansion.gameSetupOption !== 'undefined') {
            console.log(`   Type select('${expansion.gameSetupOption}') for ${expansion.description} expansion`);
          }
        }
        break;
      case "teams-setup":
        let availableTeams = [... new Set(game.spaceMarines.map(marine => marine.team))];
        console.log(`   Available teams: ${availableTeams.toString().replaceAll(',', ', ')}`);
        console.log(`   Type select(['team1', 'team2', ... ])`);
        break;
      case "marines-setup":
        let teamsInCombatSpaceMarines = game.spaceMarines.filter(marine => teamsInCombat.includes(marine.team));
        let availableMarines = [... new Set(teamsInCombatSpaceMarines.map(marine => marine.name))];
        console.log(`   Space Marines: ${availableMarines.toString().replaceAll(',', ', ')}`);
        console.log(`   Type select(['Space Marine 1', 'Space Marine 2', ... ])`);
        break;
    }
  } else if (initWizard.completed) {
    setup();
    flagPositionsWithinSpaceMarinesReach();
    console.log('Formation is ready!');
    drawFormation();
    usage();
  }
}
(init = function () {
  console.log('------------------------------------------');
  console.log(' Space Hulk Death Angel - The Card Game');
  console.log(' Space Marine formation mock-up');
  console.log('------------------------------------------');
  runInitWizard();
})();
