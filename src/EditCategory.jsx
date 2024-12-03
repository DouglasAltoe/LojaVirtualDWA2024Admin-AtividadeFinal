import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from "./axiosApi";
import FormButtons from './FormButtons';
import handleChange from './handleChange';
import parseErrors from './parseErrors';
import Loading from './Loading';
import CategoryForm from './CategoryForm';

const EditCategory = () => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const idCategoria = useParams().id;
    if (!idCategoria) {
        navigate("/categories");
    }

    function loadCategoryById(id) {
        setLoading(true);
        const getCategoryEndpoint = `admin/obter_categoria/${id}`;
        api.get(getCategoryEndpoint)
            .then(response => {
                setInputs(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar categoria:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        if (!inputs.nome || !inputs.descricao) {
            setErrors({
                descricao: !inputs.descricao ? "A descrição é obrigatória." : undefined
            });
            setLoading(false);
            return;
        }

        console.log("Dados que estão sendo enviados:", inputs);

        const editCategoryEndpoint = "admin/alterar_categoria";
        await api.post(editCategoryEndpoint, inputs)
            .then((response) => {
                if (response.status === 204) {
                    navigate("/categories");
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data) {
                    console.log("Erro:", error.response.data);
                    setErrors(parseErrors(error.response.data));
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function localHandleChange(event) {
        handleChange(event, inputs, setInputs);
    }

    useEffect(() => {
        setInputs({ ...inputs, id: idCategoria });
        loadCategoryById(idCategoria);
    }, [idCategoria]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Alteração de Categoria</h1>
            </div>
            <form onSubmit={handleSubmit} noValidate autoComplete='off' className='mb-3'>
                <CategoryForm handleChange={localHandleChange} inputs={inputs} errors={errors} isNew={false} />
                <FormButtons cancelTarget="/categories" />
            </form>
            {loading && <Loading />}
        </>
    );
}

export default EditCategory;
