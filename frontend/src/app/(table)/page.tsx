'use client'

import { useFetchCells } from '@/hooks/api/useCells'
import { useFetchTables } from '@/hooks/api/useTables'

import TableComponent from '@/components/TableComponent'
import { Header } from '@/components/header'

export default function Home() {
  const { data } = useFetchTables()
  console.log(data)

  return (
    <div className="max-w-screen max-h-screen">
      {/* <Header title={'Cross-channel analysis'} /> */}
      <TableComponent tableId={'b84f62a5-557c-4189-8fec-b7647f6f7a0f'} />
    </div>
  )
}
