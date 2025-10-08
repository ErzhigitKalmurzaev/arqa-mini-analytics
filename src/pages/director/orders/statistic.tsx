import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Package, Users, AlertCircle, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { useNavigate, useParams } from "react-router-dom"
import { getOrdersStatistics } from "../../../store/director/orderSlice"

// Types
interface Staff {
  fullname: string
  amount: number
}

interface Work {
  status: number
  amount: number
  staffs: Staff[]
}

interface Detail {
  color: string
  size: string
  planned_amount: number
  fact_amount: number
  works: Work[]
}

interface ProductInfo {
  product_title: string
  planned_total: number
  fact_total: number
  details: Detail[]
}

interface Summary {
  RECEIVER: number
  OTK: number
  PACKER: number
  MARKER: number
  CONTROLLER: number
  DEFECT: number
}

interface OrderStatisticsData {
  summary: Summary
  info: ProductInfo[]
}

const statusNames: Record<number, keyof Summary> = {
  1: "RECEIVER",
  2: "OTK",
  3: "PACKER",
  4: "MARKER",
  5: "CONTROLLER",
  6: "DEFECT"
}

const statusLabels: Record<keyof Summary, string> = {
  RECEIVER: "Приемщик",
  OTK: "ОТК",
  PACKER: "Упаковщик",
  MARKER: "Маркеровщик",
  CONTROLLER: "Контроллер",
  DEFECT: "Брак"
}

const OrderStatistics = () => {

  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [expandedProducts, setExpandedProducts] = useState<Record<number, boolean>>({})
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})

  const { order_statistics, order_statistics_status } = useAppSelector((state) => state.order)

  useEffect(() => {
    dispatch(getOrdersStatistics(id))
  }, [dispatch, id])

  const toggleProduct = (index: number) => {
    setExpandedProducts(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const toggleDetail = (productIndex: number, detailIndex: number) => {
    const key = `${productIndex}-${detailIndex}`
    setExpandedDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getProgressPercentage = (fact: number, planned: number): number => {
    return planned > 0 ? Math.round((fact / planned) * 100) : 0
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Loading state
  if (order_statistics_status === 'loading') {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Загрузка статистики...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (order_statistics_status === 'error' || !order_statistics) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ошибка загрузки
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Не удалось загрузить статистику заказа
          </p>
          <button
            onClick={() => dispatch(getOrdersStatistics(id))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Статистика заказа
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Детальный отчет по выполнению заказа
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {(Object.entries(order_statistics.summary) as [keyof Summary, number][]).map(([key, value]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transform transition-all duration-200 hover:scale-105"
            >
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {statusLabels[key]}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {order_statistics.info.map((product, productIndex) => {
            const isExpanded = expandedProducts[productIndex]
            const progressPercentage = getProgressPercentage(
              product.fact_total,
              product.planned_total
            )

            return (
              <div
                key={productIndex}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200"
              >
                {/* Product Header */}
                <button
                  onClick={() => toggleProduct(productIndex)}
                  className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-start gap-3 flex-1 text-left">
                    <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg transition-transform duration-200 hover:scale-110">
                      <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.product_title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          План: <span className="font-medium text-gray-900 dark:text-white">{product.planned_total}</span>
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Факт: <span className="font-medium text-gray-900 dark:text-white">{product.fact_total}</span>
                        </span>
                        <span className={`font-medium ${progressPercentage >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {progressPercentage}%
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ease-out ${getProgressColor(progressPercentage)}`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </button>

                {/* Product Details with Animated Collapse */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-750">
                    {product.details.map((detail, detailIndex) => {
                      const detailKey = `${productIndex}-${detailIndex}`
                      const isDetailExpanded = expandedDetails[detailKey]
                      const detailProgress = getProgressPercentage(
                        detail.fact_amount,
                        detail.planned_amount
                      )

                      return (
                        <div
                          key={detailIndex}
                          className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          {/* Detail Header */}
                          <button
                            onClick={() => toggleDetail(productIndex, detailIndex)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 transition-transform duration-200 hover:scale-105">
                                  {detail.color}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 transition-transform duration-200 hover:scale-105">
                                  {detail.size}
                                </span>
                              </div>
                              <div className="flex gap-4 text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  План: <span className="font-medium text-gray-900 dark:text-white">{detail.planned_amount}</span>
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Факт: <span className="font-medium text-gray-900 dark:text-white">{detail.fact_amount}</span>
                                </span>
                                <span className={`font-medium ${detailProgress >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {detailProgress}%
                                </span>
                              </div>
                            </div>
                            <div className={`transform transition-transform duration-300 ${isDetailExpanded ? 'rotate-180' : ''}`}>
                              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                          </button>

                          {/* Staff Details with Animated Collapse */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isDetailExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="px-4 pb-4 space-y-3">
                              {detail.works.map((work, workIndex) => (
                                <div
                                  key={workIndex}
                                  className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 transform transition-all duration-200 hover:shadow-md"
                                  style={{
                                    animation: isDetailExpanded ? `slideIn 0.3s ease-out ${workIndex * 0.05}s both` : 'none'
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                      {statusLabels[statusNames[work.status]]}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                      Всего: {work.amount}
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {work.staffs.map((staff, staffIndex) => (
                                      <div
                                        key={staffIndex}
                                        className="flex items-center justify-between p-2 px-4 bg-gray-50 dark:bg-gray-600 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-500"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center transition-transform duration-200 hover:scale-110">
                                            <Users className="w-4 h-4 text-white" />
                                          </div>
                                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {staff.fullname}
                                          </span>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                          {staff.amount}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default OrderStatistics