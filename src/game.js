const heroes = [
  {
    id: "knight",
    name: "Mara",
    className: "Oathbound Knight",
    mark: "K",
    summary: "High HP, strong attacks, reliable saves.",
    maxHp: 34,
    maxFocus: 3,
    stats: { might: 4, guile: 1, lore: 1, grit: 3 },
    inventory: ["Iron shield", "Ration", "Lantern"]
  },
  {
    id: "rogue",
    name: "Nyx",
    className: "Lockstep Rogue",
    mark: "R",
    summary: "Fast, lucky, and excellent at traps.",
    maxHp: 25,
    maxFocus: 5,
    stats: { might: 2, guile: 4, lore: 1, grit: 2 },
    inventory: ["Thieves' tools", "Smoke vial", "Lantern"]
  },
  {
    id: "mystic",
    name: "Sol",
    className: "Moonwell Mystic",
    mark: "M",
    summary: "Lower HP, high lore, focus-fueled recovery.",
    maxHp: 22,
    maxFocus: 7,
    stats: { might: 1, guile: 2, lore: 4, grit: 2 },
    inventory: ["Moon charm", "Herb bundle", "Lantern"]
  }
];

const rooms = [
  {
    title: "The Listening Gate",
    type: "arcane",
    description: "A stone door hums with a voice that asks for a secret you have never told.",
    actions: [
      { label: "Force the gate", stat: "might", dc: 13, success: { text: "The gate cracks open under raw resolve.", hp: 0, focus: 0, loot: "Stone splinter" }, fail: { text: "The door screams back. Your bones remember it.", hp: -5, focus: 0 } },
      { label: "Answer with a riddle", stat: "lore", dc: 12, success: { text: "The gate laughs and swings inward.", hp: 0, focus: 1, loot: "Whisper key" }, fail: { text: "The riddle loops until your thoughts fray.", hp: -2, focus: -1 } }
    ]
  },
  {
    title: "Hall of Waiting Blades",
    type: "trap",
    description: "Thin slots line both walls. The dust on the floor is cut into neat little squares.",
    actions: [
      { label: "Disarm the pattern", stat: "guile", dc: 14, success: { text: "You pin the mechanism with a perfect little click.", hp: 0, focus: 1, loot: "Spring needle" }, fail: { text: "A blade kisses your ribs before you roll clear.", hp: -7, focus: 0 } },
      { label: "March through guarded", stat: "grit", dc: 13, success: { text: "Steel rings from your guard, but none finds blood.", hp: -1, focus: 0 }, fail: { text: "You reach the far side with new red lines.", hp: -6, focus: 0 } }
    ]
  },
  {
    title: "The Candle Eater",
    type: "beast",
    description: "A hunched thing drinks light from the room. Its antlers scrape the ceiling.",
    actions: [
      { label: "Strike first", stat: "might", dc: 15, success: { text: "Your blow lands before the beast finishes inhaling.", hp: -2, focus: 1, loot: "Black antler" }, fail: { text: "It swallows the light, then slams you into stone.", hp: -9, focus: 0 } },
      { label: "Bait it with the lantern", stat: "guile", dc: 13, success: { text: "It lunges at the light and crashes into a pillar.", hp: 0, focus: 1 }, fail: { text: "It takes the bait and the lantern with it.", hp: -4, focus: -1 } }
    ]
  },
  {
    title: "Saint of the Dry Well",
    type: "treasure",
    description: "An old shrine offers a silver cup, a cracked mirror, and a bowl of clear water.",
    actions: [
      { label: "Drink the water", stat: "grit", dc: 11, success: { text: "Cold strength returns to your hands.", hp: 7, focus: 1, loot: "Blessed cup" }, fail: { text: "The water is clean, but the memory inside it hurts.", hp: -3, focus: 1 } },
      { label: "Read the mirror", stat: "lore", dc: 14, success: { text: "The mirror shows tomorrow's danger. You keep the angle.", hp: 0, focus: 2, loot: "Mirror shard" }, fail: { text: "The mirror shows too many versions of your last breath.", hp: -2, focus: -2 } }
    ]
  },
  {
    title: "The Waking Vault",
    type: "arcane",
    description: "The final chamber opens like an eye. Every coin on the floor turns to watch you.",
    actions: [
      { label: "Claim the relic", stat: "lore", dc: 16, success: { text: "You name the vault's true shape and take its heart.", hp: 0, focus: 0, loot: "Sunken relic", win: true }, fail: { text: "The vault rejects your name and collapses inward.", hp: -10, focus: 0 } },
      { label: "Endure the curse", stat: "grit", dc: 15, success: { text: "You walk through the curse and leave it starving.", hp: -3, focus: 0, loot: "Sunken relic", win: true }, fail: { text: "The curse hooks under your skin.", hp: -11, focus: -1 } }
    ]
  }
];

const state = {
  hero: null,
  hp: 0,
  focus: 0,
  roomIndex: 0,
  inventory: [],
  complete: false
};

const nodes = {
  partySelect: document.querySelector("#party-select"),
  portrait: document.querySelector("#portrait"),
  heroName: document.querySelector("#hero-name"),
  heroClass: document.querySelector("#hero-class"),
  hpText: document.querySelector("#hp-text"),
  hpBar: document.querySelector("#hp-bar"),
  focusText: document.querySelector("#focus-text"),
  focusBar: document.querySelector("#focus-bar"),
  statGrid: document.querySelector("#stat-grid"),
  inventoryList: document.querySelector("#inventory-list"),
  mapStrip: document.querySelector("#map-strip"),
  roomArt: document.querySelector("#room-art"),
  roomLabel: document.querySelector("#room-label"),
  roomTitle: document.querySelector("#room-title"),
  roomDescription: document.querySelector("#room-description"),
  actionGrid: document.querySelector("#action-grid"),
  die: document.querySelector("#die"),
  rollSummary: document.querySelector("#roll-summary"),
  logList: document.querySelector("#log-list"),
  restart: document.querySelector("#restart-button")
};

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addLog(text) {
  const entry = document.createElement("li");
  entry.textContent = text;
  nodes.logList.append(entry);
}

function chooseHero(heroId) {
  const hero = heroes.find((item) => item.id === heroId);
  state.hero = hero;
  state.hp = hero.maxHp;
  state.focus = hero.maxFocus;
  state.roomIndex = 0;
  state.inventory = [...hero.inventory];
  state.complete = false;
  nodes.logList.innerHTML = "";
  addLog(`${hero.name} enters the ruin.`);
  render();
}

function resolveAction(action) {
  if (!state.hero || state.complete) return;

  const roll = rollD20();
  const modifier = state.hero.stats[action.stat];
  const focused = state.focus > 0 && roll < action.dc - modifier;
  const focusBonus = focused ? 2 : 0;
  const total = roll + modifier + focusBonus;
  const passed = roll === 20 || total >= action.dc;
  const outcome = passed ? action.success : action.fail;

  if (focused) state.focus -= 1;
  state.hp = clamp(state.hp + (outcome.hp || 0), 0, state.hero.maxHp);
  state.focus = clamp(state.focus + (outcome.focus || 0), 0, state.hero.maxFocus);

  if (outcome.loot && !state.inventory.includes(outcome.loot)) {
    state.inventory.push(outcome.loot);
  }

  nodes.die.textContent = roll;
  nodes.die.classList.remove("is-rolling");
  window.requestAnimationFrame(() => nodes.die.classList.add("is-rolling"));
  nodes.rollSummary.textContent = `d20 ${roll} + ${action.stat} ${modifier}${focusBonus ? " + focus 2" : ""} = ${total} vs DC ${action.dc}`;
  addLog(`${passed ? "Success" : "Failure"}: ${outcome.text}`);

  if (state.hp <= 0) {
    state.complete = true;
    renderEnding(false);
    return;
  }

  if (outcome.win) {
    state.complete = true;
    renderEnding(true);
    return;
  }

  state.roomIndex += 1;
  render();
}

function renderHeroes() {
  nodes.partySelect.innerHTML = "";
  heroes.forEach((hero) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `hero-button${state.hero?.id === hero.id ? " is-selected" : ""}`;
    button.innerHTML = `<strong>${hero.name}, ${hero.className}</strong><span>${hero.summary}</span>`;
    button.addEventListener("click", () => chooseHero(hero.id));
    nodes.partySelect.append(button);
  });
}

function renderSheet() {
  if (!state.hero) {
    nodes.portrait.textContent = "?";
    nodes.statGrid.innerHTML = "";
    nodes.inventoryList.innerHTML = "<li>Choose a hero to begin.</li>";
    nodes.hpText.textContent = "0 / 0";
    nodes.focusText.textContent = "0 / 0";
    nodes.hpBar.style.width = "0%";
    nodes.focusBar.style.width = "0%";
    return;
  }

  nodes.portrait.textContent = state.hero.mark;
  nodes.heroName.textContent = state.hero.name;
  nodes.heroClass.textContent = state.hero.className;
  nodes.hpText.textContent = `${state.hp} / ${state.hero.maxHp}`;
  nodes.focusText.textContent = `${state.focus} / ${state.hero.maxFocus}`;
  nodes.hpBar.style.width = `${(state.hp / state.hero.maxHp) * 100}%`;
  nodes.focusBar.style.width = `${(state.focus / state.hero.maxFocus) * 100}%`;

  nodes.statGrid.innerHTML = "";
  Object.entries(state.hero.stats).forEach(([stat, value]) => {
    const tile = document.createElement("div");
    tile.className = "stat";
    tile.innerHTML = `<span>${stat}</span><strong>+${value}</strong>`;
    nodes.statGrid.append(tile);
  });

  nodes.inventoryList.innerHTML = "";
  state.inventory.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    nodes.inventoryList.append(li);
  });
}

function renderMap() {
  nodes.mapStrip.innerHTML = "";
  rooms.forEach((_, index) => {
    const node = document.createElement("div");
    node.className = "map-node";
    if (state.hero && index === state.roomIndex && !state.complete) node.classList.add("is-current");
    if (state.hero && index < state.roomIndex) node.classList.add("is-cleared");
    nodes.mapStrip.append(node);
  });
}

function renderRoom() {
  if (!state.hero) {
    nodes.roomLabel.textContent = "Room 0";
    nodes.roomTitle.textContent = "Choose your adventurer";
    nodes.roomDescription.textContent = "Each hero changes the odds. Pick one to enter the ruin.";
    nodes.roomArt.className = "room-art";
    nodes.actionGrid.innerHTML = "";
    return;
  }

  const room = rooms[state.roomIndex];
  nodes.roomLabel.textContent = `Room ${state.roomIndex + 1} of ${rooms.length}`;
  nodes.roomTitle.textContent = room.title;
  nodes.roomDescription.textContent = room.description;
  nodes.roomArt.className = `room-art ${room.type}`;
  nodes.actionGrid.innerHTML = "";

  room.actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-button";
    button.innerHTML = `<strong>${action.label}</strong><span>${action.stat.toUpperCase()} check, DC ${action.dc}</span>`;
    button.addEventListener("click", () => resolveAction(action));
    nodes.actionGrid.append(button);
  });
}

function renderEnding(won) {
  renderSheet();
  renderMap();
  nodes.roomLabel.textContent = won ? "Victory" : "Defeat";
  nodes.roomTitle.textContent = won ? "You escape with the sunken relic" : "The dungeon keeps another name";
  nodes.roomDescription.textContent = won
    ? "Your adventurer staggers into dawn with treasure, scars, and a story nobody will fully believe."
    : "The ruin goes quiet. Somewhere below, the vault counts one more shadow among its coins.";
  nodes.roomArt.className = `room-art ${won ? "treasure" : "beast"}`;
  nodes.actionGrid.innerHTML = "";
  addLog(won ? "Victory: the delve is complete." : "Defeat: the delve ends here.");
}

function render() {
  renderHeroes();
  renderSheet();
  renderMap();
  if (!state.complete) renderRoom();
}

nodes.restart.addEventListener("click", () => {
  const heroId = state.hero?.id;
  if (heroId) chooseHero(heroId);
  else render();
});

render();
