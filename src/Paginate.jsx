import React from 'react'
import ReactPaginateLib from 'react-paginate'
import { useSelector } from 'react-redux'
import './styles/Paginate.css'

const ReactPaginate = ReactPaginateLib.default

const Paginate = ({totalPaginas, onPageChange}) => {
    const pagination = useSelector(
        state => state.books.pagination
    )

    const handlePageClick = (event) => {
        const numeroPaginaReal = event.selected + 1

        fnFetchBooks(numeroPaginaReal)
    }

  return (
    <ReactPaginate
    previousLabel ="<<"
    nextLabel = ">>"
    pageCount={totalPaginas}
    onPageChange={(event => 
        onPageChange(event.selected +1)
    )}
    containerClassName="pagination"
    activeClassName="active"
    />
  )
}

export default Paginate