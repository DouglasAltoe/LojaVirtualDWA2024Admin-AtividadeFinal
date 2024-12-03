import { useEffect, useState } from "react";
import NoCategories from "./NoCategories";
import TableCategories from "./TableCategories";
import api from "./axiosApi";
import Loading from "./Loading";
import ModalConfirm from "./ModalConfirm";
import { NavLink } from "react-router-dom";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [loading, setLoading] = useState(true);

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
    };

    const deleteCategory = (categoryId) => {
        setLoading(true);
        api.postForm("admin/excluir_categoria", { "id_categoria": categoryId })
            .then(response => {
                if (response.status === 204)
                    loadCategories();
            })
            .catch(error => {
                console.error('Erro ao excluir categoria:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteCategory = (categoryId) => {
        setSelectedCategoryId(categoryId);
        const modal = new bootstrap.Modal(document.getElementById('modalDeleteCategory'));
        modal.show();
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <>
            <NavLink to="/categories/create" className="btn btn-primary my-3">Nova Categoria</NavLink>
            {categories.length > 0 ? (
                <>
                    <ModalConfirm 
                        modalId="modalDeleteCategory" 
                        question="Deseja realmente excluir esta categoria?" 
                        confirmAction={() => deleteCategory(selectedCategoryId)} 
                    />
                    <TableCategories items={categories} handleDeleteCategory={handleDeleteCategory} />
                </>
            ) : (
                (!loading && <NoCategories />)
            )}
            {loading && <Loading />}
        </>
    );
}

export default Categories;
