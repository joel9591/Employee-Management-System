import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios.get(`https://employee-management-system-9jz6.onrender.com/auth/category`)
            .then(result => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
      axios.delete(`https://employee-management-system-9jz6.onrender.com/auth/delete_category/${id}`)
      .then(result => {
          if (result.data.Status) {
              setCategory(category.filter(c => c.id !== id));
          } else {
              alert(result.data.Error);
          }
      })
      .catch(err => console.log(err));
    };

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Category List</h3>
            </div>
            <Link to="/dashboard/add_category" className='btn btn-success'>Add Category</Link>
            <div className='mt-3'>
                <table className='table table-dark table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            category.map(c => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td className='text-center'>
                                        <button
                                            className='btn btn-danger'
                                            onClick={() => handleDelete(c.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Category;
