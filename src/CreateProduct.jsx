import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { useEffect, useState } from "react";
import api from "./axiosApi";
import FormButtons from './FormButtons';
import handleChange from './handleChange';
import parseErrors from './parseErrors';
import Loading from './Loading';

const CreateProduct = () => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
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

    useEffect(() => {
        loadCategories();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const insertProductEndpoint = "admin/inserir_produto";
        const formData = new FormData();
        Object.entries(inputs).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (file) {
            formData.append("imagem", file);
        }
        console.log(formData)
        await api.postForm(insertProductEndpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((response) => {
                if (response.status === 201) {
                    navigate("/products");
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data)
                    setErrors(parseErrors(error.response.data));
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function localHandleChange(event) {
        handleChange(event, inputs, setInputs);
    }

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Inclusão de Produto</h1>
            </div>
            <form onSubmit={handleSubmit} noValidate autoComplete='off' className='mb-3'>
                <ProductForm handleChange={localHandleChange} inputs={inputs} errors={errors} handleFileChange={handleFileChange} categories={categories} />
                <FormButtons cancelTarget="/products" />
            </form>
            {loading && <Loading />}
        </>
    );
}

export default CreateProduct;