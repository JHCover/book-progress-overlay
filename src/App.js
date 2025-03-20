import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [books, setBooks] = useState([]);
    const [currentBookIndex, setCurrentBookIndex] = useState(0);

    // Fetch books on load
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/books');
                setBooks(response.data);
                if (response.data.length > 0) setCurrentBookIndex(0);
            } catch (err) {
                console.error('Error fetching books:', err);
            }
        };
        fetchBooks();
    }, []);

    // Handle image upload and save to backend
    const handleAddBook = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const newBook = {
                    cover: e.target.result,
                    title: '',
                    totalPages: 0,
                    currentPage: 0,
                };
                try {
                    const response = await axios.post('http://localhost:5000/books', newBook);
                    setBooks([...books, response.data]);
                } catch (err) {
                    console.error('Error adding book:', err);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Update book details and save to backend
    const updateBookDetails = async (index, field, value) => {
        const updatedBooks = books.map((book, i) =>
            i === index ? { ...book, [field]: value } : book
        );
        setBooks(updatedBooks);

        try {
            await axios.put(`http://localhost:5000/books/${books[index]._id}`, {
                ...updatedBooks[index],
                [field]: value,
            });
        } catch (err) {
            console.error('Error updating book:', err);
        }
    };

    // Calculate progress for the current book
    const getProgress = (book) => {
        return book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;
    };

    return (
        <div className="App">
            <h1>Book Timeline</h1>

            <input
                type="file"
                accept="image/*"
                onChange={handleAddBook}
                style={{ marginBottom: '20px' }}
            />

            <div className="timeline" style={{ position: 'relative', height: '200px' }}>
                {books.length > 0 && (
                    <div
                        className="progress-bar"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            height: '10px',
                            width: `${books.length > 1 ? 100 : getProgress(books[currentBookIndex])}%`,
                            backgroundColor: '#4CAF50',
                            zIndex: 1,
                        }}
                    />
                )}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    {books.map((book, index) => (
                        <div key={book._id} className="book" style={{ textAlign: 'center' }}>
                            <img
                                src={book.cover}
                                alt={`Book ${index + 1}`}
                                style={{ width: '100px', height: '150px', objectFit: 'cover' }}
                            />
                            <input
                                type="text"
                                placeholder="Book Title"
                                value={book.title}
                                onChange={(e) => updateBookDetails(index, 'title', e.target.value)}
                                style={{ marginTop: '5px', width: '100px' }}
                            />
                            <input
                                type="number"
                                placeholder="Total Pages"
                                value={book.totalPages}
                                onChange={(e) =>
                                    updateBookDetails(index, 'totalPages', parseInt(e.target.value) || 0)
                                }
                                style={{ marginTop: '5px', width: '100px' }}
                            />
                            {index === currentBookIndex && (
                                <input
                                    type="number"
                                    placeholder="Current Page"
                                    value={book.currentPage}
                                    onChange={(e) =>
                                        updateBookDetails(index, 'currentPage', parseInt(e.target.value) || 0)
                                    }
                                    style={{ marginTop: '5px', width: '100px' }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {books.length > 1 && (
                <div style={{ marginTop: '20px' }}>
                    <label>Select Current Book: </label>
                    <select
                        value={currentBookIndex}
                        onChange={(e) => setCurrentBookIndex(parseInt(e.target.value))}
                    >
                        {books.map((book, index) => (
                            <option key={book._id} value={index}>
                                {book.title || `Book ${index + 1}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

export default App;