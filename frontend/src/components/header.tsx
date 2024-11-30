import { FC } from 'react'

import { Aperture, Download, Link } from 'lucide-react'

import { ThemeSwitcher } from '@/components/theme-switcher'

interface IHeaderProps {
  title: string
}

export const Header: FC<IHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center py-6 px-9">
      <Aperture />
      <div className="flex items-center gap-x-4 ml-10">
        <h1 className="font-medium text-xl">{title}</h1>
        <Link className="cursor-pointer" />
        <Download className="cursor-pointer" />
      </div>
      <ThemeSwitcher />
    </div>
  )
}
