const {nanoid} = require('nanoid')
const bookshelf = require('./bookshelf')

//  API MENYIMPAN BUKU
const addBookHandler = (request, h) => {
    const { 
        name, 
        year, 
        author, 
        summary,
        publisher, 
        pageCount, 
        readPage, 
        reading 
    } = request.payload

    // Check apakah client melampirkan properti name
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    // Check apakah client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const id = nanoid(16)
    const finished = pageCount === readPage
    const createdAt = new Date().toISOString()
    const updateAt = createdAt

    const newBooks = {
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading, 
        finished, 
        createdAt, 
        updateAt
    }

    bookshelf.push(newBooks)
    
    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id
        }
    }).code(201);

}

// API MENAMPILKAN SEMUA BUKU
const getAllBookHandler = (request, h) => {
    // Mengambil nilai query parameters
    const { name, reading, finished } = request.query;

    // Filter berdasarkan query parameters
    let filteredBooks = [...bookshelf];

    // Filter berdasarkan nama buku 
    if (name) {
        const queryName = name.toLowerCase(); 
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(queryName));
    }

    // Filter berdasarkan status reading
    if (reading !== undefined) {
        const isReading = reading === '1'; 
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }

    // Filter berdasarkan status finished
    if (finished !== undefined) {
        const isFinished = finished === '1'; 
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }

    return {
        status: 'success',
        data: {
            books: filteredBooks
        }
    };
};



// API MENAMPILKAN DETAILED BUKU
const getDetailedBookHandler = (request, h) => {
    const {id} =  request.params

    const index = bookshelf.filter((n) => n.id === id)[0]

    if (index !== undefined) {
        return {
          status: 'success',
          data: {
            bookshelf,
          },
        };
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
}

// API MENGUBAH DATA BUKU
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    // Cari berdasarkan id buku
    const bookIndex = bookshelf.findIndex(book => book.id === id);

    // Check apakah id buku ditemukan
    if (bookIndex !== -1) {
        const { 
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage, 
            reading 
        } = request.payload;

        // Check apakah client melampirkan properti name pada request body
        if (!name) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            }).code(400);
        }

        // Check apakah client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
        if (readPage > pageCount) {
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            }).code(400);
        }

        const updatedAt = new Date().toISOString();
        const finished = pageCount === readPage;

        bookshelf[bookIndex] = {
            id, 
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage, 
            reading, 
            finished, 
            updatedAt
        };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200);
    } else {
        // Jika id buku tidak ditemukan
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
    }
};

// API DELETE DATA BUKU
const deleteBookByIdHandler = (request, h) => {
    const {id} = request.params
    const bookIndex = bookshelf.findIndex((book) => book.id === id)

    if (bookIndex !== -1) {
        bookshelf.splice(bookIndex, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
}

// EXPORTS
module.exports = {addBookHandler, getAllBookHandler, getDetailedBookHandler, editBookByIdHandler, deleteBookByIdHandler}