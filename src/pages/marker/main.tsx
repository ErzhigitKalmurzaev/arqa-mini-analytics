import { useState, useEffect, useRef } from "react"
import { Scan, Printer, RefreshCw, CheckCircle, XCircle, Package } from "lucide-react"

interface Label {
  id: string
  type: 'qr' | 'barcode'
  data: string
  description: string
}

interface ScannedItem {
  qrCode: string
  color: string
  size: string
  orderId: string
  orderName: string
  labels: Label[]
  scannedAt: string
}

// Мок данные - соответствие QR кодов и этикеток
const MOCK_LABELS_DATA: Record<string, ScannedItem> = {
  "QR-001-M-BLACK": {
    qrCode: "QR-001-M-BLACK",
    color: "Черный",
    size: "M",
    orderId: "ORD-2024-001",
    orderName: "Заказ для ТЦ Мега",
    scannedAt: "",
    labels: [
      {
        id: "1",
        type: "qr",
        data: "01234567890123456789012345",
        description: "Честный знак (DataMatrix)"
      },
      {
        id: "2",
        type: "barcode",
        data: "4600123456789",
        description: "Штрих-код заказчика"
      }
    ]
  },
  "QR-001-L-BLACK": {
    qrCode: "QR-001-L-BLACK",
    color: "Черный",
    size: "L",
    orderId: "ORD-2024-001",
    orderName: "Заказ для ТЦ Мега",
    scannedAt: "",
    labels: [
      {
        id: "3",
        type: "qr",
        data: "01234567890123456789012346",
        description: "Честный знак (DataMatrix)"
      },
      {
        id: "4",
        type: "barcode",
        data: "4600123456790",
        description: "Штрих-код заказчика"
      }
    ]
  },
  "QR-001-S-WHITE": {
    qrCode: "QR-001-S-WHITE",
    color: "Белый",
    size: "S",
    orderId: "ORD-2024-001",
    orderName: "Заказ для ТЦ Мега",
    scannedAt: "",
    labels: [
      {
        id: "5",
        type: "qr",
        data: "01234567890123456789012347",
        description: "Честный знак (DataMatrix)"
      },
      {
        id: "6",
        type: "barcode",
        data: "4600123456791",
        description: "Штрих-код заказчика"
      }
    ]
  }
}

const MarkerPage = () => {
  const [scanInput, setScanInput] = useState("")
  const [currentItem, setCurrentItem] = useState<ScannedItem | null>(null)
  const [scanHistory, setScanHistory] = useState<ScannedItem[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Фокус на поле ввода при загрузке и после каждого сканирования
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentItem])

  // Обработка сканирования
  const handleScan = (qrCode: string) => {
    const trimmedCode = qrCode.trim()
    console.log(`Сканирован QR код: ${trimmedCode}`)
    
    if (!trimmedCode) return

    // Поиск товара по QR коду
    const itemData = MOCK_LABELS_DATA[trimmedCode]

    if (itemData) {
      const scannedItem = {
        ...itemData,
        scannedAt: new Date().toLocaleString('ru-RU')
      }
      
      setCurrentItem(scannedItem)
      setScanHistory(prev => [scannedItem, ...prev.slice(0, 9)]) // Храним последние 10
      setSuccessMessage(`Товар найден: ${scannedItem.color} ${scannedItem.size}`)
      setErrorMessage("")
      
      // Очищаем сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(""), 3000)
    } else {
      setErrorMessage(`QR код "${trimmedCode}" не найден в системе`)
      setSuccessMessage("")
      setTimeout(() => setErrorMessage(""), 5000)
    }

    setScanInput("")
  }

  // Обработка Enter в поле ввода
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleScan(scanInput)
    }
  }

  // Генерация DataMatrix QR кода
  const generateDataMatrixURL = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`
  }

  // Генерация штрих-кода
  const generateBarcodeURL = (data: string) => {
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(data)}&code=EAN13&translate-esc=on`
  }

  // Печать этикетки
  const printLabel = async (label: Label, item: ScannedItem) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Размер этикетки: 50mm x 30mm
      const width = 400
      const height = 240
      canvas.width = width
      canvas.height = height
      
      if (!ctx) return
      
      // Белый фон
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height)
      
      // Загружаем изображение
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      if (label.type === 'qr') {
        img.src = generateDataMatrixURL(label.data)
      } else {
        img.src = generateBarcodeURL(label.data)
      }
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      
      // Рисуем код
      if (label.type === 'qr') {
        const size = 180
        const x = (width - size) / 2
        const y = 15
        ctx.drawImage(img, x, y, size, size)
        
        // Текст
        ctx.fillStyle = 'black'
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${item.color} ${item.size}`, width / 2, y + size + 18)
        
        ctx.font = '11px Arial'
        ctx.fillStyle = '#666'
        ctx.fillText(label.description, width / 2, y + size + 35)
      } else {
        // Для штрих-кода
        const bWidth = 320
        const bHeight = 100
        const x = (width - bWidth) / 2
        const y = 40
        ctx.drawImage(img, x, y, bWidth, bHeight)
        
        // Текст
        ctx.fillStyle = 'black'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(label.data, width / 2, y + bHeight + 25)
        
        ctx.font = '12px Arial'
        ctx.fillStyle = '#666'
        ctx.fillText(`${item.color} ${item.size}`, width / 2, y + bHeight + 43)
      }
      
      const dataUrl = canvas.toDataURL('image/png')
      
      // Печать
      const printWindow = window.open('', '', 'width=800,height=600')
      
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Этикетка - ${label.description}</title>
              <meta charset="utf-8">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                @page { size: 50mm 30mm; margin: 0; }
                body {
                  width: 50mm;
                  height: 30mm;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: white;
                }
                img { width: 50mm; height: 30mm; display: block; }
                @media print {
                  body {
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                  }
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="Label" />
              <script>
                window.onload = function() {
                  setTimeout(function() { window.print(); }, 250);
                };
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    } catch (error) {
      console.error('Ошибка печати:', error)
      alert('Не удалось напечатать этикетку')
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Scan size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Маркировка товаров</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Сканируйте QR код упаковки</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* Поле сканирования */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Отсканируйте QR код товара
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Наведите сканер и отсканируйте код..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                  autoFocus
                />
                <Scan className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button
                onClick={() => handleScan(scanInput)}
                disabled={!scanInput.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Поиск
              </button>
            </div>

            {/* Сообщения */}
            {successMessage && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}
            
            {errorMessage && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-800 dark:text-red-200">
                <XCircle size={18} />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Информация о текущем товаре */}
          {currentItem && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-4 border-b border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {currentItem.color} • {currentItem.size}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentItem.orderName} • #{currentItem.orderId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      QR: {currentItem.qrCode} • {currentItem.scannedAt}
                    </p>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Package className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Этикетки для печати
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentItem.labels.map((label) => (
                    <div 
                      key={label.id}
                      className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {label.description}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {label.data}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          label.type === 'qr' 
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                          {label.type === 'qr' ? 'DataMatrix' : 'Штрих-код'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => printLabel(label, currentItem)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Printer size={16} />
                          Печать
                        </button>
                        <button
                          onClick={() => printLabel(label, currentItem)}
                          className="px-4 py-2 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center"
                          title="Повторная печать"
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* История сканирования */}
          {scanHistory.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  История сканирования
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {scanHistory.map((item, index) => (
                  <div 
                    key={index}
                    className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => setCurrentItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.color} • {item.size}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.qrCode} • {item.scannedAt}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {item.labels.length} этикеток
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Инструкция */}
          {!currentItem && scanHistory.length === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
              <Scan size={48} className="mx-auto text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Начните сканирование
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 max-w-md mx-auto">
                Наведите ручной сканер на QR код упаковки товара. После сканирования на экране появятся все необходимые этикетки для печати.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default MarkerPage