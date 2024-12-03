import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { useEffect, useState } from 'react';
import api from './axiosApi';
import FormButtons from './FormButtons';
import handleChange from './handleChange';
import parseErrors from './parseErrors';
import Loading from './Loading';

const EditProduct = () => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id: idProduto } = useParams();
    const [categories, setCategories] = useState([]);

    const loadCategories = () => {
        setLoading(true);
        const categoriesEndpoint = "admin/obter_categorias";
        api.get(categoriesEndpoint)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    if (!idProduto) {
        navigate('/products');
    }

    async function loadData(id) {
        setLoading(true);
        try {
            const getProductEndpoint = `admin/obter_produto/${id}`;
            const getCategoriesEndpoint = 'admin/obter_categorias'; 
            
            const [productResponse, categoriesResponse] = await Promise.all([
                api.get(getProductEndpoint),
                api.get(getCategoriesEndpoint),
            ]);
            
            console.log('Produto:', productResponse.data); 
            setInputs(productResponse.data);
            
            console.log("-- Categorias --")
            console.log(categoriesResponse.data)

            setInputs(productResponse.data);
            setCategories(categoriesResponse.data); 
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const editProductEndpoint = 'admin/alterar_produto';
        try {
            console.log(inputs)
            const response = await api.post(editProductEndpoint, inputs);
            if (response.status === 204) {
                navigate('/products');
            } else {
                console.log(response);
            }
        } catch (error) {
            if (error?.response?.data) {
                setErrors(parseErrors(error.response.data));
            }
        } finally {
            setLoading(false);
        }
    }

    function localHandleChange(event) {
        handleChange(event, inputs, setInputs);
    }

    useEffect(() => {
        if (idProduto) {
            loadData(idProduto);
            loadCategories();
        }
    }, [idProduto]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Alteração de Produto</h1>
            </div>
            <form onSubmit={handleSubmit} noValidate autoComplete="off" className="mb-3">
                <ProductForm
                    handleChange={localHandleChange}
                    inputs={inputs}
                    errors={errors}
                    categories={categories}
                    isNew={false}
                />
                <FormButtons cancelTarget="/products" />
            </form>
            {loading && <Loading />}
        </>
    );
};

export default EditProduct;
