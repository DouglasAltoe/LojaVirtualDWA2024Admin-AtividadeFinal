import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import api from "./axiosApi";
import { Link } from 'react-router-dom';
import { NumberFormatter, CurrencyFormatter } from './formatters';

const TableProductsLine = ({ item, handleDeleteProduct }) => {
    const [category, setCategory] = useState();
    const categoryCache = {};
    const loadCategory = () => {
        if (categoryCache[item.categoria]) {
            setCategory(categoryCache[item.categoria]);
            return;
        }
        const categoriesEndpoint = `admin/obter_categorias`;
        api.get(categoriesEndpoint)
            .then((response) => {
                console.log("Resposta da API:", response.data);
                categoryCache[item.categoria] = response.data; // Salva no cache
                setCategory(response.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar a categoria:", error);
            });
    };

    useEffect(() => {
        if (item.categoria) { 
            loadCategory();
        }
    }, [item.categoria]);


    return (
        <tr>
            <td>{NumberFormatter.format(item.id, 6)}</td>
            <td>{item.nome}</td>
            <td>{item.categoria && category ? category.id : "Sem Categoria"}</td>
            {/* <span> (Debug: {JSON.stringify(category)})</span> */}
            <td>{CurrencyFormatter.format(item.preco)}</td>
            <td>{NumberFormatter.format(item.estoque, 6)}</td>
            <td>
                <button className="btn btn-outline-danger btn-sm" title="Excluir" onClick={() => handleDeleteProduct(item.id)}>
                    <i className="bi bi-trash"></i>
                </button>
                <Link to={`/products/${item.id}`} className="btn btn-outline-primary btn-sm ms-2" title="Alterar">
                    <i className="bi bi-pencil"></i>
                </Link>
            </td>
        </tr>
    );
}

TableProductsLine.propTypes = {
    item: PropTypes.object.isRequired,
    handleDeleteProduct: PropTypes.func.isRequired
};

export default TableProductsLine;
