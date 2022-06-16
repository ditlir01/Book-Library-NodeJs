var booksService = require("../services/books-service");

exports.index = async (req, res) => {
    const books = await booksService.getBooksRandomly();
    res.render('index', {
        title: 'books',
        books: books
    });
};

exports.pagination = async (req, res) => {
    let page = ((req.query.page) ? parseInt(req.query.page) : 1);
    let limit = 6
    const offset = (page-1) * limit;
    let booksList = [];
    let books = null;
    let count = 0;
    try {
        if (req.params.title) {
            let searchInput = req.params.title;
            books = await booksService.getPaginatedBooks(offset, limit, searchInput);
            count = await booksService.getCount(searchInput);
        } else {
            books = await booksService.getPaginatedBooks(offset, limit);
            count = await booksService.getCount();
        }
        if (books) {
            for (let i = 0; i < books.length; i++) {
                const author = await booksService.getAuthorById(books[i].author_id);
                booksList.push(
                    {
                        book: books[i],
                        author
                    }
                );
            }
        }
    }catch (e) {
        console.log(e);
    }
    let totalPages = Math.ceil(count['COUNT(*)'] / limit);
    res.render('books', {
        title: 'books',
        paginated: {
            valid: true,
            totalPages,
            page
        },
        booksList
    });
};

exports.addBook = async (req, res) => {
    const authors = await booksService.getAuthors();
    let years = [];
    for(let i=Number(new Date().getFullYear()); i>=1602; i--){
        years.push(i);
    }
    if(req.params.id) {
        let id = Number((req.params.id).replace(/[^\d].*/, ''));
        const book = await booksService.getById(id);
        res.render('addBook', {
            title: 'books',
            authors,
            years,
            bookPresent: {
                valid: true,
                book
            }
        })
    }else{
        res.render('addBook', {
            title: 'books',
            authors,
            years,
            bookPresent: {
                valid: false
            }
        });
    }
};

exports.store = async (req, res) => {
    const input = {
        title: req.body.title.replace(/(["'])/g, "\\$1"),
        img: req.body.img.replace(/(["'])/g, "\\$1"),
        year: Number(req.body.year),
        pages: req.body.pages,
        author_id: Number(req.body.author_id),
        description: req.body.description.replace(/(["'])/g, "\\$1")
    }
    if(req.params.id){
        let id = Number((req.params.id).replace(/[^\d].*/, ''));
        await booksService.updateBook(id, input);
        res.redirect('/api/books/details/'+id);
    }else{
        await booksService.storeBook(input);
        const book = await booksService.getBookByTitle(input.title);
        if(book){
            res.redirect('/api/books/details/'+book.id);
        }else{
            res.redirect('/api/books/addBook');
        }
    }
};

exports.showBookDetails = async (req, res) => {
    if (req.params.id) {
        let id = Number((req.params.id).replace(/[^\d].*/, ''));
        const book = await booksService.getById(id);
        if (book) {
            let author_id = book.author_id;
            const author = await booksService.getAuthorById(author_id);
            res.render('book', {
                title: 'books',
                book: book,
                currentPage: 'book',
                author
            });
        } else {
            res.redirect('/api/books');
        }
    }
};

exports.destroy = async (req, res) => {
    let id = Number((req.params.id).replace(/[^\d].*/, ''));
    await booksService.deleteBook(id);
    res.redirect('/api/books/');
};