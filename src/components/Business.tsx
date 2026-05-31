import { useGameStore } from '../store/gameStore'

const БИЗНЕСЫ = [
  { id: 'carwash', name: '🧼 Автомойка', цена: 5000, лимит: 1000, процент: 70, время: 10 },
  { id: 'laundry', name: '👕 Прачечная', цена: 10000, лимит: 2500, процент: 75, время: 8 },
  { id: 'nightclub', name: '🎵 Ночной клуб', цена: 25000, лимит: 5000, процент: 85, время: 6 },
  { id: 'casino', name: '🎰 Казино', цена: 50000, лимит: 10000, процент: 90, время: 4 },
  { id: 'bank', name: '🏦 Банк', цена: 100000, лимит: 25000, процент: 95, время: 2 }
]

export default function Business() {
  const { баланс, бизнес, купитьБизнес, продатьБизнес } = useGameStore()

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">🏢 Легальный бизнес</h2>
      
      {/* Текущий бизнес */}
      {бизнес && (
        <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 mb-4">
          <p className="text-green-400 font-medium">✅ Ваш бизнес: {бизнес.название}</p>
          <p className="text-sm text-gray-300">💰 Лимит отмыва за раз: ${бизнес.лимит}</p>
          <p className="text-sm text-gray-300">📈 Процент отмыва: {бизнес.процент}%</p>
          <button
            onClick={() => {
              if (confirm('⚠️ Продать бизнес за 50% от стоимости? Вы сможете купить другой.')) {
                продатьБизнес()
              }
            }}
            className="mt-2 w-full py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
          >
            💰 Продать бизнес (50% возврат)
          </button>
        </div>
      )}
      
      {/* Магазин бизнесов */}
      <div className="space-y-3">
        <h3 className="text-gray-400">🏪 Купить бизнес (можно только один)</h3>
        {БИЗНЕСЫ.map((бизнесКонфиг) => {
          const ужеЕсть = бизнес?.id === бизнесКонфиг.id
          const можноКупить = !бизнес && баланс >= бизнесКонфиг.цена
          
          return (
            <div key={бизнесКонфиг.id} className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{бизнесКонфиг.name}</span>
                <span className="text-yellow-400">${бизнесКонфиг.цена}</span>
              </div>
              <div className="text-sm text-gray-400 mb-2">
                💰 Лимит: ${бизнесКонфиг.лимит} за раз | 📈 Отмыв: {бизнесКонфиг.процент}%
              </div>
              {ужеЕсть ? (
                <div className="text-green-400 text-center py-1 text-sm">✅ Активный бизнес</div>
              ) : бизнес ? (
                <div className="text-gray-400 text-center py-1 text-sm">❌ У вас уже есть бизнес (продайте его, чтобы купить другой)</div>
              ) : (
                <button
                  onClick={() => купитьБизнес(бизнесКонфиг.id)}
                  disabled={!можноКупить}
                  className={`w-full py-2 rounded ${можноКупить ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}
                >
                  Купить за ${бизнесКонфиг.цена}
                </button>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Информация */}
      <div className="bg-gray-800 p-3 rounded-lg mt-4">
        <h3 className="text-sm font-semibold mb-2">📖 Как работает отмыв:</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• При продаже наркотиков деньги автоматически идут на отмыв</li>
          <li>• Бизнес отмывает до своего лимита за одну продажу</li>
          <li>• Если продажа больше лимита — остаток добавляет розыск</li>
          <li>• Чем лучше бизнес — тем больше лимит и выше процент</li>
          <li>• Без бизнеса — все деньги грязные (розыск растёт)</li>
          <li>• Продажа бизнеса возвращает 50% от стоимости покупки</li>
        </ul>
      </div>
    </div>
  )
}