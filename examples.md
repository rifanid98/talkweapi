# libraryapp-api

## I. Authorization
Untuk mengakses api yang disediakan, harus memiliki akses dengan login terlebih dahulu

**URL API**
> http://localhost:3000/auth/login [POST] <br>
> http://localhost:3000/auth/register [POST] <br>

### 1. Login API
> http://localhost:3000/auth/login [POST]

### Field

| Name          | Type          | Required |
| ------------- | ------------- | -------- |
| userName     | string        | true     | 
| userPassword | string        | true     |

### Body
Mendukung application/json, urlencoded dan form-data format

### 2. Register API
> http://localhost:3000/auth/register

### Field

| Name          | Type          | Required | 
| ------------- | ------------- | -------- | 
| userName     | string        | true     | 
| userPassword | string        | true     |
| user_role     | number        | true     |

### Body
Mendukung application/json, urlencoded dan form-data format

## II. Books
Mengakses buku, detail buku dan pencarian

**URL API**
> http://localhost:3000/libraryapp-api/books [GET]<br>
> http://localhost:3000/libraryapp-api/books/add [POST]<br>
> http://localhost:3000/libraryapp-api/books/update/:id [PATCH]<br>
> http://localhost:3000/libraryapp-api/books/delete/:id [DELETE]<br>
> http://localhost:3000/libraryapp-api/books/borrow/:id [PATCH]<br>
> http://localhost:3000/libraryapp-api/books/return/:id [PATCH]

### 1. GET Books
> http://localhost:3000/libraryapp-api/books [GET]


### Parameter
> - Search

| Name       | Type                 | Required | 
| ---------- | -------------------- | -------- | 
| desctipion | string               | optional | 
| title      | string               | optional |
| genre      | number [Foreign Key] | optional |
| author     | string               | optional |
| status     | number [0/1]         | optional |

Note: 
- Genre  : Id of genres
- Status : [0/1] [Not Booked/Booked]

Search Example:
- http://localhost:3000/libraryapp-api/books?description=some description&author=John Doe&title=The Love&genre=romance&status=1

> - Sort

| Name   | Type            | Required | 
| ------ | --------------- | -------- | 
| sort   | string [field]  | optional |

Note:
- Sort : [field] sort by [description/title/genre/author/status] 

Sort Example:
- http://localhost:3000/libraryapp-api/books?sort=author

> - Pagination

| Name   | Type   | Required                       | 
| ------ | ------ | ------------------------------ | 
| page   | string | optional                       |
| limit  | string | required if use the page param |

Note:
- Page  : The number of page you want to request
- Limit : Total data per page (required if page param is used)

Pagination Example:
- http://ocalhost:3000/libraryapp-api/books?page=1&limit=4

### 2. POST Book
> http://localhost:3000/libraryapp-api/books/add [POST]

Note: 
Menambahkan buku

### Field

| Name             | Type                | Required | 
| ---------------- | ------------------- | -------- | 
| book_title       | string              | true     |
| book_description | string              | true     |
| bookImage       | file [jpg/jpeg]     | true     |
| book_author      | string              | true     |
| bookStatus      | number              | true     |
| genre_id    | number [foreign key]| true     |

### Body
Mendukung application/json, urlencoded dan form-data format

### 3. PATCH Book
> http://localhost:3000/libraryapp-api/books/update/:id [PATCH]

Note: 
- Mengupdate buku
- :id merupakan ID Buku

Contoh : http://localhost:3000/libraryapp-api/books/20

### Field

| Name             | Type                | Required | 
| ---------------- | ------------------- | -------- | 
| book_title       | string              | true     |
| book_description | string              | true     |
| bookImage       | file [jpg/jpeg]     | true     |
| book_author      | string              | true     |
| bookStatus      | number              | true     |
| genre_id    | number [foreign key]| true     |

### Body
Mendukung application/json, urlencoded dan form-data format

### 4. DELETE Book
> http://localhost:3000/libraryapp-api/books/delete/:id [DELETE]

Note: 
- Menghapus buku
- :id merupakan ID Buku

Contoh : http://localhost:3000/libraryapp-api/books/20

### 5. Borrow Book
> http://localhost:3000/libraryapp-api/books/borrow/:id [PATCH]

Note: 
- Meminjam buku
- :id merupakan ID Buku

Contoh : http://localhost:3000/libraryapp-api/books/borrow/20

### 6. Return Book
> http://localhost:3000/libraryapp-api/books/return/:id [PATCH]

Note: 
- Meminjam buku
- :id merupakan ID Buku

Contoh : http://localhost:3000/libraryapp-api/books/return/20


## III. Book Genres
Mengakses genre buku

**URL API**
> http://localhost:3000/libraryapp-api/bookGenres [GET]<br>
> http://localhost:3000/libraryapp-api/bookGenres [POST]<br>
> http://localhost:3000/libraryapp-api/bookGenres/:id [PATCH]<br>
> http://localhost:3000/libraryapp-api/bookGenres/:id [DELETE]

### 1. GET Book Genres
> http://localhost:3000/libraryapp-api/bookGenres [GET]

Note: 
Mendapatkan seluruh genre

### 2. POST Book Genre
> http://localhost:3000/libraryapp-api/bookGenres [POST]

Note: 
Menambahkan seluruh genre

### Field

| Name             | Type     | Required | 
| ---------------- | -------- | -------- | 
| book_genre_name  | string   | true     |

### 3. PATCH Book Genre
> http://localhost:3000/libraryapp-api/bookGenres/:id [PATCH]

Note: 
- Mengupdate buku
- :id merupakan ID Buku

Contoh : http://localhost:3000/libraryapp-api/bookGenres/3

### Field

| Name             | Type     | Required | 
| ---------------- | -------- | -------- | 
| book_genre_name  | string   | true     |

### Body
Mendukung application/json, urlencoded dan form-data format

### 4. DELETE Book Genre
> http://localhost:3000/libraryapp-api/bookGenres/:id [DELETE]

Note: 
- Menghapus buku
- :id merupakan ID Buku

Contoh : http://localhost:3000/libraryapp-api/bookGenres/3
