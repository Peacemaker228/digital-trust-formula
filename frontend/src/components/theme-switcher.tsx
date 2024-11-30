'use client'

import React, { FC, useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

export const ThemeSwitcher: FC = () => {
  const { theme, setTheme } = useTheme() // Получаем тему и метод для ее изменения
  const [themeIsOn, setThemeIsOn] = useState<boolean>(theme !== 'light')

  // Когда тема меняется, обновляем состояние компонента
  useEffect(() => {
    setThemeIsOn(theme !== 'light')
  }, [theme])

  const handleChange = () => {
    const newTheme = themeIsOn ? 'light' : 'dark'

    setTheme(newTheme) // Устанавливаем новую тему через useTheme
    setThemeIsOn(!themeIsOn) // Обновляем состояние компонента
  }

  return (
    <label
      className={`relative inline-block w-[3.5em] h-[2em] rounded-full cursor-pointer ${themeIsOn ? 'bg-black' : ''} ml-auto`}
      htmlFor="switch-new">
      <input
        checked={themeIsOn}
        onChange={handleChange}
        className="absolute opacity-0 w-0 h-0"
        id="switch-new"
        type="checkbox"
      />
      <span
        className={`block w-full h-full bg-[#f4f4f5] border border-[#ff8c00] rounded-full transition-all duration-300`}>
        <span
          className={`absolute top-1/2 left-1/4 w-[1.4em] h-[1.4em] bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transform -translate-y-1/2 transition-all duration-300 ${themeIsOn ? 'translate-x-[calc(100%-1.7em)]' : 'left-1'}`}></span>
      </span>
    </label>
  )
}
