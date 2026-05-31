// Конфиг гильдий

export const GUILD_LEVELS = {
  1: { exp: 0, sellBonus: 2, craftBonus: 2, slots: 5, name: '🪵 Новички' },
  2: { exp: 1000, sellBonus: 4, craftBonus: 2, slots: 7, name: '🪨 Ремесленники' },
  3: { exp: 5000, sellBonus: 6, craftBonus: 4, slots: 10, name: '⚔️ Воины' },
  4: { exp: 15000, sellBonus: 8, craftBonus: 7, slots: 15, name: '🔥 Пламенные' },
  5: { exp: 50000, sellBonus: 12, craftBonus: 10, slots: 20, name: '👑 Легенды' },
  6: { exp: 150000, sellBonus: 15, craftBonus: 15, slots: 30, name: '✨ Божественные' },
  7: { exp: 500000, sellBonus: 20, craftBonus: 20, slots: 50, name: '🌌 Мифические' }
}

export const GUILD_UPGRADES = {
  // Экономические (активно 1)
  economic: [
    { id: 'small_trader', name: '📈 Мелкий барыга', price: 50000, bonus: 2 },
    { id: 'medium_trader', name: '📈 Средний барыга', price: 100000, bonus: 4 },
    { id: 'large_trader', name: '📈 Крупный барыга', price: 200000, bonus: 6 },
    { id: 'wholesaler', name: '📈 Оптовик', price: 500000, bonus: 8 },
    { id: 'magnate', name: '📈 Магнат', price: 1000000, bonus: 10 }
  ],
  // Производственные (активно 1)
  production: [
    { id: 'cheap_flask', name: '🔬 Дешёвая колба', price: 50000, bonus: 2 },
    { id: 'glass_flask', name: '🔬 Стеклянная колба', price: 100000, bonus: 4 },
    { id: 'lab_flask', name: '🔬 Лабораторная колба', price: 200000, bonus: 6 },
    { id: 'reactor', name: '🔬 Химический реактор', price: 500000, bonus: 8 },
    { id: 'industrial', name: '🔬 Промышленная установка', price: 1000000, bonus: 10 }
  ],
  // Логистические (активно 1)
  logistic: [
    { id: 'rusty_wheel', name: '🚗 Ржавая тачка', price: 50000, bonus: 5 },
    { id: 'used_van', name: '🚗 Б/у фургон', price: 100000, bonus: 10 },
    { id: 'truck', name: '🚗 Грузовичок', price: 200000, bonus: 15 },
    { id: 'tent_van', name: '🚗 Тентованный фургон', price: 500000, bonus: 20 },
    { id: 'armored_truck', name: '🚗 Бронированная фура', price: 1000000, bonus: 25 }
  ],
  // Защитные (активно 1)
  defense: [
    { id: 'pocket_knife', name: '🛡️ Карманный нож', price: 50000, bonus: 5 },
    { id: 'knuckle', name: '🛡️ Кастет', price: 100000, bonus: 10 },
    { id: 'pistol', name: '🛡️ Пистолет', price: 200000, bonus: 15 },
    { id: 'machine_gun', name: '🛡️ Автомат', price: 500000, bonus: 20 },
    { id: 'bulletproof', name: '🛡️ Бронежилет', price: 1000000, bonus: 25 }
  ],
  // Социальные (пассивные, все работают)
  social: [
    { id: 'friendly', name: '👥 Дружная компания', price: 50000, slots: 1, expBonus: 0 },
    { id: 'gang', name: '👥 Банда', price: 100000, slots: 1, expBonus: 2 },
    { id: 'group', name: '👥 Преступная группировка', price: 200000, slots: 2, expBonus: 4 },
    { id: 'organization', name: '👥 Организация', price: 500000, slots: 2, expBonus: 6 },
    { id: 'syndicate', name: '👥 Синдикат', price: 1000000, slots: 3, expBonus: 8 }
  ],
  // Военные атака (активно 1, за 🪙)
  militaryAttack: [
    { id: 'street_fight', name: '⚔️ Уличная драка', priceCoins: 100, bonus: 5 },
    { id: 'brawl', name: '⚔️ Разборка', priceCoins: 250, bonus: 10 },
    { id: 'gang_raid', name: '⚔️ Бандитский наезд', priceCoins: 500, bonus: 15 },
    { id: 'armed_raid', name: '⚔️ Вооружённый рейд', priceCoins: 1000, bonus: 20 },
    { id: 'total_war', name: '⚔️ Тотальная война', priceCoins: 2000, bonus: 25 },
    { id: 'tlen_army', name: '⚔️ Армия Тлена', priceCoins: 5000, bonus: 30 },
    { id: 'tlen_legion', name: '⚔️ Легион Тлена', priceCoins: 10000, bonus: 40 }
  ],
  // Военные защита (активно 1, за 🪙)
  militaryDefense: [
    { id: 'leather_jacket', name: '🛡️ Кожанка', priceCoins: 100, bonus: 5 },
    { id: 'armor', name: '🛡️ Броня', priceCoins: 250, bonus: 10 },
    { id: 'kevlar', name: '🛡️ Кевлар', priceCoins: 500, bonus: 15 },
    { id: 'titan_armor', name: '🛡️ Титановая броня', priceCoins: 1000, bonus: 20 },
    { id: 'exoskeleton', name: '🛡️ Экзоскелет', priceCoins: 2000, bonus: 25 },
    { id: 'shadow_armor', name: '🛡️ Теневой доспех', priceCoins: 5000, bonus: 30 },
    { id: 'invulnerable', name: '🛡️ Неуязвимость', priceCoins: 10000, bonus: 40 }
  ]
}

// Скины лаборатории
export const LAB_SKINS = [
  { id: 'glass_studio', name: '🧪 Стеклянная студия', price: 20, bonus: 3 },
  { id: 'chem_synth', name: '🔬 Химический синтезатор', price: 50, bonus: 5 },
  { id: 'alchemy_tower', name: '⚗️ Алхимическая башня', price: 100, bonus: 8 },
  { id: 'tlen_reactor', name: '🏭 Тленовый реактор', price: 200, bonus: 12 },
  { id: 'necro_lab', name: '💀 Некро-лаборатория', price: 500, bonus: 15 }
]

// Баффы конвертации
export const CONVERSION_BONUSES = [
  { id: 'small', name: '📈 Малая конвертация', price: 50, bonus: 2 },
  { id: 'medium', name: '📈 Средняя конвертация', price: 100, bonus: 4 },
  { id: 'large', name: '📈 Большая конвертация', price: 250, bonus: 6 },
  { id: 'expert', name: '📈 Экспертная конвертация', price: 500, bonus: 8 },
  { id: 'master', name: '👑 Мастерская конвертация', price: 1000, bonus: 10 }
]

// Временные баффы
export const TEMP_BUFFS = [
  { id: 'sell', name: '📈 Бафф на продажи', price: 2, effect: 'sellBonus', value: 10, duration: 24 },
  { id: 'craft', name: '🔬 Бафф на крафт', price: 2, effect: 'craftBonus', value: 10, duration: 24 },
  { id: 'speed', name: '⚡ Бафф на скорость', price: 2, effect: 'speedBonus', value: 20, duration: 24 },
  { id: 'stealth', name: '👻 Бафф на скрытность', price: 2, effect: 'stealthBonus', value: 20, duration: 24 },
  { id: 'exp', name: '📚 Бафф на опыт', price: 2, effect: 'expBonus', value: 20, duration: 24 },
  { id: 'combo', name: '🔥 Комбо-бафф', price: 8, effect: 'allBonus', value: 10, duration: 24 }
]

// Гильдейские базы
export const GUILD_BASES = [
  { id: 'shack', name: '🏚️ Хибара', price: 100000, bonus: 2 },
  { id: 'house', name: '🏠 Дом', price: 500000, bonus: 5 },
  { id: 'office', name: '🏢 Офис', price: 1000000, bonus: 8 },
  { id: 'mansion', name: '🏛️ Особняк', price: 5000000, bonus: 12 },
  { id: 'castle', name: '🏰 Замок', price: 10000000, bonus: 15 },
  { id: 'citadel', name: '👑 Цитадель', price: 25000000, bonus: 20 }
]

// Гильдейские квесты
export const GUILD_QUESTS = [
  { id: 'craft', name: '🔬 Химический рывок', desc: 'Сварить 500г наркотиков', target: 500, type: 'craft', rewardExp: 200, rewardCoins: 50 },
  { id: 'sales', name: '💰 Налоговый сбор', desc: 'Продать 500г наркотиков', target: 500, type: 'sales', rewardExp: 200, rewardCoins: 50 },
  { id: 'tax', name: '🏦 Пополнение казны', desc: 'Пополнить казну на $100,000', target: 100000, type: 'bank', rewardExp: 300, rewardCoins: 100 },
  { id: 'attack', name: '⚔️ Военный поход', desc: 'Атаковать 5 раз', target: 5, type: 'attacks', rewardExp: 150 },
  { id: 'defense', name: '🛡️ Защитник', desc: 'Защитить точку 3 раза', target: 3, type: 'defenses', rewardExp: 150 },
  { id: 'tlen', name: '🪙 Инвестор', desc: 'Купить 50 🪙 Тлена', target: 50, type: 'tlen', rewardExp: 100, rewardCoins: 50 },
  { id: 'online', name: '👥 Массовка', desc: 'Иметь 5 участников онлайн', target: 5, type: 'online', rewardExp: 100 },
  { id: 'bribe', name: '👮 Взяткодатель', desc: 'Дать взятку 3 раза', target: 3, type: 'bribe', rewardExp: 100 },
  { id: 'trips', name: '🚗 Дальнобойщик', desc: 'Совершить 20 поездок', target: 20, type: 'trips', rewardExp: 150 },
  { id: 'upgrade', name: '🏆 Улучшатель', desc: 'Купить 3 улучшения гильдии', target: 3, type: 'upgrade', rewardExp: 200 }
]