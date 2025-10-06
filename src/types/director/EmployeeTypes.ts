export interface IUser {
    id: string;
    username: string;
    is_active: boolean;
}

export interface IEmployee {
    id: string;
    user: IUser;
    created_at: string;
    updated_at: string;
    fullname: string;
    role: number;
}

export interface EmployeeProps {
    fullname: string;
    username: string;
    password?: string;
    role: number;
}

export interface EmployeeState {
    employees: IEmployee[];
    employees_status: 'loading' | 'success' | 'error';
    employee: IEmployee | null;
    employee_status: 'loading' | 'success' | 'error';
}
  