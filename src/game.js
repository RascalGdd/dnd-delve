const CARD_POOL = {
  slash: {
    name: "Slash",
    type: "Attack",
    cost: 1,
    rarity: "starter",
    art: "blade",
    text: "Deal 6 damage.",
    upgradeText: "Deal 9 damage.",
    play: (card) => damage(card.upgraded ? 9 : 6)
  },
  brace: {
    name: "Brace",
    type: "Skill",
    cost: 1,
    rarity: "starter",
    art: "shield",
    text: "Gain 5 block.",
    upgradeText: "Gain 8 block.",
    play: (card) => gainBlock(card.upgraded ? 8 : 5)
  },
  spark: {
    name: "Spark",
    type: "Attack",
    cost: 0,
    rarity: "common",
    art: "flame",
    text: "Deal 3 damage. Draw 1.",
    upgradeText: "Deal 5 damage. Draw 1.",
    play: (card) => {
      damage(card.upgraded ? 5 : 3);
      drawCards(1);
    }
  },
  lunge: {
    name: "Lunge",
    type: "Attack",
    cost: 2,
    rarity: "common",
    art: "blade",
    text: "Deal 13 damage.",
    upgradeText: "Deal 17 damage.",
    play: (card) => damage(card.upgraded ? 17 : 13)
  },
  ward: {
    name: "Ward",
    type: "Skill",
    cost: 1,
    rarity: "common",
    art: "shield",
    text: "Gain 4 block. Draw 1.",
    upgradeText: "Gain 7 block. Draw 1.",
    play: (card) => {
      gainBlock(card.upgraded ? 7 : 4);
      drawCards(1);
    }
  },
  ignite: {
    name: "Ignite",
    type: "Power",
    cost: 1,
    rarity: "common",
    art: "flame",
    text: "Gain 1 strength.",
    upgradeText: "Gain 2 strength.",
    exhaust: true,
    play: (card) => gainStrength(card.upgraded ? 2 : 1)
  },
  sap: {
    name: "Sap",
    type: "Skill",
    cost: 1,
    rarity: "common",
    art: "moon",
    text: "Apply 2 weak.",
    upgradeText: "Apply 3 weak. Gain 3 block.",
    play: (card) => {
      applyEnemyStatus("weak", card.upgraded ? 3 : 2);
      if (card.upgraded) gainBlock(3);
    }
  },
  expose: {
    name: "Expose",
    type: "Skill",
    cost: 1,
    rarity: "common",
    art: "eye",
    text: "Apply 2 vulnerable.",
    upgradeText: "Apply 3 vulnerable.",
    play: (card) => applyEnemyStatus("vulnerable", card.upgraded ? 3 : 2)
  },
  flourish: {
    name: "Flourish",
    type: "Attack",
    cost: 1,
    rarity: "uncommon",
    art: "blade",
    text: "Deal 5 damage twice.",
    upgradeText: "Deal 7 damage twice.",
    play: (card) => {
      damage(card.upgraded ? 7 : 5);
      damage(card.upgraded ? 7 : 5);
    }
  },
  ironveil: {
    name: "Ironveil",
    type: "Skill",
    cost: 2,
    rarity: "uncommon",
    art: "shield",
    text: "Gain 14 block.",
    upgradeText: "Gain 18 block.",
    play: (card) => gainBlock(card.upgraded ? 18 : 14)
  },
  gambit: {
    name: "Gambit",
    type: "Skill",
    cost: 0,
    rarity: "uncommon",
    art: "eye",
    text: "Discard 1 random card. Gain 2 energy.",
    upgradeText: "Discard 1 random card. Gain 3 energy.",
    play: (card) => {
      discardRandomCard();
      state.combat.energy += card.upgraded ? 3 : 2;
    }
  },
  lanternstorm: {
    name: "Lanternstorm",
    type: "Attack",
    cost: 2,
    rarity: "rare",
    art: "flame",
    text: "Deal 7 damage 3 times. Exhaust.",
    upgradeText: "Deal 9 damage 3 times. Exhaust.",
    exhaust: true,
    play: (card) => {
      for (let i = 0; i < 3; i += 1) damage(card.upgraded ? 9 : 7);
    }
  },
  rewind: {
    name: "Rewind",
    type: "Skill",
    cost: 1,
    rarity: "rare",
    art: "moon",
    text: "Draw 3. Exhaust.",
    upgradeText: "Draw 4. Gain 1 energy. Exhaust.",
    exhaust: true,
    play: (card) => {
      drawCards(card.upgraded ? 4 : 3);
      if (card.upgraded) state.combat.energy += 1;
    }
  },
  bulwark: {
    name: "Bulwark",
    type: "Power",
    cost: 2,
    rarity: "rare",
    art: "shield",
    text: "Gain 2 dexterity.",
    upgradeText: "Gain 3 dexterity.",
    exhaust: true,
    play: (card) => gainDexterity(card.upgraded ? 3 : 2)
  }
};

const HEROES = [
  {
    id: "warden",
    name: "Ash Warden",
    subtitle: "Defensive bruiser",
    mark: "AW",
    maxHp: 82,
    gold: 75,
    startingRelic: "coalHeart",
    deck: ["slash", "slash", "slash", "slash", "brace", "brace", "brace", "ignite"]
  },
  {
    id: "knife",
    name: "Glass Knife",
    subtitle: "Draws fast, blocks light",
    mark: "GK",
    maxHp: 66,
    gold: 90,
    startingRelic: "silkGlove",
    deck: ["slash", "slash", "slash", "spark", "spark", "brace", "ward", "gambit"]
  },
  {
    id: "oracle",
    name: "Blue Oracle",
    subtitle: "Status control and powers",
    mark: "BO",
    maxHp: 70,
    gold: 80,
    startingRelic: "moonLens",
    deck: ["slash", "slash", "slash", "brace", "brace", "sap", "expose", "rewind"]
  }
];

const RELICS = {
  coalHeart: { name: "Coal Heart", text: "Start each combat with 1 strength.", icon: "CH" },
  silkGlove: { name: "Silk Glove", text: "Draw 1 extra card on turn 1.", icon: "SG" },
  moonLens: { name: "Moon Lens", text: "First skill each combat costs 0.", icon: "ML" },
  bronzeRoot: { name: "Bronze Root", text: "Start each combat with 6 block.", icon: "BR" },
  coinMoth: { name: "Coin Moth", text: "Gain 12 extra gold after combat.", icon: "CM" },
  blackCandle: { name: "Black Candle", text: "Attacks deal 1 extra damage.", icon: "BC" },
  glassFeather: { name: "Glass Feather", text: "Draw 1 card after playing 3 cards in a turn.", icon: "GF" },
  emberCell: { name: "Ember Cell", text: "Gain 1 extra energy on turn 1.", icon: "EC" },
  riverStone: { name: "River Stone", text: "Rest sites heal 12 more HP.", icon: "RS" },
  silverNail: { name: "Silver Nail", text: "Elites and bosses take 2 damage at combat start.", icon: "SN" }
};

const ENEMIES = {
  ratkin: { name: "Ratkin Pack", hp: 38, art: "beast", pattern: ["attack", "attack", "block"] },
  sentry: { name: "Copper Sentry", hp: 46, art: "machine", pattern: ["block", "attack", "attack"] },
  cultist: { name: "Bell Cultist", hp: 42, art: "cult", pattern: ["buff", "attack", "attack"] },
  eliteKnight: { name: "Mirror Knight", hp: 74, art: "elite", elite: true, pattern: ["buff", "attack", "block", "attack"] },
  eliteMaw: { name: "Vault Maw", hp: 88, art: "beast", elite: true, pattern: ["attack", "debuff", "attack"] },
  boss: { name: "The Bell Above", hp: 150, art: "boss", boss: true, pattern: ["buff", "attack", "block", "debuff", "attack"] }
};

const NODE_META = {
  enemy: { label: "Monster", icon: "M" },
  elite: { label: "Elite", icon: "E" },
  event: { label: "Event", icon: "?" },
  rest: { label: "Rest", icon: "R" },
  shop: { label: "Shop", icon: "$" },
  treasure: { label: "Treasure", icon: "T" },
  boss: { label: "Boss", icon: "B" }
};

const state = {
  hero: null,
  screen: "start",
  floor: 0,
  hp: 0,
  maxHp: 0,
  gold: 0,
  deck: [],
  relics: [],
  map: [],
  currentNode: null,
  availableNodes: [],
  combat: null,
  rewards: null,
  shop: null,
  lastCardId: 1,
  log: []
};

const nodes = {
  heroSelect: document.querySelector("#hero-select"),
  grid: document.querySelector("#game-grid"),
  screen: document.querySelector("#screen"),
  newRun: document.querySelector("#new-run-button"),
  compactDeck: document.querySelector("#compact-deck-button"),
  heroAvatar: document.querySelector("#hero-avatar"),
  heroName: document.querySelector("#hero-name"),
  heroSubtitle: document.querySelector("#hero-subtitle"),
  hpText: document.querySelector("#hp-text"),
  hpBar: document.querySelector("#hp-bar"),
  goldText: document.querySelector("#gold-text"),
  goldPips: document.querySelector("#gold-pips"),
  floorText: document.querySelector("#floor-text"),
  deckCount: document.querySelector("#deck-count"),
  relicCount: document.querySelector("#relic-count"),
  relicGrid: document.querySelector("#relic-grid"),
  deckList: document.querySelector("#deck-list"),
  logList: document.querySelector("#log-list")
};

function cloneCard(id, upgraded = false) {
  const def = CARD_POOL[id];
  return { ...def, id, instanceId: state.lastCardId++, upgraded };
}

function rngItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hasRelic(id) {
  return state.relics.includes(id);
}

function addLog(text) {
  state.log.push(text);
  if (state.log.length > 60) state.log.shift();
}

function cardText(card) {
  return card.upgraded ? card.upgradeText : card.text;
}

function cardName(card) {
  return `${card.name}${card.upgraded ? "+" : ""}`;
}

function startRun(heroId) {
  const hero = HEROES.find((candidate) => candidate.id === heroId);
  state.hero = hero;
  state.screen = "map";
  state.floor = 0;
  state.maxHp = hero.maxHp;
  state.hp = hero.maxHp;
  state.gold = hero.gold;
  state.deck = hero.deck.map((id) => cloneCard(id));
  state.relics = [hero.startingRelic];
  state.map = createMap();
  state.currentNode = null;
  state.availableNodes = state.map[0].map((node) => node.id);
  state.combat = null;
  state.rewards = null;
  state.shop = null;
  state.log = [];
  addLog(`${hero.name} lights the first stair.`);
  render();
}

function createMap() {
  const rows = [
    ["enemy", "enemy", "event"],
    ["enemy", "event", "shop"],
    ["elite", "enemy", "treasure"],
    ["rest", "event", "enemy"],
    ["elite", "shop", "enemy"],
    ["rest", "treasure", "enemy"],
    ["boss"]
  ];

  return rows.map((types, depth) =>
    types.map((type, lane) => ({
      id: `${depth}-${lane}`,
      depth,
      lane,
      type,
      links: depth === rows.length - 1
        ? []
        : rows[depth + 1].map((_, nextLane) => `${depth + 1}-${nextLane}`)
    }))
  );
}

function enterNode(nodeId) {
  if (!state.availableNodes.includes(nodeId)) return;
  const node = state.map.flat().find((candidate) => candidate.id === nodeId);
  state.currentNode = node;
  state.availableNodes = node.links;
  state.floor = node.depth + 1;

  if (node.type === "enemy") startCombat(randomEnemy(false));
  if (node.type === "elite") startCombat(randomEnemy(true));
  if (node.type === "boss") startCombat("boss");
  if (node.type === "event") showEvent();
  if (node.type === "rest") showRest();
  if (node.type === "shop") showShop();
  if (node.type === "treasure") showTreasure();
}

function randomEnemy(elite) {
  return elite ? rngItem(["eliteKnight", "eliteMaw"]) : rngItem(["ratkin", "sentry", "cultist"]);
}

function startCombat(enemyId) {
  const enemyDef = ENEMIES[enemyId];
  state.screen = "combat";
  state.combat = {
    enemyId,
    enemy: { ...enemyDef, maxHp: enemyDef.hp, block: 0, strength: 0, weak: 0, vulnerable: 0 },
    drawPile: shuffle(state.deck.map((card) => ({ ...card }))),
    discardPile: [],
    exhaustPile: [],
    hand: [],
    energy: 3,
    maxEnergy: 3,
    playerBlock: hasRelic("bronzeRoot") ? 6 : 0,
    strength: hasRelic("coalHeart") ? 1 : 0,
    dexterity: 0,
    vulnerable: 0,
    weak: 0,
    turn: 0,
    playedThisTurn: 0,
    firstSkillFree: hasRelic("moonLens"),
    finished: false
  };
  if ((enemyDef.elite || enemyDef.boss) && hasRelic("silverNail")) {
    state.combat.enemy.hp -= 2;
  }
  addLog(`Combat begins: ${enemyDef.name}.`);
  startTurn();
  render();
}

function startTurn() {
  const combat = state.combat;
  combat.turn += 1;
  combat.energy = combat.maxEnergy + (combat.turn === 1 && hasRelic("emberCell") ? 1 : 0);
  combat.playerBlock = 0;
  combat.playedThisTurn = 0;
  const drawAmount = 5 + (combat.turn === 1 && hasRelic("silkGlove") ? 1 : 0);
  drawCards(drawAmount);
  setEnemyIntent();
}

function setEnemyIntent() {
  const combat = state.combat;
  const enemy = combat.enemy;
  const step = enemy.pattern[(combat.turn - 1) % enemy.pattern.length];
  if (step === "attack") enemy.intent = { type: "attack", amount: enemy.elite ? 16 : enemy.boss ? 24 : 10 };
  if (step === "block") enemy.intent = { type: "block", amount: enemy.elite ? 12 : enemy.boss ? 18 : 8 };
  if (step === "buff") enemy.intent = { type: "buff", amount: enemy.boss ? 3 : 2 };
  if (step === "debuff") enemy.intent = { type: "debuff", amount: 2 };
}

function drawCards(amount) {
  const combat = state.combat;
  for (let i = 0; i < amount; i += 1) {
    if (combat.drawPile.length === 0) {
      if (combat.discardPile.length === 0) return;
      combat.drawPile = shuffle(combat.discardPile);
      combat.discardPile = [];
      addLog("Your discard pile shuffles into the draw pile.");
    }
    combat.hand.push(combat.drawPile.pop());
  }
}

function effectiveCost(card) {
  const combat = state.combat;
  if (combat.firstSkillFree && card.type === "Skill") return 0;
  return card.cost;
}

function playCard(instanceId) {
  const combat = state.combat;
  if (!combat || combat.finished) return;
  const handIndex = combat.hand.findIndex((card) => card.instanceId === instanceId);
  if (handIndex === -1) return;
  const card = combat.hand[handIndex];
  const cost = effectiveCost(card);
  if (cost > combat.energy) {
    addLog(`Not enough energy for ${cardName(card)}.`);
    render();
    return;
  }

  combat.energy -= cost;
  if (combat.firstSkillFree && card.type === "Skill") combat.firstSkillFree = false;
  combat.hand.splice(handIndex, 1);
  card.play(card);
  combat.playedThisTurn += 1;
  if (hasRelic("glassFeather") && combat.playedThisTurn === 3) drawCards(1);
  if (card.exhaust) combat.exhaustPile.push(card);
  else combat.discardPile.push(card);
  addLog(`Played ${cardName(card)}.`);

  if (combat.enemy.hp <= 0) {
    winCombat();
    return;
  }
  render();
}

function damage(base) {
  const combat = state.combat;
  const enemy = combat.enemy;
  let amount = base + combat.strength + (hasRelic("blackCandle") ? 1 : 0);
  if (combat.weak > 0) amount = Math.floor(amount * 0.75);
  if (enemy.vulnerable > 0) amount = Math.floor(amount * 1.5);
  const blocked = Math.min(enemy.block, amount);
  enemy.block -= blocked;
  enemy.hp = clamp(enemy.hp - (amount - blocked), 0, enemy.maxHp);
}

function gainBlock(base) {
  state.combat.playerBlock += base + state.combat.dexterity;
}

function gainStrength(amount) {
  state.combat.strength += amount;
}

function gainDexterity(amount) {
  state.combat.dexterity += amount;
}

function applyEnemyStatus(status, amount) {
  state.combat.enemy[status] += amount;
}

function discardRandomCard() {
  const combat = state.combat;
  if (combat.hand.length === 0) return;
  const index = Math.floor(Math.random() * combat.hand.length);
  combat.discardPile.push(combat.hand.splice(index, 1)[0]);
}

function endTurn() {
  const combat = state.combat;
  combat.discardPile.push(...combat.hand);
  combat.hand = [];
  enemyTurn();
  if (state.hp <= 0) {
    state.screen = "defeat";
    addLog("The climb ends.");
    render();
    return;
  }
  tickStatuses();
  startTurn();
  render();
}

function enemyTurn() {
  const combat = state.combat;
  const enemy = combat.enemy;
  const intent = enemy.intent;
  enemy.block = 0;
  if (intent.type === "attack") {
    let amount = intent.amount + enemy.strength;
    if (enemy.weak > 0) amount = Math.floor(amount * 0.75);
    if (combat.vulnerable > 0) amount = Math.floor(amount * 1.5);
    const blocked = Math.min(combat.playerBlock, amount);
    combat.playerBlock -= blocked;
    state.hp = clamp(state.hp - (amount - blocked), 0, state.maxHp);
    addLog(`${enemy.name} attacks for ${amount}.`);
  }
  if (intent.type === "block") {
    enemy.block += intent.amount;
    addLog(`${enemy.name} guards.`);
  }
  if (intent.type === "buff") {
    enemy.strength += intent.amount;
    addLog(`${enemy.name} grows stronger.`);
  }
  if (intent.type === "debuff") {
    combat.vulnerable += intent.amount;
    combat.weak += 1;
    addLog(`${enemy.name} curses your footing.`);
  }
}

function tickStatuses() {
  const combat = state.combat;
  ["weak", "vulnerable"].forEach((status) => {
    combat[status] = Math.max(0, combat[status] - 1);
    combat.enemy[status] = Math.max(0, combat.enemy[status] - 1);
  });
}

function winCombat() {
  const combat = state.combat;
  combat.finished = true;
  const elite = combat.enemy.elite;
  const boss = combat.enemy.boss;
  const gold = (boss ? 80 : elite ? 38 : 22) + (hasRelic("coinMoth") ? 12 : 0);
  state.gold += gold;
  addLog(`Won combat and gained ${gold} gold.`);

  if (boss) {
    state.screen = "victory";
    render();
    return;
  }

  state.rewards = {
    title: elite ? "Elite Reward" : "Combat Reward",
    gold,
    cards: rewardCards(),
    relic: elite ? randomRelic() : null
  };
  state.screen = "reward";
  render();
}

function rewardCards() {
  const common = Object.keys(CARD_POOL).filter((id) => CARD_POOL[id].rarity === "common");
  const uncommon = Object.keys(CARD_POOL).filter((id) => CARD_POOL[id].rarity === "uncommon");
  const rare = Object.keys(CARD_POOL).filter((id) => CARD_POOL[id].rarity === "rare");
  const options = [];
  while (options.length < 3) {
    const roll = Math.random();
    const pool = roll > 0.88 ? rare : roll > 0.56 ? uncommon : common;
    const id = rngItem(pool);
    if (!options.includes(id)) options.push(id);
  }
  return options.map((id) => cloneCard(id));
}

function randomRelic() {
  const available = Object.keys(RELICS).filter((id) => !state.relics.includes(id));
  return available.length ? rngItem(available) : null;
}

function takeCard(instanceId) {
  const card = state.rewards.cards.find((candidate) => candidate.instanceId === instanceId);
  if (card) {
    state.deck.push(card);
    addLog(`Added ${cardName(card)} to the deck.`);
  }
  takeRelicIfAny();
  returnToMap();
}

function skipReward() {
  addLog("Skipped the card reward.");
  takeRelicIfAny();
  returnToMap();
}

function takeRelicIfAny() {
  if (state.rewards?.relic) {
    state.relics.push(state.rewards.relic);
    addLog(`Found relic: ${RELICS[state.rewards.relic].name}.`);
  }
}

function returnToMap() {
  state.combat = null;
  state.rewards = null;
  state.screen = "map";
  render();
}

function showTreasure() {
  state.screen = "treasure";
  const relic = randomRelic();
  state.rewards = { relic };
  if (relic) {
    state.relics.push(relic);
    addLog(`Opened a chest: ${RELICS[relic].name}.`);
  }
  render();
}

function showRest() {
  state.screen = "rest";
  render();
}

function restHeal() {
  const amount = 24 + (hasRelic("riverStone") ? 12 : 0);
  state.hp = clamp(state.hp + amount, 0, state.maxHp);
  addLog(`Rested and healed ${amount} HP.`);
  returnToMap();
}

function upgradeRandomCard() {
  const options = state.deck.filter((card) => !card.upgraded);
  if (options.length === 0) {
    addLog("Every card is already upgraded.");
    returnToMap();
    return;
  }
  const card = rngItem(options);
  card.upgraded = true;
  addLog(`Upgraded ${card.name}.`);
  returnToMap();
}

function showEvent() {
  state.screen = "event";
  render();
}

function eventChoice(kind) {
  if (kind === "power") {
    const card = cloneCard(rngItem(["lanternstorm", "bulwark", "rewind"]), true);
    state.deck.push(card);
    state.hp = clamp(state.hp - 8, 1, state.maxHp);
    addLog(`Paid 8 HP for ${cardName(card)}.`);
  }
  if (kind === "remove") {
    const index = state.deck.findIndex((card) => card.rarity === "starter");
    if (index >= 0) {
      const [removed] = state.deck.splice(index, 1);
      addLog(`Forgot ${cardName(removed)}.`);
    }
  }
  if (kind === "gold") {
    state.gold += 55;
    state.hp = clamp(state.hp - 5, 1, state.maxHp);
    addLog("Took 55 gold from the silent reliquary.");
  }
  returnToMap();
}

function showShop() {
  state.screen = "shop";
  state.shop = {
    cards: rewardCards().map((card) => ({ card, price: card.rarity === "rare" ? 95 : card.rarity === "uncommon" ? 70 : 48 })),
    relic: randomRelic(),
    relicPrice: 120
  };
  render();
}

function buyCard(instanceId) {
  const item = state.shop.cards.find((candidate) => candidate.card.instanceId === instanceId);
  if (!item || state.gold < item.price) return;
  state.gold -= item.price;
  state.deck.push(item.card);
  state.shop.cards = state.shop.cards.filter((candidate) => candidate !== item);
  addLog(`Bought ${cardName(item.card)}.`);
  render();
}

function buyRelic() {
  if (!state.shop.relic || state.gold < state.shop.relicPrice) return;
  state.gold -= state.shop.relicPrice;
  state.relics.push(state.shop.relic);
  addLog(`Bought relic: ${RELICS[state.shop.relic].name}.`);
  state.shop.relic = null;
  render();
}

function shopHeal() {
  if (state.gold < 45) return;
  state.gold -= 45;
  state.hp = clamp(state.hp + 18, 0, state.maxHp);
  addLog("Bought a field dressing.");
  render();
}

function removeCardAt(index) {
  if (state.gold < 65 || !state.deck[index]) return;
  const [removed] = state.deck.splice(index, 1);
  state.gold -= 65;
  addLog(`Removed ${cardName(removed)}.`);
  render();
}

function render() {
  renderHeroSelect();
  renderSidebar();
  renderLog();
  if (state.screen === "start") renderStart();
  if (state.screen === "map") renderMap();
  if (state.screen === "combat") renderCombat();
  if (state.screen === "reward") renderReward();
  if (state.screen === "shop") renderShop();
  if (state.screen === "rest") renderRest();
  if (state.screen === "event") renderEvent();
  if (state.screen === "treasure") renderTreasure();
  if (state.screen === "victory") renderEnding(true);
  if (state.screen === "defeat") renderEnding(false);
}

function renderHeroSelect() {
  nodes.heroSelect.innerHTML = "";
  HEROES.forEach((hero) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `climber${state.hero?.id === hero.id ? " is-active" : ""}`;
    button.innerHTML = `<strong>${hero.name}</strong><span>${hero.subtitle}</span><em>${hero.maxHp} HP · ${hero.gold} gold</em>`;
    button.addEventListener("click", () => startRun(hero.id));
    nodes.heroSelect.append(button);
  });
}

function renderSidebar() {
  if (!state.hero) {
    nodes.heroAvatar.textContent = "LS";
    nodes.heroName.textContent = "Choose a climber";
    nodes.heroSubtitle.textContent = "Build a deck and climb.";
    nodes.hpText.textContent = "0 / 0";
    nodes.hpBar.style.width = "0%";
    nodes.goldText.textContent = "0";
    nodes.floorText.textContent = "0";
    nodes.deckCount.textContent = "0";
    nodes.relicCount.textContent = "0";
    nodes.relicGrid.innerHTML = "";
    nodes.deckList.innerHTML = "";
    nodes.goldPips.innerHTML = "";
    return;
  }

  nodes.heroAvatar.textContent = state.hero.mark;
  nodes.heroName.textContent = state.hero.name;
  nodes.heroSubtitle.textContent = state.hero.subtitle;
  nodes.hpText.textContent = `${state.hp} / ${state.maxHp}`;
  nodes.hpBar.style.width = `${(state.hp / state.maxHp) * 100}%`;
  nodes.goldText.textContent = state.gold;
  nodes.floorText.textContent = state.floor;
  nodes.deckCount.textContent = state.deck.length;
  nodes.relicCount.textContent = state.relics.length;
  nodes.goldPips.innerHTML = Array.from({ length: Math.min(12, Math.ceil(state.gold / 25)) }, () => "<span></span>").join("");
  nodes.relicGrid.innerHTML = state.relics.map((id) => {
    const relic = RELICS[id];
    return `<div class="relic" title="${relic.text}"><strong>${relic.icon}</strong><span>${relic.name}</span></div>`;
  }).join("");
  nodes.deckList.innerHTML = state.deck.map((card, index) =>
    `<button class="deck-pill ${card.type.toLowerCase()}" type="button" data-remove="${index}">
      ${cardName(card)} <span>${card.cost}</span>
    </button>`
  ).join("");
  nodes.deckList.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.screen === "shop") removeCardAt(Number(button.dataset.remove));
    });
  });
}

function renderLog() {
  nodes.logList.innerHTML = [...state.log].reverse().map((entry) => `<li>${entry}</li>`).join("");
}

function renderStart() {
  nodes.screen.innerHTML = `
    <div class="splash">
      <div class="spire-art"></div>
      <div>
        <p class="label">The climb</p>
        <h2>Route, fight, draft, survive.</h2>
        <p>Choose a climber above. Every run builds a deck across branching rooms, risky elites, shops, events, and a final boss.</p>
      </div>
    </div>
  `;
}

function renderMap() {
  nodes.screen.innerHTML = `
    <div class="map-screen">
      <div class="screen-head">
        <div>
          <p class="label">Act I</p>
          <h2>Choose the next room</h2>
        </div>
        <p>Available rooms glow. Elites are harder but award relics.</p>
      </div>
      <div class="route-map">
        ${state.map.map((row) => `
          <div class="map-row">
            ${row.map((node) => renderMapNode(node)).join("")}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderMapNode(node) {
  const meta = NODE_META[node.type];
  const available = state.availableNodes.includes(node.id);
  const visited = state.currentNode?.id === node.id || node.depth < (state.currentNode?.depth ?? -1);
  return `
    <button class="map-node ${node.type} ${available ? "available" : ""} ${visited ? "visited" : ""}" type="button" data-node="${node.id}" ${available ? "" : "disabled"}>
      <span>${meta.icon}</span>
      <em>${meta.label}</em>
    </button>
  `;
}

function renderCombat() {
  const combat = state.combat;
  const enemy = combat.enemy;
  nodes.screen.innerHTML = `
    <div class="combat-screen">
      <div class="combat-stage">
        <div class="player-board">
          <p class="label">Energy</p>
          <div class="energy">${Array.from({ length: combat.maxEnergy + 1 }, (_, i) => `<span class="${i < combat.energy ? "full" : ""}"></span>`).join("")}</div>
          <div class="status-row">
            <span>Block ${combat.playerBlock}</span>
            <span>STR ${combat.strength}</span>
            <span>DEX ${combat.dexterity}</span>
            ${combat.weak ? `<span>Weak ${combat.weak}</span>` : ""}
            ${combat.vulnerable ? `<span>Vuln ${combat.vulnerable}</span>` : ""}
          </div>
        </div>
        <div class="enemy-card ${enemy.art}">
          <div class="enemy-art"></div>
          <h2>${enemy.name}</h2>
          <div class="enemy-meter"><span style="width:${(enemy.hp / enemy.maxHp) * 100}%"></span></div>
          <p>${enemy.hp} / ${enemy.maxHp} HP · Block ${enemy.block}</p>
          <div class="intent">${renderIntent(enemy.intent)}</div>
          <div class="status-row">
            <span>STR ${enemy.strength}</span>
            ${enemy.weak ? `<span>Weak ${enemy.weak}</span>` : ""}
            ${enemy.vulnerable ? `<span>Vuln ${enemy.vulnerable}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="pile-row">
        <span>Draw ${combat.drawPile.length}</span>
        <span>Discard ${combat.discardPile.length}</span>
        <span>Exhaust ${combat.exhaustPile.length}</span>
        <button id="end-turn-button" type="button">End Turn</button>
      </div>
      <div class="hand">
        ${combat.hand.map(renderCard).join("")}
      </div>
    </div>
  `;
  nodes.screen.querySelector("#end-turn-button").addEventListener("click", endTurn);
  nodes.screen.querySelectorAll("[data-card]").forEach((button) => {
    button.addEventListener("click", () => playCard(Number(button.dataset.card)));
  });
}

function renderIntent(intent) {
  if (!intent) return "";
  if (intent.type === "attack") return `Attack ${intent.amount}`;
  if (intent.type === "block") return `Block ${intent.amount}`;
  if (intent.type === "buff") return `Buff +${intent.amount} STR`;
  return "Hex";
}

function renderCard(card) {
  const shownCost = state.combat ? effectiveCost(card) : card.cost;
  return `
    <button class="card ${card.type.toLowerCase()} ${card.art}" type="button" data-card="${card.instanceId}">
      <span class="cost">${shownCost}</span>
      <strong>${cardName(card)}</strong>
      <em>${card.type}</em>
      <div class="card-art"></div>
      <p>${cardText(card)}</p>
    </button>
  `;
}

function renderReward() {
  const reward = state.rewards;
  nodes.screen.innerHTML = `
    <div class="reward-screen">
      <div class="screen-head">
        <div>
          <p class="label">${reward.title}</p>
          <h2>Choose one card</h2>
        </div>
        ${reward.relic ? `<div class="found-relic"><strong>${RELICS[reward.relic].icon}</strong><span>${RELICS[reward.relic].name}</span></div>` : ""}
      </div>
      <div class="reward-cards">
        ${reward.cards.map(renderCard).join("")}
      </div>
      <button class="secondary" id="skip-reward" type="button">Skip card</button>
    </div>
  `;
  nodes.screen.querySelectorAll("[data-card]").forEach((button) => {
    button.addEventListener("click", () => takeCard(Number(button.dataset.card)));
  });
  nodes.screen.querySelector("#skip-reward").addEventListener("click", skipReward);
}

function renderTreasure() {
  const relic = state.rewards.relic;
  nodes.screen.innerHTML = `
    <div class="choice-screen">
      <div class="spire-art treasure"></div>
      <div>
        <p class="label">Treasure</p>
        <h2>${relic ? RELICS[relic].name : "Empty reliquary"}</h2>
        <p>${relic ? RELICS[relic].text : "The chest contains only dust and a very judgmental note."}</p>
        <button id="continue-button" type="button">Continue</button>
      </div>
    </div>
  `;
  nodes.screen.querySelector("#continue-button").addEventListener("click", returnToMap);
}

function renderRest() {
  nodes.screen.innerHTML = `
    <div class="choice-screen">
      <div class="spire-art rest"></div>
      <div>
        <p class="label">Rest Site</p>
        <h2>The lamp is warm.</h2>
        <p>Heal a chunk of HP or upgrade a random card in your deck.</p>
        <div class="choice-row">
          <button id="rest-heal" type="button">Rest and heal</button>
          <button id="rest-upgrade" type="button">Upgrade a card</button>
        </div>
      </div>
    </div>
  `;
  nodes.screen.querySelector("#rest-heal").addEventListener("click", restHeal);
  nodes.screen.querySelector("#rest-upgrade").addEventListener("click", upgradeRandomCard);
}

function renderEvent() {
  nodes.screen.innerHTML = `
    <div class="event-screen">
      <p class="label">Event</p>
      <h2>The Silent Reliquary</h2>
      <p>A cabinet with no handle offers three bargains written in ash.</p>
      <div class="event-options">
        <button data-event="power" type="button"><strong>Blood for power</strong><span>Lose 8 HP. Add an upgraded rare card.</span></button>
        <button data-event="remove" type="button"><strong>Forget a lesson</strong><span>Remove a starter card.</span></button>
        <button data-event="gold" type="button"><strong>Take the coins</strong><span>Lose 5 HP. Gain 55 gold.</span></button>
      </div>
    </div>
  `;
  nodes.screen.querySelectorAll("[data-event]").forEach((button) => {
    button.addEventListener("click", () => eventChoice(button.dataset.event));
  });
}

function renderShop() {
  nodes.screen.innerHTML = `
    <div class="shop-screen">
      <div class="screen-head">
        <div>
          <p class="label">Shop</p>
          <h2>The moth merchant</h2>
        </div>
        <p>Click a deck card in the left panel to remove it for 65 gold.</p>
      </div>
      <div class="shop-grid">
        ${state.shop.cards.map((item) => `
          <div class="shop-item">
            ${renderCard(item.card)}
            <button data-buy-card="${item.card.instanceId}" type="button">Buy · ${item.price}g</button>
          </div>
        `).join("")}
        <div class="shop-item relic-buy">
          <div class="found-relic">${state.shop.relic ? `<strong>${RELICS[state.shop.relic].icon}</strong><span>${RELICS[state.shop.relic].name}</span><p>${RELICS[state.shop.relic].text}</p>` : "Sold out"}</div>
          <button id="buy-relic" type="button">Buy relic · ${state.shop.relicPrice}g</button>
        </div>
        <div class="shop-item service">
          <strong>Field dressing</strong>
          <p>Heal 18 HP.</p>
          <button id="shop-heal" type="button">Buy · 45g</button>
        </div>
      </div>
      <button class="secondary" id="leave-shop" type="button">Leave shop</button>
    </div>
  `;
  nodes.screen.querySelectorAll("[data-buy-card]").forEach((button) => {
    button.addEventListener("click", () => buyCard(Number(button.dataset.buyCard)));
  });
  nodes.screen.querySelector("#buy-relic").addEventListener("click", buyRelic);
  nodes.screen.querySelector("#shop-heal").addEventListener("click", shopHeal);
  nodes.screen.querySelector("#leave-shop").addEventListener("click", returnToMap);
}

function renderEnding(won) {
  nodes.screen.innerHTML = `
    <div class="choice-screen ending">
      <div class="spire-art ${won ? "treasure" : "boss"}"></div>
      <div>
        <p class="label">${won ? "Victory" : "Defeat"}</p>
        <h2>${won ? "The bell falls silent." : "The spire keeps climbing."}</h2>
        <p>${won ? "Your deck, relics, and a slightly smoking lantern made it to the top." : "A better route, leaner deck, or greedier elite path might change the next run."}</p>
        <button id="ending-run-button" type="button">Start another run</button>
      </div>
    </div>
  `;
  nodes.screen.querySelector("#ending-run-button").addEventListener("click", () => {
    state.screen = "start";
    render();
  });
}

nodes.newRun.addEventListener("click", () => {
  state.screen = "start";
  state.hero = null;
  render();
});

nodes.screen.addEventListener("click", (event) => {
  const nodeButton = event.target.closest("[data-node]");
  if (nodeButton && !nodeButton.disabled) {
    enterNode(nodeButton.dataset.node);
  }
});

nodes.compactDeck.addEventListener("click", () => {
  state.deck.sort((a, b) => a.type.localeCompare(b.type) || a.cost - b.cost || a.name.localeCompare(b.name));
  render();
});

render();
