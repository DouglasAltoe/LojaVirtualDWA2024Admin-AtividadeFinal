import { useNavigate } from "react-router-dom";
import CategoryForm from "./CategoryForm"; 
import { useState } from "react";
import api from "./axiosApi";
import FormButtons from "./FormButtons";
import handleChange from "./handleChange";
import parseErrors from "./parseErrors";
import Loading from "./Loading";

const CreateCategory = () => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const createCategoryEndpoint = "admin/inserir_categoria";
        const formData = new FormData();

        Object.entries(inputs).forEach(([key, value]) => {
            formData.append(key, value);
        });

        await api.postForm(createCategoryEndpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((response) => {
                if (response.status === 201) {
                    navigate("/categories");
                } else {
                    console.log("Erro desconhecido ao criar categoria:", response);
                }
            })
            .catch((error) => {
                if (error && error.response && error.response.data) {
                    setErrors(parseErrors(error.response.data));
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const localHandleChange = (event) => {
        handleChange(event, inputs, setInputs);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Inclusão de Categoria</h1>
            </div>
            <form onSubmit={handleSubmit} noValidate autoComplete="off" className="mb-3">
                <CategoryForm handleChange={localHandleChange} inputs={inputs} errors={errors} />
                <FormButtons cancelTarget="/categories" />
            </form>
            {loading && <Loading />}
        </>
    );
};

export default CreateCategory;
