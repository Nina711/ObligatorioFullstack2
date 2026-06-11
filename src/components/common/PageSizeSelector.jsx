import '../../styles/PageSizeSelector.css'

const PageSizeSelector = ({
    value,
    onChange,
    options,
    label
}) => {
    return (
        <div className="page-size-selector">
            <label>Mostrar</label>

            <select
                value={value}
                onChange={(e) =>
                    onChange(Number(e.target.value))
                }
            >
                {options.map(option => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>

            <span>{label}</span>
        </div>
    )
}

export default PageSizeSelector