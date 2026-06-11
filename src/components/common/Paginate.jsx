import ReactPaginateLib from 'react-paginate'
import '../../styles/Paginate.css'

const ReactPaginate = ReactPaginateLib.default

const Paginate = ({totalPaginas, onPageChange}) => {


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