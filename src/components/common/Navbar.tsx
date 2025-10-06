import { NavLink } from "react-router-dom"
import { useAppSelector } from "../../store/hooks"

const Navbar = () => {

  const { me_role } = useAppSelector(state => state.auth)

  const rolesButtons = [
    {},
    {
      name: 'director',
      buttons: [
        {
            name: 'Статистика',
            link: '/crm',
        },
        {
            name: 'Заказы',
            link: '/crm/orders',
        },
        {
            name: 'Клиенты',
            link: '/crm/clients',
        },
        {
            name: 'Сотрудники',
            link: '/crm/employees',
        },
      ]
    },
    {
        name: 'receiver',
        buttons: [
            {
                name: 'Заказы',
                link: '/crm/orders',
            },
        ]
    },
    {
        name: 'otk',
        buttons: [
            {
                name: 'Контроль',
                link: '/crm/control',
            },
        ]
    },
    {
        name: 'receiver',
        buttons: [
            {
                name: 'Скан',
                link: '/crm/skan',
            },
        ]
    },
    {
        name: 'receiver',
        buttons: [
            {
                name: 'Главная',
                link: '/crm/main',
            },
        ]
    },
  ]

  return (
    <nav className="flex justify-between items-center gap-4 text-sm">
        {
            rolesButtons[me_role || 0]?.buttons?.map((button: any, index) => (
                <NavLink key={index} to={button.link} end className={({ isActive }) => isActive ? 'text-blue-600 font-medium font-semibold' : 'text-gray-600 dark:text-gray-300 font-semibold hover:text-gray-900 dark:hover:text-white'}>
                    {button.name}
                </NavLink>
            ))
        }
    </nav>
  )
}

export default Navbar
