import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddCategory from './AddCategory';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios.get('http://localhost:3000/auth/category')
            .then(result => {
                if (result.data.Status) {
                    setCategories(result.data.Result);
                } else {
                    setError(result.data.Error || 'An error occurred while fetching categories.');
                }
            }).catch(err => {
                console.log(err);
                setError('An error occurred while fetching categories.');
            });
    };

    const handleCategoryAdded = (newCategory) => {
        setCategories(prevCategories => [...prevCategories, { name: newCategory }]);
    };

    const handleDelete = (categoryToDelete) => {
        if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete}"?`)) {
            axios.delete('http://localhost:3000/auth/delete_category', { data: { category: categoryToDelete } })
                .then(result => {
                    if (result.data.Status) {
                        alert('Category deleted successfully');
                        setCategories(prevCategories => prevCategories.filter(c => c.name !== categoryToDelete));
                    } else {
                        alert(result.data.Error || 'An error occurred while deleting the category.');
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert('An error occurred while deleting the category.');
                });
        }
    };

    return (
        <div className='px-5 mt-3'>
            {error && <div className="alert alert-danger">{error}</div>}
            <AddCategory categories={categories} onCategoryAdded={handleCategoryAdded} /> {/* Pass categories to AddCategory */}
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th style={{ padding: '0', margin: '5px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.length > 0 ? (
                                categories.map(c => (
                                    <tr key={c.name}>
                                        <td>{c.name}</td>
                                        <td>
                                            <button
                                                className='btn btn-danger btn-circle'
                                                onClick={() => handleDelete(c.name)}
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: 'red',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '0',
                                                    margin: '5px'
                                                }}>
                                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>X</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">No categories available</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Category;
