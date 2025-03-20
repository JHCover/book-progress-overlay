// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);

  // Handle image upload and book details
  const handleAddBook = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newBook = {
          cover: e.target.result, // Base64 image data
          title: '', // We'll add input for this
          totalPages: 0,
          currentPage: 0,
        };
        setBooks([...books, newBook]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update book details
  const updateBookDetails = (index, field, value) => {
    const updatedBooks = books.map((book, i) => {
      if (i === index) {
        return { ...book, [field]: value };
      }
      return book;
    });
    setBooks(updatedBooks);
  };

  // Calculate progress for the current book
  const getProgress = (book) => {
    return book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;
  };

  return (
      <div className="App">
        <h1>Book Timeline</h1>

        {/* Upload book cover */}
        <input
            type="file"
            accept="image/*"
            onChange={handleAddBook}
            style={{ marginBottom: '20px' }}
        />

        {/* Timeline */}
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

          {/* Books on timeline */}
          <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
              }}
          >
            {books.map((book, index) => (
                <div key={index} className="book" style={{ textAlign: 'center' }}>
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

        {/* Select current book */}
        {books.length > 1 && (
            <div style={{ marginTop: '20px' }}>
              <label>Select Current Book: </label>
              <select
                  value={currentBookIndex}
                  onChange={(e) => setCurrentBookIndex(parseInt(e.target.value))}
              >
                {books.map((book, index) => (
                    <option key={index} value={index}>
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