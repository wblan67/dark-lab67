import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { GUILD_LEVELS, GUILD_UPGRADES, LAB_SKINS, CONVERSION_BONUSES, TEMP_BUFFS, GUILD_BASES, GUILD_QUESTS } from '../config/guilds'

export default function Guild() {
  const [активнаяВкладка, setАктивнаяВкладка] = useState<'главная' | 'участники' | 'чат' | 'улучшения' | 'магазин' | 'квесты' | 'альянс'>('главная')
  const [сообщение, setСообщение] = useState('')
  
  const гильдия = useGameStore((state) => state.гильдия)
  const гильдейскийИнвентарь = useGameStore((state) => state.гильдейскийИнвентарь)
  const профит = useGameStore((state) => state.профит)
  const баланс = useGameStore((state) => state.баланс)
  const userId = useGameStore((state) => state.userId)
  
  const отправитьСообщение = useGameStore((state) => state.отправитьСообщение)
  const купитьТлен = useGameStore((state) => state.купитьТлен)
  const продатьПрофит = useGameStore((state) => state.продатьПрофит)
  const купитьСкинЛабы = useGameStore((state) => state.купитьСкинЛабы)
  const экипироватьСкинЛабы = useGameStore((state) => state.экипироватьСкинЛабы)
  const купитьБаффКонвертации = useGameStore((state) => state.купитьБаффКонвертации)
  const экипироватьБаффКонвертации = useGameStore((state) => state.экипироватьБаффКонвертации)
  const активироватьВременныйБафф = useGameStore((state) => state.активироватьВременныйБафф)
  const купитьУлучшениеГильдии = useGameStore((state) => state.купитьУлучшениеГильдии)
  const сменитьАктивноеУлучшение = useGameStore((state) => state.сменитьАктивноеУлучшение)
  const купитьБазуГильдии = useGameStore((state) => state.купитьБазуГильдии)
  const экипироватьБазуГильдии = useGameStore((state) => state.экипироватьБазуГильдии)
  const заключитьАльянс = useGameStore((state) => state.заключитьАльянс)
  const расторгнутьАльянс = useGameStore((state) => state.расторгнутьАльянс)
  const взятьКвест = useGameStore((state) => state.взятьКвест)
  const забратьНаградуКвеста = useGameStore((state) => state.забратьНаградуКвеста)
  const пригласитьВГильдию = useGameStore((state) => state.пригласитьВГильдию)
  
  const userMember = гильдия?.members?.find((m: any) => m.userId === userId)
  const userRole = userMember?.rank || 'member'
  
  const nextLevel = (гильдия?.level || 1) + 1
  const currentLevelExp = GUILD_LEVELS[гильдия?.level || 1]?.exp || 0
  const nextLevelExp = GUILD_LEVELS[nextLevel]?.exp || currentLevelExp
  const expProgress = ((гильдия?.exp || 0) - currentLevelExp) / (nextLevelExp - currentLevelExp) * 100
  
  if (!гильдия) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">🏆 Гильдия</h2>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400 mb-4">Вы не состоите в гильдии!</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'createGuild' }))}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Создать гильдию
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4">
      {/* Шапка гильдии */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{гильдия.emblem} {гильдия.name}</h2>
            <p className="text-sm text-gray-400">{гильдия.description || 'Нет описания'}</p>
          </div>
          <div className="text-right">
            <div className="text-yellow-400">Уровень {гильдия.level}</div>
            <div className="text-xs text-gray-400">{гильдия.members.length} участников</div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>EXP до {nextLevel} уровня</span>
            <span>{гильдия.exp - currentLevelExp} / {nextLevelExp - currentLevelExp}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(100, expProgress)}%` }} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-gray-700 p-2 rounded text-center">
            <div className="text-xs text-gray-400">💰 Казна</div>
            <div className="text-yellow-400">${гильдия.bank.toLocaleString()}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded text-center">
            <div className="text-xs text-gray-400">🪙 Общак (Тлен)</div>
            <div className="text-yellow-400">{гильдия.bankCoins} 🪙</div>
          </div>
        </div>
      </div>
      
      {/* Вкладки */}
      <div className="flex border-b border-gray-700 overflow-x-auto mb-4">
        <button onClick={() => setАктивнаяВкладка('главная')} className={`px-3 py-2 text-sm ${активнаяВкладка === 'главная' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>🏠 Главная</button>
        <button onClick={() => setАктивнаяВкладка('участники')} className={`px-3 py-2 text-sm ${активнаяВкладка === 'участники' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>👥 Участники</button>
        <button onClick={() => setАктивнаяВкладка('чат')} className={`px-3 py-2 text-sm ${активнаяВкладка === 'чат' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>💬 Чат</button>
        <button onClick={() => setАктивнаяВкладка('улучшения')} className={`px-3 py-2 text-sm ${активнаяВкладка === 'улучшения' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>🏆 Улучшения</button>
        <button onClick={() => setАктивнаяВкладка('магазин')} className={`px-3 py-2 text-sm ${активнаяВкладка === 'магазин' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>💎 Магазин</button>
        <button onClick={() => setАктивнаяВкладка('квесты')} className={`px-3 py-2 text-sm ${активнаяВкладка === 'квесты' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>📋 Квесты</button>
        <button onClick={() => setАктивнаяВкладка('альянс')} className={`px-3 py-2 text-sm ${активнаяВкладка === 'альянс' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>🤝 Альянс</button>
      </div>
      
      {/* ГЛАВНАЯ */}
      {активнаяВкладка === 'главная' && (
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">📊 Статистика</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Создатель:</span><span>{гильдия.members.find((m: any) => m.rank === 'leader')?.userName}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Создана:</span><span>{new Date(гильдия.createdAt).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Тип вступления:</span><span>{гильдия.type === 'open' ? '🔓 Открытая' : гильдия.type === 'request' ? '📝 По запросу' : '🔒 Закрытая (по приглашению)'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Фокус:</span><span>{гильдия.focus === 'craft' ? '🔬 Крафт' : гильдия.focus === 'sales' ? '💰 Продажи' : гильдия.focus === 'pvp' ? '⚔️ PvP' : '🌍 Смешанный'}</span></div>
              {гильдия.base && <div className="flex justify-between"><span className="text-gray-400">🏛️ База:</span><span>{GUILD_BASES.find((b: any) => b.id === гильдия.base)?.name}</span></div>}
              {гильдия.alliance && <div className="flex justify-between"><span className="text-gray-400">🤝 Альянс:</span><span>Гильдия {гильдия.alliance}</span></div>}
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">✨ Активные бонусы</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>📈 Продажи: +{GUILD_LEVELS[гильдия.level]?.sellBonus || 0}%</div>
              <div>🔬 Крафт: +{GUILD_LEVELS[гильдия.level]?.craftBonus || 0}%</div>
              {гильдия.activeUpgrades.economic && <div>💰 Экономика: +{GUILD_UPGRADES.economic.find((u: any) => u.id === гильдия.activeUpgrades.economic)?.bonus || 0}%</div>}
              {гильдия.activeUpgrades.production && <div>🔧 Производство: +{GUILD_UPGRADES.production.find((u: any) => u.id === гильдия.activeUpgrades.production)?.bonus || 0}%</div>}
              {гильдия.activeUpgrades.logistic && <div>🚗 Логистика: -{GUILD_UPGRADES.logistic.find((u: any) => u.id === гильдия.activeUpgrades.logistic)?.bonus || 0}% времени</div>}
              {гильдия.activeUpgrades.defense && <div>🛡️ Защита: -{GUILD_UPGRADES.defense.find((u: any) => u.id === гильдия.activeUpgrades.defense)?.bonus || 0}% розыска</div>}
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">🪙 Твой вклад</h3>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-yellow-400">{userMember?.contribution || 0} 🪙 Тлена</div>
                <div className="text-xs text-gray-400">+{Math.floor((userMember?.contribution || 0) * 0.11)} 💎 через неделю</div>
              </div>
              <div className="flex gap-2">
                <input type="number" id="tlenAmount" min={1} defaultValue={10} className="w-24 bg-gray-700 p-1 rounded text-sm" />
                <button onClick={() => {
                  const input = document.getElementById('tlenAmount') as HTMLInputElement
                  купитьТлен(parseInt(input.value) || 10)
                }} className="bg-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-700 transition">
                  Купить 🪙
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* УЧАСТНИКИ */}
      {активнаяВкладка === 'участники' && (
        <div className="space-y-2">
          {гильдия.members.map((member: any) => (
            <div key={member.userId} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium">
                  {member.rank === 'leader' && '👑 '}
                  {member.rank === 'coLeader' && '⭐ '}
                  {member.rank === 'member' && '🛡️ '}
                  {member.userName}
                </div>
                <div className="text-xs text-gray-400">
                  Вклад: {member.contribution || 0} 🪙 | В игре: {member.online ? '🟢 онлайн' : `🔴 был ${Math.floor((Date.now() - member.lastSeen) / 60000)} мин назад`}
                </div>
              </div>
              {(userRole === 'leader' || (userRole === 'coLeader' && member.rank !== 'leader')) && member.userId !== userId && (
                <div className="flex gap-1">
                  {userRole === 'leader' && member.rank !== 'leader' && (
                    <button onClick={() => {
                      if (confirm(`Назначить ${member.userName} со-создателем?`)) {
                        const назначитьСоздателя = useGameStore.getState().назначитьСоздателя
                        назначитьСоздателя(member.userId)
                      }
                    }} className="bg-blue-600 px-2 py-1 rounded text-xs">⭐</button>
                  )}
                  <button onClick={() => {
                    if (confirm(`Исключить ${member.userName} из гильдии?`)) {
                      const исключитьИзГильдии = useGameStore.getState().исключитьИзГильдии
                      исключитьИзГильдии(member.userId)
                    }
                  }} className="bg-red-600 px-2 py-1 rounded text-xs">❌</button>
                </div>
              )}
            </div>
          ))}
          
          {/* Кнопка приглашения для лидеров */}
          {(userRole === 'leader' || userRole === 'coLeader') && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">📨 Пригласить игрока</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  id="inviteUserId" 
                  placeholder="ID игрока" 
                  className="flex-1 bg-gray-600 p-2 rounded text-sm"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('inviteUserId') as HTMLInputElement
                    if (input.value) {
                      пригласитьВГильдию(input.value)
                      input.value = ''
                    }
                  }}
                  className="bg-green-600 px-4 py-2 rounded text-sm hover:bg-green-700 transition"
                >
                  Пригласить
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                💡 Игрок получит приглашение и сможет вступить в гильдию
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* ЧАТ */}
      {активнаяВкладка === 'чат' && (
        <div className="bg-gray-800 rounded-lg">
          <div className="h-96 overflow-y-auto p-3 space-y-2">
            {гильдия.chat.map((msg: any) => (
              <div key={msg.id} className={`${msg.userId === 'bot' ? 'text-gray-400 italic' : ''}`}>
                <span className={`font-semibold ${msg.userRank === 'leader' ? 'text-yellow-400' : msg.userRank === 'coLeader' ? 'text-blue-400' : 'text-green-400'}`}>
                  {msg.userName}:
                </span>
                <span className="ml-2">{msg.message}</span>
                <div className="text-xs text-gray-600">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 p-3 flex gap-2">
            <input
              type="text"
              value={сообщение}
              onChange={(e) => setСообщение(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && отправитьСообщение(сообщение) && setСообщение('')}
              placeholder="Введите сообщение..."
              className="flex-1 bg-gray-700 p-2 rounded text-sm"
            />
            <button onClick={() => отправитьСообщение(сообщение) && setСообщение('')} className="bg-blue-600 px-4 py-2 rounded text-sm">➡️</button>
          </div>
        </div>
      )}
      
      {/* УЛУЧШЕНИЯ */}
      {активнаяВкладка === 'улучшения' && (
        <div className="space-y-4">
          {Object.entries(GUILD_UPGRADES).map(([category, upgrades]: [string, any]) => {
            if (category === 'social') return null
            const activeId = гильдия.activeUpgrades[category]
            const purchasedIds = гильдия.purchasedUpgrades[category] || []
            
            return (
              <div key={category} className="bg-gray-800 p-3 rounded-lg">
                <h3 className="font-semibold mb-2">
                  {category === 'economic' && '💰 Экономические'}
                  {category === 'production' && '🔬 Производственные'}
                  {category === 'logistic' && '🚗 Логистические'}
                  {category === 'defense' && '🛡️ Защитные'}
                  {category === 'militaryAttack' && '⚔️ Военные (атака)'}
                  {category === 'militaryDefense' && '🛡️ Военные (защита)'}
                </h3>
                <div className="space-y-2">
                  {upgrades.map((upgrade: any) => {
                    const isPurchased = purchasedIds.includes(upgrade.id)
                    const isActive = activeId === upgrade.id
                    const price = upgrade.price || upgrade.priceCoins
                    const currency = upgrade.price ? '$' : '🪙'
                    
                    return (
                      <div key={upgrade.id} className={`p-2 rounded ${isActive ? 'bg-purple-900/50 border border-purple-500' : 'bg-gray-700'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{upgrade.name}</div>
                            <div className="text-xs text-gray-400">+{upgrade.bonus}% {category === 'logistic' ? 'скорости' : category === 'defense' ? 'защиты' : 'бонуса'}</div>
                          </div>
                          <div className="text-right">
                            {!isPurchased && (
                              <button onClick={() => купитьУлучшениеГильдии(category, upgrade.id)} className="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-700 transition">
                                Купить за {price} {currency}
                              </button>
                            )}
                            {isPurchased && !isActive && (
                              <button onClick={() => сменитьАктивноеУлучшение(category, upgrade.id)} className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition">
                                Активировать
                              </button>
                            )}
                            {isActive && <span className="text-green-400 text-xs">✅ Активно</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* МАГАЗИН */}
      {активнаяВкладка === 'магазин' && (
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">💎 Твой Профит: {профит.toFixed(1)} 💎</h3>
              <div className="flex gap-2">
                <input type="number" id="profitAmount" min={1} defaultValue={1} step={0.5} className="w-24 bg-gray-700 p-1 rounded text-sm" />
                <button onClick={() => {
                  const input = document.getElementById('profitAmount') as HTMLInputElement
                  продатьПрофит(parseFloat(input.value))
                }} className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700 transition">Продать 💎</button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">🧪 Скины лаборатории</h3>
            <div className="space-y-2">
              {LAB_SKINS.map(skin => {
                const owned = гильдейскийИнвентарь?.labSkins?.includes(skin.id)
                const active = гильдейскийИнвентарь?.activeLabSkin === skin.id
                return (
                  <div key={skin.id} className={`p-2 rounded ${active ? 'bg-purple-900/50 border border-purple-500' : 'bg-gray-700'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div>{skin.name}</div>
                        <div className="text-xs text-green-400">+{skin.bonus}% к выходу продукта</div>
                      </div>
                      <div>
                        {!owned && (
                          <button onClick={() => купитьСкинЛабы(skin.id)} className="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-700 transition">
                            {skin.price} 💎
                          </button>
                        )}
                        {owned && !active && (
                          <button onClick={() => экипироватьСкинЛабы(skin.id)} className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition">
                            Экипировать
                          </button>
                        )}
                        {active && <span className="text-green-400 text-xs">✅ Активно</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">📈 Конвертация Тлен → Профит</h3>
            <div className="space-y-2">
              {CONVERSION_BONUSES.map(bonus => {
                const owned = гильдейскийИнвентарь?.conversionBonuses?.includes(bonus.id)
                const active = гильдейскийИнвентарь?.activeConversionBonus === bonus.id
                return (
                  <div key={bonus.id} className={`p-2 rounded ${active ? 'bg-purple-900/50 border border-purple-500' : 'bg-gray-700'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div>{bonus.name}</div>
                        <div className="text-xs text-green-400">+{bonus.bonus}% к конвертации</div>
                      </div>
                      <div>
                        {!owned && (
                          <button onClick={() => купитьБаффКонвертации(bonus.id)} className="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-700 transition">
                            {bonus.price} 💎
                          </button>
                        )}
                        {owned && !active && (
                          <button onClick={() => экипироватьБаффКонвертации(bonus.id)} className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition">
                            Экипировать
                          </button>
                        )}
                        {active && <span className="text-green-400 text-xs">✅ Активно</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">⏱️ Временные баффы (24ч)</h3>
            <div className="grid grid-cols-2 gap-2">
              {TEMP_BUFFS.map(buff => (
                <button key={buff.id} onClick={() => активироватьВременныйБафф(buff.id)} className="bg-purple-600 p-2 rounded text-sm hover:bg-purple-700 transition">
                  {buff.name}<br/>
                  <span className="text-xs text-yellow-400">{buff.price} 💎</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">🏛️ Базы гильдии</h3>
            <div className="space-y-2">
              {GUILD_BASES.map(base => {
                const isActive = гильдия?.base === base.id
                return (
                  <div key={base.id} className={`p-2 rounded ${isActive ? 'bg-purple-900/50 border border-purple-500' : 'bg-gray-700'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div>{base.name}</div>
                        <div className="text-xs text-green-400">+{base.bonus}% ко всем бонусам</div>
                      </div>
                      <div>
                        {гильдия.bank >= base.price ? (
                          !isActive ? (
                            <button onClick={() => купитьБазуГильдии(base.id)} className="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-700 transition">
                              ${base.price.toLocaleString()}
                            </button>
                          ) : (
                            <span className="text-green-400 text-xs">✅ Активно</span>
                          )
                        ) : (
                          <span className="text-gray-500 text-xs">${base.price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* КВЕСТЫ */}
      {активнаяВкладка === 'квесты' && (
        <div className="space-y-3">
          {гильдия.quests.map((quest: any) => {
            const questConfig = GUILD_QUESTS.find(q => q.id === quest.id)
            if (!questConfig) return null
            const progressPercent = (quest.progress / questConfig.target) * 100
            
            return (
              <div key={quest.id} className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{questConfig.name}</div>
                    <div className="text-xs text-gray-400">{questConfig.desc}</div>
                  </div>
                  {quest.completed ? (
                    <button onClick={() => забратьНаградуКвеста(quest.id)} className="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-700 transition">
                      Забрать награду
                    </button>
                  ) : (
                    <button onClick={() => взятьКвест(quest.id)} className="bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700 transition">
                      Взять
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Прогресс: {quest.progress}/{questConfig.target}</span>
                    <span>Награда: {questConfig.rewardExp ? `+${questConfig.rewardExp} EXP` : ''} {questConfig.rewardCoins ? `+${questConfig.rewardCoins} 🪙` : ''}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* АЛЬЯНС */}
      {активнаяВкладка === 'альянс' && (
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">🤝 Текущий альянс</h3>
            {гильдия.alliance ? (
              <div className="flex justify-between items-center">
                <span>Гильдия ID: {гильдия.alliance}</span>
                {(userRole === 'leader' || userRole === 'coLeader') && (
                  <button onClick={() => расторгнутьАльянс()} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition">
                    Расторгнуть
                  </button>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-4">
                Нет активного альянса
              </div>
            )}
          </div>
          
          {(userRole === 'leader' || userRole === 'coLeader') && !гильдия.alliance && (
            <div className="bg-gray-800 p-3 rounded-lg">
              <h3 className="font-semibold mb-2">📋 Предложить альянс</h3>
              <div className="flex gap-2">
                <input type="text" id="guildId" placeholder="ID гильдии" className="flex-1 bg-gray-700 p-2 rounded text-sm" />
                <button onClick={() => {
                  const input = document.getElementById('guildId') as HTMLInputElement
                  заключитьАльянс(input.value)
                }} className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                  Предложить
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}