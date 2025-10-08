import { useState, useEffect, useRef, useCallback } from "react"
import { Scan, Printer, RefreshCw, CheckCircle, XCircle, Package, Loader2, Repeat, PrinterCheck } from "lucide-react"
import { getProductFiles, repeadFileRequest, printedLabels } from "../../store/marker/markerSlice"
import { useAppDispatch } from "../../store/hooks"
import { toast } from "react-toastify"
import Button from "../../components/ui/Button"

interface Label {
  file: string
}

interface ScannedItem {
  internalCode: string
  product: string
  color: string
  size: string
  labels: Label[]
  scannedAt: string
}

interface ScanData {
  internal_code: string
  product: string
  color: string
  size: string
}

const MarkerPage = () => {
  const dispatch = useAppDispatch()
  const [scanInput, setScanInput] = useState("")
  const [currentItem, setCurrentItem] = useState<ScannedItem | null>(null)
  const [scanHistory, setScanHistory] = useState<ScannedItem[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [repeadGet, setRepeadGet] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Автофокус на input
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentItem])

  // Очистка сообщений
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(null), message.type === 'error' ? 5000 : 3000)
      return () => clearTimeout(timeout)
    }
  }, [message])

  // Парсинг и валидация данных сканирования
  const parseScanData = useCallback((rawData: string): ScanData => {
    const trimmedData = rawData.trim()
    if (!trimmedData) {
      throw new Error("Пустые данные сканирования")
    }

    let parsedData: ScanData
    try {
      parsedData = JSON.parse(trimmedData)
    } catch (parseError) {
      throw new Error("Неверный формат данных. Ожидается JSON.")
    }

    if (!parsedData.internal_code) {
      throw new Error("Отсутствует internal_code в данных")
    }

    return {
      internal_code: parsedData.internal_code,
      product: parsedData.product || '',
      color: parsedData.color || '',
      size: parsedData.size || ''
    }
  }, [])

  const handleRepeat = () => {
    dispatch(repeadFileRequest(currentItem?.internalCode || ''))
      .then((res) => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Заявка отправлена, дождитесь подтверждения')
          setRepeadGet(false)
        } else {
          toast.error('Произошла ошибка при отправки заявки')
        }
      })
  }

  // Получение этикеток
  const fetchLabels = useCallback(async (internalCode: string): Promise<Label[]> => {
    const result = await dispatch(getProductFiles(internalCode))
    if (result.meta.requestStatus !== 'fulfilled') {
      if(result.payload === 'Повторно провести не получится!') setRepeadGet(true)
      const errorMsg = result.payload || 'Произошла ошибка при получении этикеток'
      toast.error(errorMsg)
      return []
    }
    return result.payload || []
  }, [dispatch])

  // Основной обработчик сканирования
  const handleScan = useCallback(async (scanData: string) => {
    if (!scanData.trim() || isLoading) return

    setRepeadGet(false)
    setIsLoading(true)
    setMessage(null)

    try {
      const parsedData = parseScanData(scanData)
      const labels = await fetchLabels(parsedData.internal_code)

      const scannedItem: ScannedItem = {
        internalCode: parsedData.internal_code,
        product: parsedData.product,
        color: parsedData.color,
        size: parsedData.size,
        labels,
        scannedAt: new Date().toLocaleString('ru-RU')
      }

      setCurrentItem(scannedItem)
      setScanHistory(prev => [scannedItem, ...prev.slice(0, 9)])
      setMessage({
        type: 'success',
        text: `Товар найден: ${parsedData.product} - ${parsedData.color} ${parsedData.size}`
      })
    } catch (error) {
      console.error('Ошибка сканирования:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Произошла ошибка при обработке'
      })
    } finally {
      setIsLoading(false)
      setScanInput("")
      inputRef.current?.focus()
    }
  }, [isLoading, parseScanData, fetchLabels])

  // Обработчик нажатия Enter
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleScan(scanInput)
    }
  }, [scanInput, isLoading, handleScan])

  // Печать всех этикеток по 2 экземпляра
  const printAllLabels = useCallback(async () => {
    if (!currentItem || currentItem.labels.length === 0 || isPrinting) return
    
    setIsPrinting(true)
    
    try {
      const printWindow = window.open('', '', 'width=800,height=600')
      
      if (!printWindow) {
        toast.error('Не удалось открыть окно печати')
        setIsPrinting(false)
        return
      }

      // Создаем HTML с двумя копиями каждой этикетки
      let imagesHtml = ''
      currentItem.labels.forEach((label) => {
        // Добавляем каждую этикетку дважды
        imagesHtml += `
          <div class="label-page">
            <img src="${label.file}" alt="Label" />
          </div>
          <div class="label-page">
            <img src="${label.file}" alt="Label" />
          </div>
        `
      })

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Печать этикеток</title>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              background: white;
            }
            .label-page {
              page-break-after: always;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .label-page:last-child {
              page-break-after: auto;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              display: block;
              object-fit: cover;
            }
            @media print {
              body { 
                print-color-adjust: exact; 
                -webkit-print-color-adjust: exact; 
              }
            }
          </style>
        </head>
        <body>
          ${imagesHtml}
          <script>
            let imagesLoaded = 0;
            const totalImages = ${currentItem.labels.length * 2};
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
              if (img.complete) {
                imagesLoaded++;
              } else {
                img.onload = () => {
                  imagesLoaded++;
                  if (imagesLoaded === totalImages) {
                    setTimeout(() => window.print(), 500);
                  }
                };
                img.onerror = () => {
                  imagesLoaded++;
                  if (imagesLoaded === totalImages) {
                    setTimeout(() => window.print(), 500);
                  }
                };
              }
            });
            
            if (imagesLoaded === totalImages) {
              setTimeout(() => window.print(), 500);
            }

            // Отправляем сообщение родительскому окну после печати
            window.onafterprint = () => {
              window.opener.postMessage('print-completed', '*');
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
        </html>
      `)
      
      printWindow.document.close()

      // Слушаем сообщение о завершении печати
      const handleMessage = async (event: MessageEvent) => {
        if (event.data === 'print-completed') {
          window.removeEventListener('message', handleMessage)
          
          // Отправляем запрос на сервер
          try {
            const result = await dispatch(printedLabels(currentItem.internalCode))
            if (result.meta.requestStatus === 'fulfilled') {
              toast.success('Этикетки успешно напечатаны')
              setCurrentItem(null)
            } else {
              toast.warning('Этикетки напечатаны, но не удалось отправить подтверждение на сервер')
            }
          } catch (error) {
            console.error('Ошибка отправки подтверждения печати:', error)
            toast.warning('Этикетки напечатаны, но произошла ошибка при отправке подтверждения')
          }
          
          setIsPrinting(false)
        }
      }

      window.addEventListener('message', handleMessage)

      // Таймаут на случай если окно закроется без события печати
      setTimeout(() => {
        window.removeEventListener('message', handleMessage)
        setIsPrinting(false)
      }, 60000) // 1 минута

    } catch (error) {
      console.error('Ошибка печати:', error)
      toast.error('Не удалось напечатать этикетки')
      setIsPrinting(false)
    }
  }, [currentItem, isPrinting, dispatch])

  // Печать одной этикетки
  const printLabel = useCallback((fileUrl: string) => {
    try {
      const printWindow = window.open('', '', 'width=800,height=600')
      if (!printWindow) {
        toast.error('Не удалось открыть окно печати')
        return
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Печать этикетки</title>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            @page {
              size: auto;
              margin: 0;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <img src="${fileUrl}" alt="Label" onload="window.print();" onerror="alert('Ошибка загрузки изображения');" />
        </body>
        </html>
      `)
      printWindow.document.close()
    } catch (error) {
      console.error('Ошибка печати:', error)
      toast.error('Не удалось напечатать этикетку')
    }
  }, [])

  // Компонент сообщения
  const MessageAlert = () => {
    if (!message) return null

    const isSuccess = message.type === 'success'
    const Icon = isSuccess ? CheckCircle : XCircle
    const bgColor = isSuccess 
      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'

    return (
      <div className={`mt-3 p-3 border rounded-lg flex items-center gap-2 ${bgColor}`}>
        <Icon size={18} />
        <span className="text-sm font-medium">{message.text}</span>
      </div>
    )
  }

  // Компонент карточки этикетки
  const LabelCard = ({ label, index, item }: { label: Label, index: number, item: ScannedItem }) => (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
      <div className="mb-3">
        <img
          src={label.file}
          alt={`Этикетка ${index + 1}`}
          className="w-full h-48 object-contain bg-gray-50 dark:bg-gray-900 rounded-lg"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3EОшибка загрузки%3C/text%3E%3C/svg%3E'
          }}
        />
      </div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Этикетка #{index + 1}
        </h4>
        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {item.color} {item.size}
        </span>
      </div>
      {/* <div className="flex gap-2">
        <button
          onClick={() => printLabel(label.file)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Printer size={16} />
          Печать
        </button>
        <button
          onClick={() => printLabel(label.file)}
          className="px-4 py-2 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center"
          title="Повторная печать"
        >
          <RefreshCw size={16} />
        </button>
      </div> */}
    </div>
  )

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Шапка */}
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

      {/* Основной контент */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Форма сканирования */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
                  disabled={isLoading}
                  autoFocus
                />
                {isLoading ? (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 animate-spin" size={20} />
                ) : (
                  <Scan className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                )}
              </div>
              <button
                onClick={() => handleScan(scanInput)}
                disabled={!scanInput.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                Поиск
              </button>
            </div>
            <MessageAlert />
          </section>

          {/* Текущий товар */}
          {currentItem && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-4 border-b border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {currentItem.product}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentItem.color} • {currentItem.size}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Код: {currentItem.internalCode} • {currentItem.scannedAt}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg">
                    {repeadGet ? (
                      <Button onClick={handleRepeat}>
                        <Repeat size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
                        Подать заявку на повторную печать
                      </Button>
                    ) : (
                      <Package className="text-blue-600 dark:text-blue-400" size={24} />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Этикетки для печати ({currentItem.labels.length})
                  </h3>
                  {currentItem.labels.length > 0 && (
                    <button
                      onClick={printAllLabels}
                      disabled={isPrinting}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-sm"
                    >
                      {isPrinting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Печать...
                        </>
                      ) : (
                        <>
                          <PrinterCheck size={18} />
                          Напечатать все (x2)
                        </>
                      )}
                    </button>
                  )}
                </div>

                {currentItem.labels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentItem.labels.map((label, index) => (
                      <LabelCard
                        key={`${currentItem.internalCode}-${index}`}
                        label={label}
                        index={index}
                        item={currentItem}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Нет этикеток для печати
                  </div>
                )}
              </div>
            </section>
          )}

          {/* История сканирования */}
          {scanHistory.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  История сканирования
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {scanHistory.map((item, index) => (
                  <button
                    key={`history-${item.internalCode}-${index}`}
                    className="w-full px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    onClick={() => setCurrentItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.product}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.color} • {item.size} • {item.scannedAt}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {item.labels.length} этикеток
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Пустое состояние */}
          {!currentItem && scanHistory.length === 0 && !isLoading && (
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