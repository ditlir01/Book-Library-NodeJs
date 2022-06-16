var mysqlConfig = require("../connections/mysql");
var connection = mysqlConfig.connection;

exports.getBooksRandomly = () => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM books ORDER BY RAND() LIMIT 18";
        connection.query(sql, (error, elements) => {
           if(error)
               return reject(error);

           return resolve(elements);
        });
    })
};

exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM books WHERE id= "+id;
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements[0]);
        })
    })
}

exports.storeBook = (input) => {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO books (title,pages, year, img, author_id, description) VALUES ('"+ input.title +"', "+ input.pages +", "+ input.year+", '"+ input.img+"', "+input.author_id+", '"+input.description+"')";
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements[0]);
        })
    })
}

exports.updateBook = (id, input) => {
    return new Promise( (resolve, reject) => {
        var sql = "UPDATE books SET title = '"+input.title+"', pages = "+input.pages+", year= "+input.year+", img= '"+input.img+"', description= '"+input.description+"', author_id= "+input.author_id+" WHERE id= "+id;
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements);
        })
    })
}

exports.getBookByTitle = (title) => {
    return new Promise((resolve,reject) => {
        var sql = "SELECT * FROM books WHERE title = '"+title+"'";
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements[0]);
        });
    });
}

exports.deleteBook = (id) => {
    return new Promise((resolve, reject) => {
        var sql = "DELETE FROM books WHERE id= "+id;
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements[0]);
        })
    })
};

exports.getPaginatedBooks = (offset, limit, searchInput = null) => {
    return new Promise((resolve, reject) => {
        var sql;
        if(searchInput!=null){
            sql = "SELECT * FROM books WHERE title LIKE '%"+searchInput+"%' LIMIT "+limit+" OFFSET "+offset;
        }else {
            sql = "SELECT * FROM books LIMIT "+limit+" OFFSET "+offset;
        }
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements);
        })
    })
}

exports.getCount = (searchInput = null) => {
    return new Promise( (resolve, reject) => {
        var sql;
        if(searchInput!=null){
            sql = "SELECT COUNT(*) FROM books WHERE title LIKE '%"+searchInput+"%'";
        }else{
            sql = "SELECT COUNT(*) FROM books";
        }
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements[0]);
        })
    })
}

exports.getAuthors = () => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM authors";
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements);
        })
    })
}

exports.getAuthorById = (id) => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM authors WHERE id= "+id;
        connection.query(sql, (error, elements) => {
            if(error)
                return reject(error);

            return resolve(elements[0]);
        })
    })
}