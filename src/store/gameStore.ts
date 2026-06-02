// @ts-nocheck 
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getBoxById } from '../config/boxes'
import { EQUIPMENT_CONFIG, RARITIES, getEquipmentById } from '../config/equipment'
import { GUILD_LEVELS, GUILD_UPGRADES, LAB_SKINS, CONVERSION_BONUSES, TEMP_BUFFS, GUILD_BASES, GUILD_QUESTS } from '../config/guilds'
import { supabase } from '../lib/supabaseClient'  // ← ДОБАВЛЕНО!

const CARS_CONFIG: Record<string, any> = {
  walk: { name: '🚶‍♂️ Пешком', time: 20, capacity: 10, level: 0 },
  bicycle: { name: '🛵 Велосипед', time: 15, capacity: 20, level: 1 },
  scooter: { name: '🏍️ Скутер', time: 12, capacity: 30, level: 2 },
  cheapCar: { name: '🚗 Дешёвая тачка', time: 10, capacity: 50, level: 3 },
  minibus: { name: '🚐 Микроавтобус', time: 8, capacity: 80, level: 4 },
  truck: { name: '🚚 Грузовик', time: 6, capacity: 120, level: 5 },
  bigTruck: { name: '🚛 Фура', time: 5, capacity: 180, level: 6 },
  armored: { name: '🚀 Бронированный', time: 4, capacity: 250, level: 7 },
  helicopter: { name: '🚁 Вертолёт', time: 3, capacity: 350, level: 8 },
  plane: { name: '✈️ Самолёт', time: 2, capacity: 500, level: 9 },
  secret: { name: '🛸 Секретная', time: 1, capacity: 1000, level: 10 }
}

const БИЗНЕСЫ = [
  { id: 'carwash', name: '🧼 Автомойка', цена: 5000, лимит: 1000, процент: 70, уровень: 1 },
  { id: 'laundry', name: '👕 Прачечная', цена: 10000, лимит: 2500, процент: 75, уровень: 2 },
  { id: 'nightclub', name: '🎵 Ночной клуб', цена: 25000, лимит: 5000, процент: 85, уровень: 3 },
  { id: 'casino', name: '🎰 Казино', цена: 50000, лимит: 10000, процент: 90, уровень: 4 },
  { id: 'bank', name: '🏦 Банк', цена: 100000, лимит: 25000, процент: 95, уровень: 5 }
]

const ЗВАНИЯ = [
  { id: 'street_dealer', название: 'Уличный дилер', требование: { уровень: 1, продажи: 0 }, бонус: { цена: 5, износ: 0, опыт: 0 } },
  { id: 'pusher', название: 'Барыга', требование: { уровень: 3, продажи: 50 }, бонус: { цена: 8, износ: 0, опыт: 5 } },
  { id: 'distributor', название: 'Оптовик', требование: { уровень: 5, продажи: 200 }, бонус: { цена: 10, износ: 5, опыт: 10 } },
  { id: 'cartel_member', название: 'Картель', требование: { уровень: 8, продажи: 500 }, бонус: { цена: 12, износ: 10, опыт: 15 } },
  { id: 'kingpin', название: 'Криминальный авторитет', требование: { уровень: 10, продажи: 1000 }, бонус: { цена: 15, износ: 15, опыт: 20 } }
]

const НАВЫКИ = [
  { id: 'speed_cook', название: '🔥 Скоростная варка', цена: 5000, бонус: { времяКрафта: -5 }, макс: 5 },
  { id: 'discount', название: '💰 Скидка на ингредиенты', цена: 8000, бонус: { ценаИнгредиентов: -5 }, макс: 3 },
  { id: 'profit', название: '💵 Профит', цена: 10000, бонус: { ценаПродажи: 5 }, макс: 5 },
  { id: 'stealth', название: '👻 Невидимка', цена: 15000, бонус: { рискРейда: -10 }, макс: 3 },
  { id: 'boss', название: '👔 Босс', цена: 20000, бонус: { опыт: 10 }, макс: 2 }
]

const СКИНЫ = [
  { id: 'basement', название: '🗑️ Грязный подвал', цена: 0, бонус: {} },
  { id: 'garage', название: '🚗 Гараж', цена: 10000, бонус: { опыт: 5 } },
  { id: 'warehouse', название: '📦 Склад', цена: 25000, бонус: { ценаПродажи: 3 } },
  { id: 'hightech', название: '🔬 Хай-тек лаборатория', цена: 50000, бонус: { времяКрафта: -10, опыт: 10 } },
  { id: 'secret', название: '🛸 Секретная база', цена: 100000, бонус: { времяКрафта: -15, ценаПродажи: 10, опыт: 20 } }
]

interface GameState {
  userId: string | null
  баланс: number
  инвентарь: Record<string, number>
  оборудованиеИнстансы: Record<string, string[]>
  оборудованиеИнстансыДанные: Record<string, { rarity: string; wear: number; usageCount: number; totalCrafted: number }>
  уровень: number
  опыт: number
  загрузка: boolean
  машины: Record<string, { активна: boolean; износ?: number; название?: string }>
  улучшенияМашин: Record<string, {
    скорость: number
    вместимость: number
    надежность: number
  }>
  активнаяМашина: string
  активныеПродажи: Record<string, any>
  розыск: number
  бизнес: any | null
  активныйКрафт: any | null
  ачивки: Record<string, boolean>
  навыки: Record<string, number>
  активноеЗвание: string
  доступныеЗвания: string[]
  активныйСкин: string
  купленныеСкины: string[]
  текущиеЦены: Record<string, number>
  следующееОбновлениеЦен: number
  осколки: number
  глифы: Record<string, boolean>
  экипированныеГлифы: string[]
  защитаОтСгорания: number
  
  // ========== ГИЛЬДИИ ==========
  гильдия: any
  гильдейскийИнвентарь: {
    labSkins: string[]
    activeLabSkin: string | null
    conversionBonuses: string[]
    activeConversionBonus: string | null
    temporaryBuffs: {
      sellBonus?: number
      craftBonus?: number
      speedBonus?: number
      stealthBonus?: number
      expBonus?: number
      comboBonus?: number
    }
  }
  профит: number
  всеГильдии: Record<string, any>
  приглашенияВГильдию: { userId: string; from: string; fromName: string; guildId: string; guildName: string; timestamp: number }[]
  
  // ========== РЕФЕРАЛЫ ==========
  рефералы: {
    invitedBy: string | null
    invitedUsers: string[]
    totalReferrals: number
    rewardsClaimed: Record<string, boolean>
  }
  
  статистика: {
    всегоСварено: Record<string, number>
    всегоПродано: Record<string, number>
    всегоПродаж: number
    всегоЗаработано: number
    всегоОтмыто: number
    всегоВзяток: number
    всегоРейдов: number
    всегоКрафтовПодряд: number
    максимальныйБаланс: number
    всегоПоездок: number
    поездкиПешком: number
    всегоРемонтов: number
    времяВИгре: number
    всегоКликов: number
    дниПодряд: number
    последнийВход: number
    последнийБонус: number
    утреннийВход: boolean
    ночнойВход: boolean
    открытоБоксов: number
  успешныхСкрещиваний: number
  выиграновКазино: number
  проиграновКазино: number
  }
  
  загрузитьПользователя: (telegramId: string) => Promise<void>
  купитьПредмет: (item: string, price: number) => Promise<boolean>
  купитьОборудованиеИнстанс: (itemId: string) => Promise<boolean>
  купитьЗащиту: () => Promise<boolean>
  продатьНаркотик: (drug: string, pricePerGram: number) => Promise<boolean>
  добавитьОпыт: (amount: number) => Promise<void>
  починитьОборудование: (instanceId: string) => Promise<boolean>
  починитьМашину: (carId: string) => Promise<boolean>
  сделатьКрафт: (drugKey: string, recipe: any) => Promise<boolean>
  купитьМашину: (id: string) => Promise<boolean>
  экипироватьМашину: (carId: string) => Promise<void>
  начатьПродажу: (drugKey: string, grams: number, pricePerGram: number) => Promise<boolean>
  увеличитьРозыск: (amount: number) => void
  датьВзятку: () => Promise<boolean>
  рейд: () => Promise<void>
  купитьБизнес: (id: string) => Promise<boolean>
  продатьБизнес: () => Promise<boolean>
  завершитьВсеПродажи: () => void
  начатьКрафтВStore: (key: string, recipe: any) => void
  проверитьАчивку: (id: string, условие: () => boolean, награда: number) => boolean
  проверитьВсеАчивки: () => void
  обновитьСтатистику: () => void
  обновитьЦены: () => void
  запланироватьОбновлениеЦен: () => void
  открытьЗвание: (id: string) => void
  купитьНавык: (id: string) => Promise<boolean>
  купитьСкин: (id: string) => Promise<boolean>
  экипироватьСкин: (id: string) => void
  открытьБокс: (boxId: string, glyphId: string) => Promise<boolean>
  экипироватьГлиф: (glyphId: string) => void
  снятьГлиф: (glyphId: string) => void
  добавитьОсколки: (amount: number) => void
  скреститьОборудование: (instanceId1: string, instanceId2: string) => Promise<boolean>
  получитьИнстансыОборудования: (itemId: string) => string[]
  улучшитьМашину: (carId: string, тип: 'speed' | 'capacity' | 'reliability') => Promise<boolean>
  
  // ========== ДОБАВЛЕНО: СОХРАНЕНИЕ В SUPABASE ==========
  сохранитьПрогресс: () => Promise<void>
  загрузитьПрогресс: (telegramId: string) => Promise<void>
  
  // МЕТОДЫ ГИЛЬДИИ
  создатьГильдию: (name: string, description: string, type: string, focus: string, minLevel: number, emblem: string, color: string) => Promise<boolean>
  вступитьВГильдию: (guildId: string) => Promise<boolean>
  покинутьГильдию: () => Promise<boolean>
  исключитьИзГильдии: (userId: string) => Promise<boolean>
  назначитьСоздателя: (userId: string) => Promise<boolean>
  отправитьСообщение: (message: string) => void
  купитьТлен: (amount: number) => Promise<boolean>
  продатьПрофит: (amount: number) => Promise<boolean>
  купитьСкинЛабы: (skinId: string) => Promise<boolean>
  экипироватьСкинЛабы: (skinId: string) => Promise<boolean>
  купитьБаффКонвертации: (bonusId: string) => Promise<boolean>
  экипироватьБаффКонвертации: (bonusId: string) => Promise<boolean>
  активироватьВременныйБафф: (buffId: string) => Promise<boolean>
  купитьУлучшениеГильдии: (category: string, upgradeId: string) => Promise<boolean>
  сменитьАктивноеУлучшение: (category: string, upgradeId: string) => Promise<boolean>
  купитьБазуГильдии: (baseId: string) => Promise<boolean>
  экипироватьБазуГильдии: (baseId: string) => Promise<boolean>
  заключитьАльянс: (guildId: string) => Promise<boolean>
  расторгнутьАльянс: () => Promise<boolean>
  взятьКвест: (questId: string) => Promise<boolean>
  забратьНаградуКвеста: (questId: string) => Promise<boolean>
  обновитьПрогрессКвеста: (type: string, amount: number) => void
  сброситьКвесты: () => void
  обновитьОнлайн: () => void
  пригласитьВГильдию: (userId: string) => Promise<boolean>
  принятьПриглашение: (guildId: string) => Promise<boolean>
  отклонитьПриглашение: (guildId: string) => Promise<boolean>
  получитьПриглашения: () => { from: string; guildId: string; guildName: string; timestamp: number }[]
  
  // РЕФЕРАЛЫ
  обработатьРеферала: (referrerId: string) => Promise<{ rewarded: boolean; message: string }>
  получитьРеферальнуюСсылку: () => string
  забратьРеферальнуюНаграду: (userId: string) => Promise<boolean>
  сгенерироватьРеферальныйКод: () => void
  применитьРеферальныйКод: (code: string) => Promise<boolean>
  получитьБонусЗаПриглашение: () => Promise<boolean>
}

const EXP_TO_LEVEL: Record<number, number> = {
  1: 0, 2: 500, 3: 1500, 4: 3500, 5: 7000,
  6: 12000, 7: 18000, 8: 25000, 9: 35000, 10: 50000
}

function getLevel(exp: number): number {
  for (let i = 10; i >= 1; i--) {
    if (exp >= EXP_TO_LEVEL[i]) return i
  }
  return 1
}

function getNextRarity(current: string): string | null {
  const order = ['common', 'rare', 'epic', 'legendary', 'mythic']
  const index = order.indexOf(current)
  if (index === -1 || index === order.length - 1) return null
  return order[index + 1]
}

// Функция для принудительной миграции
function migrateOldData(state: any) {
  const hasNewData = state?.оборудованиеИнстансы && Object.keys(state.оборудованиеИнстансы).length > 0
  
  let hasRealInstances = false
  if (hasNewData) {
    for (const instances of Object.values(state.оборудованиеИнстансы)) {
      if ((instances as string[]).length >= 2) {
        hasRealInstances = true
        break
      }
    }
  }
  
  if (hasRealInstances) {
    console.log('✅ Данные уже есть (2+ экземпляров), миграция не нужна')
    return state
  }
  
  console.log('🔄 Принудительная миграция данных...')
  
  const oldEquipment = state?.оборудование || {}
  const oldRarity = state?.оборудованиеРедкость || {}
  const oldWear = state?.износ || {}
  const oldStats = state?.оборудованиеСтатистика || {}
  
  const новыеИнстансы: Record<string, string[]> = {}
  const новыеДанные: Record<string, any> = {}
  
  for (const [itemId, owned] of Object.entries(oldEquipment)) {
    if (owned) {
      const instanceId1 = `${itemId}_migrated_${Date.now()}_1_${Math.random()}`
      const instanceId2 = `${itemId}_migrated_${Date.now()}_2_${Math.random()}`
      
      новыеИнстансы[itemId] = [instanceId1, instanceId2]
      
      const rarity = (oldRarity[itemId] as string) || 'common'
      const wear = (oldWear[itemId] as number) || 0
      const usageCount = (oldStats[itemId] as any)?.usageCount || 0
      const totalCrafted = (oldStats[itemId] as any)?.totalCrafted || 0
      
      новыеДанные[instanceId1] = { rarity, wear, usageCount, totalCrafted }
      новыеДанные[instanceId2] = { rarity, wear, usageCount, totalCrafted }
    }
  }
  
  if (Object.keys(новыеИнстансы).length === 0) {
    console.log('ℹ️ Старых данных нет, создаём тестовые с 2 экземплярами...')
    
    новыеИнстансы['filter'] = [
      `filter_test_${Date.now()}_1`,
      `filter_test_${Date.now()}_2`
    ]
    
    новыеДанные[новыеИнстансы['filter'][0]] = { rarity: 'common', wear: 0, usageCount: 0, totalCrafted: 0 }
    новыеДанные[новыеИнстансы['filter'][1]] = { rarity: 'common', wear: 0, usageCount: 0, totalCrafted: 0 }
  }
  
  state.оборудованиеИнстансы = новыеИнстансы
  state.оборудованиеИнстансыДанные = новыеДанные
  console.log('✅ Миграция завершена!', новыеИнстансы)
  
  return state
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      userId: null,
      баланс: 1500,
      инвентарь: {},
      оборудованиеИнстансы: {},
      оборудованиеИнстансыДанные: {},
      уровень: 1,
      опыт: 0,
      загрузка: false,
      машины: {},
      улучшенияМашин: {},
      активнаяМашина: 'walk',
      активныеПродажи: {},
      розыск: 0,
      бизнес: null,
      активныйКрафт: null,
      ачивки: {},
      навыки: {},
      активноеЗвание: 'street_dealer',
      доступныеЗвания: ['street_dealer'],
      активныйСкин: 'basement',
      купленныеСкины: ['basement'],
      текущиеЦены: {
        krokodil: 250,
        marijuana: 70,
        pcp: 120,
        amphetamine: 180,
        meth: 300,
        mdma: 350,
        heroin: 500,
        cocaine: 700,
        blue_meth: 1000,
        lsd: 1500
      },
      следующееОбновлениеЦен: Date.now() + 5 * 60 * 1000,
      осколки: 0,
      глифы: {},
      экипированныеГлифы: [],
      защитаОтСгорания: 0,
      
      // ========== ГИЛЬДИИ ==========
      гильдия: null,
      гильдейскийИнвентарь: {
        labSkins: [],
        activeLabSkin: null,
        conversionBonuses: [],
        activeConversionBonus: null,
        temporaryBuffs: {}
      },
      профит: 0,
      всеГильдии: {},
      приглашенияВГильдию: [],
      
      // ========== РЕФЕРАЛЫ ==========
      рефералы: {
        invitedBy: null,
        invitedUsers: [],
        totalReferrals: 0,
        rewardsClaimed: {}
      },
      
      статистика: {
        всегоСварено: {},
        всегоПродано: {},
        всегоПродаж: 0,
        всегоЗаработано: 0,
        всегоОтмыто: 0,
        всегоВзяток: 0,
        всегоРейдов: 0,
        всегоКрафтовПодряд: 0,
        максимальныйБаланс: 1500,
        всегоПоездок: 0,
        поездкиПешком: 0,
        всегоРемонтов: 0,
        времяВИгре: 0,
        всегоКликов: 0,
        дниПодряд: 0,
        последнийВход: Date.now(),
        последнийБонус: 0,
        утреннийВход: false,
        ночнойВход: false,
          открытоБоксов: 0,
  успешныхСкрещиваний: 0,
  выиграновКазино: 0,
  проиграновКазино: 0
      },

      // ========== ДОБАВЛЕНО: СОХРАНЕНИЕ В SUPABASE ==========
      сохранитьПрогресс: async () => {
        const state = get()
        if (!state.userId) return
        
        try {
          // Сохраняем в таблицу players
          await supabase
            .from('players')
            .upsert({
              id: state.userId,
              balance: state.баланс,
              level: state.уровень,
              experience: state.опыт,
              wanted_level: state.розыск,
              active_car: state.активнаяМашина,
              active_rank: state.активноеЗвание,
              active_skin: state.активныйСкин,
              updated_at: new Date()
            })
            .eq('id', state.userId)
          
          // Сохраняем статистику
          await supabase
            .from('stats')
            .upsert({
              player_id: state.userId,
              total_earned: state.статистика?.всегоЗаработано || 0,
              total_sales_count: state.статистика?.всегоПродаж || 0,
              total_bribes: state.статистика?.всегоВзяток || 0,
              total_raids: state.статистика?.всегоРейдов || 0,
              total_trips: state.статистика?.всегоПоездок || 0,
              total_repairs: state.статистика?.всегоРемонтов || 0,
              play_time: state.статистика?.времяВИгре || 0,
              total_clicks: state.статистика?.всегоКликов || 0,
              streak_days: state.статистика?.дниПодряд || 0
            })
            .eq('player_id', state.userId)
            
          console.log('✅ Прогресс сохранён в Supabase')
        } catch (error) {
          console.error('❌ Ошибка сохранения:', error)
        }
      },

      загрузитьПрогресс: async (telegramId: string) => {
        try {
          // Загружаем данные игрока
          const { data: player } = await supabase
            .from('players')
            .select('*')
            .eq('id', telegramId)
            .single()
          
          if (player) {
            set({
              баланс: player.balance,
              уровень: player.level,
              опыт: player.experience,
              розыск: player.wanted_level,
              активнаяМашина: player.active_car || 'walk',
              активноеЗвание: player.active_rank || 'street_dealer',
              активныйСкин: player.active_skin || 'basement'
            })
          }
          
          // Загружаем статистику
          const { data: stats } = await supabase
            .from('stats')
            .select('*')
            .eq('player_id', telegramId)
            .single()
          
          if (stats) {
            set({
              статистика: {
                ...get().статистика,
                всегоЗаработано: stats.total_earned || 0,
                всегоПродаж: stats.total_sales_count || 0,
                всегоВзяток: stats.total_bribes || 0,
                всегоРейдов: stats.total_raids || 0,
                всегоПоездок: stats.total_trips || 0,
                всегоРемонтов: stats.total_repairs || 0,
                времяВИгре: stats.play_time || 0,
                всегоКликов: stats.total_clicks || 0,
                дниПодряд: stats.streak_days || 0
              }
            })
          }
          
          console.log('✅ Прогресс загружен из Supabase')
        } catch (error) {
          console.error('❌ Ошибка загрузки:', error)
        }
      },

      // ОБНОВЛЁННЫЙ загрузитьПользователя (с вызовом загрузки из Supabase)
      загрузитьПользователя: async (telegramId) => {
        set({ userId: telegramId, загрузка: true })
        await get().загрузитьПрогресс(telegramId)
        set({ загрузка: false })
      },

      купитьПредмет: async (item, price) => {
        const { баланс, инвентарь } = get()
        if (баланс < price) {
          alert(`❌ Не хватает денег! Нужно: $${price}`)
          return false
        }
        set({ 
          баланс: баланс - price,
          инвентарь: { ...инвентарь, [item]: (инвентарь[item] || 0) + 1 }
        })
        await get().сохранитьПрогресс()
        return true
      },

      купитьОборудованиеИнстанс: async (itemId) => {
        const { баланс, оборудованиеИнстансы, оборудованиеИнстансыДанные } = get()
        const config = EQUIPMENT_CONFIG.find(e => e.id === itemId)
        if (!config) return false
        
        const currentCount = (оборудованиеИнстансы[itemId] || []).length
        if (currentCount >= config.maxCount) {
          alert(`❌ Нельзя купить больше ${config.maxCount} экземпляров ${config.name}!`)
          return false
        }
        
        const rarity = 'common'
        const цена = config.basePrice
        
        if (баланс < цена) {
          alert(`❌ Не хватает денег! Нужно: $${цена}`)
          return false
        }
        
        const instanceId = `${itemId}_${Date.now()}_${Math.random()}`
        
        const новыеИнстансы = {
          ...оборудованиеИнстансы,
          [itemId]: [...(оборудованиеИнстансы[itemId] || []), instanceId]
        }
        
        const новыеДанные = {
          ...оборудованиеИнстансыДанные,
          [instanceId]: {
            rarity: rarity,
            wear: 0,
            usageCount: 0,
            totalCrafted: 0
          }
        }
        
        set({ 
          баланс: баланс - цена,
          оборудованиеИнстансы: новыеИнстансы,
          оборудованиеИнстансыДанные: новыеДанные
        })
        
        alert(`✅ Куплен ${config.name} (⚪ Обычный) за $${цена}\n📦 Теперь у вас ${новыеИнстансы[itemId].length}/${config.maxCount} экземпляров`)
        await get().сохранитьПрогресс()
        return true
      },

      купитьЗащиту: async () => {
        const { осколки, защитаОтСгорания } = get()
        const цена = 100
        
        if (осколки < цена) {
          alert(`❌ Не хватает осколков! Нужно: ${цена}, есть: ${осколки}`)
          return false
        }
        
        set({ 
          осколки: осколки - цена,
          защитаОтСгорания: защитаОтСгорания + 1
        })
        
        alert(`✅ Куплен Амулет защиты! (${защитаОтСгорания + 1} шт.)`)
        await get().сохранитьПрогресс()
        return true
      },

      продатьНаркотик: async (drug, pricePerGram) => {
        const { баланс, инвентарь, бизнес, увеличитьРозыск, добавитьОпыт, текущиеЦены } = get()
        const граммы = инвентарь[drug] || 0
        if (граммы === 0) {
          alert('❌ Нет товара для продажи!')
          return false
        }
        
        const цена = текущиеЦены[drug] || pricePerGram
        const выручка = граммы * цена
        const опытЗаПродажу = граммы * 5
        let чистыеДеньги = выручка
        let неОтмытоДенег = 0
        
        if (бизнес) {
          if (выручка <= бизнес.лимит) {
            чистыеДеньги = Math.floor(выручка * (бизнес.процент / 100))
            неОтмытоДенег = выручка - чистыеДеньги
          } else {
            const отмытоПоЛимиту = Math.floor(бизнес.лимит * (бизнес.процент / 100))
            чистыеДеньги = отмытоПоЛимиту
            неОтмытоДенег = выручка - отмытоПоЛимиту
          }
          if (неОтмытоДенег > 0) {
            const розыскПрирост = Math.floor(неОтмытоДенег / 100) * 2
            увеличитьРозыск(розыскПрирост)
          }
        } else {
          неОтмытоДенег = выручка
          const розыскПрирост = Math.floor(неОтмытоДенег / 100) * 2
          увеличитьРозыск(розыскПрирост)
          чистыеДеньги = 0
        }
        
        const новыйБаланс = баланс + чистыеДеньги
        set({ 
          баланс: новыйБаланс,
          инвентарь: { ...инвентарь, [drug]: 0 }
        })
        await добавитьОпыт(опытЗаПродажу)
        
        let сообщение = `✅ Продано! +$${выручка} (+${опытЗаПродажу} EXP)`
        if (бизнес) {
          сообщение += `\n💰 Отмыто: $${чистыеДеньги} (${бизнес.процент}%)`
          if (неОтмытоДенег > 0) {
            сообщение += `\n⚠️ Не отмыто: $${неОтмытоДенег} (добавлено в розыск)`
          }
        } else {
          сообщение += `\n⚠️ Нет бизнеса! Все деньги грязные (розыск +${Math.floor(выручка / 50)})`
        }
        alert(сообщение)
        
        const { гильдия } = get()
        if (гильдия) {
          get().обновитьПрогрессКвеста('sales', граммы)
        }
        
        get().проверитьВсеАчивки()
        await get().сохранитьПрогресс()
        return true
      },

      добавитьОпыт: async (amount) => {
        const { опыт } = get()
        const новыйОпыт = опыт + amount
        const новыйУровень = getLevel(новыйОпыт)
        const старыйУровень = get().уровень
        set({ опыт: новыйОпыт, уровень: новыйУровень })
        if (новыйУровень > старыйУровень) {
          alert(`🎉 ПОВЫШЕНИЕ УРОВНЯ! Теперь ${новыйУровень} уровень!`)
        }
        get().проверитьВсеАчивки()
        await get().сохранитьПрогресс()
      },

      починитьОборудование: async (instanceId) => {
        const { баланс, оборудованиеИнстансы, оборудованиеИнстансыДанные, статистика } = get()
        const данные = оборудованиеИнстансыДанные[instanceId]
        if (!данные) {
          alert('❌ Оборудование не найдено!')
          return false
        }
        
        const текущийИзнос = данные.wear || 0
        if (текущийИзнос === 0) {
          alert('✅ Оборудование в идеальном состоянии!')
          return false
        }
        
        let itemId = null
        for (const [id, instances] of Object.entries(оборудованиеИнстансы)) {
          if (instances.includes(instanceId)) {
            itemId = id
            break
          }
        }
        
        const config = EQUIPMENT_CONFIG.find(e => e.id === itemId)
        if (!config) {
          alert('❌ Конфиг оборудования не найден!')
          return false
        }
        
        const baseRepairPrice = Math.floor(config.basePrice / 5)
        const multiplier: Record<string, number> = {
          common: 1.0,
          rare: 1.5,
          epic: 2.0,
          legendary: 3.0,
          mythic: 5.0
        }
        const ценаРемонта = Math.ceil((текущийИзнос / 100) * baseRepairPrice * (multiplier[данные.rarity] || 1.0))
        
        if (баланс < ценаРемонта) {
          alert(`❌ Не хватает денег на ремонт! Нужно: $${ценаРемонта}`)
          return false
        }
        
        set({ 
          баланс: баланс - ценаРемонта,
          оборудованиеИнстансыДанные: {
            ...оборудованиеИнстансыДанные,
            [instanceId]: { ...данные, wear: 0 }
          },
          статистика: {
            ...статистика,
            всегоРемонтов: (статистика?.всегоРемонтов || 0) + 1
          }
        })
        
        alert(`🔧 Отремонтировано ${config.name} (${RARITIES[данные.rarity]?.icon || '⚪'} ${RARITIES[данные.rarity]?.name || 'Обычный'})!\n💰 Стоимость: $${ценаРемонта.toLocaleString()}\n📊 Износ: ${текущийИзнос}% → 0%`)
        await get().сохранитьПрогресс()
        return true
      },

      починитьМашину: async (carId) => {
        const { машины, баланс, статистика } = get()
        const машина = машины[carId]
        
        if (!машина || !машина.износ || машина.износ === 0) {
          alert('✅ Машина в идеальном состоянии!')
          return false
        }
        
        const CARS_REPAIR_CONFIG: Record<string, { name: string; icon: string; basePrice: number }> = {
          bicycle: { name: 'Велосипед', icon: '🛵', basePrice: 500 },
          scooter: { name: 'Скутер', icon: '🏍️', basePrice: 800 },
          cheapCar: { name: 'Дешёвая тачка', icon: '🚗', basePrice: 1500 },
          minibus: { name: 'Микроавтобус', icon: '🚐', basePrice: 3000 },
          truck: { name: 'Грузовик', icon: '🚚', basePrice: 5000 },
          bigTruck: { name: 'Фура', icon: '🚛', basePrice: 8000 },
          armored: { name: 'Бронированный', icon: '🚀', basePrice: 15000 },
          helicopter: { name: 'Вертолёт', icon: '🚁', basePrice: 25000 },
          plane: { name: 'Самолёт', icon: '✈️', basePrice: 50000 },
          secret: { name: 'Секретная', icon: '🛸', basePrice: 100000 }
        }
        
        const config = CARS_REPAIR_CONFIG[carId]
        if (!config) return false
        
        const ценаРемонта = Math.ceil((машина.износ / 100) * config.basePrice / 5)
        
        if (баланс < ценаРемонта) {
          alert(`❌ Не хватает денег на ремонт! Нужно: $${ценаРемонта}`)
          return false
        }
        
        set({
          баланс: баланс - ценаРемонта,
          машины: {
            ...машины,
            [carId]: { ...машина, износ: 0 }
          },
          статистика: {
            ...статистика,
            всегоРемонтов: (статистика?.всегоРемонтов || 0) + 1
          }
        })
        
        alert(`🔧 Отремонтирована ${config.name}!\n💰 Стоимость: $${ценаРемонта}`)
        await get().сохранитьПрогресс()
        return true
      },

      сделатьКрафт: async (drugKey, recipe) => {
        const { инвентарь, оборудованиеИнстансы, оборудованиеИнстансыДанные, добавитьОпыт, статистика, добавитьОсколки } = get()
        
        for (const [ингредиент, количество] of Object.entries(recipe.ingredients)) {
          const есть = инвентарь[ингредиент] || 0
          if (есть < (количество as number)) {
            alert(`❌ Не хватает ${ингредиент}!`)
            return false
          }
        }
        
        if (recipe.requiredEquipment) {
          for (const equip of recipe.requiredEquipment) {
            const instances = оборудованиеИнстансы[equip] || []
            if (instances.length === 0) {
              alert(`❌ Нет оборудования: ${equip}`)
              return false
            }
          }
        }
        
        let эффективность = 1
        let износПрирост = 0
        const использованныеИнстансы: string[] = []
        
        if (recipe.requiredEquipment) {
          for (const equip of recipe.requiredEquipment) {
            const instances = оборудованиеИнстансы[equip] || []
            if (instances.length > 0) {
              const instanceId = instances[0]
              использованныеИнстансы.push(instanceId)
              const данные = оборудованиеИнстансыДанные[instanceId]
              const износПроцент = (данные?.wear || 0) / 100
              const rarityMultiplier = RARITIES[данные?.rarity || 'common']?.multiplier || 1
              
              эффективность *= (1 - износПроцент * 0.5)
              const износШанс = 5 + Math.random() * 15
              износПрирост += Math.floor(износШанс * rarityMultiplier)
            }
          }
        }
        
        const реальныйВыход = Math.max(1, Math.floor(recipe.output * эффективность))
        
        const новыйИнвентарь = { ...инвентарь }
        for (const [ингредиент, количество] of Object.entries(recipe.ingredients)) {
          новыйИнвентарь[ингредиент] = (новыйИнвентарь[ингредиент] || 0) - (количество as number)
          if (новыйИнвентарь[ингредиент] === 0) delete новыйИнвентарь[ингредиент]
        }
        новыйИнвентарь[drugKey] = (новыйИнвентарь[drugKey] || 0) + реальныйВыход
        
        const новыеДанные = { ...оборудованиеИнстансыДанные }
        for (const instanceId of использованныеИнстансы) {
          const данные = новыеДанные[instanceId]
          if (данные) {
            const новыйИзнос = Math.min(100, (данные.wear || 0) + износПрирост)
            новыеДанные[instanceId] = {
              ...данные,
              wear: новыйИзнос,
              usageCount: (данные.usageCount || 0) + 1,
              totalCrafted: (данные.totalCrafted || 0) + реальныйВыход
            }
          }
        }
        
        set({ 
          инвентарь: новыйИнвентарь,
          оборудованиеИнстансыДанные: новыеДанные
        })
        
        const опытЗаКрафт = реальныйВыход * 10
        await добавитьОпыт(опытЗаКрафт)
        
        const { гильдия } = get()
        if (гильдия) {
          get().обновитьПрогрессКвеста('craft', реальныйВыход)
        }
        
        if (Math.random() < 0.05) {
          const shardsAmount = Math.floor(Math.random() * 5) + 1
          добавитьОсколки(shardsAmount)
          alert(`✨ Вам повезло! Выпало ${shardsAmount} осколков!`)
        }
        
        alert(`✅ ${recipe.name} готов! +${реальныйВыход} грамм (эффективность ${Math.round(эффективность * 100)}%, +${опытЗаКрафт} EXP)`)
        get().проверитьВсеАчивки()
        await get().сохранитьПрогресс()
        return true
      },

      купитьМашину: async (id) => {
        const { машины, инвентарь, улучшенияМашин } = get()
        const carBuyConfig: Record<string, any> = {
          bicycle: { drug: 'marijuana', amount: 10, name: '🛵 Велосипед' },
          scooter: { drug: 'marijuana', amount: 15, name: '🏍️ Скутер' },
          cheapCar: { drug: 'marijuana', amount: 20, name: '🚗 Дешёвая тачка' },
          minibus: { drug: 'meth', amount: 10, name: '🚐 Микроавтобус' },
          truck: { drug: 'meth', amount: 20, name: '🚚 Грузовик' },
          bigTruck: { drug: 'meth', amount: 30, name: '🚛 Фура' },
          armored: { drug: 'cocaine', amount: 20, name: '🚀 Бронированный' },
          helicopter: { drug: 'cocaine', amount: 35, name: '🚁 Вертолёт' },
          plane: { drug: 'blue_meth', amount: 25, name: '✈️ Самолёт' },
          secret: { drug: 'lsd', amount: 30, name: '🛸 Секретная' }
        }
        const config = carBuyConfig[id]
        if (!config) return false
        if (машины[id]?.активна) {
          alert('❌ У вас уже есть эта машина!')
          return false
        }
        const естьГрамм = инвентарь[config.drug] || 0
        if (естьГрамм < config.amount) {
          alert(`❌ Нужно ${config.amount}г ${config.drug}! У вас есть ${естьГрамм}г`)
          return false
        }
        const новыйИнвентарь = { ...инвентарь }
        новыйИнвентарь[config.drug] = естьГрамм - config.amount
        if (новыйИнвентарь[config.drug] === 0) delete новыйИнвентарь[config.drug]
        const новыеМашины = { ...машины, [id]: { активна: true, износ: 0 } }
        set({ инвентарь: новыйИнвентарь, машины: новыеМашины })
        
        const новыеУлучшения = {
          ...улучшенияМашин,
          [id]: { скорость: 0, вместимость: 0, надежность: 0 }
        }
        set({ улучшенияМашин: новыеУлучшения })
        
        alert(`✅ Куплена: ${config.name}!`)
        get().проверитьВсеАчивки()
        await get().сохранитьПрогресс()
        return true
      },

      экипироватьМашину: async (carId) => {
        const { машины } = get()
        if (carId !== 'walk' && !машины[carId]?.активна) {
          alert('❌ У вас нет этой машины!')
          return
        }
        set({ активнаяМашина: carId })
        alert(`✅ Теперь вы используете: ${CARS_CONFIG[carId]?.name || '🚶‍♂️ Пешком'}`)
        await get().сохранитьПрогресс()
      },

      улучшитьМашину: async (carId, тип) => {
        const { баланс, улучшенияМашин, машины } = get()
        const улучшения = улучшенияМашин[carId] || { скорость: 0, вместимость: 0, надежность: 0 }
        
        let текущийУровень = 0
        let эффект = ''
        let типУлучшения = ''
        
        switch(тип) {
          case 'speed':
            текущийУровень = улучшения.скорость
            эффект = `Скорость +${(текущийУровень + 1) * 5}% (время -${(текущийУровень + 1) * 5}%)`
            типУлучшения = 'скорость'
            break
          case 'capacity':
            текущийУровень = улучшения.вместимость
            эффект = `Вместимость +${(текущийУровень + 1) * 10}%`
            типУлучшения = 'вместимость'
            break
          case 'reliability':
            текущийУровень = улучшения.надежность
            эффект = `Износ -${(текущийУровень + 1) * 10}%`
            типУлучшения = 'надёжность'
            break
        }
        
        if (текущийУровень >= 5) {
          alert(`❌ Максимальный уровень улучшения (5)!`)
          return false
        }
        
        const CARS_PRICE: Record<string, number> = {
          bicycle: 500,
          scooter: 800,
          cheapCar: 1500,
          minibus: 3000,
          truck: 5000,
          bigTruck: 8000,
          armored: 15000,
          helicopter: 25000,
          plane: 50000,
          secret: 100000
        }
        
        const базоваяЦена = CARS_PRICE[carId] || 1000
        const цена = Math.floor(базоваяЦена * (текущийУровень + 1) * 1.5)
        
        if (баланс < цена) {
          alert(`❌ Не хватает денег! Нужно: $${цена.toLocaleString()}, есть: $${баланс.toLocaleString()}`)
          return false
        }
        
        const новыеУлучшения = {
          ...улучшенияМашин,
          [carId]: {
            ...улучшения,
            [тип === 'speed' ? 'скорость' : тип === 'capacity' ? 'вместимость' : 'надежность']: текущийУровень + 1
          }
        }
        
        set({
          баланс: баланс - цена,
          улучшенияМашин: новыеУлучшения
        })
        
        const CARS_LIST: Record<string, string> = {
          bicycle: '🛵 Велосипед',
          scooter: '🏍️ Скутер',
          cheapCar: '🚗 Дешёвая тачка',
          minibus: '🚐 Микроавтобус',
          truck: '🚚 Грузовик',
          bigTruck: '🚛 Фура',
          armored: '🚀 Бронированный',
          helicopter: '🚁 Вертолёт',
          plane: '✈️ Самолёт',
          secret: '🛸 Секретная'
        }
        const carName = CARS_LIST[carId] || carId
        
        alert(`✅ Улучшена ${типУлучшения} ${carName} до ${текущийУровень + 1} уровня!\n💰 -$${цена.toLocaleString()}\n✨ Эффект: ${эффект}`)
        await get().сохранитьПрогресс()
        return true
      },

      начатьПродажу: async (drugKey, grams, pricePerGram) => {
        const { инвентарь, активнаяМашина, активныеПродажи, увеличитьРозыск, текущиеЦены, статистика, машины, улучшенияМашин } = get()
        const carConfig = CARS_CONFIG[активнаяМашина]
        
        if (!carConfig) {
          alert('❌ Машина не найдена!')
          return false
        }
        
        const улучшения = улучшенияМашин[активнаяМашина] || { скорость: 0, вместимость: 0, надежность: 0 }
        
        const скоростьМножитель = 1 - (улучшения.скорость * 0.05)
        const реальноеВремя = Math.max(1, Math.floor(carConfig.time * скоростьМножитель))
        
        const вместимостьМножитель = 1 + (улучшения.вместимость * 0.1)
        const реальнаяВместимость = Math.floor(carConfig.capacity * вместимостьМножитель)
        
        const сейчас = Date.now()
        const очищенныеПродажи = { ...активныеПродажи }
        let очищеноПродаж = 0
        let добавленоДенег = 0
        
        for (const [id, продажа] of Object.entries(активныеПродажи || {})) {
          if (продажа.времяОкончания <= сейчас) {
            добавленоДенег += продажа.выручка
            delete очищенныеПродажи[id]
            очищеноПродаж++
            if (продажа.таймер) clearTimeout(продажа.таймер)
          }
        }
        
        if (очищеноПродаж > 0) {
          const новыйБаланс = get().баланс + добавленоДенег
          set({ 
            баланс: новыйБаланс,
            активныеПродажи: очищенныеПродажи
          })
          alert(`✅ Автоматически завершено ${очищеноПродаж} продаж! +$${добавленоДенег}`)
        }
        
        const текущиеПродажи = очищенныеПродажи || {}
        if (Object.values(текущиеПродажи).length >= 5) {
          alert('❌ У вас уже 5 активных продаж!')
          return false
        }
        
        const естьГрамм = инвентарь[drugKey] || 0
        if (естьГрамм < grams) {
          alert(`❌ У вас только ${естьГрамм}г!`)
          return false
        }
        
        if (grams > реальнаяВместимость) {
          alert(`❌ Машина может увезти только ${реальнаяВместимость}г! (Улучшение вместимости: ${улучшения.вместимость}/5)`)
          return false
        }
        
        const новыйИнвентарь = { ...инвентарь }
        новыйИнвентарь[drugKey] = естьГрамм - grams
        if (новыйИнвентарь[drugKey] === 0) delete новыйИнвентарь[drugKey]
        
        const цена = текущиеЦены[drugKey] || pricePerGram
        const выручка = grams * цена
        const времяОкончания = Date.now() + реальноеВремя * 60 * 1000
        const продажаId = Date.now().toString()
        
        const таймер = setTimeout(() => {
          const текущиеПродажиВТаймере = get().активныеПродажи
          const продажа = текущиеПродажиВТаймере[продажаId]
          if (продажа && продажа.времяОкончания <= Date.now()) {
            const новыеПродажи2 = { ...текущиеПродажиВТаймере }
            delete новыеПродажи2[продажаId]
            const новыйБаланс = get().баланс + продажа.выручка
            set({ баланс: новыйБаланс, активныеПродажи: новыеПродажи2 })
            alert(`✅ Продажа завершена! +$${продажа.выручка.toLocaleString()}`)
          }
        }, реальноеВремя * 60 * 1000)
        
        const новыеПродажи = {
          ...текущиеПродажи,
          [продажаId]: { 
            времяОкончания, 
            товар: drugKey, 
            количество: grams, 
            выручка, 
            время: реальноеВремя, 
            таймер 
          }
        }
        
        set({ 
          инвентарь: новыйИнвентарь, 
          активныеПродажи: новыеПродажи,
          статистика: {
            ...статистика,
            всегоПоездок: (статистика?.всегоПоездок || 0) + 1
          }
        })
        
        if (активнаяМашина !== 'walk') {
          const надежностьМножитель = 1 - (улучшения.надежность * 0.1)
          const износЗаПоездкуБазовый: Record<string, number> = {
            bicycle: 3,
            scooter: 4,
            cheapCar: 5,
            minibus: 6,
            truck: 7,
            bigTruck: 8,
            armored: 4,
            helicopter: 3,
            plane: 2,
            secret: 1
          }
          const износЗаПоездку = Math.max(1, Math.floor((износЗаПоездкуБазовый[активнаяМашина] || 3) * надежностьМножитель))
          
          const текущаяМашина = машины[активнаяМашина] || { активна: true, износ: 0 }
          const новыйИзнос = Math.min(100, (текущаяМашина.износ || 0) + износЗаПоездку)
          
          set({
            машины: {
              ...get().машины,
              [активнаяМашина]: {
                ...текущаяМашина,
                активна: true,
                износ: новыйИзнос
              }
            }
          })
          
          if (новыйИзнос > 70) {
            alert(`⚠️ ${carConfig.name} сильно изношена (${новыйИзнос}%)! Почините её в разделе "Ремонт"!`)
          }
        }
        
        const розыскПрирост = Math.floor(grams / 10) * 2
        get().увеличитьРозыск(розыскПрирост)
        
        const { гильдия } = get()
        if (гильдия) {
          get().обновитьПрогрессКвеста('trips', 1)
        }
        
        let сообщение = `🚗 ${carConfig.name} увезла ${grams}г на продажу!\n`
        сообщение += `⏱️ Вернётся через ${реальноеВремя} мин.\n`
        сообщение += `💰 Ожидаемая выручка: $${выручка.toLocaleString()}\n`
        if (улучшения.скорость > 0 || улучшения.вместимость > 0 || улучшения.надежность > 0) {
          сообщение += `✨ Активны улучшения:`
          if (улучшения.скорость > 0) сообщение += ` ⚡-${улучшения.скорость * 5}%`
          if (улучшения.вместимость > 0) сообщение += ` 📦+${улучшения.вместимость * 10}%`
          if (улучшения.надежность > 0) сообщение += ` 🛡️-${улучшения.надежность * 10}%`
        }
        сообщение += `\n👮 +${розыскПрирост}% розыска`
        
        alert(сообщение)
        
        get().проверитьВсеАчивки()
        await get().сохранитьПрогресс()
        return true
      },

      увеличитьРозыск: (amount) => {
        const { розыск } = get()
        let новыйРозыск = розыск + amount
        if (новыйРозыск > 100) новыйРозыск = 100
        set({ розыск: новыйРозыск })
        if (новыйРозыск >= 100) {
          get().рейд()
        }
      },

      датьВзятку: async () => {
        const { розыск, баланс, гильдия } = get()
        if (розыск === 0) {
          alert('👮 Полиция вас не ищет!')
          return false
        }
        const ценаВзятки = розыск * 200
        if (баланс < ценаВзятки) {
          alert(`❌ Не хватает денег на взятку! Нужно: $${ценаВзятки}`)
          return false
        }
        
        let guildExp = 0
        let newGuild = гильдия
        if (гильдия) {
          guildExp = Math.floor(розыск / 5)
          newGuild = {
            ...гильдия,
            exp: гильдия.exp + guildExp
          }
        }
        
        set({ 
          баланс: баланс - ценаВзятки, 
          розыск: 0,
          статистика: {
            ...get().статистика,
            всегоВзяток: (get().статистика?.всегоВзяток || 0) + 1
          },
          гильдия: newGuild
        })
        
        let сообщение = `✅ Взятка дана! -$${ценаВзятки}. Розыск сброшен.`
        if (guildExp > 0) {
          сообщение += `\n🏆 Гильдия получила +${guildExp} EXP!`
          get().обновитьПрогрессКвеста('bribe', 1)
        }
        alert(сообщение)
        
        get().проверитьВсеАчивки()
        await get().сохранитьПрогресс()
        return true
      },

      рейд: async () => {
        const { инвентарь, баланс, статистика } = get()
        const потеряТовара = Math.random() * 0.6 + 0.4
        const новыйИнвентарь = { ...инвентарь }
        let потеряноГрамм = 0
        for (const [key, value] of Object.entries(новыйИнвентарь)) {
          const потеря = Math.floor(value * потеряТовара)
          if (потеря > 0) {
            новыйИнвентарь[key] = value - потеря
            потеряноГрамм += потеря
            if (новыйИнвентарь[key] === 0) delete новыйИнвентарь[key]
          }
        }
        const штраф = 1000
        const новыйБаланс = Math.max(0, баланс - штраф)
        set({ 
          инвентарь: новыйИнвентарь, 
          баланс: новыйБаланс, 
          розыск: 0,
          статистика: {
            ...статистика,
            всегоРейдов: (статистика?.всегоРейдов || 0) + 1
          }
        })
        alert(`🚨 ПОЛИЦЕЙСКИЙ РЕЙД! 🚨\nПотеряно: ${потеряноГрамм}г товара\nШтраф: $${штраф}`)
        get().проверитьВсеАчивки()
        await get().сохранитьПрогресс()
      },

      купитьБизнес: async (id) => {
        const { бизнес, баланс } = get()
        const бизнесКонфиг = БИЗНЕСЫ.find(b => b.id === id)
        if (!бизнесКонфиг) return false
        if (бизнес) {
          alert('❌ У вас уже есть бизнес!')
          return false
        }
        if (баланс < бизнесКонфиг.цена) {
          alert(`❌ Не хватает денег! Нужно: $${бизнесКонфиг.цена}`)
          return false
        }
        set({
          баланс: баланс - бизнесКонфиг.цена,
          бизнес: {
            id: бизнесКонфиг.id,
            лимит: бизнесКонфиг.лимит,
            процент: бизнесКонфиг.процент,
            название: бизнесКонфиг.name
          }
        })
        alert(`✅ Куплен бизнес: ${бизнесКонфиг.name}!`)
        get().проверитьВсеАчивки()
        await get().сохранитьПрогресс()
        return true
      },

      продатьБизнес: async () => {
        const { бизнес, баланс } = get()
        if (!бизнес) {
          alert('❌ У вас нет бизнеса для продажи!')
          return false
        }
        
        const бизнесКонфиг = БИЗНЕСЫ.find(b => b.id === бизнес.id)
        if (!бизнесКонфиг) return false
        
        const возврат = Math.floor(бизнесКонфиг.цена * 0.5)
        const новыйБаланс = баланс + возврат
        
        set({
          баланс: новыйБаланс,
          бизнес: null
        })
        
        alert(`✅ Бизнес продан! Вы получили $${возврат.toLocaleString()} (50% от стоимости покупки)`)
        await get().сохранитьПрогресс()
        return true
      },

      завершитьВсеПродажи: () => {
        const { активныеПродажи, баланс } = get()
        let дополнительныйБаланс = 0
        for (const [, продажа] of Object.entries(активныеПродажи || {})) {
          дополнительныйБаланс += продажа.выручка
          if (продажа.таймер) clearTimeout(продажа.таймер)
        }
        set({ активныеПродажи: {}, баланс: баланс + дополнительныйБаланс })
        if (дополнительныйБаланс > 0) {
          alert(`✅ Завершено ${Object.keys(активныеПродажи || {}).length} продаж! +$${дополнительныйБаланс}`)
        }
      },

      начатьКрафтВStore: (key, recipe) => {
        const времяОкончания = Date.now() + recipe.time * 1000
        set({ активныйКрафт: { key, recipe, времяОкончания } })
        
        setTimeout(async () => {
          const state = get()
          const { активныйКрафт, инвентарь, статистика, добавитьОсколки, оборудованиеИнстансы, оборудованиеИнстансыДанные } = state
          
          if (активныйКрафт && активныйКрафт.времяОкончания <= Date.now()) {
            let эффективность = 1
            let износПрирост = 0
            const использованныеИнстансы: string[] = []
            
            if (активныйКрафт.recipe.requiredEquipment) {
              for (const equip of активныйКрафт.recipe.requiredEquipment) {
                const instances = оборудованиеИнстансы[equip] || []
                if (instances.length > 0) {
                  const instanceId = instances[0]
                  использованныеИнстансы.push(instanceId)
                  const данные = оборудованиеИнстансыДанные[instanceId]
                  const износПроцент = (данные?.wear || 0) / 100
                  const rarityMultiplier = RARITIES[данные?.rarity || 'common']?.multiplier || 1
                  
                  эффективность *= (1 - износПроцент * 0.5)
                  const износШанс = 5 + Math.random() * 15
                  износПрирост += Math.floor(износШанс * rarityMultiplier)
                }
              }
            }
            
            const реальныйВыход = Math.max(1, Math.floor(активныйКрафт.recipe.output * эффективность))
            
            const новыйИнвентарь = {
              ...инвентарь,
              [активныйКрафт.key]: (инвентарь[активныйКрафт.key] || 0) + реальныйВыход
            }
            
            const новаяСтатистика = {
              ...статистика,
              всегоСварено: {
                ...статистика.всегоСварено,
                [активныйКрафт.key]: (статистика.всегоСварено[активныйКрафт.key] || 0) + реальныйВыход
              }
            }
            
            const новыеДанные = { ...оборудованиеИнстансыДанные }
            for (const instanceId of использованныеИнстансы) {
              const данные = новыеДанные[instanceId]
              if (данные) {
                const новыйИзнос = Math.min(100, (данные.wear || 0) + износПрирост)
                новыеДанные[instanceId] = {
                  ...данные,
                  wear: новыйИзнос,
                  usageCount: (данные.usageCount || 0) + 1,
                  totalCrafted: (данные.totalCrafted || 0) + реальныйВыход
                }
              }
            }
            
            set({ 
              инвентарь: новыйИнвентарь,
              статистика: новаяСтатистика,
              оборудованиеИнстансыДанные: новыеДанные,
              активныйКрафт: null
            })
            
            const { гильдия } = get()
            if (гильдия) {
              get().обновитьПрогрессКвеста('craft', реальныйВыход)
            }
            
            if (Math.random() < 0.05) {
              const shardsAmount = Math.floor(Math.random() * 5) + 1
              добавитьОсколки(shardsAmount)
              alert(`✨ Вам повезло! Выпало ${shardsAmount} осколков!`)
            }
            
            get().проверитьВсеАчивки()
            await get().сохранитьПрогресс()
          }
        }, recipe.time * 1000)
      },

      скреститьОборудование: async (instanceId1, instanceId2) => {
        const { оборудованиеИнстансы, оборудованиеИнстансыДанные, защитаОтСгорания } = get()
        
        let itemId1 = null
        let itemId2 = null
        
        for (const [itemId, instances] of Object.entries(оборудованиеИнстансы)) {
          if (instances.includes(instanceId1)) itemId1 = itemId
          if (instances.includes(instanceId2)) itemId2 = itemId
        }
        
        if (!itemId1 || !itemId2 || itemId1 !== itemId2) {
          alert('❌ Можно скрещивать только два одинаковых предмета!')
          return false
        }
        
        const data1 = оборудованиеИнстансыДанные[instanceId1]
        const data2 = оборудованиеИнстансыДанные[instanceId2]
        
        if (!data1 || !data2) {
          alert('❌ Данные оборудования не найдены!')
          return false
        }
        
        if (data1.rarity !== data2.rarity) {
          alert('❌ Можно скрещивать только оборудование одинаковой редкости!')
          return false
        }
        
        const currentRarity = data1.rarity
        const nextRarity = getNextRarity(currentRarity)
        
        if (!nextRarity) {
          alert('❌ Это оборудование уже максимальной редкости!')
          return false
        }
        
        const chance = RARITIES[currentRarity]?.upgradeChance || 0
        const isSuccess = Math.random() < chance
        const useProtection = защитаОтСгорания > 0
        
        if (isSuccess) {
          const новыеИнстансы = { ...оборудованиеИнстансы }
          новыеИнстансы[itemId1] = новыеИнстансы[itemId1].filter(id => id !== instanceId2)
          
          const новыеДанные = { ...оборудованиеИнстансыДанные }
          delete новыеДанные[instanceId2]
          
          set({
            оборудованиеИнстансы: новыеИнстансы,
            оборудованиеИнстансыДанные: {
              ...новыеДанные,
              [instanceId1]: { ...data1, rarity: nextRarity, wear: 0 }
            }
          })
          
          const config = EQUIPMENT_CONFIG.find(e => e.id === itemId1)
          alert(`🎉 УСПЕХ! ${config?.name} улучшен до ${RARITIES[nextRarity].icon} ${RARITIES[nextRarity].name}!\nВторой предмет исчез при скрещивании.`)
        } else {
          if (useProtection) {
            set({ защитаОтСгорания: защитаОтСгорания - 1 })
            alert(`🛡️ Амулет защиты сработал! Оба предмета сохранены.\nОсталось амулетов: ${защитаОтСгорания - 1}`)
          } else {
            const новыеИнстансы = { ...оборудованиеИнстансы }
            новыеИнстансы[itemId1] = новыеИнстансы[itemId1].filter(id => id !== instanceId1 && id !== instanceId2)
            
            const новыеДанные = { ...оборудованиеИнстансыДанные }
            delete новыеДанные[instanceId1]
            delete новыеДанные[instanceId2]
            
            set({
              оборудованиеИнстансы: новыеИнстансы,
              оборудованиеИнстансыДанные: новыеДанные
            })
            const config = EQUIPMENT_CONFIG.find(e => e.id === itemId1)
            alert(`💥 НЕУДАЧА! Оба экземпляра ${config?.name} сгорели при скрещивании!`)
          }
        }
        
        await get().сохранитьПрогресс()
        return true
      },

      получитьИнстансыОборудования: (itemId) => {
        const { оборудованиеИнстансы } = get()
        return оборудованиеИнстансы[itemId] || []
      },

      // ========== АЧИВКИ ==========

      проверитьАчивку: (id, условие, награда) => {
        const state = get()
        const ачивки = state.ачивки || {}
        
        if (ачивки[id]) return false
        
        if (условие()) {
          set({ ачивки: { ...ачивки, [id]: true } })
          state.добавитьОпыт(награда)
          
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('achievementUnlocked', { 
              detail: { id, награда }
            }))
          }
          
          console.log(`🏆 Ачивка получена: ${id} (+${награда} EXP)`)
          return true
        }
        return false
      },

      проверитьВсеАчивки: () => {
        const state = get()
        const stats = state.статистика || {}
        
        state.проверитьАчивку('welcome', () => true, 10)
        state.проверитьАчивку('regular', () => (stats.дниПодряд || 0) >= 7, 500)
        state.проверитьАчивку('hardworker', () => (stats.времяВИгре || 0) >= 3600, 100)
        state.проверитьАчивку('marathon', () => (stats.времяВИгре || 0) >= 36000, 1000)
        state.проверитьАчивку('resident', () => (stats.времяВИгре || 0) >= 86400, 5000)
        state.проверитьАчивку('clicker', () => (stats.всегоКликов || 0) >= 1000, 200)
        state.проверитьАчивку('clicker_monster', () => (stats.всегоКликов || 0) >= 5000, 500)
        
        const totalCrafted = Object.values(stats.всегоСварено || {}).reduce((a: number, b: number) => a + b, 0)
        const uniqueCrafted = Object.keys(stats.всегоСварено || {}).length
        const krokodil = stats.всегоСварено?.krokodil || 0
        const marijuana = stats.всегоСварено?.marijuana || 0
        const meth = stats.всегоСварено?.meth || 0
        const blueMeth = stats.всегоСварено?.blue_meth || 0
        const lsd = stats.всегоСварено?.lsd || 0
        
        state.проверитьАчивку('first_craft', () => totalCrafted >= 1, 50)
        state.проверитьАчивку('crazy_chemist', () => totalCrafted >= 100, 500)
        state.проверитьАчивку('full_drugs', () => uniqueCrafted >= 10, 2000)
        state.проверитьАчивку('krokodil_master', () => krokodil >= 50, 300)
        state.проверитьАчивку('weed_master', () => marijuana >= 100, 500)
        state.проверитьАчивку('meth_master', () => meth >= 50, 500)
        state.проверитьАчивку('walter_white', () => blueMeth >= 30, 1000)
        state.проверитьАчивку('acid_trip', () => lsd >= 20, 1500)
        
        const totalSoldGrams = Object.values(stats.всегоПродано || {}).reduce((a: number, b: number) => a + b, 0)
        const totalSales = stats.всегоПродаж || 0
        const totalEarned = stats.всегоЗаработано || 0
        
        state.проверитьАчивку('first_sale', () => totalSoldGrams >= 1, 50)
        state.проверитьАчивку('dealer', () => totalSales >= 100, 1000)
        state.проверитьАчивку('millionaire', () => totalEarned >= 1000000, 5000)
        state.проверитьАчивку('wholesale', () => totalSoldGrams >= 1000, 2000)
        state.проверитьАчивку('money_bag', () => totalEarned >= 10000000, 10000)
        
        const carsCount = Object.keys(state.машины || {}).length
        const hasSecret = state.машины?.secret?.активна || false
        const totalTrips = stats.всегоПоездок || 0
        
        state.проверитьАчивку('first_car', () => carsCount >= 1, 100)
        state.проверитьАчивку('five_cars', () => carsCount >= 5, 500)
        state.проверитьАчивку('all_cars', () => carsCount >= 11, 2000)
        state.проверитьАчивку('secret_car', () => hasSecret, 5000)
        state.проверитьАчивку('racer', () => totalTrips >= 100, 1000)
        
        const hasBusiness = !!state.бизнес
        const isBank = state.бизнес?.id === 'bank'
        const totalWashed = stats.всегоОтмыто || 0
        
        state.проверитьАчивку('first_business', () => hasBusiness, 500)
        state.проверитьАчивку('mafia', () => isBank, 2000)
        state.проверитьАчивку('clean_money', () => totalWashed >= 1000000, 5000)
        
        const totalBribes = stats.всегоВзяток || 0
        const totalRaids = stats.всегоРейдов || 0
        
        state.проверитьАчивку('wanted', () => state.розыск >= 100, 100)
        state.проверитьАчивку('bribe_master', () => totalBribes >= 10, 1000)
        state.проверитьАчивку('untouchable', () => totalRaids >= 5, 2000)
        
        const equipmentCount = Object.keys(state.оборудованиеИнстансы || {}).length
        const totalRepairs = stats.всегоРемонтов || 0
        const allEquipment = equipmentCount >= 17
        
        state.проверитьАчивку('five_equipment', () => equipmentCount >= 5, 200)
        state.проверитьАчивку('all_equipment', () => allEquipment, 2000)
        state.проверитьАчивку('repair_master', () => totalRepairs >= 100, 1000)
        
        const level = state.уровень
        
        state.проверитьАчивку('level_5', () => level >= 5, 500)
        state.проверитьАчивку('level_10', () => level >= 10, 2000)
        state.проверитьАчивку('level_20', () => level >= 20, 10000)
        
        const craftsInRow = stats.всегоКрафтовПодряд || 0
        state.проверитьАчивку('craft_streak', () => craftsInRow >= 10, 1000)
      },

      обновитьСтатистику: () => {
        const { статистика } = get()
        set({ статистика: { ...статистика } })
      },

      обновитьЦены: () => {
        const { текущиеЦены } = get()
        const новыеЦены = { ...текущиеЦены }
        const названия: Record<string, string> = {
          krokodil: '🐊 Крокодил',
          marijuana: '🌿 Марихуана',
          pcp: '👻 PCP',
          amphetamine: '⚡ Амфетамин',
          meth: '❄️ Метамфетамин',
          mdma: '💊 MDMA',
          heroin: '💉 Героин',
          cocaine: '⬜ Кокаин',
          blue_meth: '💎 Голубой Мет',
          lsd: '🧪 ЛСД'
        }
        
        const БАЗОВЫЕ_ЦЕНЫ = {
          krokodil: 250,
          marijuana: 70,
          pcp: 120,
          amphetamine: 180,
          meth: 300,
          mdma: 350,
          heroin: 500,
          cocaine: 700,
          blue_meth: 1000,
          lsd: 1500
        }
        
        let изменения = []
        for (const [key, цена] of Object.entries(новыеЦены)) {
          const база = БАЗОВЫЕ_ЦЕНЫ[key as keyof typeof БАЗОВЫЕ_ЦЕНЫ] || 100
          const изменение = (Math.random() * 60) - 30
          let новаяЦена = Math.floor(база * (1 + изменение / 100))
          новаяЦена = Math.max(10, новаяЦена)
          новыеЦены[key] = новаяЦена
          const знак = изменение > 0 ? '↑' : '↓'
          изменения.push(`${названия[key]}: ${цена} → ${новаяЦена} (${знак}${Math.abs(изменение).toFixed(0)}%)`)
        }
        
        const следующийИнтервал = 5 * 60 * 1000 + Math.random() * 5 * 60 * 1000
        const следующееВремя = Date.now() + следующийИнтервал
        
        set({ 
          текущиеЦены: новыеЦены,
          следующееОбновлениеЦен: следующееВремя
        })
        
        alert(`📊 БИРЖА ЦЕН ОБНОВЛЕНА!\n\n${изменения.slice(0, 5).join('\n')}${изменения.length > 5 ? `\nи ещё ${изменения.length - 5} позиций...` : ''}\n\n⏱️ Следующее обновление через ${Math.floor(следующийИнтервал / 60000)} мин`)
      },

      запланироватьОбновлениеЦен: () => {
        const { следующееОбновлениеЦен } = get()
        const сейчас = Date.now()
        const задержка = Math.max(0, следующееОбновлениеЦен - сейчас)
        
        setTimeout(() => {
          get().обновитьЦены()
          get().запланироватьОбновлениеЦен()
        }, задержка)
      },

      открытьЗвание: (id) => {
        const { доступныеЗвания, статистика, уровень } = get()
        const звание = ЗВАНИЯ.find(z => z.id === id)
        if (!звание) return
        
        if (уровень < звание.требование.уровень) {
          alert(`❌ Нужен ${звание.требование.уровень} уровень!`)
          return
        }
        if ((статистика?.всегоПродаж || 0) < звание.требование.продажи) {
          alert(`❌ Нужно ${звание.требование.продажи} продаж!`)
          return
        }
        if (!доступныеЗвания.includes(id)) {
          set({ доступныеЗвания: [...доступныеЗвания, id] })
        }
        set({ активноеЗвание: id })
        alert(`✅ Теперь вы ${звание.название}!`)
      },

      купитьНавык: async (id) => {
        const { навыки, баланс } = get()
        const навык = НАВЫКИ.find(n => n.id === id)
        if (!навык) return false
        
        const текущийУровень = навыки[id] || 0
        if (текущийУровень >= навык.макс) {
          alert('❌ Максимальный уровень навыка!')
          return false
        }
        
        const цена = навык.цена * (текущийУровень + 1)
        if (баланс < цена) {
          alert(`❌ Нужно $${цена} для улучшения!`)
          return false
        }
        
        set({ 
          баланс: баланс - цена,
          навыки: { ...навыки, [id]: текущийУровень + 1 }
        })
        alert(`✅ ${навык.название} улучшен до ${текущийУровень + 1} уровня!`)
        await get().сохранитьПрогресс()
        return true
      },

      купитьСкин: async (id) => {
        const { купленныеСкины, баланс } = get()
        const скин = СКИНЫ.find(s => s.id === id)
        if (!скин) return false
        
        if (купленныеСкины.includes(id)) {
          alert('❌ У вас уже есть этот скин!')
          return false
        }
        
        if (баланс < скин.цена) {
          alert(`❌ Нужно $${скин.цена} для покупки!`)
          return false
        }
        
        set({ 
          баланс: баланс - скин.цена,
          купленныеСкины: [...купленныеСкины, id]
        })
        alert(`✅ Скин ${скин.название} куплен!`)
        await get().сохранитьПрогресс()
        return true
      },

      экипироватьСкин: (id) => {
        const { купленныеСкины } = get()
        if (!купленныеСкины.includes(id)) {
          alert('❌ У вас нет этого скина!')
          return
        }
        set({ активныйСкин: id })
        alert(`✅ Скин ${СКИНЫ.find(s => s.id === id)?.название} экипирован!`)
        get().сохранитьПрогресс()
      },

      // ========== БОКСЫ И ГЛИФЫ ==========

      открытьБокс: async (boxId, glyphId) => {
  const { осколки, глифы, статистика } = get()
  const box = getBoxById(boxId)
  if (!box) return false
  if (осколки < box.price) return false
  
  set({ осколки: осколки - box.price })
  
  if (!глифы[glyphId]) {
    set({ глифы: { ...глифы, [glyphId]: true } })
  }
  
  // ↓↓↓ ДОБАВЛЯЕМ СЧЁТЧИК ОТКРЫТЫХ БОКСОВ ↓↓↓
  set({
    статистика: {
      ...статистика,
      открытоБоксов: (статистика?.открытоБоксов || 0) + 1
    }
  })
  
  await get().сохранитьПрогресс()
  get().проверитьВсеАчивки()
  return true
},

      экипироватьГлиф: (glyphId) => {
        const { глифы, экипированныеГлифы } = get()
        if (!глифы[glyphId]) {
          alert('❌ У вас нет этого глифа!')
          return
        }
        if (экипированныеГлифы.length >= 3) {
          alert('❌ Можно экипировать только 3 глифа!')
          return
        }
        if (экипированныеГлифы.includes(glyphId)) {
          alert('❌ Глиф уже экипирован!')
          return
        }
        
        set({ экипированныеГлифы: [...экипированныеГлифы, glyphId] })
        alert(`✅ Глиф экипирован!`)
        get().сохранитьПрогресс()
      },

      снятьГлиф: (glyphId) => {
        const { экипированныеГлифы } = get()
        set({ экипированныеГлифы: экипированныеГлифы.filter(id => id !== glyphId) })
        alert(`✅ Глиф снят!`)
        get().сохранитьПрогресс()
      },

      добавитьОсколки: (amount) => {
        const { осколки } = get()
        set({ осколки: осколки + amount })
        get().сохранитьПрогресс()
      },

      // ========== МЕТОДЫ ГИЛЬДИИ ==========

      создатьГильдию: async (name, description, type, focus, minLevel, emblem, color) => {
        const { баланс, userId, гильдия, всеГильдии } = get()
        const userName = localStorage.getItem('userName') || 'Игрок'
        if (гильдия) { alert('❌ Вы уже в гильдии!'); return false }
        if (баланс < 100000) { alert(`❌ Не хватает $100,000 для создания гильдии!`); return false }
        
        const guildId = `guild_${Date.now()}_${Math.random()}`
        const newGuild = {
          id: guildId, name, description, leader: userId!, type, focus, minLevel, emblem, color,
          level: 1, exp: 0, bank: 0, bankCoins: 0, createdAt: Date.now(), lastAttackTime: 0, base: null, alliance: null,
          members: [{ userId: userId!, userName: userName, rank: 'leader', online: true, lastSeen: Date.now(), joinedAt: Date.now(), contribution: 0 }],
          chat: [{ id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `🎉 Гильдия "${name}" создана! Добро пожаловать!`, timestamp: Date.now() }],
          activeUpgrades: { economic: null, production: null, logistic: null, defense: null, militaryAttack: null, militaryDefense: null },
          purchasedUpgrades: { economic: [], production: [], logistic: [], defense: [], social: [], militaryAttack: [], militaryDefense: [] },
          quests: GUILD_QUESTS.map(q => ({ id: q.id, progress: 0, completed: false })),
          lastQuestReset: Date.now(),
          notificationSettings: { chat: true, wars: true, points: true, income: true, members: true, upgrades: true, quests: true }
        }
        set({ баланс: баланс - 100000, гильдия: newGuild, всеГильдии: { ...всеГильдии, [guildId]: newGuild } })
        alert(`✅ Гильдия "${name}" создана!`)
        await get().сохранитьПрогресс()
        return true
      },

      вступитьВГильдию: async (guildId) => {
        const { гильдия, userId, уровень, всеГильдии } = get()
        const userName = localStorage.getItem('userName') || 'Игрок'
        if (гильдия) { alert('❌ Вы уже в гильдии!'); return false }
        const targetGuild = всеГильдии?.[guildId]
        if (!targetGuild) { alert('❌ Гильдия не найдена!'); return false }
        if (уровень < targetGuild.minLevel) { alert(`❌ Требуется ${targetGuild.minLevel} уровень!`); return false }
        if (targetGuild.type === 'closed') { alert('❌ Гильдия закрыта для вступления!'); return false }
        
        const newMember = { userId: userId!, userName: userName, rank: 'member', online: true, lastSeen: Date.now(), joinedAt: Date.now(), contribution: 0 }
        const updatedGuild = { ...targetGuild, members: [...targetGuild.members, newMember], chat: [...targetGuild.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `👋 ${userName} вступил в гильдию!`, timestamp: Date.now() }] }
        set({ гильдия: updatedGuild, всеГильдии: { ...всеГильдии, [guildId]: updatedGuild } })
        alert(`✅ Вы вступили в гильдию "${targetGuild.name}"!`)
        await get().сохранитьПрогресс()
        return true
      },

      покинутьГильдию: async () => {
        const { гильдия, userId, всеГильдии } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const member = гильдия.members.find(m => m.userId === userId)
        if (member?.rank === 'leader') { alert('❌ Создатель не может покинуть гильдию!'); return false }
        const updatedMembers = гильдия.members.filter(m => m.userId !== userId)
        const updatedGuild = { ...гильдия, members: updatedMembers, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `👋 ${member?.userName} покинул гильдию...`, timestamp: Date.now() }] }
        set({ гильдия: null, всеГильдии: { ...всеГильдии, [гильдия.id]: updatedGuild } })
        alert(`✅ Вы покинули гильдию!`)
        await get().сохранитьПрогресс()
        return true
      },

      исключитьИзГильдии: async (targetUserId) => {
        const { гильдия, userId, всеГильдии } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader' && userRole !== 'coLeader') { alert('❌ Недостаточно прав!'); return false }
        const target = гильдия.members.find(m => m.userId === targetUserId)
        if (!target) { alert('❌ Игрок не в гильдии!'); return false }
        if (target.rank === 'leader') { alert('❌ Нельзя исключить создателя гильдии!'); return false }
        if (target.rank === 'coLeader' && userRole !== 'leader') { alert('❌ Только создатель может исключить со-создателя!'); return false }
        const updatedMembers = гильдия.members.filter(m => m.userId !== targetUserId)
        const updatedGuild = { ...гильдия, members: updatedMembers, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `${target.userName} исключён из гильдии!`, timestamp: Date.now() }] }
        set({ гильдия: updatedGuild, всеГильдии: { ...всеГильдии, [гильдия.id]: updatedGuild } })
        alert(`✅ Игрок ${target.userName} исключён из гильдии!`)
        await get().сохранитьПрогресс()
        return true
      },

      назначитьСоздателя: async (targetUserId) => {
        const { гильдия, userId } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader') { alert('❌ Только создатель может назначать со-создателей!'); return false }
        const target = гильдия.members.find(m => m.userId === targetUserId)
        if (!target) { alert('❌ Игрок не в гильдии!'); return false }
        const coLeaders = гильдия.members.filter(m => m.rank === 'coLeader')
        if (coLeaders.length >= 2 && target.rank !== 'coLeader') { alert('❌ Максимум 2 со-создателя!'); return false }
        const updatedMembers = гильдия.members.map(m => m.userId === targetUserId ? { ...m, rank: 'coLeader' } : m)
        const updatedGuild = { ...гильдия, members: updatedMembers, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `${target.userName} назначен со-создателем!`, timestamp: Date.now() }] }
        set({ гильдия: updatedGuild })
        alert(`✅ ${target.userName} назначен со-создателем!`)
        await get().сохранитьПрогресс()
        return true
      },

      отправитьСообщение: (message) => {
        const { гильдия, userId } = get()
        const userName = localStorage.getItem('userName') || 'Игрок'
        const userRank = гильдия?.members.find(m => m.userId === userId)?.rank || 'member'
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return }
        if (message.trim() === '') return
        const newMessage = { id: Date.now().toString(), userId: userId!, userName: userName, userRank: userRank, message: message.trim(), timestamp: Date.now() }
        const updatedGuild = { ...гильдия, chat: [newMessage, ...гильдия.chat].slice(0, 100) }
        set({ гильдия: updatedGuild })
      },

      купитьТлен: async (amount) => {
        const { баланс, гильдия, userId } = get()
        const userName = localStorage.getItem('userName') || 'Игрок'
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const price = amount * 100
        if (баланс < price) { alert(`❌ Не хватает $${price.toLocaleString()}!`); return false }
        const updatedMembers = гильдия.members.map(m => m.userId === userId ? { ...m, contribution: (m.contribution || 0) + amount } : m)
        const updatedGuild = { ...гильдия, bankCoins: гильдия.bankCoins + amount, members: updatedMembers, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `${userName} купил ${amount} 🪙 Тлена!`, timestamp: Date.now() }] }
        set({ баланс: баланс - price, гильдия: updatedGuild })
        alert(`✅ Куплено ${amount} 🪙 Тлена за $${price.toLocaleString()}!`)
        get().обновитьПрогрессКвеста('tlen', amount)
        await get().сохранитьПрогресс()
        return true
      },

      продатьПрофит: async (amount) => {
        const { профит, баланс } = get()
        if (профит < amount) { alert(`❌ У вас только ${профит} 💎!`); return false }
        const price = amount * 1000
        set({ профит: профит - amount, баланс: баланс + price })
        alert(`✅ Продано ${amount} 💎 за $${price.toLocaleString()}!`)
        await get().сохранитьПрогресс()
        return true
      },

      купитьСкинЛабы: async (skinId) => {
        const { профит, гильдейскийИнвентарь } = get()
        const skin = LAB_SKINS.find(s => s.id === skinId)
        if (!skin) return false
        if (профит < skin.price) { alert(`❌ Нужно ${skin.price} 💎!`); return false }
        if (гильдейскийИнвентарь.labSkins.includes(skinId)) { alert('❌ У вас уже есть этот скин!'); return false }
        set({ профит: профит - skin.price, гильдейскийИнвентарь: { ...гильдейскийИнвентарь, labSkins: [...гильдейскийИнвентарь.labSkins, skinId] } })
        alert(`✅ Куплен скин "${skin.name}"!`)
        await get().сохранитьПрогресс()
        return true
      },

      экипироватьСкинЛабы: async (skinId) => {
        const { гильдейскийИнвентарь } = get()
        if (!гильдейскийИнвентарь.labSkins.includes(skinId)) { alert('❌ У вас нет этого скина!'); return false }
        set({ гильдейскийИнвентарь: { ...гильдейскийИнвентарь, activeLabSkin: skinId } })
        const skin = LAB_SKINS.find(s => s.id === skinId)
        alert(`✅ Скин "${skin?.name}" экипирован! +${skin?.bonus}% к выходу продукта`)
        await get().сохранитьПрогресс()
        return true
      },

      купитьБаффКонвертации: async (bonusId) => {
        const { профит, гильдейскийИнвентарь } = get()
        const bonus = CONVERSION_BONUSES.find(b => b.id === bonusId)
        if (!bonus) return false
        if (профит < bonus.price) { alert(`❌ Нужно ${bonus.price} 💎!`); return false }
        if (гильдейскийИнвентарь.conversionBonuses.includes(bonusId)) { alert('❌ У вас уже есть этот бафф!'); return false }
        set({ профит: профит - bonus.price, гильдейскийИнвентарь: { ...гильдейскийИнвентарь, conversionBonuses: [...гильдейскийИнвентарь.conversionBonuses, bonusId] } })
        alert(`✅ Куплен бафф "${bonus.name}" (+${bonus.bonus}% к конвертации)!`)
        await get().сохранитьПрогресс()
        return true
      },

      экипироватьБаффКонвертации: async (bonusId) => {
        const { гильдейскийИнвентарь } = get()
        if (!гильдейскийИнвентарь.conversionBonuses.includes(bonusId)) { alert('❌ У вас нет этого баффа!'); return false }
        set({ гильдейскийИнвентарь: { ...гильдейскийИнвентарь, activeConversionBonus: bonusId } })
        const bonus = CONVERSION_BONUSES.find(b => b.id === bonusId)
        alert(`✅ Бафф "${bonus?.name}" экипирован! +${bonus?.bonus}% к конвертации`)
        await get().сохранитьПрогресс()
        return true
      },

      активироватьВременныйБафф: async (buffId) => {
        const { профит, гильдейскийИнвентарь } = get()
        const buff = TEMP_BUFFS.find(b => b.id === buffId)
        if (!buff) return false
        if (профит < buff.price) { alert(`❌ Нужно ${buff.price} 💎!`); return false }
        const now = Date.now()
        const durationMs = buff.duration * 60 * 60 * 1000
        let newBuffs = { ...гильдейскийИнвентарь.temporaryBuffs }
        if (buff.effect === 'sellBonus') newBuffs.sellBonus = now + durationMs
        else if (buff.effect === 'craftBonus') newBuffs.craftBonus = now + durationMs
        else if (buff.effect === 'speedBonus') newBuffs.speedBonus = now + durationMs
        else if (buff.effect === 'stealthBonus') newBuffs.stealthBonus = now + durationMs
        else if (buff.effect === 'expBonus') newBuffs.expBonus = now + durationMs
        else if (buff.effect === 'allBonus') {
          newBuffs.sellBonus = now + durationMs; newBuffs.craftBonus = now + durationMs
          newBuffs.speedBonus = now + durationMs; newBuffs.stealthBonus = now + durationMs; newBuffs.expBonus = now + durationMs
        }
        set({ профит: профит - buff.price, гильдейскийИнвентарь: { ...гильдейскийИнвентарь, temporaryBuffs: newBuffs } })
        alert(`✅ Бафф "${buff.name}" активирован на ${buff.duration} часа!`)
        await get().сохранитьПрогресс()
        return true
      },

      купитьУлучшениеГильдии: async (category, upgradeId) => {
        const { гильдия, userId } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader' && userRole !== 'coLeader') { alert('❌ Только лидеры могут покупать улучшения!'); return false }
        const upgrades = GUILD_UPGRADES[category as keyof typeof GUILD_UPGRADES]
        const upgrade = upgrades.find((u: any) => u.id === upgradeId)
        if (!upgrade) return false
        const isPurchased = гильдия.purchasedUpgrades[category as keyof typeof гильдия.purchasedUpgrades]?.includes(upgradeId)
        if (isPurchased) { alert('❌ Улучшение уже куплено!'); return false }
        const price = upgrade.price || 0
        if (гильдия.bank < price) { alert(`❌ В казне не хватает $${price.toLocaleString()}!`); return false }
        const updatedPurchased = { ...гильдия.purchasedUpgrades, [category]: [...(гильдия.purchasedUpgrades[category as keyof typeof гильдия.purchasedUpgrades] || []), upgradeId] }
        const updatedGuild = { ...гильдия, bank: гильдия.bank - price, purchasedUpgrades: updatedPurchased, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `🏆 Куплено улучшение "${upgrade.name}"!`, timestamp: Date.now() }] }
        set({ гильдия: updatedGuild })
        alert(`✅ Улучшение "${upgrade.name}" куплено!`)
        await get().сохранитьПрогресс()
        return true
      },

      сменитьАктивноеУлучшение: async (category, upgradeId) => {
        const { гильдия, userId } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader' && userRole !== 'coLeader') { alert('❌ Только лидеры могут менять активные улучшения!'); return false }
        const isPurchased = гильдия.purchasedUpgrades[category as keyof typeof гильдия.purchasedUpgrades]?.includes(upgradeId)
        if (!isPurchased) { alert('❌ Улучшение не куплено!'); return false }
        const updatedGuild = { ...гильдия, activeUpgrades: { ...гильдия.activeUpgrades, [category]: upgradeId } }
        set({ гильдия: updatedGuild })
        alert(`✅ Активное улучшение изменено!`)
        await get().сохранитьПрогресс()
        return true
      },

      купитьБазуГильдии: async (baseId) => {
        const { гильдия, userId } = get()
        const base = GUILD_BASES.find(b => b.id === baseId)
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader' && userRole !== 'coLeader') { alert('❌ Только лидеры могут покупать базу!'); return false }
        if (!base) return false
        if (гильдия.bank < base.price) { alert(`❌ В казне не хватает $${base.price.toLocaleString()}!`); return false }
        const updatedGuild = { ...гильдия, bank: гильдия.bank - base.price, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `🏛️ Куплена база "${base.name}"!`, timestamp: Date.now() }] }
        set({ гильдия: updatedGuild })
        alert(`✅ База "${base.name}" куплена! Теперь её можно экипировать.`)
        await get().сохранитьПрогресс()
        return true
      },

      экипироватьБазуГильдии: async (baseId) => {
        const { гильдия, userId } = get()
        const base = GUILD_BASES.find(b => b.id === baseId)
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader' && userRole !== 'coLeader') { alert('❌ Только лидеры могут экипировать базу!'); return false }
        if (!base) return false
        const updatedGuild = { ...гильдия, base: baseId }
        set({ гильдия: updatedGuild })
        alert(`✅ База "${base.name}" экипирована! +${base.bonus}% ко всем бонусам.`)
        await get().сохранитьПрогресс()
        return true
      },

      заключитьАльянс: async (guildId) => {
        const { гильдия, userId, всеГильдии } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader') { alert('❌ Только создатель может заключать альянсы!'); return false }
        if (гильдия.alliance) { alert('❌ У вас уже есть альянс!'); return false }
        const targetGuild = всеГильдии?.[guildId]
        if (!targetGuild) { alert('❌ Гильдия не найдена!'); return false }
        if (targetGuild.id === гильдия.id) { alert('❌ Нельзя заключить альянс с самим собой!'); return false }
        const updatedGuild = { ...гильдия, alliance: guildId, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `🤝 Заключён альянс с гильдией "${targetGuild.name}"!`, timestamp: Date.now() }] }
        set({ гильдия: updatedGuild })
        alert(`✅ Альянс с гильдией "${targetGuild.name}" заключён!`)
        await get().сохранитьПрогресс()
        return true
      },

      расторгнутьАльянс: async () => {
        const { гильдия, userId } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader') { alert('❌ Только создатель может расторгнуть альянс!'); return false }
        if (!гильдия.alliance) { alert('❌ У вас нет альянса!'); return false }
        const updatedGuild = { ...гильдия, alliance: null, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `💔 Альянс расторгнут!`, timestamp: Date.now() }] }
        set({ гильдия: updatedGuild })
        alert(`✅ Альянс расторгнут!`)
        await get().сохранитьПрогресс()
        return true
      },

      взятьКвест: async (questId) => {
        const { гильдия } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const quest = гильдия.quests.find(q => q.id === questId)
        if (!quest) return false
        if (quest.completed) { alert('❌ Квест уже завершён!'); return false }
        alert(`✅ Квест взят! Выполняйте задания для его завершения.`)
        return true
      },

      забратьНаградуКвеста: async (questId) => {
        const { гильдия, userId } = get()
        if (!гильдия) { alert('❌ Вы не в гильдии!'); return false }
        const questIndex = гильдия.quests.findIndex(q => q.id === questId)
        if (questIndex === -1) return false
        const quest = гильдия.quests[questIndex]
        const questConfig = GUILD_QUESTS.find(q => q.id === questId)
        if (!questConfig) return false
        if (!quest.completed && quest.progress < questConfig.target) { alert(`❌ Квест не выполнен! Прогресс: ${quest.progress}/${questConfig.target}`); return false }
        if (quest.completed) { alert('❌ Награда уже получена!'); return false }
        let newBank = гильдия.bank, newBankCoins = гильдия.bankCoins, rewardMessage = ''
        if (questConfig.rewardExp) { newBank = гильдия.bank + (questConfig.rewardExp || 0); rewardMessage += ` +${questConfig.rewardExp} EXP` }
        if (questConfig.rewardCoins) { newBankCoins = гильдия.bankCoins + questConfig.rewardCoins; rewardMessage += ` +${questConfig.rewardCoins} 🪙` }
        const updatedQuests = [...гильдия.quests]; updatedQuests[questIndex] = { ...quest, completed: true }
        const updatedGuild = { ...гильдия, bank: newBank, bankCoins: newBankCoins, quests: updatedQuests, chat: [...гильдия.chat, { id: Date.now().toString(), userId: 'bot', userName: '🤖 Бот', userRank: 'member', message: `🎉 Квест "${questConfig.name}" выполнен! Награда:${rewardMessage}`, timestamp: Date.now() }] }
        set({ гильдия: updatedGuild })
        alert(`✅ Квест "${questConfig.name}" выполнен! Получено:${rewardMessage}`)
        await get().сохранитьПрогресс()
        return true
      },

      обновитьПрогрессКвеста: (type, amount) => {
        const { гильдия } = get()
        if (!гильдия) return
        const updatedQuests = гильдия.quests.map(quest => {
          const questConfig = GUILD_QUESTS.find(q => q.id === quest.id)
          if (!questConfig || quest.completed) return quest
          if (questConfig.type === type) {
            const newProgress = Math.min(quest.progress + amount, questConfig.target)
            return { ...quest, progress: newProgress }
          }
          return quest
        })
        set({ гильдия: { ...гильдия, quests: updatedQuests } })
      },

      сброситьКвесты: () => {
        const { гильдия } = get()
        if (!гильдия) return
        const now = Date.now()
        const dayMs = 24 * 60 * 60 * 1000
        if (now - гильдия.lastQuestReset < dayMs) return
        const updatedQuests = GUILD_QUESTS.map(q => ({ id: q.id, progress: 0, completed: false }))
        set({ гильдия: { ...гильдия, quests: updatedQuests, lastQuestReset: now } })
      },

      обновитьОнлайн: () => {
        const { гильдия, userId } = get()
        if (!гильдия) return
        const updatedMembers = гильдия.members.map(m => ({ ...m, online: m.userId === userId, lastSeen: m.userId === userId ? Date.now() : m.lastSeen }))
        set({ гильдия: { ...гильдия, members: updatedMembers } })
      },

      // ========== ПРИГЛАШЕНИЯ В ГИЛЬДИЮ ==========

      пригласитьВГильдию: async (targetUserId) => {
        const { гильдия, userId, всеГильдии, приглашенияВГильдию } = get()
        const userName = localStorage.getItem('userName') || 'Игрок'
        
        if (!гильдия) {
          alert('❌ Вы не в гильдии!')
          return false
        }
        
        const userRole = гильдия.members.find(m => m.userId === userId)?.rank
        if (userRole !== 'leader' && userRole !== 'coLeader') {
          alert('❌ Только лидеры могут приглашать!')
          return false
        }
        
        const targetGuild = Object.values(всеГильдии || {}).find((g: any) => 
          g.members.some((m: any) => m.userId === targetUserId)
        )
        if (targetGuild) {
          alert('❌ Игрок уже состоит в гильдии!')
          return false
        }
        
        const existingInvite = приглашенияВГильдию?.find(
          (inv: any) => inv.guildId === гильдия.id && inv.userId === targetUserId
        )
        if (existingInvite) {
          alert('❌ Приглашение уже отправлено!')
          return false
        }
        
        const newInvite = {
          userId: targetUserId,
          from: userId!,
          fromName: userName,
          guildId: гильдия.id,
          guildName: гильдия.name,
          timestamp: Date.now()
        }
        
        set({ 
          приглашенияВГильдию: [...(приглашенияВГильдию || []), newInvite]
        })
        
        alert(`✅ Приглашение отправлено игроку!`)
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('guildInvite', { 
            detail: { from: userName, guildName: гильдия.name, guildId: гильдия.id }
          }))
        }
        
        return true
      },

      принятьПриглашение: async (guildId) => {
        const { гильдия, userId, уровень, всеГильдии, приглашенияВГильдию } = get()
        const userName = localStorage.getItem('userName') || 'Игрок'
        
        if (гильдия) {
          alert('❌ Вы уже в гильдии!')
          return false
        }
        
        const invite = приглашенияВГильдию?.find((inv: any) => inv.guildId === guildId && inv.userId === userId)
        if (!invite) {
          alert('❌ Приглашение не найдено или истекло!')
          return false
        }
        
        const targetGuild = всеГильдии?.[guildId]
        if (!targetGuild) {
          alert('❌ Гильдия не найдена!')
          return false
        }
        
        if (уровень < targetGuild.minLevel) {
          alert(`❌ Требуется ${targetGuild.minLevel} уровень!`)
          return false
        }
        
        const maxSlots = GUILD_LEVELS[targetGuild.level]?.slots || 5
        if (targetGuild.members.length >= maxSlots) {
          alert('❌ В гильдии нет свободных мест!')
          return false
        }
        
        const newMember = {
          userId: userId!,
          userName: userName,
          rank: 'member',
          online: true,
          lastSeen: Date.now(),
          joinedAt: Date.now(),
          contribution: 0
        }
        
        const updatedGuild = {
          ...targetGuild,
          members: [...targetGuild.members, newMember],
          chat: [...targetGuild.chat, {
            id: Date.now().toString(),
            userId: 'bot',
            userName: '🤖 Бот',
            userRank: 'member',
            message: `👋 ${userName} вступил в гильдию по приглашению от ${invite.fromName}!`,
            timestamp: Date.now()
          }]
        }
        
        const updatedInvites = приглашенияВГильдию.filter((inv: any) => !(inv.guildId === guildId && inv.userId === userId))
        
        set({ 
          гильдия: updatedGuild,
          всеГильдии: { ...всеГильдии, [guildId]: updatedGuild },
          приглашенияВГильдию: updatedInvites
        })
        
        alert(`✅ Вы вступили в гильдию "${targetGuild.name}"!`)
        await get().сохранитьПрогресс()
        return true
      },

      отклонитьПриглашение: async (guildId) => {
        const { userId, приглашенияВГильдию } = get()
        
        const updatedInvites = приглашенияВГильдию.filter(
          (inv: any) => !(inv.guildId === guildId && inv.userId === userId)
        )
        
        set({ приглашенияВГильдию: updatedInvites })
        alert(`❌ Приглашение отклонено!`)
        return true
      },

      получитьПриглашения: () => {
        const { userId, приглашенияВГильдию } = get()
        return (приглашенияВГильдию || []).filter((inv: any) => inv.userId === userId)
      },

      // ========== РЕФЕРАЛЫ ==========

      обработатьРеферала: async (referrerId) => {
        const { userId, рефералы, баланс, осколки, статистика } = get()
        
        if (!userId) {
          return { rewarded: false, message: "Пользователь не авторизован" }
        }
        
        if (referrerId === userId) {
          return { rewarded: false, message: "Нельзя пригласить самого себя" }
        }
        
        if (рефералы.invitedBy) {
          return { rewarded: false, message: "Вы уже были приглашены кем-то" }
        }
        
        const key = `${referrerId}_${userId}`
        if (рефералы.rewardsClaimed[key]) {
          return { rewarded: false, message: "Награда за этого реферала уже выдана" }
        }
        
        set({
          рефералы: {
            ...рефералы,
            invitedBy: referrerId,
            rewardsClaimed: { ...рефералы.rewardsClaimed, [key]: true }
          }
        })
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('referralReward', {
            detail: {
              referrerId: referrerId,
              reward: { cash: 5000, shard: 1 },
              newUserId: userId
            }
          }))
        }
        
        const newBalance = баланс + 2500
        const newShards = осколки + 1
        
        set({
          баланс: newBalance,
          осколки: newShards,
          статистика: {
            ...статистика,
            всегоЗаработано: (статистика?.всегоЗаработано || 0) + 2500
          }
        })
        
        await get().сохранитьПрогресс()
        
        return {
          rewarded: true,
          message: `🎉 Вы получили $2500 и 1 осколок за переход по реферальной ссылке!\nВаш друг тоже получил бонус!`
        }
      },

      получитьРеферальнуюСсылку: () => {
        const { userId } = get()
        if (!userId) return ''
        
        const botUsername = 'YourGameBot'
        return `https://t.me/${botUsername}?start=ref_${userId}`
      },

      забратьРеферальнуюНаграду: async (referredUserId) => {
        const { userId, рефералы, баланс, осколки } = get()
        
        if (!userId) return false
        
        const key = `${userId}_${referredUserId}`
        if (рефералы.rewardsClaimed[key]) {
          alert('❌ Награда за этого реферала уже получена!')
          return false
        }
        
        set({
          баланс: баланс + 5000,
          осколки: осколки + 1,
          рефералы: {
            ...рефералы,
            totalReferrals: рефералы.totalReferrals + 1,
            invitedUsers: [...рефералы.invitedUsers, referredUserId],
            rewardsClaimed: { ...рефералы.rewardsClaimed, [key]: true }
          }
        })
        
        alert(`🎉 Вы получили $5000 и 1 осколок за приглашение друга!`)
        await get().сохранитьПрогресс()
        return true
      },

      сгенерироватьРеферальныйКод: () => {
        const { userId, реферальныйКод } = get()
        if (реферальныйКод) return
        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let result = ''
        for (let i = 0; i < 8; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        set({ реферальныйКод: result })
        get().сохранитьПрогресс()
      },

      применитьРеферальныйКод: async (code) => {
        const { userId, всеГильдии, приглашённые } = get()
        
        if (приглашённые?.includes(userId!)) {
          alert('❌ Вы уже использовали реферальный код!')
          return false
        }
        
        let referrerId = null
        for (const [id, data] of Object.entries(всеГильдии || {})) {
          if (data.реферальныйКод === code) {
            referrerId = id
            break
          }
        }
        
        if (!referrerId) {
          alert('❌ Неверный реферальный код!')
          return false
        }
        
        if (referrerId === userId) {
          alert('❌ Нельзя использовать свой собственный код!')
          return false
        }
        
        const updatedReferrer = {
          ...всеГильдии[referrerId],
          приглашённые: [...(всеГильдии[referrerId].приглашённые || []), userId],
          реферальныйСчётчик: (всеГильдии[referrerId].реферальныйСчётчик || 0) + 1
        }
        
        set({ 
          всеГильдии: { ...всеГильдии, [referrerId]: updatedReferrer },
          приглашённые: [...(приглашённые || []), userId!]
        })
        
        alert(`✅ Реферальный код применён!`)
        await get().сохранитьПрогресс()
        return true
      },

      получитьБонусЗаПриглашение: async () => {
        const { userId, всеГильдии, бонусыЗаПриглашения, баланс, осколки } = get()
        
        const user = всеГильдии?.[userId!]
        if (!user) return false
        
        const новыеПриглашения = user.реферальныйСчётчик || 0
        const ужеПолучено = бонусыЗаПриглашения || 0
        const новые = новыеПриглашения - ужеПолучено
        
        if (новые <= 0) {
          alert('❌ Нет новых бонусов!')
          return false
        }
        
        const бонус = новые * 5000
        const осколкиБонус = новые * 5
        
        set({ 
          баланс: (баланс || 0) + бонус,
          бонусыЗаПриглашения: новыеПриглашения,
          осколки: (осколки || 0) + осколкиБонус
        })
        
        alert(`✅ Получен бонус за ${новые} приглашённых!\n💰 +$${бонус.toLocaleString()}\n💎 +${осколкиБонус} осколков`)
        await get().сохранитьПрогресс()
        return true
      },

    }),
    {
      name: 'dark-lab-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          migrateOldData(state)
        }
      }
    }
  )
)
