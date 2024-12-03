import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { NumberFormatter } from './formatters';

const TableCategoriesLine = ({ item, handleDeleteCategory }) => {
    return (
        <tr>
            <td>{NumberFormatter.format(item.id, 6)}</td>
            <td>{item.descricao}</td>
            <td>
                <button 
                    className="btn btn-outline-danger btn-sm" 
                    title="Excluir" 
                    onClick={() => handleDeleteCategory(item.id)}
                >
                    <i className="bi bi-trash"></i>
                </button>
                <Link 
                    to={`/categories/${item.id}`} 
                    className="btn btn-outline-primary btn-sm ms-2" 
                    title="Alterar"
                >
                    <i className="bi bi-pencil"></i>
                </Link>
            </td>
        </tr>
    );
}

TableCategoriesLine.propTypes = {
    item: PropTypes.object.isRequired,
    handleDeleteCategory: PropTypes.func.isRequired
};

export default TableCategoriesLine;
