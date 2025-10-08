export interface OrderProductDetail {
    color: string;
    size: string;
    amount: number;
  }
  
  export interface OrderProduct {
    id?: string;
    product_title: string;
    details: OrderProductDetail[];
  }
  
  export interface OrderProps {
    order_products: OrderProduct[];
    status: number;
    client: string; // UUID клиента
  }
  
  export interface ClientInfo {
    id: string;
    fullname: string;
  }
  
  export interface IOrder {
    id: string;
    order_products: OrderProduct[];
    client_info: ClientInfo;
    created_at: string;  // ISO-дата
    updated_at: string;  // ISO-дата
    status: number;
    client: string;      // UUID клиента
  }

  export interface OrderState {
    orders: IOrder[];
    orders_status: 'loading' | 'success' | 'error';
    statements: any[];
    statements_status: 'loading' | 'success' | 'error';
    order: IOrder | null;
    order_status: 'loading' | 'success' | 'error';
    order_statistics: OrderStatisticsData;
    order_statistics_status: 'loading' | 'success' | 'error';
  }

  export interface Staff {
    fullname: string
    amount: number
  }
  
  export interface Work {
    status: number
    amount: number
    staffs: Staff[]
  }
  
  export interface Detail {
    color: string
    size: string
    planned_amount: number
    fact_amount: number
    works: Work[]
  }
  
  export interface ProductInfo {
    product_title: string
    planned_total: number
    fact_total: number
    details: Detail[]
  }
  
  export interface Summary {
    RECEIVER: number
    OTK: number
    PACKER: number
    MARKER: number
    CONTROLLER: number
    DEFECT: number
  }
  
  export interface OrderStatisticsData {
    summary: Summary
    info: ProductInfo[]
  }
  