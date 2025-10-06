import { useEffect, useState } from "react"
import type { FormEvent, ChangeEvent } from "react"
import { Trash2, Plus, Package, Save } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { getClients } from "../../../store/director/clientSlice"
import { createOrder } from "../../../store/director/orderSlice"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

interface ProductDetail {
  color: string
  size: string
  amount: number
}

interface OrderProduct {
  id: string
  product_title: string
  details: ProductDetail[]
}

interface CreateOrderData {
  order_products: {
    product_title: string
    details: ProductDetail[]
  }[]
  status: number
  client: string
}

const OrderCreate = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState<OrderProduct[]>([])
  const [clientId, setClientId] = useState("")
  const [currentProduct, setCurrentProduct] = useState({
    product_title: ""
  })
  const [currentDetail, setCurrentDetail] = useState({
    color: "",
    size: "",
    amount: 0
  })
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { clients } = useAppSelector(state => state.client);

  useEffect(() => {
    dispatch(getClients())
  }, [])

  const handleProductTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentProduct({ product_title: e.target.value })
    if (errors.product_title) {
      setErrors(prev => ({ ...prev, product_title: '' }))
    }
  }

  const handleDetailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentDetail(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? parseInt(value) || 0 : value 
    }))
  }

  const addProduct = () => {
    if (!currentProduct.product_title.trim()) {
      setErrors({ product_title: "Введите название товара" })
      return
    }

    const newProduct: OrderProduct = {
      id: Date.now().toString(),
      product_title: currentProduct.product_title,
      details: []
    }

    setProducts(prev => [...prev, newProduct])
    setCurrentProduct({ product_title: "" })
    setExpandedProductId(newProduct.id)
    setErrors({})
  }

  const addDetail = (productId: string) => {
    if (!currentDetail.color.trim() || !currentDetail.size.trim() || currentDetail.amount <= 0) {
      setErrors({ detail: "Заполните все поля детали" })
      return
    }

    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, details: [...product.details, { ...currentDetail }] }
        : product
    ))

    setCurrentDetail({ color: "", size: "", amount: 0 })
    setErrors({})
  }

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  const removeDetail = (productId: string, detailIndex: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId
        ? { ...product, details: product.details.filter((_, i) => i !== detailIndex) }
        : product
    ))
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    
    if (!clientId) {
      newErrors.client = "Выберите клиента"
    }
    
    if (products.length === 0) {
      newErrors.products = "Добавьте хотя бы один товар"
    }
    
    const hasEmptyDetails = products.some(p => p.details.length === 0)
    if (hasEmptyDetails) {
      newErrors.details = "У каждого товара должна быть хотя бы одна деталь"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const orderData: CreateOrderData = {
        order_products: products.map(p => ({
          product_title: p.product_title,
          details: p.details
        })),
        status: 1,
        client: clientId
      }
      
      await dispatch(createOrder(orderData)).unwrap()
      
      toast.success('Заказ успешно создан!')
      handleReset()
      navigate('/crm/orders')

    } catch (error) {
      console.error('Ошибка при создании заказа:', error)
      alert('Произошла ошибка при создании заказа')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setProducts([])
    setClientId("")
    setCurrentProduct({ product_title: "" })
    setCurrentDetail({ color: "", size: "", amount: 0 })
    setExpandedProductId(null)
    setErrors({})
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Создание заказа</h1>
            </div>
          </div>
          
          {/* Выбор клиента */}
          <div>
            <label className="block text-sm text-left font-medium text-gray-700 dark:text-gray-300 mb-2">
              Клиент <span className="text-red-500">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value)
                if (errors.client) setErrors(prev => ({ ...prev, client: '' }))
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Выберите клиента</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.fullname}</option>
              ))}
            </select>
            {errors.client && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.client}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Добавление нового товара */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Package size={18} />
              Добавить товар
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={currentProduct.product_title}
                onChange={handleProductTitleChange}
                placeholder="Название товара"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all font-medium whitespace-nowrap"
              >
                <Plus size={20} className="md:hidden" />
                <span className="hidden md:inline">Добавить</span>
              </button>
            </div>
            {errors.product_title && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.product_title}</p>
            )}
          </div>

          {/* Сообщения об ошибках */}
          {errors.products && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200">
              ⚠ {errors.products}
            </div>
          )}
          
          {errors.details && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-800 dark:text-orange-200">
              ⚠ {errors.details}
            </div>
          )}

          {/* Список товаров */}
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Package size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Товары не добавлены</p>
              <p className="text-xs mt-1">Добавьте первый товар выше</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Заголовок товара */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                          {product.product_title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {product.details.length} деталей • {product.details.reduce((sum, d) => sum + d.amount, 0)} шт.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeProduct(product.id)
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Детали товара */}
                  {expandedProductId === product.id && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-gray-50 dark:bg-gray-700/30">
                      
                      {/* Форма добавления детали */}
                      <div className="space-y-3">
                        <p className="text-sm text-left font-medium text-gray-700 dark:text-gray-300">
                          Добавить деталь:
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            name="color"
                            value={currentDetail.color}
                            onChange={handleDetailChange}
                            placeholder="Цвет"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                          <input
                            type="text"
                            name="size"
                            value={currentDetail.size}
                            onChange={handleDetailChange}
                            placeholder="Размер"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                          <input
                            type="number"
                            name="amount"
                            value={currentDetail.amount || ""}
                            onChange={handleDetailChange}
                            placeholder="Кол-во"
                            min="1"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => addDetail(product.id)}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Добавить деталь
                        </button>
                        
                        {errors.detail && (
                          <p className="text-sm text-red-600 dark:text-red-400">{errors.detail}</p>
                        )}
                      </div>

                      {/* Список деталей */}
                      {product.details.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Детали товара:
                          </p>
                          {product.details.map((detail, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                                  {detail.color}
                                </span>
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                  {detail.size}
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {detail.amount} шт.
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDetail(product.id, index)}
                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors ml-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer с кнопками */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 shadow-lg">
        <div className="flex items-center justify-between gap-x-3 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="w-1/3 py-3 border-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
          >
            Очистить все
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || products.length === 0}
            className="w-2/3 py-3 border-1 border-blue-600 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all font-semibold text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>Создание...</>
            ) : (
              <>
                <Save size={20} />
                Создать
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderCreate