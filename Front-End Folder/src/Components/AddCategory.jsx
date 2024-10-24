import axios from 'axios';
import React, { useState } from 'react';

const AddCategory = ({ categories, onCategoryAdded }) => { // Receive the categories list from props
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validate category input
        if (!category) {
            setError('Category cannot be empty');
            return;
        }

        // Check if the category already exists in the list
        const isCategoryExists = categories.some(c => c.name.toLowerCase() === category.toLowerCase());

        if (isCategoryExists) {
            setError('This category already exists.');
            return;
        }

        // Proceed with adding the category if it doesn't exist
        axios.post('http://localhost:3000/auth/add_category', { category })
            .then(response => {
                if (response.data.Status) {
                    onCategoryAdded(category);
                    setCategory(''); // Clear the input field
                } else {
                    setError(response.data.Error || 'An error occurred while adding the category.');
                }
            })
            .catch(err => {
                console.error(err);
                setError('An error occurred while adding the category.');
            });
    };

    return (
        <div className='p-3'>
            <h2 className='text-center'>Add Category</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div 
                className='border rounded p-3 mx-auto my-3' 
                style={{ width: '300px', transition: 'all 0.3s ease', overflow: 'hidden' }}
            >
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <input
                            type="text"
                            placeholder='Enter Category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='form-control'
                            required
                        />
                    </div>
                    <button className='btn btn-success w-100'>Add Category</button>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
