const PathNotFound = () => {

  return (
    <div className="pnf-wrap">
      <div className="pnf-icon-ring">
        <span className="pnf-emoji">🔍</span>
      </div>
      <p className="pnf-code">404</p>
      <h1 className="pnf-title">Página no encontrada</h1>
      <p className="pnf-desc">
        La página que buscás no existe o fue movida.
      </p>
    </div>
  )
}

export default PathNotFound;