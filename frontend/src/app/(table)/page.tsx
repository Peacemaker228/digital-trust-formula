'use client'

import { useFetchCells } from '@/hooks/api/useCells'

import { Header } from '@/components/header'

export default function Home() {
  const { data } = useFetchCells('b84f62a5-557c-4189-8fec-b7647f6f7a0f')
  console.log(data)

  return (
    <div className="mx-auto my-0 max-w-[1440px] w-full">
      <Header title={'Cross-channel analysis'} />
    </div>
  )
}
