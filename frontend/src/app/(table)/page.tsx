'use client'

import { useFetchCells } from '@/hooks/api/useCells'

import { Header } from '@/components/header'
import TableComponent from '@/components/TableComponent'
import { useFetchTables } from '@/hooks/api/useTables'

export default function Home() {
  const { data } = useFetchTables()
  console.log(data)

  return (
    <div className="w-screen h-screen">
      {/* <Header title={'Cross-channel analysis'} /> */}
      <TableComponent tableId={'b84f62a5-557c-4189-8fec-b7647f6f7a0f'} />
    </div>
  )
}
